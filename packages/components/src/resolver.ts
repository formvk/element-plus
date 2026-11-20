/** 可自动注册的容器组件名（与 containers 目录导出一一对应） */
const COMPONENTS = [
  // form
  'SchemaForm',
  // popup
  'PopupForm',
  'ModalForm',
  'DrawerForm',
  // crud-table
  'CrudTable',
  'DataTable',
  'SearchForm',
  'AddPopup',
  'EditPopup',
] as const

const COMPONENT_SET: ReadonlySet<string> = new Set(COMPONENTS)

export interface FormvkElementPlusResolver {
  type: 'component'
  resolve: (name: string) => { name: string; from: string } | undefined
}

/**
 * `unplugin-vue-components` 的解析器，按需解析容器组件。
 * 字段 / 布局 / 数组组件由 schema 内部解析，不参与自动注册；组件样式仍由应用层统一引入。
 */
export function FormvkElementPlusResolver(): FormvkElementPlusResolver {
  return {
    type: 'component',
    resolve: name => (COMPONENT_SET.has(name) ? { name, from: '@formvk/element-plus' } : undefined),
  }
}
