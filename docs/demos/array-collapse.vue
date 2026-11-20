<script setup lang="ts">
import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const form = createForm({
  values: {
    users: [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
      { name: 'Carol', email: 'carol@example.com' },
    ],
  },
})

const schema = createSchema({
  users: f.ArrayCollapse(
    f.Object({
      index: f.Index(),
      name: f.Input({ title: '姓名', required: true }),
      email: f.Input({ title: '邮箱' }),
    }),
    {
      title: '成员',
      componentProps: {
        // 默认展开前两个面板
        defaultOpenPanelCount: 2,
      },
      properties: {
        add: f.Addition({ title: '新增面板' }),
      },
    }
  ),
})
</script>

<template>
  <OptionsProvider>
    <Form :form="form" layout="vertical">
      <SchemaField :schema="schema" />
    </Form>
  </OptionsProvider>
</template>
