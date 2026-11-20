<template>
  <OptionsProvider>
    <Form
      :form="form"
      layout="vertical"
      size="large"
      feedback-layout="terse"
      tooltip-layout="text"
      bordered
      inset
      fullness
    >
      <SchemaField :schema="schema" />
    </Form>
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
  normal: f.Input({ title: '默认' }),
  tooltip: f.Input({ title: '提示文本布局', decoratorProps: { tooltip: '鼠标悬浮查看提示' } }),
  error: f.Input({ title: '校验反馈', decoratorProps: { feedbackStatus: 'error', feedbackText: '出错了' } }),
})

const form = createForm()
</script>
