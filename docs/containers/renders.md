# 表格渲染器

`renders` 是一组开箱即用的表格列渲染器，用于把常见的数据展示需求收敛成一行配置：

```vue
<ElTableColumn label="名称" prop="name">
  <template #default="{ row, $index }">
    <Cell :render="renders.text({ ellipsis: true })" :text="row.name" :record="row" :index="$index" />
  </template>
</ElTableColumn>
```

每个渲染器都返回 `(text, record, index) => VNodeChild` 的列渲染函数；`ElTableColumn` 只提供作用域插槽，因此需要一个极简的 `Cell` 组件在插槽内调用渲染函数：

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

const Cell = defineComponent({
  name: 'RenderCell',
  inheritAttrs: false,
  props: {
    render: {
      type: Function as PropType<(text: any, record: any, index: number) => any>,
      required: true,
    },
    text: { type: null as unknown as PropType<any>, default: undefined },
    record: { type: Object as PropType<Record<string, any>>, default: undefined },
    index: { type: Number, default: 0 },
  },
  setup(props) {
    return () => props.render(props.text, props.record, props.index)
  },
})
```

下文示例中的 `Cell` 均指这个适配组件。

## 基础用法

<demo vue="../demos/renders.vue" title="在 CrudTable 中使用内置渲染器" description="序号、文本、枚举、标签、图片、链接与时间列" />

## 渲染上下文

渲染器会自动从 `CrudTable` 注入的上下文中读取信息，并作为入参传给自定义组件与 `format` 函数：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `text` | `any` | 当前单元格的值 |
| `record` | `IRecord` | 当前行数据 |
| `index` | `number` | 当前行索引 |
| `table` | `TableModel` | 表格模型，可调用 `editPopup.open`、`onRemove` 等 |
| `$state` | `object` | 表格模型的 `state` |
| `...scope` | — | `CrudTable` 的 `scope` 会合并进渲染参数 |

`CrudTable` 会自动包裹 `TableRenderProvider`；如果脱离 `CrudTable` 直接使用 `ElTable`，需要手动提供上下文：

```vue
<script setup lang="ts">
import { TableRenderProvider, renders } from '@formvk/element-plus'
</script>

<template>
  <TableRenderProvider :value="{ table, placeholder: '--' }">
    <ElTable :data="table.records">
      <ElTableColumn label="名称" prop="name">
        <template #default="{ row, $index }">
          <Cell :render="renders.text()" :text="row.name" :record="row" :index="$index" />
        </template>
      </ElTableColumn>
    </ElTable>
  </TableRenderProvider>
</template>
```

`placeholder` 为单元格空值占位符，默认 `--`，渲染器内的 `placeholder` 参数优先级更高。

## API

### `renders.serial()`

按当前页的行索引输出 1 起始的序号，不接受参数。

### `renders.text(options?)`

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `placeholder` | `VNodeChild` | 继承上下文 | 空值占位符 |
| `ellipsis` | `boolean` | `false` | 单行省略，溢出时通过 Tooltip 展示完整内容 |
| `tooltipProps` | `Record<string, any>` | — | 透传给 Tooltip |
| `format` | `(props) => VNodeChild` | — | 自定义渲染，返回空值时回退到占位符 |

`options` 也可以直接传 `format` 函数。

### `renders.option(options)`

把单元格值渲染为选项文本，支持树形选项与值数组。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `ITree[] \| (props) => ITree[]` | — | 选项数据源 |
| `last` | `boolean` | `true` | 树形选项只显示最后一级 |
| `separator` | `string` | `/` | 多级选项与多值之间的分隔符 |
| `placeholder` | `VNodeChild` | 继承上下文 | 空值占位符 |
| `ellipsis` | `boolean` | `false` | 内容溢出时单行省略 |

`options` 也可以直接传选项数组或返回数组的函数。

### `renders.tag(options)`

与 `option` 类似，但使用 `ElTag` 渲染，选项项可携带 `type`、`color` 等 Tag 属性。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `ITree<Record<string, any>>[] \| (props) => ITree<Record<string, any>>[]` | — | 选项数据源 |
| `last` | `boolean` | `true` | 树形选项只显示最后一级 |
| `placeholder` | `VNodeChild` | 继承上下文 | 空值占位符 |

### `renders.time(options?)`

使用 dayjs 格式化时间，默认 `YYYY-MM-DD HH:mm:ss`。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `format` | `string \| (props) => VNodeChild` | `YYYY-MM-DD HH:mm:ss` | 格式化模板或自定义渲染 |
| `placeholder` | `VNodeChild` | 继承上下文 | 空值占位符 |

`options` 也可以直接传格式字符串或渲染函数。

### `renders.image(options?)`

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `number` | `20` | 图片宽高 |
| `format` | `(props) => string` | — | 由单元格值推导图片地址 |
| `class` / `style` | — | — | 图片样式 |
| `placeholder` | `VNodeChild` | 继承上下文 | 空值占位符 |

### `renders.link(options?)`

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `format` | `(props) => string` | — | 由单元格值推导链接地址，默认使用单元格值 |
| `target` | `string` | `_blank` | 打开方式 |
| `rel` / `class` / `style` | — | — | 透传给 `<a>` |
| `placeholder` | `VNodeChild` | 继承上下文 | 空值占位符 |

### `renders.createRender(render)`

把自定义渲染函数转换为列渲染函数，渲染函数会接收完整的渲染参数（`text`、`record`、`index`、`table`、`$state` 与 `scope`）：

```ts
import { h } from 'vue'
import { renders } from '@formvk/element-plus'

const statusRender = renders.createRender(props => h('span', `${props.record.name}：${props.text}`))
```

## 注意事项

- 渲染器返回的是列渲染函数，而不是 Vue 组件；需要像 demo 一样通过 `Cell` 适配组件在 `ElTableColumn` 的默认插槽内调用。
- `option` / `tag` 的选项值按 `value` 全等匹配，树形结构会返回从根到目标节点的链路。
- `ellipsis` 首屏测量在挂载后完成，单元格内容后续变化时不会重新测量。
