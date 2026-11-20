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
  date: f.DatePicker({ title: '日期', componentProps: { type: 'date', style: { width: '100%' } } }),
  month: f.DatePicker({ title: '月份', componentProps: { type: 'month' } }),
  year: f.DatePicker({ title: '年份', componentProps: { type: 'year' } }),
  datetime: f.DatePicker({ title: '日期时间', componentProps: { type: 'datetime' } }),
  format: f.DatePicker({ title: '自定义格式', componentProps: { type: 'date', format: 'DD/MM/YYYY' } }),
  range: f.DateRangePicker({ title: '日期范围', componentProps: { type: 'daterange' } }),
})

const createInitialValues = () => ({
  date: '2026-11-17',
  month: '2026-11',
  year: '2026',
  datetime: '2026-11-17 10:30:00',
  format: '17/11/2026',
  range: ['2026-11-01', '2026-11-17'],
})

const form = createForm({ values: createInitialValues() })
const readPrettyForm = createForm({ pattern: 'readPretty', values: createInitialValues() })
const stackStyle = { display: 'grid', gap: '16px' }
const sectionTitleStyle = { marginBottom: '12px', fontWeight: '600' }
</script>
