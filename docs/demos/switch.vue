<template>
  <OptionsProvider>
    <Form :form="form" layout="vertical">
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
  basic: f.Switch({ title: '基础开关' }),
  text: f.Switch({
    title: '带文案',
    componentProps: { activeText: '开', inactiveText: '关' },
  }),
  disabled: f.Switch({ title: '禁用', componentProps: { disabled: true } }),
})

const form = createForm({ values: { basic: true, text: true, disabled: false } })
</script>
