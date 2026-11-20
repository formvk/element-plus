<template>
  <OptionsProvider>
    <Form :form="form">
      <SchemaField :schema="schema" />
    </Form>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { createExpression, createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'

type FeedbackLayout = 'loose' | 'terse' | 'popover' | 'none'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

// 通过表达式把下拉框的值绑定到各字段的 feedbackLayout
const valuesExp = createExpression<{ feedbackLayout: FeedbackLayout }>('$values')

const schema = createSchema({
  feedbackLayout: f.Select({
    title: 'feedbackLayout',
    enum: [
      { label: 'loose', value: 'loose' },
      { label: 'terse', value: 'terse' },
      { label: 'popover', value: 'popover' },
      { label: 'none', value: 'none' },
    ],
    componentProps: { style: { width: '220px' } },
  }),
  error: f.Input({
    title: 'error',
    decoratorProps: {
      feedbackLayout: valuesExp.feedbackLayout,
      feedbackStatus: 'error',
      feedbackText: '校验失败',
    },
  }),
  warning: f.Input({
    title: 'warning',
    decoratorProps: {
      feedbackLayout: valuesExp.feedbackLayout,
      feedbackStatus: 'warning',
      feedbackText: '存在风险',
    },
  }),
  success: f.Input({
    title: 'success',
    decoratorProps: {
      feedbackLayout: valuesExp.feedbackLayout,
      feedbackStatus: 'success',
      feedbackText: '校验通过',
    },
  }),
  pending: f.Input({
    title: 'pending',
    decoratorProps: {
      feedbackLayout: valuesExp.feedbackLayout,
      feedbackStatus: 'pending',
      feedbackText: '校验中…',
    },
  }),
  customIcon: f.Input({
    title: '自定义成功图标',
    decoratorProps: {
      feedbackLayout: valuesExp.feedbackLayout,
      feedbackStatus: 'success',
      feedbackText: '已通过',
      feedbackIcon: '✓',
    },
  }),
  customErrorIcon: f.Input({
    title: '自定义错误图标',
    decoratorProps: {
      feedbackLayout: valuesExp.feedbackLayout,
      feedbackStatus: 'error',
      feedbackText: '未通过',
      feedbackIcon: '✕',
    },
  }),
})

const form = createForm({ values: { feedbackLayout: 'loose' } })
</script>
