<template>
  <OptionsProvider>
    <div :style="stackStyle">
      <Form :form="form" layout="vertical" @auto-submit="handleAutoSubmit" @auto-submit-failed="handleAutoSubmitFailed">
        <SchemaField :schema="schema" />
        <Submit>提交</Submit>
      </Form>
      <div v-if="result" :style="{ color: success ? successColor : errorColor }">
        {{ result }}
      </div>
    </div>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Form, Submit, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
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
})

const form = createForm()
const result = ref('')
const success = ref(false)
const stackStyle = { display: 'grid', gap: '12px' }
const successColor = 'var(--vp-c-green-1, #389e0d)'
const errorColor = 'var(--vp-c-red-1, #cf1322)'

const handleAutoSubmit = (values: any) => {
  result.value = `提交成功：${JSON.stringify(values)}`
  success.value = true
}

const handleAutoSubmitFailed = (feedbacks: any[]) => {
  result.value = `提交失败：${feedbacks.map(item => item.messages?.join('')).join('；')}`
  success.value = false
}
</script>
