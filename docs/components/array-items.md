# ArrayItems

列表形态的数组组件，每个元素渲染在独立的行容器中，是最常用的数组形态。注册到 `createSchemaOptions` 的 `arrayComponents`。

<demo vue="../demos/array-items.vue" title="ArrayItems 示例" description="新增、删除与字段校验" />

## 何时使用

- 维护一组结构相同的对象，且每项只需要简单的纵向排列与增删操作。
- 需要卡片、折叠、标签页或表格外观时，改用对应的数组组件。

## 用法

```ts
import { Addition, ArrayItems, FormItem, Input, Remove } from '@formvk/element-plus'
import { createSchema, createSchemaOptions } from '@formvk/vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: { Input },
  voidComponents: {
    FormItem,
    Addition,
    Remove,
  },
  arrayComponents: { ArrayItems },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  users: f.ArrayItems(
    f.Object({
      name: f.Input({ title: '姓名', required: true }),
      remove: f.Remove({ title: '删除' }),
    }),
    {
      properties: {
        add: f.Addition({ title: '新增成员' }),
      },
    }
  ),
})
```

## 属性

本组件无独立扩展属性，通用数组属性（`disabled` / `onAdd` / `onCopy` / `onRemove` / `onMoveUp` / `onMoveDown`）见 [ArrayBase](/components/array-base#数组属性)；数组项 key 由数组 Schema 的 `recordKey` 控制，见 [ArrayBase](/components/array-base#数组项稳定键-recordkey)。

## 拖拽排序

内部使用 SortableJS 作为排序容器，拖拽手柄选择器为 `.el-formvk-array-base-sort-handle`。在数组项 schema 中声明 `SortHandle` 即可拖拽排序，排序结束后通过 `field.move` 写回字段值；`Index` 用于展示序号。未声明 `SortHandle` 时数组项不可拖拽。

## 注意事项

- 操作组件在字段 `pattern` 不是 `editable` 时自动隐藏；`Addition` 在 `editable` / `disabled` 下保留。
- 数组为空时只渲染新增按钮，不渲染列表项。
