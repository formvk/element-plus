# Form

表单容器，内部集成 `FormLayout` 与阅读态占位符上下文，并接管原生提交事件。传入 `form` 时创建独立的表单上下文；未传入时自动从父级获取表单实例。

<demo vue="../demos/form-basic.vue" title="auto-submit / auto-submit-failed" description="提交成功与校验失败分别触发对应回调" />

<demo vue="../demos/form-component.vue" title="component / previewTextPlaceholder" description="component 替换渲染容器，previewTextPlaceholder 控制阅读态空值" />

## 何时使用

- 作为任何 Schema 驱动表单的根节点，承载 `createForm()` 创建的表单实例。
- 需要统一配置表单布局、阅读态空值占位符或提交 / 校验失败回调时。
- 需要把表单渲染到非 `<form>` 容器（如自定义组件、弹窗内容）时，使用 `component` 替换容器。

## 属性

Element Plus 参考：[Form](https://element-plus.org/zh-CN/component/form.html)。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `form` | `Form` | — | 由 `createForm` 创建的表单实例；不传时从父级上下文获取 |
| `component` | `string` | `'form'` | 渲染容器 |
| `preview-text-placeholder` | `VNodeChild` | `'N/A'` | 阅读态空值占位符，通过 `Placeholder` 上下文下发 |
| `@auto-submit` | `(values) => any` | — | 表单提交且校验通过后的回调 |
| `@auto-submit-failed` | `(feedbacks) => void` | — | 提交校验失败后的回调 |
| 其他 | `IFormLayoutProps` | — | 透传给内部 `FormLayout`，见 [FormLayout](/components/form-layout) |

## 注意事项

- 既没有传入 `form`、也不存在父级表单上下文时，会抛出 `must pass form instance by createForm` 错误。
- 容器的原生 `submit` 事件会被自动拦截（`preventDefault`），转而调用 `form.submit()`，校验失败时进入 `auto-submit-failed`。
- `createForm` 返回的是 `markRaw` 包装的对象，不具备 Vue 响应式；需要切换 `form.readPretty` 时手动赋值即可，模板中依赖它的局部状态请使用 `ref` 配合 `watch`。
- [Submit](/components/submit) 在未传入 `onSubmit` 时以原生 submit 按钮工作，同样会触发这里的提交逻辑。
