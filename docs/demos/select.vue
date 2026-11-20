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
  single: f.Select({
    title: '单选',
    enum: [
      { label: '选项一', value: 'a' },
      { label: '选项二', value: 'b' },
    ],
    componentProps: { clearable: true, placeholder: '请选择' },
  }),
  multiple: f.Select({
    title: '多选',
    componentProps: {
      multiple: true,
      clearable: true,
      collapseTags: true,
      options: [
        { label: 'React', value: 'react' },
        { label: 'Vue', value: 'vue' },
        { label: 'Angular', value: 'angular' },
      ],
    },
  }),
  search: f.Select({
    title: '可搜索',
    componentProps: {
      filterable: true,
      options: [
        { label: '杭州', value: 'hangzhou' },
        { label: '上海', value: 'shanghai' },
        { label: '北京', value: 'beijing' },
      ],
    },
  }),
  options: f.Select({
    title: '使用 componentProps.options',
    componentProps: {
      options: [
        { label: '管理员', value: 'admin' },
        { label: '访客', value: 'guest' },
      ],
    },
  }),
})

const createInitialValues = () => ({
  single: 'a',
  multiple: ['react', 'vue'],
  search: 'hangzhou',
  options: 'guest',
})

const form = createForm({ values: createInitialValues() })
const readPrettyForm = createForm({ pattern: 'readPretty', values: createInitialValues() })
const stackStyle = { display: 'grid', gap: '16px' }
const sectionTitleStyle = { marginBottom: '12px', fontWeight: '600' }
</script>
