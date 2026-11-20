# Cascader

级联选择组件，基于 Element Plus `Cascader` 封装。Schema 中的 `enum` 会通过 `dataSource` 自动映射为 `options`，字段值为所选路径的 `value` 数组；阅读态自动切换为 `TextCascader`。

<demo vue="../demos/cascader.vue" title="Cascader 示例" description="默认级联、任意一级可选、多选，含 readPretty 阅读态" />

## 何时使用

- 选项具有清晰的层级结构，如省市区、组织架构、商品分类。
- 需要从树形结构中选择一条或多条路径。
- 扁平的大量选项更适合 [Select](/components/select) 或 [TreeSelect](/components/tree-select)。

## 属性

继承 Element Plus [`Cascader`](https://element-plus.org/zh-CN/component/cascader.html) 的属性，未列出的属性与 `ElCascader` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `Option[]` | 级联数据 |
| `dataSource` | `Option[]` | 本包映射属性，等价于 `options`；Schema 的 `enum` 会自动注入 |
| `props` | `{ checkStrictly?, multiple?, ... }` | 级联配置，`checkStrictly` 允许选择任意一级，`multiple` 开启多选 |
| `collapseTags` | `boolean` | 多选时是否折叠展示已选标签 |
| `clearable` | `boolean` | 是否展示清除按钮 |
| `filterable` | `boolean` | 是否可搜索 |
| `separator` | `string` | 选项分隔符，默认 `/` |
| `showAllLevels` | `boolean` | 是否展示完整路径 |
| `disabled` | `boolean` | 禁用选择 |

## 阅读态

`readPretty` 模式下自动切换为 `TextCascader`，单条路径的各级标签以 `/` 连接，多条路径以空格分隔；找不到对应选项或值为空时展示 `previewTextPlaceholder`。

## 注意事项

- 单选时字段值是路径数组（如 `['zhejiang', 'hangzhou']`），多选时是路径数组的数组。
- `checkStrictly` 与 `multiple` 需要放在 `props` 属性内，而不是组件顶层。
