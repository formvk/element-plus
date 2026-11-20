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
  grid: f.FormGrid({
    componentProps: {
      minWidth: 220,
      maxColumns: 3,
    },
    properties: {
      username: f.Input({ title: '用户名' }),
      email: f.Input({ title: '邮箱' }),
      role: f.Select({
        title: '角色',
        enum: [
          { label: '管理员', value: 'admin' },
          { label: '访客', value: 'guest' },
        ],
      }),
      city: f.Input({ title: '城市' }),
      company: f.Input({ title: '公司' }),
      remark: f.Input({ title: '备注' }),
    },
  }),
})

const form = createForm()
</script>
