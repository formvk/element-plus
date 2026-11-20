import type { GeneralField } from '@formvk/core'
import type { Schema, SchemaKey } from '@formvk/schema'
import { toArr } from '@formvk/shared'
import { RecursionField, useField, useFieldSchema } from '@formvk/vue'
import { ElBadge, ElCollapse, ElCollapseItem } from 'element-plus'
import type { CollapsePropsPublic } from 'element-plus'
import { computed, defineComponent, reactive } from 'vue'
import type { PropType } from 'vue'

import { isComponentOf, usePrefixCls } from '../../shared'
import { cls } from '../../shared'

type ActiveKeys = string | number | Array<string | number>

type ActiveKey = string | number

export interface IFormCollapse {
  activeKeys: ActiveKeys
  hasActiveKey(key: ActiveKey): boolean
  setActiveKeys(key: ActiveKeys): void
  addActiveKey(key: ActiveKey): void
  removeActiveKey(key: ActiveKey): void
  toggleActiveKey(key: ActiveKey): void
}

export interface IFormCollapseProps {
  formCollapse?: IFormCollapse
  activeKey?: ActiveKeys
  modelValue?: ActiveKeys
  defaultActiveKey?: ActiveKeys
  accordion?: boolean
}

const parsePanels = (field: GeneralField | undefined, currentSchema: Schema | undefined) => {
  const panels: { name: SchemaKey; key: SchemaKey; props: any; schema: Schema }[] = []
  if (!field || !currentSchema) return panels
  currentSchema.mapProperties((panelSchema, name) => {
    const child = field.query(field.address.concat(name)).take()
    if (child?.display === 'none' || child?.display === 'hidden') return
    if (isComponentOf(panelSchema.component, 'CollapsePanel')) {
      const props = {
        ...panelSchema?.componentProps,
        ...child?.componentProps,
      }
      const key = props.key ?? name
      // key 需要作为组件属性单独传入，留在 props 中会被 spread 进组件
      delete props.key
      panels.push({ name, key, props, schema: panelSchema })
    }
  })
  return panels
}

// 使用 Vue reactive 承载状态，保证外部读取 activeKeys 时具备响应式
export const createFormCollapse = (defaultActiveKeys?: ActiveKeys): IFormCollapse => {
  const formCollapse: IFormCollapse = reactive({
    activeKeys: defaultActiveKeys as ActiveKeys,
    setActiveKeys(keys: ActiveKeys) {
      formCollapse.activeKeys = keys
    },
    hasActiveKey(key: ActiveKey) {
      if (Array.isArray(formCollapse.activeKeys)) {
        if (formCollapse.activeKeys.includes(key)) {
          return true
        }
      } else if (formCollapse.activeKeys == key) {
        return true
      }
      return false
    },
    addActiveKey(key: ActiveKey) {
      if (formCollapse.hasActiveKey(key)) return
      formCollapse.activeKeys = toArr(formCollapse.activeKeys).concat(key)
    },
    removeActiveKey(key: ActiveKey) {
      if (Array.isArray(formCollapse.activeKeys)) {
        formCollapse.activeKeys = formCollapse.activeKeys.filter(item => item != key)
      } else {
        formCollapse.activeKeys = ''
      }
    },
    toggleActiveKey(key: ActiveKey) {
      if (formCollapse.hasActiveKey(key)) {
        formCollapse.removeActiveKey(key)
      } else {
        formCollapse.addActiveKey(key)
      }
    },
  })
  return formCollapse
}

export const FormCollapse = defineComponent<
  Omit<CollapsePropsPublic, 'modelValue'> & IFormCollapseProps & { prefixCls?: string }
>({
  name: 'FormCollapse',
  inheritAttrs: false,
  props: {
    formCollapse: Object as PropType<IFormCollapse>,
    activeKey: [String, Number, Array] as PropType<ActiveKeys>,
    modelValue: [String, Number, Array] as PropType<ActiveKeys>,
    defaultActiveKey: [String, Number, Array] as PropType<ActiveKeys>,
    accordion: Boolean,
    prefixCls: String,
  },
  setup(props, { attrs }) {
    const field = useField()
    const schema = useFieldSchema()
    const prefixCls = usePrefixCls('collapse', props)
    const fallbackCollapse = createFormCollapse(props.defaultActiveKey ?? props.activeKey ?? props.modelValue)
    const mergedFormCollapse = computed(() => props.formCollapse ?? fallbackCollapse)
    const panels = computed(() => parsePanels(field.value, schema.value))

    const activeKeys = computed<ActiveKeys>(() => {
      const activeKey = props.activeKey ?? props.modelValue
      if (activeKey !== undefined) return activeKey
      if (mergedFormCollapse.value?.activeKeys !== undefined) return mergedFormCollapse.value.activeKeys
      if (props.accordion) return panels.value[0]?.key
      return panels.value.map(item => item.key)
    })

    const badgedHeader = (key: SchemaKey, panelProps: any) => {
      const currentField = field.value
      const header = panelProps.title ?? panelProps.header
      if (!currentField) return header
      const errors = currentField.form.queryFeedbacks({
        type: 'error',
        address: `${currentField.address.concat(key)}.*`,
      })
      if (errors.length) {
        return (
          <ElBadge type="danger" class="errors-badge" value={errors.length}>
            <span>{header}</span>
          </ElBadge>
        )
      }
      return header
    }

    const takeActiveKeys = () => activeKeys.value

    return () => (
      <ElCollapse
        {...attrs}
        accordion={props.accordion}
        modelValue={takeActiveKeys()}
        class={cls(prefixCls, attrs.class as string)}
        onChange={(key: ActiveKeys) => {
          ;(attrs.onChange as any)?.(key)
          ;(attrs['onUpdate:modelValue'] as any)?.(key)
          mergedFormCollapse.value?.setActiveKeys?.(key)
        }}
      >
        {panels.value.map(({ props: panelProps, schema, name, key }) => (
          <ElCollapseItem key={key} name={key} disabled={panelProps.disabled}>
            {{
              title: () => badgedHeader(name, panelProps),
              default: () => <RecursionField schema={schema} name={name} />,
            }}
          </ElCollapseItem>
        ))}
      </ElCollapse>
    )
  },
})
