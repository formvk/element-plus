import type { TableModel } from '@formvk/models'
import type { ISchema } from '@formvk/schema'
import { ElPagination, ElTable, vLoading } from 'element-plus'
import { computed, defineComponent, onMounted, withDirectives } from 'vue'
import type { PropType, VNodeChild } from 'vue'

import { TableRenderProvider } from '../../hooks'
import { SchemaForm } from '../form'
import { PopupForm } from '../popup'

/** 新增 / 编辑弹窗配置，`type` 默认 `drawer` */
export type CrudTablePopupProps =
  | (Record<string, any> & { type?: 'drawer' })
  | (Record<string, any> & { type: 'modal' })

export interface CrudTableProps<IRecord extends object = any> {
  /** 表格模型，负责搜索、分页、记录与增删改的数据流转 */
  table: TableModel<IRecord>
  /** 搜索表单 schema */
  search?: ISchema
  /** 新增表单 schema */
  add?: ISchema
  /** 编辑表单 schema */
  edit?: ISchema
  /** 标题，用于拼接弹窗标题 */
  title?: VNodeChild
  /** 表达式作用域，同时合并进表格渲染器参数 */
  scope?: Record<string, unknown>
  /** 追加或覆盖内置组件 */
  components?: Record<string, any>
  /** 单元格空值占位符，供 `renders` 使用，默认 `--` */
  placeholder?: VNodeChild
  /** 新增与编辑弹窗的公共配置，可被 `addProps` / `editProps` 覆盖 */
  popupProps?: CrudTablePopupProps
  /** 新增弹窗配置，覆盖 `popupProps` */
  addProps?: CrudTablePopupProps
  /** 编辑弹窗配置，覆盖 `popupProps` */
  editProps?: CrudTablePopupProps
}

export const CrudTable = defineComponent({
  name: 'CrudTable',
  inheritAttrs: false,
  props: {
    table: { type: Object as PropType<TableModel>, required: true },
    search: Object as PropType<ISchema>,
    add: Object as PropType<ISchema>,
    edit: Object as PropType<ISchema>,
    title: { type: null as unknown as PropType<VNodeChild>, default: undefined },
    scope: Object as PropType<Record<string, unknown>>,
    components: Object as PropType<Record<string, any>>,
    placeholder: { type: null as unknown as PropType<VNodeChild>, default: undefined },
    popupProps: Object as PropType<CrudTablePopupProps>,
    addProps: Object as PropType<CrudTablePopupProps>,
    editProps: Object as PropType<CrudTablePopupProps>,
  },
  setup(props, { attrs, slots }) {
    onMounted(() => {
      props.table.onMount()
    })

    const renderContext = computed(() => ({
      table: props.table,
      placeholder: props.placeholder,
      scope: props.scope,
    }))

    const pagination = computed(() => props.table.pagination)

    return () => {
      const addPopupConfig = {
        type: 'drawer',
        title: `新增${props.title ?? ''}`,
        ...(props.popupProps ?? {}),
        ...(props.addProps ?? {}),
      } as Record<string, any>

      const editPopupConfig = {
        type: 'drawer',
        title: `编辑${props.title ?? ''}`,
        ...(props.popupProps ?? {}),
        ...(props.editProps ?? {}),
      } as Record<string, any>

      return (
        <TableRenderProvider value={renderContext.value}>
          {props.search ? (
            <SchemaForm
              form={props.table.form}
              schema={props.search}
              scope={props.scope}
              components={props.components}
              onAutoSubmit={() => props.table.search()}
            />
          ) : null}
          {withDirectives(
            <ElTable {...attrs} data={props.table.records} class={(attrs.class as string) ?? 'formvk-crud-table'}>
              {slots.default?.()}
            </ElTable>,
            [[vLoading, props.table.form.submitting]]
          )}
          {pagination.value.total > 0 ? (
            <div class="formvk-crud-table-pagination">
              <ElPagination
                currentPage={pagination.value.current}
                pageSize={pagination.value.pageSize}
                total={pagination.value.total}
                pageSizes={[10, 20, 50, 100]}
                layout="total, sizes, prev, pager, next, jumper"
                {...({
                  // ElPagination 仅在 vnode props 中检测到驼峰事件名时才视为新用法
                  onCurrentChange: (current: number) =>
                    props.table.onSearch({
                      current,
                      pageSize: pagination.value.pageSize,
                      total: pagination.value.total,
                    }),
                  onSizeChange: (pageSize: number) =>
                    props.table.onSearch({
                      current: 1,
                      pageSize,
                      total: pagination.value.total,
                    }),
                } as any)}
              />
            </div>
          ) : null}
          {props.add ? (
            <PopupForm
              {...addPopupConfig}
              popup={props.table.addPopup}
              schema={props.add}
              scope={props.scope}
              components={props.components}
            />
          ) : null}
          {props.edit ? (
            <PopupForm
              {...editPopupConfig}
              popup={props.table.editPopup}
              schema={props.edit}
              scope={props.scope}
              components={props.components}
            />
          ) : null}
        </TableRenderProvider>
      )
    }
  },
})
