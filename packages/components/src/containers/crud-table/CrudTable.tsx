import type { TableModel } from '@formvk/models'
import type { ISchema } from '@formvk/schema'
import type { TableProps } from 'element-plus'
import { defineComponent } from 'vue'
import type { PropType, VNodeChild } from 'vue'

import { TableRenderProvider } from '../../hooks'
import type { DrawerFormProps, ModalFormProps } from '../popup'
import type { DataTablePagination, DataTableProps, SearchFormProps, TablePopupProps } from './widgets'
import { AddPopup, DataTable, EditPopup, SearchForm } from './widgets'

/** 新增 / 编辑弹窗配置，`type` 默认 `drawer` */
export type CrudTablePopupProps =
  | (Omit<DrawerFormProps, 'popup' | 'schema' | 'scope' | 'components'> & { type?: 'drawer' })
  | (Omit<ModalFormProps, 'popup' | 'schema' | 'scope' | 'components'> & { type: 'modal' })

export interface CrudTableProps<IRecord extends object = any> extends DataTableProps<IRecord> {
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
  /** 搜索表单配置，覆盖内部默认值 */
  searchProps?: Omit<SearchFormProps, 'form' | 'schema' | 'scope' | 'components'>
  /** 新增与编辑弹窗的公共配置，可被 `addProps` / `editProps` 覆盖 */
  popupProps?: CrudTablePopupProps
  /** 新增弹窗配置，覆盖 `popupProps` */
  addProps?: CrudTablePopupProps
  /** 编辑弹窗配置，覆盖 `popupProps` */
  editProps?: CrudTablePopupProps
}

/**
 * 标准「搜索 + 表格 + 新增 / 编辑」组合。
 * 需要自定义布局时，可改用 `TableRenderProvider` 与 `SearchForm` / `DataTable` / `AddPopup` / `EditPopup` 自由组装
 */
export const CrudTable = defineComponent<CrudTableProps & TableProps>({
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
    columns: Array as PropType<DataTableProps['columns']>,
    pagination: { type: [Boolean, Object] as PropType<false | DataTablePagination>, default: undefined },
    searchProps: Object as PropType<CrudTableProps['searchProps']>,
    popupProps: Object as PropType<CrudTablePopupProps>,
    addProps: Object as PropType<CrudTablePopupProps>,
    editProps: Object as PropType<CrudTablePopupProps>,
  },
  setup(props, { attrs, slots }) {
    return () => {
      const addPopupConfig: TablePopupProps & Record<string, any> = {
        type: 'drawer',
        title: `新增${props.title ?? ''}`,
        ...(props.popupProps ?? {}),
        ...(props.addProps ?? {}),
      }

      const editPopupConfig: TablePopupProps & Record<string, any> = {
        type: 'drawer',
        title: `编辑${props.title ?? ''}`,
        ...(props.popupProps ?? {}),
        ...(props.editProps ?? {}),
      }

      return (
        <TableRenderProvider value={{ table: props.table, placeholder: props.placeholder, scope: props.scope }}>
          {props.search ? (
            <SearchForm
              {...(props.searchProps ?? {})}
              schema={props.search}
              scope={props.scope}
              components={props.components}
            />
          ) : null}
          <DataTable
            {...attrs}
            columns={props.columns}
            pagination={props.pagination}
            scope={props.scope}
            placeholder={props.placeholder}
          >
            {slots.default?.()}
          </DataTable>
          {props.add ? (
            <AddPopup {...addPopupConfig} schema={props.add} scope={props.scope} components={props.components} />
          ) : null}
          {props.edit ? (
            <EditPopup {...editPopupConfig} schema={props.edit} scope={props.scope} components={props.components} />
          ) : null}
        </TableRenderProvider>
      )
    }
  },
})
