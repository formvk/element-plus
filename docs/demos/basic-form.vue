<template>
  <OptionsProvider>
    <div :style="stackStyle">
      <Form :form="form">
        <SchemaField :schema="schema" />
        <div :style="buttonStyle">
          <Submit @submit="handleSubmit">提交</Submit>
          <Reset>重置</Reset>
        </div>
      </Form>
      <pre v-if="submitted" :style="preStyle">{{ submitted }}</pre>
    </div>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Form, Reset, Submit, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'
import { ref } from 'vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名', required: true }),
  role: f.Select({
    title: '角色',
    required: true,
    enum: [
      { label: '管理员', value: 'admin' },
      { label: '访客', value: 'guest' },
    ],
  }),
  remark: f.Input({
    title: '备注',
    componentProps: { placeholder: '选填' },
  }),
})

const form = createForm({
  values: {
    username: 'alice',
    role: 'admin',
  },
})
const submitted = ref('')
const stackStyle = { display: 'grid', gap: '16px' }
const buttonStyle = { display: 'flex', gap: '8px' }
const preStyle = {
  margin: '0',
  padding: '12px',
  borderRadius: '8px',
  background: 'var(--vp-c-bg-soft, #f6f8fa)',
  fontSize: '13px',
  overflow: 'auto',
}

const handleSubmit = (values: any) => {
  submitted.value = JSON.stringify(values, null, 2)
}
</script>
