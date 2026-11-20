# ArrayTable

可编辑表格形态的数组组件，基于 `ElTable` + `ElPagination`，列通过 `Column` 声明，单元格自动渲染 `RecursionField`，适合字段规整、数据量较大的对象数组。

<demo vue="../demos/array-table.vue" title="ArrayTable 示例" description="列声明、操作列、分页、拖拽排序与新增" />

## 何时使用

- 每条记录结构完全一致、字段以列的形式对比查看更清晰时。
- 需要分页、拖拽排序行等表格能力时。
- 记录内字段差异大或需要复杂布局时，[ArrayCards](/components/array-cards) 等形态更合适。

## 属性

基于 Element Plus `ElTable` 实现，并接管分页：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `pagination` | `boolean \| object` | `true` | 分页配置；传 `false` 关闭分页，传对象时支持 `pageSize`、`current`、`layout` |
| `border` | `boolean` | `true` | 是否带边框，对应 `ElTable` 的 `border` |
| `size` | `'large' \| 'default' \| 'small'` | `'small'` | 表格尺寸 |

`ElTable` 的其余属性通过 attrs 透传给 `ElTable`；`class` 作用在外层容器上，`style` 会同时作用于外层容器与 `ElTable`。分页固定使用 `[10, 20, 50, 100]` 的每页条数选项，默认 `layout` 为 `total, sizes, prev, pager, next, jumper`，可通过 `pagination.layout` 覆盖；数组条数减少时会自动收敛当前页码。

通用数组属性（`disabled` / `onAdd` / `onCopy` / `onRemove` / `onMoveUp` / `onMoveDown`）见 [ArrayBase](/components/array-base#数组属性)。

## 列组件与操作组件

| 组件 | 说明 |
| --- | --- |
| `Column` | 列容器，`componentProps` 中 `title` / `label` 为表头，`dataIndex` 对应列内字段名，其余属性（`width`、`fixed`、`align` 等）透传给 `ElTableColumn` |
| `ArrayTableAddition` | 表格底部的新增按钮；新增后超过当前页时自动翻到下一页 |
| `Addition` | 通用新增按钮，不会自动翻页 |
| `Index` | 序号，渲染为 `#1.` 形式 |
| `SortHandle` | 拖拽排序手柄，基于 SortableJS 监听 `el-formvk-array-base-sort-handle` 类名 |
| `Remove` | 删除按钮 |
| `MoveUp` / `MoveDown` | 上移 / 下移按钮 |
| `Copy` | 复制按钮 |

单元格内容由 `RecursionField` 根据 `Column` 的 `properties` 渲染，`prop` 只用于绑定列名，不会直接取行数据。

## 用法

```ts
const schema = createSchema({
  users: f.ArrayTable(
    f.Object({
      name: f.Column({
        componentProps: { title: '姓名', dataIndex: 'name', width: 180 },
        properties: { name: f.Input({ required: true }) },
      }),
      actions: f.Column({
        componentProps: { title: '操作', dataIndex: 'actions', width: 220 },
        properties: {
          action: f.FormItem({
            properties: {
              sort: f.SortHandle(),
              remove: f.Remove({ title: '删除' }),
              up: f.MoveUp(),
              down: f.MoveDown(),
            },
          }),
        },
      }),
    }),
    {
      componentProps: { pagination: { pageSize: 2 } },
      properties: {
        add: f.ArrayTableAddition({ title: '新增一行' }),
      },
    }
  ),
})
```

## 注意事项

- 列的 `dataIndex` 需要与列内字段名对应，否则无法关联列定义与单元格内容。
- `SortHandle` 需要配合 `Index` 或操作列使用；拖拽只在当前页内生效，排序结果会通过 `field.move` 写回数组。
- 分页由组件内部维护，`pagination.current` 只作为初始页码。
