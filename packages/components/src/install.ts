import type { App, Component } from 'vue'

import * as containers from './containers'

/**
 * 可全局注册的容器组件。
 * 字段 / 布局 / 数组组件由 schema 在内部解析，无需全局注册。
 */
const components: Record<string, Component> = {
  SchemaForm: containers.SchemaForm,
  CrudTable: containers.CrudTable,
  DataTable: containers.DataTable,
  SearchForm: containers.SearchForm,
  AddPopup: containers.AddPopup,
  EditPopup: containers.EditPopup,
  PopupForm: containers.PopupForm,
  ModalForm: containers.ModalForm,
  DrawerForm: containers.DrawerForm,
}

/** 全量注册容器组件 */
export const install = (app: App) => {
  Object.entries(components).forEach(([name, component]) => app.component(name, component))
}

export const FormvkElementPlus = { install }

export default FormvkElementPlus
