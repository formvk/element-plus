import type { ArrayField } from '@formvk/core'
import { RecursionField, useField, useFieldSchema } from '@formvk/vue'
import { ElBadge, ElTabPane, ElTabs } from 'element-plus'
import { computed, defineComponent, ref } from 'vue'

import { usePrefixCls } from '../../shared'

const FeedbackBadge = defineComponent({
  name: 'ArrayTabsFeedbackBadge',
  props: { index: { type: Number, required: true } },
  setup(props) {
    const field = useField<ArrayField>()
    return () => {
      const currentField = field.value as ArrayField
      if (!currentField) return null
      const tab = `${currentField.title || 'Untitled'} ${props.index + 1}`
      const errors = (currentField.errors ?? []).filter(error =>
        String(error.address ?? '').includes(`${currentField.address}.${props.index}`)
      )
      if (errors.length) {
        return (
          <ElBadge type="danger" class="errors-badge" value={errors.length}>
            <span>{tab}</span>
          </ElBadge>
        )
      }
      return <span>{tab}</span>
    }
  },
})

export const ArrayTabs = defineComponent({
  name: 'ArrayTabs',
  inheritAttrs: false,
  props: {
    prefixCls: String,
  },
  setup(props, { attrs }) {
    const field = useField<ArrayField>()
    const schema = useFieldSchema()
    const prefixCls = usePrefixCls('array-tabs', props)
    const activeKey = ref('tab-0')

    const getKey = (index: number) => {
      const currentField = field.value as ArrayField
      return String(currentField?.getRecordKey(index) ?? index)
    }

    const dataSource = computed(() => {
      const currentField = field.value as ArrayField
      if (!currentField) return []
      const value = Array.isArray(currentField.value) ? currentField.value : []
      return value.length ? value : [{}]
    })

    const tabKeys = computed(() => dataSource.value.map((_, index) => getKey(index)))
    const mergedActiveKey = computed(() =>
      tabKeys.value.includes(activeKey.value) ? activeKey.value : tabKeys.value[0]
    )

    const onEdit = (targetKey: any, action: 'add' | 'remove') => {
      const currentField = field.value as ArrayField
      if (!currentField) return
      if (action === 'add') {
        const id = dataSource.value.length
        if (currentField.value?.length) {
          currentField.push(null)
        } else {
          currentField.push(null, null)
        }
        activeKey.value = getKey(id)
      } else if (action === 'remove') {
        const index = dataSource.value.findIndex((_, i) => getKey(i) === String(targetKey))
        if (index < 0) return
        if (index - 1 > -1) {
          activeKey.value = getKey(index - 1)
        }
        currentField.remove(index)
      }
    }

    return () => {
      const currentField = field.value as ArrayField
      if (!currentField) return null
      return (
        <ElTabs
          {...attrs}
          type={((attrs.type as string) ?? 'card') as any}
          editable
          modelValue={mergedActiveKey.value}
          class={prefixCls}
          onEdit={onEdit}
        >
          {dataSource.value.map((_, index) => {
            const items = Array.isArray(schema.value?.items)
              ? schema.value.items[index] || schema.value.items[0]
              : schema.value?.items
            return (
              <ElTabPane
                key={String(currentField.getRecordKey(index))}
                name={String(currentField.getRecordKey(index))}
                closable={index !== 0}
                lazy={false}
              >
                {{
                  label: () => <FeedbackBadge index={index} />,
                  default: () => (items ? <RecursionField schema={items} name={index} /> : null),
                }}
              </ElTabPane>
            )
          })}
        </ElTabs>
      )
    }
  },
})
