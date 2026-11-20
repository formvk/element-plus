# Reset

表单重置按钮，基于 Element Plus `Button` 封装，调用父级表单实例的 `reset`，并支持重置后重新校验。

<demo vue="../demos/reset.vue" title="forceClear / validate / reset-validate-success / reset-validate-failed" description="重置后可选触发校验，并监听校验结果" />

## 何时使用

- 表单底部的重置动作，把字段恢复到初始值。
- 需要重置后立即重新校验（如筛选条件表单），或强制清空所有值时。

## 属性

继承 Element Plus [`Button`](https://element-plus.org/zh-CN/component/button.html) 的属性与内核的 `IFieldResetOptions`，本包扩展以下属性：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `forceClear` | `boolean` | 是否强制清空字段值（而不是恢复初始值） |
| `validate` | `boolean` | 重置后是否触发校验 |
| `onResetValidateSuccess` | `(payload) => void` | 重置并校验成功后的回调 |
| `onResetValidateFailed` | `(feedbacks) => void` | 重置并校验失败后的回调 |
| `onClick` | `(e) => any` | 点击回调，返回 `false` 可阻止重置 |
| 其他 | `ButtonProps` | 透传给 `ElButton` |

在模板中使用事件绑定：`@reset-validate-success`、`@reset-validate-failed`。

## 注意事项

- 按钮必须渲染在 `Form` 或 `FormProvider` 上下文内部；获取不到表单实例时点击不产生任何效果。
- 在表单根实例上调用的是 `form.reset('*', options)`，在对象字段上下文中则调用字段自身的 `reset(options)`。
