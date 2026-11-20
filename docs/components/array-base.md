# ArrayBase

数组组件的底层基座，提供数组字段的上下文与一组操作组件。`ArrayItems`、`ArrayCards`、`ArrayCollapse`、`ArrayTabs`、`ArrayTable` 都基于 `ArrayBase` 与下列操作组件组合而成，一般只在自定义数组组件时直接使用。

<demo vue="../demos/array-base.vue" title="ArrayBase 示例" description="组合 Index、SortHandle、Copy、Remove、MoveUp、MoveDown 与 Addition，展示序号、拖拽手柄、操作按钮与禁用态" />

## 何时使用

- 内置的五种数组形态都不满足设计时，基于 `ArrayBase` 自定义数组渲染。
- 只需要选择现成形态时，直接使用 [ArrayItems](/components/array-items) 等上层组件。

## 成员

| 成员 | 说明 |
| --- | --- |
| `ArrayBase` | 数组上下文的根容器 |
| `ArrayBaseItem` | 列表项上下文容器，向下提供 `index` 与 `record` |
| `Addition` | 新增按钮，基于 `ElButton` |
| `Remove` | 删除按钮 |
| `Copy` | 复制按钮，在当前项后插入一份副本；默认移除副本的 `recordKey` 字段 |
| `MoveUp` | 上移按钮 |
| `MoveDown` | 下移按钮 |
| `Index` | 当前项序号，渲染为 `#1.` 形式 |
| `SortHandle` | 拖拽排序手柄，默认渲染 `Rank` 图标的 `ElButton` |
| `useArray` | 读取数组上下文（`field`、`schema` 与 `props`） |
| `useIndex` | 读取当前项索引 |
| `useRecord` | 读取当前项数据 |

## 数组属性

数组属性由 `ArrayBase` 接收，自定义数组组件时需要把组件收到的属性显式传给 `ArrayBase`：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `disabled` | `boolean` | 禁用数组操作 |
| `onAdd` | `(index: number) => void` | 新增后触发，参数为新项索引 |
| `onCopy` | `(index: number) => void` | 复制后触发，参数为插入位置索引 |
| `onRemove` | `(index: number) => void` | 删除后触发 |
| `onMoveUp` | `(index: number) => void` | 上移后触发 |
| `onMoveDown` | `(index: number) => void` | 下移后触发 |

内置数组组件（`ArrayItems`、`ArrayCards` 等）当前不会把 `componentProps` 中的数组属性继续透传给内部的 `ArrayBase`，这些回调只在自定义数组组件中可用；字段级禁用请直接使用 schema 的 `disabled`。

### ArrayBaseItem 额外属性

除 `index`、`record` 外，`ArrayBaseItem` 的 `key` 建议使用字段的 `getRecordKey(index)` 生成，保证增删、排序后列表项身份稳定。`record` 支持传对象或 `(index) => record` 函数。

### 数组项稳定键 recordKey

`recordKey` 是数组 Schema 节点的字段属性（不是 `componentProps`），用于为数组项生成稳定 key：

```ts
const schema = createSchema({
  users: f.ArrayCards(f.Object({ id: f.Input(), name: f.Input() }), {
    recordKey: 'id', // 或 (record, index) => record.id ?? index
  }),
})
```

| 形式 | 说明 |
| --- | --- |
| `string` | 取数组项上的同名字段；取不到字符串或数字时回退索引 |
| `(record, index) => string \| number` | 自定义取值函数 |

配置后可通过字段方法 `field.getRecordKey(index)` 读取；未配置时返回索引。

### Copy 与 recordKey

`Copy` 默认会克隆整条记录，其中包含 `recordKey` 对应的字段。为保证副本的 key 唯一，组件在未提供 `copyRecord` 且 `recordKey` 为字符串时，会删除副本上的该字段，副本回退到索引 key；需要在复制后立即获得稳定 key 时，使用 `copyRecord` 生成新记录。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `copyRecord` | `(record, index) => any` | 自定义副本数据，返回要插入的记录；提供后不再自动处理 key |

```ts
f.Copy({
  title: '复制',
  componentProps: {
    copyRecord: (record: any) => ({ ...record, id: createId() }),
  },
})
```

`recordKey` 为函数时无法推断对应字段，需要自行通过 `copyRecord` 生成新 key。

### Addition 额外属性

`Addition` 基于 `ElButton`，除 `title`、`icon`、`disabled` 外还支持：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `method` | `'push' \| 'unshift'` | 新增方式，默认追加到末尾，`unshift` 插入到开头 |
| `defaultValue` | `any` | 新项的初始值；不传时按 Schema 自动推导（数组为 `[]`、对象为 `{}`） |

按钮文案默认取 `title`，也可以通过默认插槽自定义；`ElButton` 的其余属性同样可以透传。

其余操作组件（`Remove` / `Copy` / `MoveUp` / `MoveDown`）同样支持 `title`、`icon`、`disabled`，渲染为 `ElButton` 的文本小按钮，其余属性透传给 `ElButton`。

## 拖拽排序

`SortHandle` 渲染的按钮带有 `el-formvk-array-base-sort-handle` 类名。`ArrayItems` 与 `ArrayTable` 内部基于 SortableJS 监听该类名作为拖拽手柄，在数组项 schema 中声明 `SortHandle` 即可启用排序；未声明时不可拖拽。

## 自定义数组组件

基于 `ArrayBase` 自定义数组组件时，用 `useField` / `useFieldSchema` 读取当前数组字段，用 `ArrayBaseItem` 为每一项提供上下文：

```vue
<script setup lang="ts">
import { ArrayBase, ArrayBaseItem } from '@formvk/element-plus'
import { RecursionField, useField, useFieldSchema } from '@formvk/vue'

const field = useField()
const schema = useFieldSchema()
</script>

<template>
  <ArrayBase>
    <ArrayBaseItem
      v-for="(item, index) in field.value"
      :key="field.getRecordKey(index)"
      :index="index"
      :record="item"
    >
      <RecursionField :schema="schema.items" :name="index" />
    </ArrayBaseItem>
  </ArrayBase>
</template>
```

## 注意事项

- 操作组件通过 `ArrayBaseItem` 的上下文自动获取当前项索引，无需手动传 `index`。
- 字段 `pattern` 不是 `editable` 时，`SortHandle`、`Remove`、`Copy`、`MoveUp`、`MoveDown` 会自动隐藏；`Addition` 在 `editable` / `disabled` 下保留。
