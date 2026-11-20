import type { ArrayField } from '@formvk/core'
import type { Schema } from '@formvk/schema'
import { RecursionField, useField, useFieldSchema } from '@formvk/vue'
import { defineComponent, computed } from 'vue'
import type { HTMLAttributes } from 'vue'

import { isComponentOf, SortableContainer, usePrefixCls } from '../../shared'
import { cls } from '../../shared'
import { ArrayBase, ArrayBaseItem } from '../array-base'

const isAdditionComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'Addition')
}

const useAddition = () => {
  const schema = useFieldSchema()
  return computed(() =>
    schema.value?.reduceProperties((addition, propertySchema: Schema, key) => {
      if (isAdditionComponent(propertySchema)) {
        return <RecursionField schema={propertySchema} name={key} />
      }
      return addition
    }, null)
  )
}

export const ArrayItems = defineComponent<HTMLAttributes>(
  (_, { attrs }) => {
    const field = useField<ArrayField>()
    const schema = useFieldSchema()
    const prefixCls = usePrefixCls('array-items')
    const addition = useAddition()

    return () => {
      const currentField = field.value as ArrayField
      if (!currentField) return null
      if (!schema.value) throw new Error('can not found schema object')
      const currentSchema = schema.value
      const dataSource = Array.isArray(currentField.value) ? currentField.value : []
      return (
        <ArrayBase>
          <div {...attrs} onChange={() => {}} class={cls(prefixCls, attrs.class as string)}>
            <SortableContainer
              list={dataSource.slice()}
              class={`${prefixCls}-list`}
              onSortEnd={({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
                currentField.move(oldIndex, newIndex)
              }}
            >
              {dataSource.map((_item, index) => {
                const items = Array.isArray(currentSchema.items)
                  ? currentSchema.items[index] || currentSchema.items[0]
                  : currentSchema.items
                return (
                  // 数组项 key 由字段的 recordKey 解析，未配置时回退到索引
                  <ArrayBaseItem
                    key={currentField.getRecordKey(index)}
                    index={index}
                    record={() => currentField.value?.[index]}
                  >
                    <div class={`${prefixCls}-item`}>
                      <div class={`${prefixCls}-item-inner`}>
                        {items ? <RecursionField schema={items} name={index} /> : null}
                      </div>
                    </div>
                  </ArrayBaseItem>
                )
              })}
            </SortableContainer>
            {addition.value}
          </div>
        </ArrayBase>
      )
    }
  },
  { name: 'ArrayItems', inheritAttrs: false }
)

export const ArrayItemsItem = defineComponent<HTMLAttributes & { type?: 'card' | 'divide' }>({
  name: 'ArrayItemsItem',
  inheritAttrs: false,
  props: {
    type: {
      type: String as () => 'card' | 'divide',
      default: 'card',
    },
  },
  setup(props, { attrs, slots }) {
    const prefixCls = usePrefixCls('array-items')
    return () => (
      <div {...attrs} onChange={() => {}} class={cls(`${prefixCls}-${props.type || 'card'}`, attrs.class as string)}>
        {slots.default?.()}
      </div>
    )
  },
})
