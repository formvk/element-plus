import type { GeneralField } from '@formvk/core'
import type { Schema, SchemaKey } from '@formvk/schema'
import { RecursionField, useField, useFieldSchema } from '@formvk/vue'
import { ElBadge, ElTabPane, ElTabs } from 'element-plus'
import { computed, defineComponent, reactive } from 'vue'
import type { PropType } from 'vue'

import { isComponentOf, usePrefixCls } from '../../shared'
import { cls } from '../../shared'

export interface IFormTab {
  activeKey?: string
  setActiveKey(key: string): void
}

export interface IFormTabProps {
  formTab?: IFormTab
  activeKey?: string
  defaultValue?: string
}

interface IFeedbackBadgeProps {
  name: SchemaKey
  tab: any
}

const parseTabs = (field: GeneralField | undefined, currentSchema: Schema | undefined) => {
  const tabs: { name: SchemaKey; props: any; schema: Schema }[] = []
  if (!field || !currentSchema) return tabs
  currentSchema.mapProperties((tabSchema, name) => {
    const child = field.query(field.address.concat(name)).take()
    if (child?.display === 'none' || child?.display === 'hidden') return
    if (isComponentOf(tabSchema.component, 'TabPane')) {
      const key = child?.componentProps?.key || tabSchema?.componentProps?.key || name
      tabs.push({
        name,
        props: {
          ...tabSchema?.componentProps,
          ...child?.componentProps,
          key,
        },
        schema: tabSchema,
      })
    }
  })
  return tabs
}

const FeedbackBadge = defineComponent({
  name: 'FeedbackBadge',
  inheritAttrs: false,
  props: {
    name: { type: [String, Number] as PropType<SchemaKey>, required: true },
    tab: { type: null as unknown as PropType<any>, default: undefined },
  },
  setup(props) {
    const field = useField()
    return () => {
      const currentField = field.value
      if (!currentField) return props.tab
      const errors = currentField.form.queryFeedbacks({
        type: 'error',
        address: `${currentField.address.concat(props.name)}.*`,
      })
      if (errors.length) {
        return (
          <ElBadge type="danger" class="errors-badge" value={errors.length}>
            <span>{props.tab}</span>
          </ElBadge>
        )
      }
      return props.tab
    }
  },
})

// 使用 Vue reactive 承载状态，外部读取 activeKey 时具备响应式
export const createFormTab = (defaultActiveKey?: string): IFormTab => {
  const formTab: IFormTab = reactive({
    activeKey: defaultActiveKey,
    setActiveKey(key: string) {
      formTab.activeKey = key
    },
  })
  return formTab
}

export const FormTab = defineComponent({
  name: 'FormTab',
  inheritAttrs: false,
  props: {
    formTab: Object as PropType<IFormTab>,
    activeKey: String,
    defaultValue: String,
    prefixCls: String,
  },
  setup(props, { attrs }) {
    const field = useField()
    const schema = useFieldSchema()
    const tabs = computed(() => parseTabs(field.value, schema.value))
    const fallbackTab = createFormTab()
    const mergedFormTab = computed(() => props.formTab ?? fallbackTab)
    const prefixCls = usePrefixCls('tab', props)
    const activeKey = computed(() => props.activeKey ?? mergedFormTab.value?.activeKey)

    return () => (
      <ElTabs
        {...attrs}
        modelValue={activeKey.value}
        class={cls(prefixCls, attrs.class as string)}
        onTabChange={(key: string | number) => {
          ;(attrs.onTabChange as any)?.(key)
          ;(attrs.onChange as any)?.(key)
          ;(attrs['onUpdate:modelValue'] as any)?.(key)
          mergedFormTab.value?.setActiveKey?.(key as string)
        }}
      >
        {tabs.value.map(({ props: tabProps, schema, name }, index) => (
          <ElTabPane
            key={String(tabProps.key ?? index)}
            name={String(tabProps.key ?? index)}
            disabled={tabProps.disabled}
            lazy={false}
          >
            {{
              label: () => <FeedbackBadge name={name} tab={tabProps.tab ?? tabProps.label} />,
              default: () => <RecursionField schema={schema} name={name} />,
            }}
          </ElTabPane>
        ))}
      </ElTabs>
    )
  },
})

export type { IFeedbackBadgeProps }
