<template>
  <OptionsProvider>
    <div :style="stackStyle">
      <Form :form="form" layout="vertical">
        <SchemaField :schema="schema" />
      </Form>
      <div>
        <div :style="sectionTitleStyle">阅读态（readPretty）</div>
        <Form :form="readPrettyForm" layout="vertical" preview-text-placeholder="—">
          <SchemaField :schema="schema" />
        </Form>
      </div>
    </div>
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
  normal: f.Input({ title: '基础输入' }),
  clearable: f.Input({
    title: '可清空',
    componentProps: { clearable: true, placeholder: '请输入内容' },
  }),
  maxLength: f.Input({
    title: '字数限制',
    componentProps: { maxlength: 10, showWordLimit: true, placeholder: '最多 10 个字符' },
  }),
  disabled: f.Input({ title: '禁用', componentProps: { disabled: true } }),
  textarea: f.TextArea({
    title: '多行文本',
    componentProps: { rows: 3, showWordLimit: true, maxlength: 100 },
  }),
})

const createInitialValues = () => ({
  normal: 'hello',
  clearable: 'formvk',
  maxLength: 'formvk',
  disabled: '禁用态固定内容',
  textarea: '这是一段多行文本，阅读态会渲染为纯文本。',
})

const form = createForm({ values: createInitialValues() })
const readPrettyForm = createForm({ pattern: 'readPretty', values: createInitialValues() })
const stackStyle = { display: 'grid', gap: '16px' }
const sectionTitleStyle = { marginBottom: '12px', fontWeight: '600' }
</script>
