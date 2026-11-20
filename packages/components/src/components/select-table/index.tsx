import { Search } from '@element-plus/icons-vue'
import type { GeneralField } from '@formvk/core'
import type { Schema } from '@formvk/schema'
import { isArr, isBool, isFn } from '@formvk/shared'
import { RecursionField, useField, useFieldSchema } from '@formvk/vue'
import { ElCheckbox, ElInput, ElRadio, ElTable, ElTableColumn, vLoading } from 'element-plus'
import { computed, defineComponent, ref, withDirectives } from 'vue'
import type { PropType } from 'vue'

import { cls, isComponentOf, usePrefixCls } from '../../shared'
import { checkSlackly, flattenOptions, getIndeterminate, getSize, getTitleAddon, useFilterOptions } from './hooks'
import { getOutputData, getUISelected } from './utils'

interface ObservableColumnSource {
  field?: GeneralField
  columnProps: Record<string, any>
  schema: Schema
  display?: string
  name: string
}

type IFilterOption = boolean | ((option: any, keyword: string) => boolean)

type IFilterSort = (optionA: any, optionB: any) => number

export interface ISelectTableProps {
  mode?: 'multiple' | 'single'
  modelValue?: any
  dataSource?: any[]
  optionAsValue?: boolean
  valueType?: 'all' | 'parent' | 'child' | 'path'
  showSearch?: boolean
  searchProps?: Record<string, any>
  primaryKey?: string | ((record: any) => string)
  filterOption?: IFilterOption
  filterSort?: IFilterSort
  onSearch?: (keyword: string) => void
  onChange?: (value: any, options: any) => void
  loading?: boolean
  columns?: Record<string, any>[]
  rowSelection?: Record<string, any>
  checkStrictly?: boolean
  disabled?: boolean
}

const isColumnComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'Column')
}

const addPrimaryKey = (dataSource: any[], rowKey: (record: any) => string, primaryKey: string): any[] =>
  dataSource.map((item): any => {
    const children: any = isArr(item.children) ? addPrimaryKey(item.children, rowKey, primaryKey) : {}
    return {
      ...item,
      ...children,
      [primaryKey]: rowKey(item),
    }
  })

export const SelectTable = defineComponent({
  name: 'SelectTable',
  inheritAttrs: false,
  props: {
    mode: { type: String as PropType<'multiple' | 'single'>, default: 'multiple' },
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
    dataSource: Array as PropType<any[]>,
    optionAsValue: Boolean,
    valueType: { type: String as PropType<'all' | 'parent' | 'child' | 'path'>, default: 'all' },
    showSearch: Boolean,
    searchProps: Object as PropType<Record<string, any>>,
    primaryKey: {
      type: [String, Function] as PropType<string | ((record: any) => string)>,
      default: 'key',
    },
    filterOption: {
      type: [Boolean, Function] as PropType<IFilterOption>,
      default: undefined,
    },
    filterSort: Function as PropType<IFilterSort>,
    onSearch: Function as PropType<(keyword: string) => void>,
    onChange: Function as PropType<(value: any, options: any) => void>,
    loading: { type: Boolean, default: undefined },
    columns: Array as PropType<Record<string, any>[]>,
    rowSelection: Object as PropType<Record<string, any>>,
    checkStrictly: { type: Boolean, default: true },
    disabled: Boolean,
    prefixCls: String,
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    const field = useField()
    const schema = useFieldSchema()
    const prefixCls = usePrefixCls('select-table', props)
    const searchValue = ref<string | undefined>(undefined)

    const mergedCheckStrictly = computed(() => props.rowSelection?.checkStrictly ?? props.checkStrictly)
    const loading = computed(() => (isBool(props.loading) ? props.loading : !!(field.value as any)?.loading))
    const disabled = computed(() => !!props.disabled || !!field.value?.disabled)
    const readOnly = computed(() => !!field.value?.readOnly)
    const readPretty = computed(() => !!field.value?.readPretty)

    const primaryKey = computed(() => (isFn(props.primaryKey) ? '__formvk_key__' : props.primaryKey || 'key'))

    const sources = computed<ObservableColumnSource[]>(() => {
      const arrayField = field.value
      if (!arrayField || !schema.value) return []
      const parseSources = (columnSchema: Schema): ObservableColumnSource[] => {
        if (isColumnComponent(columnSchema)) {
          if (!columnSchema.componentProps?.['dataIndex'] && !columnSchema['name']) return []
          const name = columnSchema.componentProps?.['dataIndex'] || columnSchema['name']
          const childField = arrayField.query(arrayField.address.concat(name)).take()
          const columnProps = (childField?.component as any[] | undefined)?.[1] || columnSchema.componentProps || {}
          const display = childField?.display || columnSchema.display
          return [
            {
              name,
              display,
              field: childField,
              schema: columnSchema,
              columnProps: {
                title: childField?.title || columnProps.title,
                ...columnProps,
              },
            },
          ]
        } else if (columnSchema.properties) {
          return columnSchema.reduceProperties<ObservableColumnSource[], ObservableColumnSource[]>(
            (buf, propertySchema) => {
              return buf.concat(parseSources(propertySchema))
            },
            []
          )
        }
        return []
      }

      const parseArrayItems = (schemaItems: any) => {
        if (!schemaItems) return []
        const items = isArr(schemaItems) ? schemaItems : [schemaItems]
        return items.reduce<ObservableColumnSource[]>((columns, itemSchema) => {
          return columns.concat(parseSources(itemSchema))
        }, [])
      }

      const currentSchema = schema.value
      const validSchema = (
        currentSchema.type === 'array' && currentSchema.items ? currentSchema.items : currentSchema
      ) as Schema | Schema[]
      return parseArrayItems(validSchema)
    })

    const columns = computed(() =>
      sources.value.reduce<Record<string, any>[]>((buf, { name, columnProps, schema, display }, key) => {
        if (display && display !== 'visible') return buf
        if (!isColumnComponent(schema)) return buf
        const { title, dataIndex: _dataIndex, key: _key, render: _render, ...rest } = columnProps
        return buf.concat({
          key,
          prop: name,
          label: title ?? name,
          ...rest,
        })
      }, [])
    )

    const rawDataSource = computed(() => {
      if (isArr(props.dataSource)) return props.dataSource
      return ((field.value as any)?.dataSource as any[]) ?? []
    })

    const dataSource = computed(() => {
      if (isFn(props.primaryKey)) {
        return addPrimaryKey(rawDataSource.value, props.primaryKey, primaryKey.value)
      }
      return rawDataSource.value
    })

    const filteredDataSource = useFilterOptions(
      () => dataSource.value,
      () => searchValue.value,
      () => props.filterOption,
      () => mergedCheckStrictly.value
    )

    const orderedFilteredDataSource = computed(() => {
      if (!props.filterSort) return filteredDataSource.value
      return [...filteredDataSource.value].sort((a, b) => props.filterSort!(a, b))
    })

    const flatDataSource = computed(() => flattenOptions(dataSource.value))
    const flatFilteredDataSource = computed(() => flattenOptions(filteredDataSource.value))

    const selected = computed(() =>
      getUISelected(
        props.modelValue,
        flatDataSource.value,
        primaryKey.value,
        props.valueType,
        props.optionAsValue,
        props.mode,
        mergedCheckStrictly.value,
        props.primaryKey
      )
    )

    // readPretty 时只显示已选中的数据行
    const readPrettyDataSource = computed(() =>
      orderedFilteredDataSource.value.filter(item => selected.value.includes(item?.[primaryKey.value]))
    )

    const displayDataSource = computed(() =>
      readPretty.value ? readPrettyDataSource.value : orderedFilteredDataSource.value
    )

    const getWholeDataSource = () => {
      if (props.optionAsValue && props.mode === 'multiple' && props.modelValue?.length) {
        const map = new Map()
        const arr = [...flatDataSource.value, ...props.modelValue]
        arr.forEach(item => {
          if (!primaryKey.value) return
          if (!map.has(item?.[primaryKey.value])) {
            map.set(item?.[primaryKey.value], item)
          }
        })
        return [...map.values()]
      }
      return flatDataSource.value
    }

    const onInnerChange = (selectedRowKeys: any[]) => {
      if (readOnly.value) return
      // 筛选后 onChange 默认的 records 数据不完整，此处需使用完整数据过滤
      const wholeRecords = getWholeDataSource().filter(
        item => primaryKey.value && selectedRowKeys.includes(item?.[primaryKey.value])
      )
      const { outputValue, outputOptions } = getOutputData(
        selectedRowKeys,
        wholeRecords,
        dataSource.value,
        primaryKey.value,
        props.valueType,
        props.optionAsValue,
        props.mode,
        mergedCheckStrictly.value
      )
      emit('update:modelValue', outputValue)
      props.onChange?.(outputValue, outputOptions)
    }

    // TreeData SlacklyChange（父子联动）
    const onSlacklyChange = (currentSelected: any[]) => {
      const { selectedRowKeys } = checkSlackly(
        currentSelected,
        selected.value,
        flatDataSource.value,
        flatFilteredDataSource.value,
        primaryKey.value,
        mergedCheckStrictly.value
      )
      onInnerChange(selectedRowKeys)
    }

    const applySelectedKeys = (keys: any[]) => {
      if (mergedCheckStrictly.value !== false) {
        onInnerChange(keys)
      } else {
        onSlacklyChange(keys)
      }
    }

    const onRowClick = (record: Record<string, any>) => {
      if (readPretty.value || disabled.value || readOnly.value || record?.disabled) {
        return
      }
      const selectedRowKey = primaryKey.value ? record?.[primaryKey.value] : null
      const isSelected = selectedRowKey != null ? selected.value.includes(selectedRowKey) : false
      if (props.mode === 'single' && selectedRowKey != null) {
        applySelectedKeys([selectedRowKey])
        return
      }
      if (isSelected) {
        applySelectedKeys(selected.value.filter(item => item !== selectedRowKey))
      } else {
        applySelectedKeys([...selected.value, selectedRowKey])
      }
    }

    const onInnerSearch = (searchText?: string) => {
      const formatted = (searchText || '').trim()
      searchValue.value = searchText
      props.onSearch?.(formatted)
    }

    const renderTitleAddon = () =>
      getTitleAddon(
        selected.value,
        flatDataSource.value,
        flatFilteredDataSource.value,
        primaryKey.value,
        props.mode,
        disabled.value,
        readOnly.value,
        mergedCheckStrictly.value,
        keys => applySelectedKeys(keys)
      )

    const renderSelectionColumn = () => {
      if (readPretty.value) return null
      if (props.mode === 'single') {
        return (
          <ElTableColumn width="55" class-name={`${prefixCls}-selection`}>
            {{
              default: ({ row }: any) => (
                <span onClick={(e: MouseEvent) => e.stopPropagation()}>
                  <ElRadio
                    modelValue={selected.value.includes(row?.[primaryKey.value])}
                    disabled={disabled.value || row?.disabled}
                    onChange={() => onRowClick(row)}
                  />
                </span>
              ),
            }}
          </ElTableColumn>
        )
      }
      return (
        <ElTableColumn width="55" class-name={`${prefixCls}-selection`}>
          {{
            header: () => renderTitleAddon(),
            default: ({ row }: any) => (
              <span onClick={(e: MouseEvent) => e.stopPropagation()}>
                <ElCheckbox
                  modelValue={selected.value.includes(row?.[primaryKey.value])}
                  indeterminate={getIndeterminate(row, flatDataSource.value, selected.value, primaryKey.value)}
                  disabled={disabled.value || row?.disabled}
                  onChange={(checked: any) => {
                    const key = row?.[primaryKey.value]
                    const keys = checked ? [...selected.value, key] : selected.value.filter(item => item !== key)
                    applySelectedKeys(keys)
                  }}
                />
              </span>
            ),
          }}
        </ElTableColumn>
      )
    }

    return () => {
      const currentField = field.value
      if (!currentField) return null
      const { class: attrsClass, style: attrsStyle, ...tableAttrs } = attrs
      const { searchSize, tableSize } = getSize(
        currentField.decoratorProps?.size as any,
        props.searchProps?.size,
        attrs.size as any
      )

      return (
        <div class={cls(prefixCls, attrsClass as string)} style={attrsStyle as any}>
          {props.showSearch ? (
            <ElInput
              {...(props.searchProps as any)}
              modelValue={searchValue.value}
              class={cls(`${prefixCls}-search`, props.searchProps?.class)}
              style={{ width: '100%', ...props.searchProps?.style }}
              placeholder={props.searchProps?.placeholder ?? '请输入搜索内容'}
              clearable
              prefixIcon={Search as any}
              disabled={disabled.value}
              readOnly={readOnly.value}
              size={searchSize as any}
              onInput={(value: string) => onInnerSearch(value)}
              onClear={() => onInnerSearch('')}
            />
          ) : null}
          {withDirectives(
            <ElTable
              {...tableAttrs}
              rowKey={primaryKey.value}
              data={displayDataSource.value}
              size={tableSize as any}
              class={`${prefixCls}-table`}
              {...({ 'onRow-click': (record: any) => onRowClick(record) } as any)}
            >
              {renderSelectionColumn()}
              {props.columns?.length
                ? props.columns.map((column, key) => <ElTableColumn key={key} {...column} />)
                : columns.value.map(column => <ElTableColumn key={column.key} {...column} />)}
            </ElTable>,
            [[vLoading, loading.value]]
          )}
          {sources.value.map((column, key) => {
            // 专门用来承接对 Column 的状态管理
            if (!isColumnComponent(column.schema)) return null
            return <RecursionField name={column.name} schema={column.schema} onlyRenderSelf key={key} />
          })}
        </div>
      )
    }
  },
})
