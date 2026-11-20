# 数组字段操作

本指南介绍如何编辑 `type: 'array'` 的字段：注册数组组件、声明对象数组、增删复制排序，以及选择合适的数组形态。

## 第一步：注册数组组件

数组组件需要注册到 `createSchemaOptions` 的 `arrayComponents`，操作组件注册到 `voidComponents`：

```ts
import { Addition, ArrayItems, FormItem, Input, Remove } from '@formvk/element-plus'
import { createSchema, createSchemaOptions } from '@formvk/vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: { Input },
  voidComponents: { FormItem, Addition, Remove },
  arrayComponents: { ArrayItems },
  defaultDecorator: 'FormItem',
})
```

## 第二步：声明对象数组或原始值数组

`f.ArrayItems(items, options)` 的第一个参数是元素 Schema Creator，第二个参数描述数组字段本身（`componentProps`、操作区 `properties`）：

```ts
const schema = createSchema({
  // 对象数组
  users: f.ArrayItems(
    f.Object({
      name: f.Input({ title: '姓名' }),
      remove: f.Remove({ title: '删除' }),
    }),
    {
      properties: {
        add: f.Addition({ title: '新增成员' }),
      },
    }
  ),
  // 原始值数组
  tags: f.ArrayItems(f.Input()),
})
```

<demo vue="../../demos/array-items.vue" title="ArrayItems 示例" description="支持新增、删除成员，字段校验由内核接管" />

对象数组的每个元素都是按索引嵌套的子字段，`users.0.name`、`users.1.name` 依次对应每一项。数组组件内部已处理好 `index` 与 basePath 的映射，直接按上面的写法声明即可。

## 第三步：使用操作组件

`ArrayBase` 是所有数组组件的底层基座，提供以下操作组件：

| 组件 | 说明 |
| --- | --- |
| `Addition` | 新增一项，支持 `method: 'push' \| 'unshift'` 与 `defaultValue` |
| `Remove` | 删除当前项 |
| `Copy` | 复制当前项并插入到下一行 |
| `MoveUp` / `MoveDown` | 上移 / 下移当前项 |
| `SortHandle` | 拖拽排序手柄（基于 SortableJS） |
| `Index` | 当前项序号，渲染为 `#1.` |

操作组件通过上下文自动获取当前项索引，支持 `title`、`icon`、`disabled` 与 Element Plus `Button` 的其余属性；字段处于非 `editable` 模式时会自动隐藏。数组容器层面的回调通过 `componentProps` 传入：

```ts
f.ArrayItems(f.Object({ /* ... */ }), {
  componentProps: {
    disabled: false,
    onAdd: index => console.log('新增于', index),
    onRemove: index => console.log('删除了', index),
  },
})
```

完整的回调与成员清单见 [ArrayBase 参考](/components/array-base)。

## 选择数组形态

| 组件 | 形态 | 适用场景 |
| --- | --- | --- |
| `ArrayItems` | 列表 | 最常用，简单纵向排列 |
| `ArrayCards` | 卡片列表 | 单项字段多，强调记录独立性 |
| `ArrayCollapse` | 折叠面板 | 记录多、按需展开 |
| `ArrayTabs` | 标签页 | 平级切换，同一时间编辑一项 |
| `ArrayTable` | 可编辑表格 | 结构规整、数据量大，需要分页与固定列 |
| `SelectTable` | 表格选择 | 从候选表格数据中勾选值 |

各形态的属性与示例见左侧「数组组件」分组的组件参考页。

## 表格选择：SelectTable

`SelectTable` 的候选数据来自 `componentProps.dataSource`，列通过 `Column` 声明：

```ts
import { Column, SelectTable } from '@formvk/element-plus'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  voidComponents: { FormItem, Column },
  arrayComponents: { SelectTable },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  users: f.SelectTable(
    f.Object({
      name: f.Column({
        componentProps: { key: 'name', dataIndex: 'name', title: '名称' },
      }),
    }),
    {
      componentProps: {
        dataSource: [
          { key: 1, name: 'A' },
          { key: 2, name: 'B' },
        ],
      },
    }
  ),
})
```

单选设置 `componentProps.mode: 'single'`，值为主键；设置 `optionAsValue: true` 时值为整行数据。
