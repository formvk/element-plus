<template>
  <OptionsProvider>
    <Form
      :form="form"
      layout="horizontal"
      label-align="right"
      wrapper-align="left"
      colon
      :label-width="100"
      :wrapper-width="220"
    >
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
  normal: f.Input({ title: '默认布局' }),
  leftLabel: f.Input({ title: 'label 左对齐', decoratorProps: { labelAlign: 'left' } }),
  rightWrapper: f.Input({ title: '控件右对齐', decoratorProps: { wrapperAlign: 'right' } }),
  fixed: f.Input({ title: '固定宽度', decoratorProps: { labelWidth: 120, wrapperWidth: 260 } }),
  noColon: f.Input({ title: '隐藏冒号', decoratorProps: { colon: false } }),
  longLabel: f.Input({ title: '很长的 label 文本可以换行', decoratorProps: { labelWidth: 90, labelWrap: true } }),
  wrapperWrap: f.Select({
    title: '控件换行',
    decoratorProps: { wrapperWidth: 140, wrapperWrap: true },
    componentProps: {
      multiple: true,
      options: [
        { label: '苹果', value: 'apple' },
        { label: '香蕉', value: 'banana' },
        { label: '樱桃', value: 'cherry' },
      ],
    },
  }),
})

const form = createForm()
</script>
