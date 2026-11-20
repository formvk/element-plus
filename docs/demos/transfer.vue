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

const dataSource = Array.from({ length: 8 }).map((_, index) => ({
  key: String(index),
  label: `成员 ${index + 1}`,
}))

const schema = createSchema({
  members: f.Transfer({
    title: '选择成员',
    componentProps: {
      data: dataSource,
      titles: ['待选', '已选'],
      filterable: true,
    },
  }),
})

const form = createForm({ values: { members: ['1', '3'] } })
</script>
