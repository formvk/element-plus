<template>
  <OptionsProvider>
    <Form :form="form" layout="vertical">
      <SchemaField :schema="schema" />
    </Form>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  normal: f.Input({
    title: '默认 label',
    decoratorProps: { extra: 'extra 会渲染在控件下方' },
  }),
  tooltip: f.Input({
    title: '带提示',
    decoratorProps: { tooltip: 'tooltip 会渲染为 label 后的问号图标' },
  }),
  colon: f.Input({
    title: '隐藏冒号',
    decoratorProps: { colon: false },
  }),
  noLabel: f.Input({
    title: '隐藏 label',
    decoratorProps: { label: ' ' },
  }),
  asterisk: f.Input({
    title: '自定义必填星号',
    required: false,
    decoratorProps: { asterisk: true },
  }),
})

const form = createForm()
</script>
