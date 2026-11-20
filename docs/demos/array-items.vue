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
    users: [{ name: 'Alice', email: 'alice@example.com' }],
  },
})

const schema = createSchema({
  users: f.ArrayItems(
    f.Object({
      name: f.Input({ title: '姓名', required: true }),
      email: f.Input({ title: '邮箱' }),
      remove: f.Remove({ title: '删除' }),
    }),
    {
      properties: {
        add: f.Addition({ title: '新增成员' }),
      },
    }
  ),
})
</script>

<template>
  <OptionsProvider>
    <Form :form="form">
      <SchemaField :schema="schema" />
    </Form>
  </OptionsProvider>
</template>
