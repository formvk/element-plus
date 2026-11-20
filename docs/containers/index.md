# 容器总览

容器（containers）把**组件**与 **`@formvk/models`** 的数据模型组合起来，提供表单级的高层抽象：一个入口同时接管 schema 渲染、弹窗开关、提交校验、分页与数据刷新。

## 容器与组件的区别

| | 组件（components） | 容器（containers） |
| --- | --- | --- |
| 职责 | 单个字段 / 布局 / 数组的渲染与交互 | 组合多个组件与数据模型，完成完整业务闭环 |
| 状态 | 由 Formily 字段模型驱动 | 由 `@formvk/models` 的 `PopupModel` / `TableModel` 驱动 |
| 典型场景 | `Input`、`FormItem`、`ArrayTable` | 弹窗表单、搜索 + 表格 + 新增/编辑 |

## 容器一览

| 容器 | 说明 |
| --- | --- |
| [SchemaForm](/containers/schema-form) | `Form` + `SchemaField` 的一层封装，直接渲染 schema |
| [PopupForm](/containers/popup) | 基于 `PopupModel` 的弹窗表单，按 `type` 渲染 `ElDrawer` 或 `ElDialog` |
| [CrudTable](/containers/crud-table) | 基于 `TableModel`，整合搜索表单、分页、新增/编辑弹窗 |
| [表格组件](/containers/crud-table#自由组合) | `TableRenderProvider` + `SearchForm` / `DataTable` / `AddPopup` / `EditPopup`，可脱离 `CrudTable` 自由组装 |
| [表格渲染器](/containers/renders) | 基于 `renders` 的常用表格列渲染器，配合 `CrudTable` 使用 |

## 安装

```bash
pnpm add @formvk/element-plus @formvk/models @formvk/vue vue element-plus
```

`@formvk/models` 是容器的数据层，提供 `PopupModel` 与 `TableModel`，与 UI 框架无关，同一实例可在 React / Vue 中复用。若只使用组件、不使用容器，则无需直接依赖它。

## 组件映射

容器不预绑定内置组件。推荐在**应用最外层**通过 `createSchemaOptions` 返回的 `OptionsProvider` 注入一次注册表，容器内部的 `SchemaField` 会自动继承，无需再传 `components`：

```vue
<script setup lang="ts">
import { SchemaForm, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { createForm, createSchema, createSchemaOptions } from '@formvk/vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const form = createForm()
const schema = createSchema({
  username: f.Input({ title: '用户名' }),
})
</script>

<template>
  <OptionsProvider>
    <SchemaForm :form="form" :schema="schema" />
  </OptionsProvider>
</template>
```

`f` 的组件 props、字段值与 `scope` 类型均由命名空间中的组件自动推导，无需手写类型参数；只需要部分组件时也可按需传入子集。

容器仍保留 `components` prop，用于局部覆盖或脱离 `OptionsProvider` 单独使用，显式传入时优先生效。

::: tip
工厂函数（如 `createFormCollapse`）不属于组件映射，已从分类命名空间中排除，直接从 `@formvk/element-plus` 具名导入使用。
:::
