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
  group: f.RadioGroup({
    title: '单选组',
    enum: [
      { label: '选项 A', value: 'a' },
      { label: '选项 B', value: 'b' },
      { label: '选项 C', value: 'c' },
    ],
  }),
  disabled: f.RadioGroup({
    title: '禁用分组',
    componentProps: { disabled: true },
    enum: [
      { label: '日', value: 'day' },
      { label: '周', value: 'week' },
      { label: '月', value: 'month' },
    ],
  }),
  single: f.Radio({
    title: '单个 Radio（布尔值）',
    componentProps: { value: true, label: '同意协议' },
  }),
})

const createInitialValues = () => ({
  group: 'b',
  disabled: 'week',
  single: true,
})

const form = createForm({ values: createInitialValues() })
const readPrettyForm = createForm({ pattern: 'readPretty', values: createInitialValues() })
const stackStyle = { display: 'grid', gap: '16px' }
const sectionTitleStyle = { marginBottom: '12px', fontWeight: '600' }
</script>
