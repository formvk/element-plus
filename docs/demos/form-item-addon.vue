<template>
  <OptionsProvider>
    <Form :form="form">
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
  default: f.Input({
    title: '默认 label',
    decoratorProps: {
      addonBefore: '[前]',
      addonAfter: '[后]',
    },
  }),
  left: f.Input({
    title: 'label 左对齐',
    decoratorProps: { labelAlign: 'left' },
  }),
  width: f.Input({
    title: 'label 固定 160px',
    decoratorProps: { labelWidth: 160 },
  }),
  auto: f.Input({
    title: 'label 宽度 auto',
    decoratorProps: { labelWidth: 'auto' },
  }),
  wrap: f.Input({
    title: '这是一段很长很长且允许换行的 label',
    decoratorProps: { labelWidth: 100, labelWrap: true },
  }),
})

const form = createForm()
</script>
