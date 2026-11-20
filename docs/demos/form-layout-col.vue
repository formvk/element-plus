<template>
  <OptionsProvider>
    <Form :form="form" :label-col="4" :wrapper-col="8" layout="horizontal">
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
  username: f.Input({ title: '用户名' }),
  email: f.Input({ title: '邮箱' }),
  mobile: f.Input({ title: '手机号' }),
  x: f.Input({ title: 'X 坐标' }),
  y: f.Input({ title: 'Y 坐标' }),
})

const form = createForm()
</script>
