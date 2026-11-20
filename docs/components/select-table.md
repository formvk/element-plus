# SelectTable

表格选择组件，基于 `ElTable` 以表格形式展示候选数据并勾选值，字段值为勾选行的主键（或整行数据），支持单选、多选、搜索与树形父子联动。

<demo vue="../demos/select-table.vue" title="SelectTable 示例" description="多选搜索、自定义过滤排序与单选取值，下方实时展示字段值" />

## 何时使用

- 候选项本身是结构化数据，需要展示多列信息后再选择，如选择商品、订单、成员。
- 需要在选择前进行搜索、过滤或排序时。
- 只需要简单枚举选择时，[Select](/components/select) 更轻量。

## 属性

基于 Element Plus `ElTable` 实现，勾选列由组件手写（多选用 `ElCheckbox`、单选用 `ElRadio`），并扩展：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `mode` | `'multiple' \| 'single'` | `'multiple'` | 单选 / 多选 |
| `dataSource` | `any[]` | — | 候选数据；不传时读取字段上的 `dataSource` |
| `optionAsValue` | `boolean` | `false` | 为 `true` 时以整行数据作为字段值，否则只取主键 |
| `valueType` | `'all' \| 'parent' \| 'child' \| 'path'` | `'all'` | 树形数据的取值方式，`checkStrictly` 为 `false` 时生效 |
| `showSearch` | `boolean` | `false` | 是否显示搜索框 |
| `searchProps` | `Record<string, any>` | — | `ElInput` 属性，如 `placeholder` |
| `primaryKey` | `string \| ((record) => string)` | `'key'` | 主键字段名或取值函数 |
| `filterOption` | `false \| ((keyword, option) => boolean)` | — | 自定义搜索过滤，参数依次为关键词与候选行；传 `false` 关闭过滤 |
| `filterSort` | `(a, b) => number` | — | 搜索结果排序 |
| `onSearch` | `(keyword: string) => void` | — | 搜索回调，用于受控远程搜索 |
| `onChange` | `(value, options) => void` | — | 选择变化回调 |
| `loading` | `boolean` | — | 表格加载态；不传时读取字段的 `loading` |
| `columns` | `Record<string, any>[]` | — | 快捷列配置，传入后替代 Schema 中的 `Column` |
| `rowSelection` | `Record<string, any>` | — | 行选择配置，支持 `checkStrictly` |
| `checkStrictly` | `boolean` | `true` | 树形父子联动；为 `false` 时按 `valueType` 输出值 |
| `disabled` | `boolean` | `false` | 禁用选择与搜索 |

`ElTable` 的其余属性通过 attrs 透传给 `ElTable`，`class` / `style` 落在最外层容器上。

## 列组件

`Column` 的 `componentProps` 中，`dataIndex` 与列内字段名绑定，`title` 作为表头，其余属性（`width`、`align` 等）透传给 `ElTableColumn`；`key` 不必填。

多选模式下，勾选列表头提供全选 Checkbox（按当前筛选结果计算），点击行也可以切换选中状态；`readPretty` 阅读态只展示已选中的行。

## 用法

```ts
import { Column, FormItem, SelectTable } from '@formvk/element-plus'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  voidComponents: { FormItem, Column },
  arrayComponents: { SelectTable },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  users: f.SelectTable(
    f.Object({
      name: f.Column({
        componentProps: { dataIndex: 'name', title: '姓名' },
      }),
    }),
    {
      componentProps: {
        dataSource: [
          { key: 1, name: 'Alice' },
          { key: 2, name: 'Bob' },
        ],
        showSearch: true,
      },
    }
  ),
})
```

单选时设置 `componentProps.mode: 'single'`，值为主键；设置 `optionAsValue: true` 时值为整行数据。树形数据通过 `children` 嵌套，`checkStrictly: false` 时可按 `valueType` 输出父节点、子节点或路径。

## 注意事项

- `optionAsValue: true` 时初始值需要传整行数据，只传主键不会回显选中状态。
- `valueType: 'path'` 时忽略 `optionAsValue`，按树路径输出。
- `onSearch` 只负责把关键词抛给外部，实际过滤仍由 `filterOption` 或默认规则完成。
