# Checkbox

复选组件，包含 `Checkbox` 与 `CheckboxGroup` 两个具名导出。`Checkbox` 将字段值映射到 `checked`，用于布尔值绑定；`CheckboxGroup` 绑定数组值，阅读态自动切换为标签形态的 `TextSelect`。

<demo vue="../demos/checkbox.vue" title="CheckboxGroup / 纵向排列 / 单个 Checkbox" description="分组、自定义布局与布尔值复选，含 readPretty 阅读态" />

## 何时使用

- 需要在一组选项中多选时使用 `CheckboxGroup`，字段值为选中项 `value` 的数组。
- 仅需要表达单个布尔状态（如“已阅读并同意协议”）时使用单独的 `Checkbox`。

## 属性

### Checkbox

继承 Element Plus [`Checkbox`](https://element-plus.org/zh-CN/component/checkbox.html) 的属性，本包将字段值映射到 `checked`。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `boolean` | 是否选中，由内核注入并映射到 `checked` |
| `label` | `string \| number \| boolean` | 复选框文案 |
| `disabled` | `boolean` | 禁用选择 |

### CheckboxGroup

继承 Element Plus [`CheckboxGroup`](https://element-plus.org/zh-CN/component/checkbox.html) 的属性，未列出的属性与 `ElCheckboxGroup` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `{ label, value }[]` | 选项数据 |
| `dataSource` | `{ label, value }[]` | 本包映射属性，等价于 `options`；Schema 的 `enum` 会自动注入 |
| `disabled` | `boolean` | 禁用整组选择 |

## 阅读态

`CheckboxGroup` 在 `readPretty` 模式下自动切换为 `TextSelect`（以 `tags` 模式渲染），每个选中项展示为一个 Tag。单独的 `Checkbox` 不内置阅读态切换，详情场景请使用 `CheckboxGroup` 或自行配合 [Text](/components/preview-text) 渲染。
