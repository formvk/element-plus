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

const fields = ['name', 'email', 'mobile', 'company', 'city', 'remark']
const titles = ['姓名', '邮箱', '手机号', '公司', '城市', '备注']

const schema = createSchema({
  grid: f.FormGrid({
    componentProps: {
      minWidth: 200,
      minColumns: 1,
      maxColumns: 3,
      colWrap: true,
    },
    properties: Object.fromEntries(fields.map((key, index) => [key, f.Input({ title: titles[index] })])),
  }),
})

const form = createForm()
</script>
