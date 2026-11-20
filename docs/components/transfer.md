# Transfer

穿梭框组件，基于 Element Plus `Transfer` 封装。字段值自动映射为右侧列表的 `key` 集合，Schema 的 `enum` 会转换为内部数据源。

<demo vue="../demos/transfer.vue" title="Transfer 示例" description="数据源、标题与搜索" />

## 何时使用

- 需要在两个列表之间直观地移动选项，突出“已选 / 待选”的对应关系。
- 选项数量较多、需要搜索辅助选择。
- 仅需要简单多选时，[Select](/components/select) 的 `multiple` 模式更轻量。

## 属性

继承 Element Plus [`Transfer`](https://element-plus.org/zh-CN/component/transfer.html) 的属性，未列出的属性与 `ElTransfer` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `(string \| number)[]` | 字段值，由内核注入并映射到 `v-model` |
| `data` | `TransferItem[]` | 数据源，每项需包含 `key` 与 `label` |
| `dataSource` | `TransferItem[]` | 本包映射属性，等价于 `data`，兼容 `label` / `value` 字段；Schema 的 `enum` 会自动转换 |
| `titles` | `[string, string]` | 左右两列的标题 |
| `filterable` | `boolean` | 是否展示搜索框 |
| `props` | `{ key, label }` | 自定义数据项的字段名，默认 `key` / `label` |

## 注意事项

- 组件会把 `dataSource` 中的 `value` / `title` 归一化为 `key` / `label`，因此 Schema `enum` 可以直接使用。
- `Transfer` 未内置阅读态渲染，`readPretty` 模式下仍渲染穿梭框本身。详情页可结合字段的 `dataSource` 与 [Text](/components/preview-text) 自行回显选中项文案。
