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

const options = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      { label: '杭州', value: 'hangzhou', children: [{ label: '西湖', value: 'xihu' }] },
      { label: '宁波', value: 'ningbo', children: [{ label: '鄞州', value: 'yinzhou' }] },
    ],
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [{ label: '南京', value: 'nanjing', children: [{ label: '玄武', value: 'xuanwu' }] }],
  },
]

const schema = createSchema({
  basic: f.Cascader({ title: '级联选择', componentProps: { options } }),
  strict: f.Cascader({
    title: '选择任意一级',
    componentProps: { options, props: { checkStrictly: true } },
  }),
  multiple: f.Cascader({
    title: '多选',
    componentProps: { options, props: { multiple: true }, collapseTags: true },
  }),
})

const createInitialValues = () => ({
  basic: ['zhejiang', 'hangzhou', 'xihu'],
  strict: ['zhejiang', 'hangzhou'],
  multiple: [['jiangsu', 'nanjing', 'xuanwu']],
})

const form = createForm({ values: createInitialValues() })
const readPrettyForm = createForm({ pattern: 'readPretty', values: createInitialValues() })
const stackStyle = { display: 'grid', gap: '16px' }
const sectionTitleStyle = { marginBottom: '12px', fontWeight: '600' }
</script>
