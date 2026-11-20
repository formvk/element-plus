# ArrayCollapse

折叠面板形态的数组组件，每个元素渲染为一个 Element Plus `ElCollapseItem`，适合字段多、需要按需展开的数组。

<demo vue="../demos/array-collapse.vue" title="ArrayCollapse 示例" description="默认展开前两个面板与新增面板" />

## 何时使用

- 单条记录字段很多，全部平铺会导致页面过长。
- 用户通常只关注其中一两条记录，需要折叠其余项时。

## 属性

基于 Element Plus `ElCollapse` / `ElCollapseItem` 实现，并扩展：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `defaultOpenPanelCount` | `number` | `5` | 初始化时默认展开的面板数量，按数组项 key 计算 |
| `accordion` | `boolean` | `false` | 是否手风琴模式；开启后 `modelValue` 为单个面板 key |

`ElCollapse` 的其余属性（不含 `modelValue` / `accordion`）会透传给内部的 `ElCollapse`。数组项 key 由数组 Schema 的 `recordKey` 控制，见 [ArrayBase](/components/array-base#数组项稳定键-recordkey)。

通用数组属性（`disabled` / `onAdd` / `onCopy` / `onRemove` / `onMoveUp` / `onMoveDown`）见 [ArrayBase](/components/array-base#数组属性)。

## 用法

```ts
const schema = createSchema({
  users: f.ArrayCollapse(
    f.Object({
      index: f.Index(),
      name: f.Input({ title: '姓名' }),
    }),
    {
      componentProps: {
        defaultOpenPanelCount: 2,
        accordion: true,
      },
      properties: {
        add: f.Addition({ title: '新增面板' }),
      },
    }
  ),
})
```

## 面板标题

- 面板标题优先取数组项 `componentProps` 的 `title`，其次是数组项 Schema 的 `title`，最后回退到数组字段的 `title`。
- 数组项的 `componentProps.disabled` 或 Schema 的 `disabled` 可禁用单个面板。
- `Index` 渲染在标题文案之前；字段校验失败时，标题会包裹 `ElBadge` 并展示错误数量。
- 新增面板后会自动展开新面板：配置了 `recordKey` 时使用新项的 key，否则按索引插入并顺延已有 key。

## 注意事项

- 当前实现只在面板标题区渲染 `Index`，不会渲染 `Remove` / `MoveUp` / `MoveDown`；这些操作组件即使写在数组项中也不会显示，折叠形态需要删除能力时请改用其他数组组件。
- 空数组时渲染一张带 `ElEmpty` 空状态的卡片。
