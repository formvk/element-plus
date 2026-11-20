# Schema 驱动与表单状态模型

本页解释 `@formvk/element-plus` 背后的工作方式：一份 Schema 如何变成可交互表单，字段状态存放在哪里，以及四种交互模式的区别。理解这些内容有助于你排查联动、校验与阅读态问题。

## 三层结构

一个表单由三个角色协作完成：

| 角色 | 工厂 / 组件 | 职责 |
| --- | --- | --- |
| 表单实例 | `createForm()` | 状态中心：维护字段图（graph）、值、校验反馈、生命周期 |
| Schema | `createSchema()` + `fragment` | 声明式描述：有哪些字段、用什么组件、如何联动与校验 |
| 渲染器 | `SchemaField` + `createSchemaOptions()` 的 `OptionsProvider` | 把 Schema 翻译成 Vue 组件树，并把字段与组件连接起来 |

`createSchemaOptions` 的注册表（`components` / `voidComponents` / `arrayComponents`）经 `OptionsProvider` 提供给后代 `SchemaField`，建立「Schema 中的组件名 → 真实 Vue 组件」的映射；`fragment`（`f`）则由同一份注册表推导，保证 `f.Input` 这样的构造器与注册表里的组件严格对应。`OptionsProvider` 是应用级上下文，在应用最外层注入一次即可，后代所有表单与容器自动继承。

## 字段是状态的唯一持有者

渲染期间，`SchemaField` 会为每个数据字段在内核中创建一个 `Field`（数组是 `ArrayField`，对象是 `ObjectField`，纯布局是 `VoidField`）。组件本身不保存业务状态：

```text
field.value  ←→  connect/mapProps  ←→  Element Plus 组件的 modelValue/onUpdate:modelValue
```

- 用户操作组件 → `update:modelValue` 写入 `field.value`；
- 联动、校验、重置都直接作用于 field，而不是组件；
- 因此同一份 Schema 换一套桥接组件（如 Element Plus → 其他 UI 库），状态逻辑可以完全复用。

字段之间通过路径（如 `users.0.name`）组织成字段图，联动中的 `field.query('.country')` 就是在这张图上查找同级字段。

## 响应式联动模型

`reactions` 函数在字段初始化时执行，内核的响应式系统会追踪函数内读取的所有字段状态。当被追踪的数据变化时，函数自动重新执行，对 `field.visible`、`field.componentProps` 等赋值会立即反映到视图。

这意味着你只需要描述「依赖什么、派生什么」，不需要手动订阅或在 `watch` 里同步状态。<span v-pre>`{{ ... }}`</span> 形式的表达式字符串是同一套机制的轻量写法。

## 四种交互模式（pattern）

`pattern` 是字段级（也可表单级统一设置）的交互模式，共四种：

| pattern | 含义 | 典型用途 |
| --- | --- | --- |
| `editable` | 可编辑，默认模式 | 正常填写 |
| `disabled` | 渲染禁用态控件，值仍提交 | 权限受控但需要展示控件外观 |
| `readOnly` | 只读，控件不可改但保持原组件形态 | 防止误改、流程锁定 |
| `readPretty` | 阅读态，切换为 `Text*` 纯文本组件 | 详情页、确认页 |

表单实例上提供了对应的布尔访问器（`form.editable`、`form.disabled`、`form.readOnly`、`form.readPretty`）与 `setPattern` 方法；Schema 上也有同名开关字段。

与 `pattern` 正交的是**可见性**：`visible` / `hidden` 控制是否渲染，`display: 'none'` 会保留字段实例与值但不输出 DOM。

## 一次提交发生了什么

1. `Submit`（或原生提交）触发 `form.submit()`；
2. 内核按字段图执行全量校验，错误以 feedback 形式写入对应 field；
3. `FormItem` 响应 feedback 渲染错误文案，数组容器（如 `ArrayTabs`）在标签上汇总错误数；
4. 全部通过后调用成功回调并把 `form.values` 交给业务；失败则进入 `onSubmitFailed` / `onAutoSubmitFailed`。

因为值始终收敛在 `form.values` 中，提交时不需要从各个组件收集数据，重置（`reset`）也是把字段恢复到 `initialValues` 而非卸载重建。

## 延伸阅读

- [阅读态 Text 渲染机制](/guide/explanation/read-pretty-rendering)：`readPretty` 下组件替换与占位符的实现细节
- [与 formily-element-plus 的差异](/guide/explanation/formily-diff)
- [Schema 参考](/guide/schema)：完整字段与作用域速查
