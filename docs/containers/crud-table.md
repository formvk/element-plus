# CrudTable

基于 `TableModel` 的表格容器：整合搜索表单、分页、数据加载与新增 / 编辑弹窗，业务侧只需要提供 schema 与数据请求方法。

## 何时使用

- 标准「搜索 + 表格 + 新增 / 编辑」的 CRUD 页面。
- 想复用 `PopupModel` 的弹窗表单能力，但不想手写打开、刷新、分页回第一页等逻辑。
- 数据结构固定，仅字段与请求实现不同的列表页。

## 基础用法

<demo vue="../demos/crud-table.vue" title="搜索 + 表格 + 新增 / 编辑 / 删除" description="TableModel 提供数据流转，CrudTable 负责渲染，列上直接使用 renders" />

## TableModel

`TableModel` 只负责数据流转，不感知 UI，构造参数如下：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `search` | `(values, pagination) => Promise<ITableResult \| IRecord[] \| false \| void>` | 搜索方法，可返回记录数组或 `{ records, pagination }`；返回数组时按条数计算 `total` |
| `add` / `edit` | `(values) => Promise<boolean \| void>` | 新增 / 编辑，返回真值时自动回到第一页并刷新 |
| `remove` | `(record) => Promise<boolean \| void>` | 删除，返回真值时自动刷新 |
| `auto` | `boolean` | 是否在 `onMount` 时自动加载，默认 `true` |
| `pagination` | `Partial<IPagination>` | 初始分页，默认 `{ current: 1, pageSize: 20, total: 0 }` |
| `state` | `IState` | 表格附加状态，渲染器可通过 `$state` 读取 |
| `addOptions` / `editOptions` | `PopupOptions` | 新增 / 编辑弹窗的表单选项 |
| `searchOptions` | `IFormProps` | 搜索表单选项 |

常用成员：

| 成员 | 说明 |
| --- | --- |
| `records` | 当前表格数据 |
| `pagination` | `{ current, pageSize, total }` |
| `form` | 搜索表单实例 |
| `addPopup` / `editPopup` | 新增 / 编辑弹窗模型 |
| `search()` | 提交搜索表单并加载数据 |
| `onSearch(pagination?)` | 翻页搜索，不传分页时回到第一页 |
| `onMount()` | 挂载入口，`auto` 未关闭时自动执行一次 `onSearch()` |
| `onAdd(values)` / `onEdit(values)` | 执行新增 / 编辑，返回真值时回到第一页并刷新 |
| `onRemove(record, cb?)` | 删除记录，传 `cb` 时替代默认刷新 |
| `compile(columns, scope?)` | 用表达式编译列配置，作用域含 `$table` / `$state` |

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `table` | `TableModel` | — | 表格模型 |
| `search` | `ISchema` | — | 搜索表单 schema，不传则不渲染搜索区 |
| `add` | `ISchema` | — | 新增表单 schema，不传则不渲染新增弹窗 |
| `edit` | `ISchema` | — | 编辑表单 schema，不传则不渲染编辑弹窗 |
| `title` | `VNodeChild` | — | 弹窗标题后缀，如 `"用户"` 渲染为「新增用户 / 编辑用户」 |
| `scope` | `Record<string, unknown>` | — | 表达式作用域，同时合并进表格渲染器参数 |
| `components` | `Record<string, any>` | — | 可选，扁平组件映射；默认继承顶层 `OptionsProvider`，见 [容器总览](/containers/) |
| `placeholder` | `VNodeChild` | `--` | 单元格空值占位符，供 [`renders`](/containers/renders) 使用 |
| `popupProps` | `CrudTablePopupProps` | — | 新增与编辑弹窗的公共配置 |
| `addProps` | `CrudTablePopupProps` | — | 新增弹窗配置，覆盖 `popupProps` |
| `editProps` | `CrudTablePopupProps` | — | 编辑弹窗配置，覆盖 `popupProps` |
| 其他 | `ElTable` 属性 | — | 透传给 `ElTable`，如 `row-key`、`border`；`data` 与默认 class 由容器接管 |

表格列通过默认插槽传入 `ElTableColumn`：

```vue
<CrudTable :table="table" row-key="id" :search="searchSchema" :add="addSchema" :edit="editSchema">
  <ElTableColumn label="序号" width="70">
    <template #default="{ $index }">
      <Cell :render="renders.serial()" :index="$index" />
    </template>
  </ElTableColumn>
  <ElTableColumn label="用户名" prop="username">
    <template #default="{ row, $index }">
      <Cell :render="renders.text()" :text="row.username" :record="row" :index="$index" />
    </template>
  </ElTableColumn>
</CrudTable>
```

## 弹窗配置

新增 / 编辑弹窗统一使用 [`PopupForm`](/containers/popup)，通过 `popupProps` 配置公共属性，再用 `addProps` / `editProps` 单独覆盖：

```vue
<CrudTable
  :table="table"
  :add="addSchema"
  :edit="editSchema"
  :popup-props="{ type: 'modal', width: 520 }"
  :edit-props="{ title: '编辑用户' }"
/>
```

`CrudTablePopupProps` 的 `type` 决定弹窗形态，其余属性透传给对应的 `ElDialog` / `ElDrawer`：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'drawer' \| 'modal'` | `'drawer'` | 弹窗形态 |
| `title` | `VNodeChild` | `新增{title}` / `编辑{title}` | 弹窗标题，传入时覆盖默认拼接结果 |
| 其他 | `ElDrawer` / `ElDialog` 属性 | — | 如 `width`、`size`、`close-on-click-modal` |

合并顺序为 `默认值 → popupProps → addProps / editProps`，后者覆盖前者。

## 表格渲染器

`CrudTable` 会自动注入表格渲染上下文，因此列上可以直接使用内置渲染器，无需手写展示逻辑：

```vue
<script setup lang="ts">
import { renders } from '@formvk/element-plus'
</script>

<template>
  <ElTableColumn label="名称" prop="name">
    <template #default="{ row, $index }">
      <Cell :render="renders.text({ ellipsis: true })" :text="row.name" :record="row" :index="$index" />
    </template>
  </ElTableColumn>
</template>
```

`renders.xxx()` 返回 `(text, record, index) => VNodeChild` 的列渲染函数；由于 `ElTableColumn` 只提供作用域插槽，需要像 demo 一样用一个极简的 `Cell` 组件在插槽内调用渲染函数。渲染器可读取 `table`、`$state`、`scope` 与单元格上下文，完整列表见 [表格渲染器](/containers/renders)。

## 行为说明

- 挂载时调用 `table.onMount()`，未关闭 `auto` 时自动执行一次搜索。
- 搜索表单提交后调用 `table.search()`，表单校验不通过不会发起请求。
- 分页组件在当前 `total > 0` 时渲染；页码变化调用 `table.onSearch({ current, pageSize, total })`，每页条数变化时回到第 1 页。
- 表格 loading 取自搜索表单的 `submitting` 状态，通过 `v-loading` 展示。
- 新增 / 编辑弹窗分别复用 `table.addPopup`、`table.editPopup`，提交成功后模型自动回到第一页并刷新列表。
- 新增 / 编辑弹窗默认渲染为抽屉，`popupProps.type = 'modal'` 可切换为对话框。
- 新增与删除入口未内置按钮：调用 `table.addPopup.open()` 打开新增弹窗，在列中调用 `table.editPopup.open(record)`、`table.onRemove(record)` 触发编辑 / 删除。
- 表格外层包裹 `TableRenderProvider`，`placeholder` 与 `scope` 会传递给所有内置渲染器。
- 搜索表单与新增 / 编辑弹窗都继承应用最外层的 `OptionsProvider`，通常无需再传 `components`。
