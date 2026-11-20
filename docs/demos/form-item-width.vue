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
  alignLeft: f.Input({
    title: '控件左对齐（默认）',
    decoratorProps: { wrapperAlign: 'left' },
  }),
  alignRight: f.Input({
    title: '控件右对齐',
    decoratorProps: { wrapperAlign: 'right' },
  }),
  width: f.Input({
    title: '控件固定 240px',
    decoratorProps: { wrapperWidth: 240 },
  }),
  auto: f.Input({
    title: '控件宽度 auto',
    decoratorProps: { wrapperWidth: 'auto' },
  }),
  wrap: f.Select({
    title: '控件允许换行',
    decoratorProps: { wrapperWidth: 120, wrapperWrap: true },
    componentProps: {
      multiple: true,
      options: [
        { label: '选项一', value: 1 },
        { label: '选项二', value: 2 },
        { label: '选项三', value: 3 },
      ],
    },
  }),
  fullness: f.Input({
    title: '撑满整行',
    decoratorProps: { fullness: true },
  }),
  inset: f.Input({
    title: '隐藏两侧留白',
    decoratorProps: { inset: true },
  }),
  noBorder: f.Input({
    title: '隐藏边框',
    decoratorProps: { bordered: false },
  }),
})

const form = createForm()
</script>
