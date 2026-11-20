# Submit

表单提交按钮，基于 Element Plus `Button` 封装，自动接入父级表单的提交、校验与提交中状态。

<demo vue="../demos/submit.vue" title="onSubmit / onSubmitSuccess / onSubmitFailed" description="提交成功与失败分别回调，未通过校验时展示错误数量" />

## 何时使用

- 表单底部的主提交动作，配合 [Form](/components/form) 或 [FormButtonGroup](/components/form-button-group) 使用。
- 需要在提交成功 / 失败后执行各自的副作用（跳转、提示、埋点）时。

## 属性

继承 Element Plus [`Button`](https://element-plus.org/zh-CN/component/button.html) 的属性，本包扩展以下属性：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `onSubmit` | `(values) => any` | 提交成功回调；传入后按钮变为 `native-type="button"` 并手动触发 `form.submit` |
| `onSubmitSuccess` | `(payload) => void` | `form.submit` 成功后的回调 |
| `onSubmitFailed` | `(feedbacks) => void` | 校验失败回调 |
| `onClick` | `(e) => any` | 点击回调，返回 `false` 可阻止后续提交 |
| `loading` | `boolean` | 未显式传入时自动跟随 `form.submitting` |
| 其他 | `ButtonProps` | 透传给 `ElButton`，默认 `type="primary"` |

在模板中使用事件绑定：`@submit`、`@submit-success`、`@submit-failed`。

## 注意事项

- 未传入 `onSubmit` 时按钮使用原生 `submit` 行为（`native-type="submit"`），由外层 `Form` 接管提交；传入后改为手动调用 `form.submit(onSubmit)`。
- 按钮必须渲染在 `Form` 或 `FormProvider` 上下文内部，否则无法获取表单实例。
