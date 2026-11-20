# ArrayTabs

标签页形态的数组组件，每个元素渲染为一个 `ElTabPane`，并内置新增 / 关闭按钮（固定开启 `editable`）。

<demo vue="../demos/array-tabs.vue" title="ArrayTabs 示例" description="可新增、关闭的标签页数组" />

## 何时使用

- 数组项之间是平级切换关系，同一时间只编辑一项，如多段行程、多个收件人。
- 项数可能动态增减，且希望新增 / 删除操作直接内聚在标签栏时。

## 属性

基于 Element Plus `ElTabs` 实现，常用属性：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'card' \| 'border-card'` | `'card'` | 标签页类型；组件固定开启 `editable`，新增 / 关闭按钮由 `ElTabs` 的 `editable` 提供 |

`ElTabs` 的其余属性（如 `tab-position`、`stretch`、`closable`）通过 attrs 透传；`modelValue` 由组件内部维护，无需传入。数组项 key 由数组 Schema 的 `recordKey` 控制，见 [ArrayBase](/components/array-base#数组项稳定键-recordkey)。

## 面板与标签

- 标签文案为「字段 `title` + 序号」，如 `成员 1`；字段校验失败时，标签上会通过 `ElBadge` 展示错误数量。
- 数组为空时仍会渲染一个空面板；第一个面板不可关闭，组件至少保留一个面板。
- 点击标签栏的 `+` 会向数组追加一项并自动切换过去，关闭标签会切换到前一个面板。

## 注意事项

- 首个面板不可关闭，因此不能通过关闭标签清空数组。
- 组件不会渲染 `Addition`，新增入口统一为标签栏的 `+`。
