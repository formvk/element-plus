# ArrayCards

卡片形态的数组组件，每个元素渲染为一张 Element Plus `ElCard`，操作组件自动归集到卡片右上角。

<demo vue="../demos/array-cards.vue" title="ArrayCards 示例" description="卡片标题、序号、删除与新增" />

## 何时使用

- 数组项包含的字段较多，希望以卡片视觉边界区分每一项。
- 项数不多、希望突出每条记录的独立性时。

## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `title` | `VNodeChild` | 卡片标题，缺省时取字段 `title`；也可使用同名 `title` 插槽 |
| `extra` | `VNodeChild` | 卡片右上角追加内容，与操作组件组合渲染；也可使用同名 `extra` 插槽 |

每张卡片固定使用 `ElCard` 的 `shadow="never"` 外观，其余 `ElCard` 属性不会透传；需要调整样式时可通过 `class` 覆盖。数组为空时渲染一张带 `ElEmpty` 空状态的卡片。

`Index` 渲染在卡片标题区，`Copy` / `Remove` / `MoveUp` / `MoveDown` 等操作组件渲染在右上角，其余字段渲染在卡片内容区。

数组项 key 由数组 Schema 的 `recordKey` 控制，见 [ArrayBase](/components/array-base#数组项稳定键-recordkey)。

通用数组属性（`disabled` / `onAdd` / `onCopy` / `onRemove` / `onMoveUp` / `onMoveDown`）见 [ArrayBase](/components/array-base#数组属性)。

## 用法

```ts
const schema = createSchema({
  users: f.ArrayCards(
    f.Object({
      index: f.Index(),
      name: f.Input({ title: '姓名' }),
      remove: f.Remove({ title: '删除' }),
    }),
    {
      properties: {
        add: f.Addition({ title: '新增卡片' }),
      },
    }
  ),
})
```

## 大数组与 recordKey

项数较多、需要复制或上下移动时，建议用业务 id 作为 `recordKey`，并在 `Copy` 中通过 `copyRecord` 为副本生成新的 id：

<demo vue="../demos/array-cards-large.vue" title="大数组卡片示例" description="6 条记录，使用业务 id 作为数组项 key，支持复制、上下移动与删除" />

## 注意事项

- `Index` 与操作组件会自动从卡片内容区移除，避免重复渲染。
- 复制副本默认会删除字符串 `recordKey` 对应字段，需要稳定 key 时请配置 `copyRecord`。
