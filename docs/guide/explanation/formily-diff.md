# 与 formily-element-plus 的差异

`@formvk/element-plus` 在组件设计与 API 形态上与 formily-element-plus 对齐，熟悉 Formily 的开发者可以快速迁移。本页列出需要注意的差异。

## 包名与导入

Formily 的 `@formily/*` 体系整体替换为 `@formvk/*`：

```ts
// Formily
import { createForm, createSchemaField } from '@formily/core' // 或 @formily/vue

// Formvk
import { SchemaField, createForm, createSchema, createSchemaOptions } from '@formvk/vue'
import { Form, FormItem, Input } from '@formvk/element-plus'
```

`@formvk/element-plus` 只包含组件桥接层，内核能力（表单实例、字段、Hooks）从 `@formvk/vue` 导入。

`createSchemaField` 已移除，改用 `createSchemaOptions` 生成 `OptionsProvider` 与 `fragment`；`OptionsProvider` 在应用最外层注入一次，后代 `SchemaField` 与容器组件自动继承。

## Schema 字段去掉 x- 前缀

扩展字段统一使用小驼峰无前缀写法：

| Formily | Formvk |
| --- | --- |
| `x-component` | `component` |
| `x-decorator` | `decorator` |
| `x-component-props` | `componentProps` |
| `x-decorator-props` | `decoratorProps` |
| `x-reactions` | `reactions` |
| `x-validator` | `validator` |

标准 JSON Schema 字段（`type`、`title`、`required`、`enum` 等）保持不变。第三方自定义扩展使用 `xKey` 形式（如 `xCustomThing`）。

注意：Formvk 的 `pattern` 表示交互模式（`editable` / `readOnly` / `disabled` / `readPretty`），不再承担 JSON Schema 的正则语义；正则校验写入 `validator`。

## createSchema 与 fragment

Formvk 推荐通过 `createSchema` + `fragment` 构造器描述表单，能获得完整的类型推断（组件名、`componentProps`、联动作用域都会根据注册表收窄）：

```ts
const { fragment: f } = createSchemaOptions({ components: { Input } })

const schema = createSchema({
  name: f.Input({ title: '姓名', required: true }),
})
```

`component` / `decorator` 既可以传注册名字符串，也可以直接传组件引用，两种写法等价。

## 组件导出形态

本包采用扁平化的具名导出，取消 `Component.Sub` 形式的复合组件挂载（少量保留的复合能力除外，如 `FormButtonGroup.Sticky`）：

```ts
// 数组操作项均为独立具名导出
import { Addition, Remove, Copy, MoveUp, MoveDown, SortHandle, Index } from '@formvk/element-plus'

// 阅读态组件同样具名导出
import { Text, TextInput, TextSelect, TextDatePicker } from '@formvk/element-plus'
```

阅读态组件统一使用 `Text` 前缀命名（对应 Formily 中的 PreviewText 家族）。

## 弹窗表单

本包不提供 `FormDialog` / `FormDrawer` 组件。弹窗表单由容器内的弹窗模型承担：`PopupForm` 基于 `@formvk/models` 的 `PopupModel` 管理打开、关闭、校验与提交，`type="modal"` 时渲染 `ModalForm`（内部使用 `ElDialog`），默认渲染 `DrawerForm`（内部使用 `ElDrawer`）；`CrudTable` 的新增 / 编辑弹窗也复用同一模型。相比组件式弹窗，容器内的弹窗模型状态更透明，也更适合与提交、刷新、路由结合，详见 [弹窗表单](/containers/popup)。

## 样式与技术栈

- 样式来自 Element Plus 的 CSS 变量与控件样式，桥接层只补充布局辅助样式；应用入口需要引入 `element-plus/dist/index.css` 与 `@formvk/element-plus/style.css`；
- 基于 Vue 3.5 与 Element Plus 2.14，peer 依赖要求 Vue `^3.5.0`、Element Plus `^2.14.0`；
- 响应式内核由 `@formvk/reactive` 提供，`reactions`、`useField` 的使用心智与 Formily 保持一致。

## 延伸阅读

- [安装](/guide/install)：版本要求与依赖清单
- [Schema 参考](/guide/schema)：完整字段速查
- [接入自定义组件](/guide/how-to/custom-component)：桥接 API（connect / mapProps / mapReadPretty）
