import type { ArrayField } from '@formvk/core'
import type { Schema } from '@formvk/schema'
import { toArr } from '@formvk/shared'
import { RecursionField, useField, useFieldSchema } from '@formvk/vue'
import { ElBadge, ElCard, ElCollapse, ElCollapseItem, ElEmpty } from 'element-plus'
import type { CollapseProps } from 'element-plus'
import { computed, defineComponent, ref, watch } from 'vue'

import { cls, isComponentOf, usePrefixCls } from '../../shared'
import { ArrayBase, ArrayBaseItem } from '../array-base'

export interface IArrayCollapseProps {
  /** 默认展开的面板数量 */
  defaultOpenPanelCount?: number
  accordion?: boolean
  prefixCls?: string
}

const isAdditionComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'Addition')
}

const isIndexComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'Index')
}

const isRemoveComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'Remove')
}

const isMoveUpComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'MoveUp')
}

const isMoveDownComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'MoveDown')
}

const isOperationComponent = (schema: Schema) => {
  return (
    isAdditionComponent(schema) || isRemoveComponent(schema) || isMoveDownComponent(schema) || isMoveUpComponent(schema)
  )
}

const takeDefaultActiveKeys = (field: ArrayField, defaultOpenPanelCount = 5) => {
  const dataSource = Array.isArray(field.value) ? field.value : []
  return dataSource.slice(0, defaultOpenPanelCount).map((_, index) => String(field.getRecordKey(index)))
}

const insertActiveKeys = (activeKeys: string[], index: number) => {
  if (activeKeys.length <= index) return activeKeys.concat(String(index))
  return activeKeys.reduce<string[]>((buf, key) => {
    const keyIndex = Number(key)
    if (keyIndex < index) return buf.concat(key)
    if (keyIndex === index) return buf.concat([key, String(keyIndex + 1)])
    return buf.concat(String(keyIndex + 1))
  }, [])
}

export const ArrayCollapse = defineComponent<CollapseProps & IArrayCollapseProps>({
  name: 'ArrayCollapse',
  inheritAttrs: false,
  props: {
    defaultOpenPanelCount: { type: Number, default: 5 },
    accordion: Boolean,
    prefixCls: String,
  },
  setup(props, { attrs }) {
    const field = useField<ArrayField>()
    const schema = useFieldSchema()
    const prefixCls = usePrefixCls('array-collapse', props)
    const activeKeys = ref<string[]>(
      field.value ? takeDefaultActiveKeys(field.value as ArrayField, props.defaultOpenPanelCount) : []
    )

    watch(
      () => (Array.isArray(field.value?.value) ? field.value.value.length : 0),
      () => {
        const currentField = field.value as ArrayField
        if (!currentField) return
        if (!currentField.modified && currentField.value?.length) {
          activeKeys.value = takeDefaultActiveKeys(currentField, props.defaultOpenPanelCount)
        }
      }
    )

    const addition = computed(() =>
      schema.value?.reduceProperties((sum, propertySchema, key) => {
        if (isAdditionComponent(propertySchema)) {
          return <RecursionField schema={propertySchema} name={key} />
        }
        return sum
      }, null)
    )

    const renderPanelTitle = (index: number, items: Schema, headerText: any) => {
      const currentField = field.value as ArrayField
      if (!currentField) return headerText
      const path = currentField.address.concat(index)
      const errors = currentField.form.queryFeedbacks({
        type: 'error',
        address: `${path}.**`,
      })
      return (
        <ArrayBaseItem index={index} record={() => currentField.value?.[index]}>
          <RecursionField
            schema={items}
            name={index}
            filterProperties={(propertySchema: Schema) => isIndexComponent(propertySchema)}
            onlyRenderProperties
          />
          {errors.length ? (
            <ElBadge type="danger" class="errors-badge" value={errors.length}>
              <span>{headerText}</span>
            </ElBadge>
          ) : (
            headerText
          )}
        </ArrayBaseItem>
      )
    }

    return () => {
      const currentField = field.value as ArrayField
      if (!currentField) return null
      if (!schema.value) throw new Error('can not found schema object')
      const currentSchema = schema.value
      const dataSource = Array.isArray(currentField.value) ? currentField.value : []
      const collapseValue = props.accordion ? activeKeys.value[0] : activeKeys.value

      return (
        <ArrayBase
          onAdd={(index: number) => {
            if (currentField.recordKey) {
              const key = String(currentField.getRecordKey(index))
              activeKeys.value = activeKeys.value.includes(key) ? activeKeys.value : activeKeys.value.concat(key)
              return
            }
            activeKeys.value = insertActiveKeys(activeKeys.value, index)
          }}
        >
          {!dataSource.length ? (
            <ElCard class={cls(`${prefixCls}-item`, attrs.class as string)} shadow="never">
              <ElEmpty />
            </ElCard>
          ) : null}
          <ElCollapse
            {...attrs}
            accordion={props.accordion}
            modelValue={collapseValue}
            class={cls(`${prefixCls}-item`, attrs.class as string)}
            onChange={(keys: any) => {
              activeKeys.value = toArr(keys).map(String)
              ;(attrs.onChange as any)?.(keys)
            }}
          >
            {dataSource.flatMap((item, index) => {
              const items = Array.isArray(currentSchema.items)
                ? currentSchema.items[index] || currentSchema.items[0]
                : currentSchema.items
              if (!items) return []
              const panelProps = currentField.query(`${currentField.address}.${index}`).get('componentProps')
              const panelSchemaProps = items.componentProps ?? {}
              const headerText = panelProps?.title ?? panelSchemaProps.title ?? currentField.title
              return [
                <ElCollapseItem
                  key={String(currentField.getRecordKey(index))}
                  name={String(currentField.getRecordKey(index))}
                  disabled={panelProps?.disabled ?? panelSchemaProps.disabled}
                >
                  {{
                    title: () => renderPanelTitle(index, items, headerText),
                    default: () => (
                      <ArrayBaseItem index={index} record={item}>
                        <RecursionField
                          schema={items}
                          name={index}
                          filterProperties={(propertySchema: Schema) => {
                            if (isIndexComponent(propertySchema)) return false
                            if (isOperationComponent(propertySchema)) return false
                            return true
                          }}
                        />
                      </ArrayBaseItem>
                    ),
                  }}
                </ElCollapseItem>,
              ]
            })}
          </ElCollapse>
          {addition.value}
        </ArrayBase>
      )
    }
  },
})
