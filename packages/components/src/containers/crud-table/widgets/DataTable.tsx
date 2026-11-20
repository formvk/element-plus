import type { IPagination, TableModel } from '@formvk/models'
import type { Stringify } from '@formvk/schema'
import { ElPagination, ElTable, ElTableColumn, vLoading } from 'element-plus'
import type { TableProps } from 'element-plus'
import { Comment, computed, defineComponent, onMounted, withDirectives } from 'vue'
import type { PropType, VNode, VNodeChild } from 'vue'

import { TableRenderProvider, usePrefixCls, useTableModel, useTableRenderContext, useTableScope } from '../../../hooks'
import type { ColumnRender } from '../../renders/types'

/** 单元格取值：支持 `a.b` 形式的多层路径 */
function getCellValue(record: Record<string, any>, prop?: string) {
  if (!prop) return undefined
  return prop.split('.').reduce<any>((value, key) => value?.[key], record)
}

/** 分页配置，`false` 关闭分页 */
export type DataTablePagination = Partial<IPagination> & {
  /** ElPagination 布局，默认 `total, sizes, prev, pager, next, jumper` */
  layout?: string
  /** 每页条数选项，默认 `[10, 20, 50, 100]` */
  pageSizes?: number[]
  [key: string]: any
}

/** 表格列配置，字段透传给 ElTableColumn，支持 `{{ }}` 表达式 */
export interface DataTableColumn<IRecord extends object = any> {
  /** 列类型：`selection` / `index` / `expand` */
  type?: string
  /** 列标题 */
  label?: string
  /** 字段名，支持 `a.b` 形式的多层路径 */
  prop?: string
  /** 列宽 */
  width?: string | number
  /** 最小列宽 */
  minWidth?: string | number
  /** 固定列 */
  fixed?: boolean | 'left' | 'right'
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 表头对齐方式 */
  headerAlign?: 'left' | 'center' | 'right'
  /** 是否可排序 */
  sortable?: boolean | 'custom'
  /** 内容溢出时省略并显示 tooltip */
  showOverflowTooltip?: boolean
  /** 单元格 class */
  className?: string
  /** 表头 class */
  labelClassName?: string
  /** 单元格格式化，透传给 ElTableColumn */
  formatter?: (row: IRecord, column: any, value: any, index: number) => VNodeChild
  /** 自定义单元格渲染函数，签名与 renders 渲染器一致 */
  render?: ColumnRender<IRecord>
  /** 嵌套子列 */
  children?: DataTableColumn<IRecord>[]
  /** 其他 ElTableColumn 属性 */
  [key: string]: any
}

export interface DataTableProps<IRecord extends object = any> {
  /** 列配置，支持 `{{ }}` 表达式 */
  columns?: Stringify<DataTableColumn<IRecord>>[]
  /** 分页配置，默认使用模型分页；传 `false` 关闭分页 */
  pagination?: false | DataTablePagination
  /** 表达式作用域，会与上下文 scope、`$table`、`$state` 合并 */
  scope?: Record<string, unknown>
  /** 单元格空值占位符，供渲染器使用，默认继承上下文 */
  placeholder?: VNodeChild
}

/**
 * 表格模型驱动的表格：分页、加载态与列表达式由模型接管。
 * 默认渲染 `columns`，也可以通过默认插槽传入 `ElTableColumn` 自定义列
 */
export const DataTable = defineComponent<DataTableProps & TableProps>({
  name: 'DataTable',
  inheritAttrs: false,
  props: {
    columns: Array as PropType<DataTableProps['columns']>,
    pagination: { type: [Boolean, Object] as PropType<false | DataTablePagination>, default: undefined },
    scope: Object as PropType<Record<string, unknown>>,
    placeholder: { type: null as unknown as PropType<VNodeChild>, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const table = useTableModel<TableModel>()
    const context = useTableRenderContext<TableModel>()
    const expressionScope = useTableScope(props.scope)
    const prefixCls = usePrefixCls('crud-table')

    onMounted(() => table.onMount())

    const columns = computed(() =>
      props.columns?.length ? table.compile<DataTableColumn>(props.columns, expressionScope.value) : []
    )

    const pagination = computed(() => {
      if (props.pagination === false) return null
      const config = props.pagination && typeof props.pagination === 'object' ? props.pagination : null
      return { ...config, ...table.pagination }
    })

    const renderContext = computed(() => ({
      ...context.value,
      placeholder: props.placeholder ?? context.value.placeholder,
      scope: expressionScope.value,
    }))

    const renderColumn = (column: DataTableColumn, key: string | number) => {
      const { render, children, ...rest } = column
      const columnKey = (rest.columnKey as string) ?? rest.prop ?? key
      const columnSlots = render
        ? {
            default: ({ row, $index }: { row: Record<string, any>; $index: number }) =>
              render(getCellValue(row, rest.prop), row, $index),
          }
        : children?.length
          ? { default: () => children.map((child, index) => renderColumn(child, `${columnKey}-${index}`)) }
          : undefined

      return (
        <ElTableColumn key={columnKey} {...(rest as Record<string, any>)}>
          {columnSlots}
        </ElTableColumn>
      )
    }

    /** 优先使用默认插槽传入的列，空插槽会被编译成注释节点，需要回退到 columns */
    const renderColumns = () => {
      const slotContent = slots.default?.()
      const nodeList = slotContent == null ? [] : Array.isArray(slotContent) ? slotContent : [slotContent]
      const isEmpty = nodeList.every(node => node == null || (node as VNode).type === Comment)
      return isEmpty ? columns.value.map((column, index) => renderColumn(column, index)) : slotContent
    }

    return () => {
      const mergedPagination = pagination.value
      const { class: className, ...tableAttrs } = attrs

      return (
        <TableRenderProvider value={renderContext.value}>
          {withDirectives(
            <ElTable {...tableAttrs} data={table.records} class={(className as string) ?? prefixCls}>
              {renderColumns()}
            </ElTable>,
            [[vLoading, table.form.submitting]]
          )}
          {mergedPagination && mergedPagination.total > 0 ? (
            <div class={`${prefixCls}-pagination`}>
              <ElPagination
                {...({
                  // ElPagination 仅在 vnode props 中检测到驼峰事件名时才视为新用法
                  pageSizes: [10, 20, 50, 100],
                  layout: 'total, sizes, prev, pager, next, jumper',
                  ...mergedPagination,
                  onCurrentChange: (current: number) =>
                    table.onSearch({
                      current,
                      pageSize: mergedPagination.pageSize,
                      total: mergedPagination.total,
                    }),
                  onSizeChange: (pageSize: number) =>
                    table.onSearch({
                      current: 1,
                      pageSize,
                      total: mergedPagination.total,
                    }),
                } as any)}
                currentPage={mergedPagination.current}
                pageSize={mergedPagination.pageSize}
                total={mergedPagination.total}
              />
            </div>
          ) : null}
        </TableRenderProvider>
      )
    }
  },
})
