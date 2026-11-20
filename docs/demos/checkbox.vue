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
  group: f.CheckboxGroup({
    title: '多选组',
    enum: [
      { label: '阅读', value: 'read' },
      { label: '运动', value: 'sport' },
      { label: '音乐', value: 'music' },
    ],
  }),
  vertical: f.CheckboxGroup({
    title: '纵向排列',
    componentProps: {
      options: [
        { label: '苹果', value: 'apple' },
        { label: '香蕉', value: 'banana' },
      ],
      style: { display: 'grid', gap: '8px' },
    },
  }),
  single: f.Checkbox({
    title: '单个 Checkbox（布尔值）',
    componentProps: { label: '订阅通知' },
  }),
})

const createInitialValues = () => ({
  group: ['read', 'music'],
  vertical: ['apple'],
  single: true,
})

const form = createForm({ values: createInitialValues() })
const readPrettyForm = createForm({ pattern: 'readPretty', values: createInitialValues() })
const stackStyle = { display: 'grid', gap: '16px' }
const sectionTitleStyle = { marginBottom: '12px', fontWeight: '600' }
</script>
