# InputNumber

数字输入组件，基于 Element Plus `InputNumber` 封装。阅读态自动切换为 `TextInputNumber`，并保留 `formatter` 的格式化效果。

<demo vue="../demos/input-number.vue" title="min / max / step / precision / controlsPosition / stepStrictly" description="常见数字输入配置，含 readPretty 阅读态" />

## 何时使用

- 需要录入数字，如数量、年龄、金额。
- 需要限制取值范围、小数精度或按指定格式展示数字。

## 属性

继承 Element Plus [`InputNumber`](https://element-plus.org/zh-CN/component/input-number.html) 的属性，未列出的属性与 `ElInputNumber` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `modelValue` | `number \| null` | 字段值，由内核注入 |
| `min` / `max` | `number` | 最小值 / 最大值 |
| `step` | `number` | 步长 |
| `precision` | `number` | 小数精度 |
| `controlsPosition` | `'' \| 'right'` | 加减按钮位置 |
| `stepStrictly` | `boolean` | 是否只允许输入步长的整数倍 |
| `disabled` | `boolean` | 禁用输入 |

## 阅读态

`readPretty` 模式下自动切换为 `TextInputNumber`：配置了 `formatter` 时展示格式化后的文本，否则直接展示数字；空值展示 `previewTextPlaceholder`。
