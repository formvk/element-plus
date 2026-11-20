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
    members: [{ name: 'Alice', email: 'alice@example.com' }],
  },
})

const schema = createSchema({
  members: f.ArrayTabs(
    f.Object({
      name: f.Input({ title: '姓名', required: true }),
      email: f.Input({ title: '邮箱' }),
    }),
    { title: '成员' }
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
