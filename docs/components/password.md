# Password

密码输入组件，基于 Element Plus `Input` 的密码模式封装，扩展了密码强度条能力。阅读态自动切换为 `TextInput`。

<demo vue="../demos/password.vue" title="checkStrength 与密码确认" description="开启强度条，并用 validator 校验两次输入一致，含 readPretty 阅读态" />

## 何时使用

- 登录、注册、修改密码等密码录入场景。
- 需要可视化提示密码强度时，开启 `checkStrength`。

## 属性

继承 Element Plus [`Input`](https://element-plus.org/zh-CN/component/input.html) 的属性，本包额外扩展以下属性，其余属性与 `ElInput` 一致并原样透传。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `checkStrength` | `boolean` | `false` | 本包扩展，是否展示密码强度条 |
| `showPassword` | `boolean` | `true` | 是否展示切换密码可见性的按钮 |
| `modelValue` | `string` | — | 字段值，由内核注入 |
| `disabled` | `boolean` | `false` | 禁用输入 |
| `maxlength` | `number` | — | 最大输入长度 |
| `placeholder` | `string` | — | 占位文案 |

## 阅读态

`readPretty` 模式下渲染为 `TextInput`，以纯文本展示字段值，不会还原为可输入的密码框。
