# Switch

开关组件，基于 Element Plus `Switch` 封装，将字段值映射到 `checked`，用于布尔值的切换。

<demo vue="../demos/switch.vue" title="基础开关、文案与禁用" description="activeText / inactiveText / disabled" />

## 何时使用

- 需要在两个互斥状态（开 / 关、是 / 否）之间即时切换。
- 相比单独的 [Checkbox](/components/checkbox)，`Switch` 更适合表达“立即生效”的设置项。

## 属性

继承 Element Plus [`Switch`](https://element-plus.org/zh-CN/component/switch.html) 的属性，未列出的属性与 `ElSwitch` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `boolean` | 字段值，由内核注入并映射到 `checked` |
| `activeText` | `string` | 选中时展示的文案 |
| `inactiveText` | `string` | 未选中时展示的文案 |
| `activeValue` / `inactiveValue` | `boolean \| string \| number` | 选中 / 未选中时的值，默认 `true` / `false` |
| `disabled` | `boolean` | 禁用切换 |

## 注意事项

- `Switch` 未内置阅读态渲染，`readPretty` 模式下仍渲染开关本身。详情页可将字段组件替换为 [Text](/components/preview-text) 自行展示布尔文案。
