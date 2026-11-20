<template>
  <OptionsProvider>
    <div :style="stackStyle">
      <Form :form="form" layout="vertical">
        <SchemaField :schema="schema" />
        <Submit @submit="handleSubmit" @submit-success="handleSubmitSuccess" @submit-failed="handleSubmitFailed">
          提交
        </Submit>
      </Form>
      <div v-if="log">{{ log }}</div>
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
})

const form = createForm()
const log = ref('')
const stackStyle = { display: 'grid', gap: '12px' }

const handleSubmit = (values: any) => {
  log.value = `onSubmit：${JSON.stringify(values)}`
}

const handleSubmitSuccess = (values: any) => {
  log.value = `onSubmitSuccess：${JSON.stringify(values)}`
}

const handleSubmitFailed = (feedbacks: any[]) => {
  log.value = `onSubmitFailed：${feedbacks.length} 条错误`
}
</script>
