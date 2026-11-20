# 弹窗表单

基于 `PopupModel` 的弹窗表单容器，提供 `ModalForm`（对话框，内部使用 `ElDialog`）与 `DrawerForm`（抽屉，内部使用 `ElDrawer`）两种形态，并通过 `PopupForm` 按 `type` 统一渲染。

## 何时使用

- 新增 / 编辑数据需要一个独立的表单弹窗。
- 希望弹窗的打开、关闭、表单重建与提交后关闭都由模型统一管理。
- 需要在对话框与抽屉之间切换，而不改动业务逻辑。

## 基础用法

<demo vue="../demos/popup-form.vue" title="抽屉 / 对话框切换" description="同一 PopupModel 与 schema，通过 type 切换弹窗形态" />

`type` 省略时渲染 `DrawerForm`（内部使用 `ElDrawer`）；`type="modal"` 渲染 `ModalForm`（内部使用 `ElDialog`）。

## PopupForm 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'drawer' \| 'modal'` | `'drawer'` | 弹窗形态，决定渲染 `DrawerForm` 还是 `ModalForm` |
| 其他 | `DrawerFormProps \| ModalFormProps` | — | 按 `type` 透传给对应表单组件，见下方属性表 |

## PopupModel

| 成员 | 说明 |
| --- | --- |
| `visible` | 弹窗是否可见 |
| `form` | 当前表单实例，`open` 时按传入值重建 |
| `open(values?, initialValues?)` | 重置表单并打开弹窗 |
| `close()` | 关闭弹窗 |
| `onSubmit()` | 校验并提交，提交函数返回真值时自动关闭 |

构造函数为 `new PopupModel(submit, options?)`：`submit` 是 `(values) => Promise<boolean \| void>` 的提交函数，`options` 为表单选项（`IFormProps`），会在每次 `open` 时用于创建新的表单实例。

```ts
import { PopupModel } from '@formvk/models'

const popup = new PopupModel(async values => {
  await save(values)
  return true
})
```

## 属性

### ModalForm

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `popup` | `PopupModel` | — | 弹窗表单模型，内部使用模型创建的 form 实例 |
| `schema` | `ISchema` | — | 弹窗内表单 schema |
| `scope` | `Record<string, unknown>` | — | 表达式作用域 |
| `components` | `Record<string, any>` | — | 可选，扁平组件映射；默认继承顶层 `OptionsProvider` |
| `onOk` | `(e) => boolean \| void \| Promise<boolean \| void>` | — | 点击确定时触发，返回 `false` 阻止提交 |
| `onCancel` | `(e) => boolean \| void \| Promise<boolean \| void>` | — | 点击取消或关闭弹窗时触发，返回 `false` 阻止关闭 |
| 其他 | `ElDialog` 属性 | — | 如 `title`、`width`；`modelValue` 与底部按钮由容器接管 |

### DrawerForm

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `popup` / `schema` / `scope` / `components` | 同 `ModalForm` | — | 表单内容 |
| `onOk` / `onCancel` | 同 `ModalForm` | — | 同 `ModalForm` |
| 其他 | `ElDrawer` 属性 | — | 如 `title`、`size`；`modelValue` 与底部按钮由容器接管 |

抽屉未指定 `size` 时默认宽度为 `600`。

## 行为说明

- 点确定时先触发 `onOk`，未返回 `false` 才调用 `popup.onSubmit()`。
- 点取消、点击遮罩或关闭图标时先触发 `onCancel`，未返回 `false` 才调用 `popup.close()`。
- 确定按钮的 loading 取自 `popup.form.submitting`；校验中与提交中都会展示。
- 提交函数返回假值时表单保持打开，便于展示服务端错误。
- 弹窗底部由容器统一渲染「取消 / 确定」按钮；表单内容始终使用 `popup.form`，`schema`、`scope`、`components` 会透传给内部的 `SchemaForm`。
- 弹窗内容通过 Teleport 渲染，但组件上下文依然有效，可以继承应用最外层的 `OptionsProvider`。

## 与 CrudTable 组合

[CrudTable](/containers/crud-table) 的新增 / 编辑弹窗内部即使用 `PopupForm`，默认抽屉形态，可通过 `popupProps`、`addProps`、`editProps` 配置形态与属性：

```vue
<CrudTable
  :table="table"
  :add="addSchema"
  :edit="editSchema"
  :popup-props="{ type: 'modal', width: 520 }"
  :edit-props="{ title: '编辑用户' }"
/>
```

合并顺序为 `默认值 → popupProps → addProps / editProps`，同时设置时后者生效。
