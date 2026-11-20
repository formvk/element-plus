# Radio

单选组件，包含 `Radio` 与 `RadioGroup` 两个具名导出。`Radio` 将字段值映射到 `checked`，用于布尔值绑定；`RadioGroup` 绑定枚举值，阅读态自动切换为 `TextSelect`。

<demo vue="../demos/radio.vue" title="RadioGroup / 禁用分组 / 单个 Radio" description="分组与布尔值单选，含 readPretty 阅读态" />

## 何时使用

- 在少量互斥选项中做选择时使用 `RadioGroup`。
- 仅需要一个布尔开关且希望展示为单选框样式时，使用单独的 `Radio`（纯开关交互更推荐 [Switch](/components/switch)）。

## 属性

### Radio

继承 Element Plus [`Radio`](https://element-plus.org/zh-CN/component/radio.html) 的属性，本包将字段值映射到 `checked`。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `boolean` | 是否选中，由内核注入并映射到 `checked` |
| `label` | `string \| number \| boolean` | 单选项的文案 |
| `disabled` | `boolean` | 禁用选择 |

### RadioGroup

继承 Element Plus [`RadioGroup`](https://element-plus.org/zh-CN/component/radio.html) 的属性，未列出的属性与 `ElRadioGroup` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `{ label, value }[]` | 选项数据 |
| `dataSource` | `{ label, value }[]` | 本包映射属性，等价于 `options`；Schema 的 `enum` 会自动注入 |
| `disabled` | `boolean` | 禁用整组选择 |

## 阅读态

`RadioGroup` 在 `readPretty` 模式下自动切换为 `TextSelect`，将值回显为选项标签。单独的 `Radio` 不内置阅读态切换，详情场景请使用 `RadioGroup` 或自行配合 [Text](/components/preview-text) 渲染。
