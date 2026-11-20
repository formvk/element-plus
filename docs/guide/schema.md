# Schema 参考

本页是 Schema 字段与 `fragment` 构造器的速查参考。Schema 是对表单结构、状态与联动的声明式描述，本包使用 Formvk 的无前缀字段（`component` 而不是 `x-component`）。

- 想跟着步骤搭建第一个表单，阅读[快速开始](/guide/quick-start)。
- 想实现具体需求（联动、校验、数组、阅读态等），阅读[操作指南](/guide/how-to/linkage)。

## 常用 Schema 字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `'string' \| 'number' \| 'boolean' \| 'object' \| 'array' \| 'void' \| 'date' \| 'datetime'` | 字段类型 |
| `title` | `string` | 字段标题，通常由 `FormItem` 渲染为 label |
| `description` | `string` | 字段描述，通常渲染为 `FormItem` 的 `extra` |
| `component` | `string \| Component` | 字段组件，可以是注册名字符串或组件引用 |
| `decorator` | `string \| Component` | 装饰器组件，一般为 `FormItem` |
| `componentProps` | `object` | 透传给字段组件的 props，叶子节点支持 <span v-pre>`{{表达式}}`</span> |
| `decoratorProps` | `object` | 透传给装饰器组件的 props |
| `properties` | `object` | 子字段，用于 `void` / `object` 容器 |
| `items` | `ISchema \| ISchema[]` | 数组元素 Schema |
| `default` | `any` | 默认值 |
| `enum` | `array` | 字段数据源，`Select` / `RadioGroup` / `CheckboxGroup` 会自动连接到 `options`，`TreeSelect` 连接到 `data` |
| `required` | `boolean \| string \| string[]` | 是否必填 |
| `validator` | `FieldValidator` | 校验器，支持规则对象、函数或数组，详见[表单校验](/guide/how-to/validation) |
| `reactions` | `SchemaReaction \| SchemaReaction[]` | 字段联动，详见[字段联动](/guide/how-to/linkage) |
| `readOnly` / `disabled` / `readPretty` / `editable` | `boolean` | 字段交互模式开关 |
| `visible` / `hidden` / `display` | `boolean \| 'visible' \| 'hidden' \| 'none'` | 字段可见性 |
| `pattern` | `string` | 注意：表示交互模式（`editable` / `readOnly` / `disabled` / `readPretty`），**不是**正则表达式；正则校验请使用 `validator` |

JSON Schema 标准校验字段（`maxLength` / `minLength` / `minimum` / `maximum`、`maxItems` 等）同样可用，完整规则见[表单校验](/guide/how-to/validation)。

## fragment 构造器

`createSchemaOptions` 返回的 `fragment`（通常简写为 `f`）由注册表推导而来：注册了 `Input`，就有 `f.Input`；注册了 `FormItem`，就有 `f.FormItem`。

| 构造器 | 用途 |
| --- | --- |
| `f.Field(options)` | 普通字段（不绑定具体组件） |
| `f.Void(properties, options)` | 虚拟字段 / 布局容器 |
| `f.Object(properties, options)` | 对象字段，第一个参数直接传入子字段 |
| `f.ArrayItems(items, options)` | 数组字段，`items` 传入元素 Schema Creator |
| `f.Input(options)` 等 | 注册表推导出的组件构造器，所有注册的字段 / void / 数组组件都有对应方法 |

```ts
const schema = createSchema({
  profile: f.Object({
    name: f.Input({ title: '姓名' }),
  }),
  users: f.ArrayItems(f.Object({ name: f.Input({ title: '姓名' }) })),
  panel: f.Void({}, { component: SomeContainer }),
})
```

## 组件名与组件引用

`component` / `decorator` 的两种写法等价：

```ts
// 1. 注册名字符串
createSchema({ name: f.Field({ title: '姓名', component: 'Input' }) })

// 2. 组件引用
createSchema({ name: f.Field({ title: '姓名', component: Input }) })
```

组件引用同样适用于带层级的组件，例如 `TabPane`、`CollapsePanel`、`Column`，内核会通过组件的 `name` 识别其语义。

## 表达式与作用域

`componentProps` 等位置的字符串叶子可以写 <span v-pre>`{{ ... }}`</span> 表达式，联动与表达式中内置以下作用域变量：

| 变量 | 说明 |
| --- | --- |
| `$self` | 当前字段 |
| `$form` | 当前表单实例 |
| `$values` | 表单值 |
| `$record` | 父级记录（数组项），内含 `$lookup` 与 `$index` |
| `$records` | 父级记录数组 |
| `$index` | 当前字段在数组中的下标 |
| `$props` | 设置当前字段组件属性的方法 |
| `$effect` / `$memo` / `$observable` | 动态能力，分别等同 `autorun`、立即求值、转 observable |

表达式与联动的具体写法见[字段联动](/guide/how-to/linkage)。
