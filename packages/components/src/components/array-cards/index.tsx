import type { ArrayField } from '@formvk/core'
import type { Schema } from '@formvk/schema'
import { RecursionField, useField, useFieldSchema } from '@formvk/vue'
import { ElCard, ElEmpty } from 'element-plus'
import { computed, defineComponent } from 'vue'
import type { PropType, VNodeChild } from 'vue'

import { cls, isComponentOf, usePrefixCls } from '../../shared'
import { ArrayBase, ArrayBaseItem } from '../array-base'

const isAdditionComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'Addition')
}

const isIndexComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'Index')
}

const isRemoveComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'Remove')
}

const isCopyComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'Copy')
}

const isMoveUpComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'MoveUp')
}

const isMoveDownComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'MoveDown')
}

const isOperationComponent = (schema: Schema) => {
  return (
    isAdditionComponent(schema) ||
    isRemoveComponent(schema) ||
    isCopyComponent(schema) ||
    isMoveDownComponent(schema) ||
    isMoveUpComponent(schema)
  )
}

export const ArrayCards = defineComponent({
  name: 'ArrayCards',
  inheritAttrs: false,
  props: {
    title: { type: null as unknown as PropType<VNodeChild>, default: undefined },
    extra: { type: null as unknown as PropType<VNodeChild>, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const field = useField<ArrayField>()
    const schema = useFieldSchema()
    const prefixCls = usePrefixCls('array-cards')

    const addition = computed(() =>
      schema.value?.reduceProperties((sum, propertySchema: Schema, key) => {
        if (isAdditionComponent(propertySchema)) {
          return <RecursionField schema={propertySchema} name={key} />
        }
        return sum
      }, null)
    )

    const renderCardSlots = (index: number, items: Schema | undefined, empty?: boolean) => {
      const currentField = field.value as ArrayField
      const header = (
        <span>
          {items && !empty ? (
            <RecursionField
              schema={items}
              name={index}
              filterProperties={(propertySchema: Schema) => isIndexComponent(propertySchema)}
              onlyRenderProperties
            />
          ) : null}
          {slots.title?.() ?? props.title ?? currentField.title}
        </span>
      )
      const extra = (
        <span>
          {items && !empty ? (
            <RecursionField
              schema={items}
              name={index}
              filterProperties={(propertySchema: Schema) => isOperationComponent(propertySchema)}
              onlyRenderProperties
            />
          ) : null}
          {slots.extra?.() ?? props.extra}
        </span>
      )
      const content = empty ? (
        <ElEmpty />
      ) : items ? (
        <RecursionField
          schema={items}
          name={index}
          filterProperties={(propertySchema: Schema) => {
            if (isIndexComponent(propertySchema)) return false
            if (isOperationComponent(propertySchema)) return false
            return true
          }}
        />
      ) : null
      return {
        header: () => header,
        extra: () => extra,
        default: () => content,
      }
    }

    return () => {
      const currentField = field.value as ArrayField
      if (!currentField) return null
      if (!schema.value) throw new Error('can not found schema object')
      const currentSchema = schema.value
      const dataSource = Array.isArray(currentField.value) ? currentField.value : []
      return (
        <ArrayBase>
          {!dataSource.length ? (
            <ElCard class={cls(`${prefixCls}-item`, attrs.class as string)} shadow="never">
              {renderCardSlots(-1, undefined, true)}
            </ElCard>
          ) : null}
          {dataSource.map((_, index) => {
            const items = Array.isArray(currentSchema.items)
              ? currentSchema.items[index] || currentSchema.items[0]
              : currentSchema.items
            // 数组项 key 由字段的 recordKey 解析，未配置时回退到索引
            return (
              <ArrayBaseItem
                key={currentField.getRecordKey(index)}
                index={index}
                record={() => currentField.value?.[index]}
              >
                <ElCard class={cls(`${prefixCls}-item`, attrs.class as string)} shadow="never">
                  {renderCardSlots(index, items)}
                </ElCard>
              </ArrayBaseItem>
            )
          })}
          {addition.value}
        </ArrayBase>
      )
    }
  },
})
