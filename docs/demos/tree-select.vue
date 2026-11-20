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

const treeData = [
  {
    label: '研发部',
    value: 'dev',
    children: [
      { label: '前端组', value: 'fe' },
      { label: '后端组', value: 'be' },
    ],
  },
  {
    label: '设计部',
    value: 'design',
    children: [{ label: '交互组', value: 'ux' }],
  },
]

const schema = createSchema({
  basic: f.TreeSelect({ title: '树选择', componentProps: { data: treeData, defaultExpandAll: true } }),
  multiple: f.TreeSelect({
    title: '多选',
    componentProps: { data: treeData, multiple: true, defaultExpandAll: true },
  }),
  checkable: f.TreeSelect({
    title: '可勾选',
    componentProps: { data: treeData, showCheckbox: true, defaultExpandAll: true },
  }),
  search: f.TreeSelect({
    title: '可搜索',
    componentProps: { data: treeData, filterable: true },
  }),
})

const createInitialValues = () => ({
  basic: 'fe',
  multiple: ['fe', 'ux'],
  checkable: ['dev'],
  search: 'be',
})

const form = createForm({ values: createInitialValues() })
const readPrettyForm = createForm({ pattern: 'readPretty', values: createInitialValues() })
const stackStyle = { display: 'grid', gap: '16px' }
const sectionTitleStyle = { marginBottom: '12px', fontWeight: '600' }
</script>
