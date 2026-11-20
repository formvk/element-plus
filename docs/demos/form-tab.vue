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
  tabs: f.FormTab({
    properties: {
      user: f.TabPane({
        componentProps: { key: 'user', tab: '基本信息' },
        properties: {
          name: f.Input({ title: '姓名' }),
          email: f.Input({ title: '邮箱' }),
          city: f.Input({ title: '城市' }),
        },
      }),
      security: f.TabPane({
        componentProps: { key: 'security', tab: '账号安全' },
        properties: {
          password: f.Password({ title: '密码' }),
          confirm: f.Password({ title: '确认密码' }),
        },
      }),
    },
  }),
})

const form = createForm()
</script>
