# 大数组场景

本指南介绍记录条数较多、单项字段较多的数组如何用 `ArrayCards` 承载，以及什么时候需要配置 `recordKey` 保持数组项身份稳定。

## 第一步：用卡片切分记录

数组字段的声明方式不变，把数组组件换成 `ArrayCards` 即可：每条记录渲染为一张卡片，`Index` 进入卡片标题，操作组件自动归集到卡片右上角。

```ts
const schema = createSchema({
  members: f.ArrayCards(
    f.Object({
      // 业务主键不参与展示，只作为数组项 key
      id: f.Input({ hidden: true }),
      index: f.Index(),
      name: f.Input({ title: '姓名', required: true }),
      email: f.Input({ title: '邮箱' }),
      moveUp: f.MoveUp(),
      moveDown: f.MoveDown(),
      remove: f.Remove(),
    }),
    {
      recordKey: 'id',
      properties: {
        add: f.Addition({ title: '新增成员' }),
      },
    }
  ),
})
```

<demo vue="../../demos/array-cards-large.vue" title="大数组卡片示例" description="6 条记录，使用业务 id 作为数组项 key，支持复制、上下移动与删除" />

卡片为每条记录建立独立的视觉边界，适合单项字段多、需要在同一页逐条核对的场景。`ArrayCards` 会一次性渲染全部卡片，没有分页；记录达到几十条时，优先考虑带分页的 `ArrayTable`，或改用按需展开的 `ArrayCollapse`。

## 第二步：配置 recordKey

`recordKey` 是数组 Schema 节点的字段属性，与 `properties`、`componentProps` 同级，直接写在第二个参数里，不要放进 `componentProps`：

```ts
// 取数组项上的同名字段
f.ArrayCards(items, { recordKey: 'id' })

// 自定义取值，适合 id 可能缺失的场景
f.ArrayCards(items, { recordKey: (record, index) => record.id ?? index })
```

| 形式 | 说明 |
| --- | --- |
| `string` | 读取数组项上的同名字段，值必须是 `string` 或 `number`，否则回退到索引 |
| `(record, index) => string \| number` | 自行计算 key，可以做兜底 |

配置后可以通过字段方法 `field.getRecordKey(index)` 读取当前项的 key；未配置时它返回索引。`string` 形式要求数组项的 Schema 中声明了同名字段，TypeScript 会按数组项类型校验取值；如果 id 只存在于数据中、不需要渲染，可以声明为 `hidden`。

## 第三步：确认是否需要 recordKey

`recordKey` 决定数组项在 Vue 列表渲染中的身份（对应 `v-for` 的 key）。只要数组项会「换位置」或需要「保留局部状态」，就应该配置：

| 场景 | 不配置的后果 |
| --- | --- |
| 增删、复制、上下移动 | 索引变化后 Vue 会把旧卡片实例复用给另一条记录，输入焦点、下拉面板、上传进度等局部状态错位 |
| 卡片内的组件持有内部状态 | key 随索引漂移，状态会跟随错误的记录 |
| 数据回填、重新拉取后整体替换数组 | 有稳定 id 时已有卡片可以复用，避免整列重建 |
| 删除、排序后仍需按 id 与后端数据对应 | 索引不再对应记录，只能靠业务 id 定位 |

以下情况可以不配置：

- 只读展示，卡片内没有任何交互状态。
- 只追加、不删除也不排序，索引始终保持稳定。
- 卡片内容完全由表单值驱动，即使重建也没有可观察的状态差异。

## 第四步：处理新增与复制

`recordKey` 只用于生成 key 和 `field.getRecordKey(index)` 的返回值，不会写入数组数据本身。以下几点需要业务侧保证：

- **唯一性**：key 重复时 Vue 会打印同 key 警告，卡片状态也会串位。
- **类型**：值必须是 `string` 或 `number`；缺失或类型不符时会静默回退到索引，等于没有配置。
- **新增**：`Addition` 推导出的默认值不包含业务 id，新增项在补上 id 之前会使用索引作为 key。
- **复制**：`Copy` 会克隆整条记录。未提供 `copyRecord` 时，组件会删除副本上的字符串 `recordKey` 字段，避免与原记录重复；但副本在补齐新 id 前只能使用索引 key。推荐直接用 `copyRecord` 生成新记录：

```ts
f.Copy({
  title: '复制',
  componentProps: {
    copyRecord: record => ({ ...record, id: createId() }),
  },
})
```

因此，大数组表单建议让数据在进入表单前就带有唯一 id（例如接口返回的主键），并在新增、复制等产生新记录的操作中同步生成 id。

## 注意事项

- `recordKey` 解决的是实例复用问题，不会降低单张卡片的渲染成本；单项字段极多时仍应控制字段数量。
- 自定义数组渲染时，`ArrayBaseItem` 的 key 同样应使用 `field.getRecordKey(index)`，详见 [ArrayBase](/components/array-base#数组项稳定键-recordkey)。
- 各数组形态的完整属性见 [ArrayCards](/components/array-cards) 与 [ArrayBase](/components/array-base)。
