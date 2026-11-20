---
layout: home

hero:
  name: '@formvk/element-plus'
  text: 'Schema 驱动的 Element Plus 表单'
  tagline: Formily Element Plus 的 1:1 移植版本，基于 Formvk 内核与 Element Plus 2.x
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: 组件总览
      link: /components/

features:
  - title: Schema 驱动
    details: 用一份 Schema 描述字段、布局与联动，字段状态、校验与生命周期由 Formvk 内核统一管理。
  - title: 完整的组件桥接
    details: 覆盖表单、布局、基础字段、数组组件、表格选择与可编辑组件，行为与 formily-element-plus 对齐。
  - title: Element Plus 样式体系
    details: 组件直接复用 Element Plus 的控件与 CSS 变量，主题、暗色模式与全局配置天然一致。
  - title: TypeScript
    details: 完整类型声明；Schema 支持 createSchema + fragment 构建，并自动推导组件与布局属性。
---

## 最小示例

开始前请先完成[安装](/guide/install)。

```vue
<script setup lang="ts">
import { SchemaField, createForm, createSchema, createSchemaOptions } from '@formvk/vue'
import { Form, Submit, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'

const form = createForm()

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
  <!-- OptionsProvider 只需在应用最外层注入一次 -->
  <OptionsProvider>
    <Form :form="form" layout="vertical">
      <SchemaField :schema="schema" />
      <Submit :on-submit="values => console.log(values)">提交</Submit>
    </Form>
  </OptionsProvider>
</template>
```
