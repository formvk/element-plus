<template>
  <OptionsProvider>
    <Form :form="form" class="form-item-advanced" :style="{ padding: '8px' }">
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
  vertical: f.Input({
    title: '单项 vertical 布局',
    decoratorProps: { layout: 'vertical' },
  }),
  size: f.Input({
    title: '单项 size',
    decoratorProps: { size: 'large' },
  }),
  tooltipText: f.Input({
    title: 'tooltipLayout=text',
    decoratorProps: { tooltip: '提示直接用文本展示', tooltipLayout: 'text' },
  }),
  tooltipIcon: f.Input({
    title: '自定义 tooltipIcon',
    decoratorProps: {
      tooltip: '自定义图标',
      tooltipIcon: '?',
    },
  }),
  col: f.Input({
    title: 'labelCol / wrapperCol',
    decoratorProps: { labelCol: 6, wrapperCol: 10 },
  }),
  style: f.Input({
    title: 'labelStyle / wrapperStyle',
    decoratorProps: {
      labelStyle: { color: 'var(--vp-c-brand-1, #1677ff)' },
      wrapperStyle: {
        background: 'var(--vp-c-brand-soft, rgba(22, 119, 255, 0.06))',
        padding: '4px',
        borderRadius: '4px',
      },
    },
  }),
  popover: f.Input({
    title: 'popover 反馈',
    decoratorProps: {
      feedbackLayout: 'popover',
      feedbackStatus: 'error',
      feedbackText: '通过 getPopupContainer 指定浮层挂载节点',
      getPopupContainer: (node: HTMLElement) => node.parentElement ?? document.body,
    },
  }),
})

const form = createForm()
</script>
