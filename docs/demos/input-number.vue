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
  basic: f.InputNumber({ title: '基础数字', componentProps: { min: 0, max: 100 } }),
  step: f.InputNumber({ title: '步长 5', componentProps: { step: 5 } }),
  precision: f.InputNumber({ title: '保留两位小数', componentProps: { precision: 2, step: 0.01 } }),
  controls: f.InputNumber({
    title: '按钮位置',
    componentProps: { controlsPosition: 'right', stepStrictly: true },
  }),
})

const createInitialValues = () => ({
  basic: 10,
  step: 10,
  precision: 1.5,
  controls: 20,
})

const form = createForm({ values: createInitialValues() })
const readPrettyForm = createForm({ pattern: 'readPretty', values: createInitialValues() })
const stackStyle = { display: 'grid', gap: '16px' }
const sectionTitleStyle = { marginBottom: '12px', fontWeight: '600' }
</script>
