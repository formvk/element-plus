# 快速开始

一个完整的表单由三部分组成：表单实例（`createForm`）、Schema 选项工厂（`createSchemaOptions`）与 Schema（`createSchema`）。

## 1. 创建表单实例

```ts
import { createForm } from '@formvk/vue'

const form = createForm({
  values: {
    username: 'alice',
  },
})
```

`createForm` 同步返回表单实例，直接保存到变量或组件作用域即可，不需要额外的状态容器。

## 2. 注册组件并创建 Schema 选项

`createSchemaOptions` 的注册表决定了 Schema 中可以使用哪些组件：

```ts
import { createSchemaOptions } from '@formvk/vue'
import { arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'

export const { OptionsProvider, fragment: f } = createSchemaOptions({
  // 字段组件（Input / Select 等）
  components: fieldComponents,
  // 布局 / 装饰器组件（type: 'void'）
  voidComponents,
  // 数组组件（ArrayItems / ArrayTable 等）
  arrayComponents,
  // 声明了 title 且未显式指定 decorator 时，自动补 FormItem
  defaultDecorator: 'FormItem',
})
```

::: tip 应用级注入一次
`OptionsProvider` 是应用级上下文，只需在应用最外层（如根组件、路由布局）的模板中注入一次。内部的 `Form`、`SchemaField` 以及 `SchemaForm` / `PopupForm` / `CrudTable` 等容器都会自动继承，不需要在每个表单里重复包裹。
:::

## 3. 使用 fragment 描述表单

`fragment`（通常简写为 `f`）由注册表推导而来：注册了 `Input`，就有 `f.Input`；注册了 `FormItem`，就有 `f.FormItem`。

```ts
import { createSchema } from '@formvk/vue'

const schema = createSchema({
  username: f.Input({ title: '用户名' }),
  role: f.Select({
    title: '角色',
    enum: [
      { label: '管理员', value: 'admin' },
      { label: '访客', value: 'guest' },
    ],
  }),
})
```

## 4. 渲染表单

```vue
<script setup lang="ts">
import { SchemaField, createForm, createSchema, createSchemaOptions } from '@formvk/vue'
import { Form, Reset, Submit, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'

const form = createForm()

// 应用顶层注入一次，内部所有表单共用
const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名' }),
})
</script>

<template>
  <OptionsProvider>
    <Form :form="form" layout="vertical">
      <SchemaField :schema="schema" />
      <Submit :on-submit="values => console.log(values)">提交</Submit>
      <Reset>重置</Reset>
    </Form>
  </OptionsProvider>
</template>
```

<demo vue="../demos/basic-form.vue" title="完整示例" description="修改字段后点击提交，可以看到表单收集到的值" />

`Form` 会自动提供 `FormProvider` 与 `FormLayout`，因此 Schema 内的所有字段都能获取到表单实例与布局配置。若某个子树需要独立的组件注册表，再在该子树内嵌套一个新的 `OptionsProvider` 即可。

## 5. 数组字段

数组组件需要注册到 `arrayComponents`；上面使用的分类命名空间已经包含全部数组组件：

```ts
const schema = createSchema({
  users: f.ArrayItems(f.Object({ name: f.Input({ title: '姓名' }) })),
})
```

## 下一步

教程到此结束。带着具体问题继续阅读操作指南：

- [字段联动](/guide/how-to/linkage)：根据其他字段的值控制显隐、选项与组件属性
- [表单校验](/guide/how-to/validation)：必填、内置格式与自定义校验器
- [数组字段操作](/guide/how-to/array)：增删、复制、排序与五种数组形态
- [响应式布局](/guide/how-to/layout)：FormLayout 断点与 FormGrid 栅格
- [阅读态与详情页](/guide/how-to/read-pretty)：一键切换只读展示
- [接入自定义组件](/guide/how-to/custom-component)：把业务组件桥接到 Schema 体系
