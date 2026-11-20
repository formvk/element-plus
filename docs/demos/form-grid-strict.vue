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
      minWidth: 180,
      maxWidth: 260,
      maxColumns: 4,
      columnGap: 16,
      rowGap: 8,
      strictAutoFit: true,
      colWrap: true,
    },
    properties: {
      name: f.Input({ title: '姓名' }),
      email: f.Input({ title: '邮箱（gridSpan 2）', decoratorProps: { gridSpan: 2 } }),
      mobile: f.Input({ title: '手机号' }),
      company: f.Input({ title: '公司' }),
      city: f.Input({ title: '城市' }),
      address: f.Input({ title: '地址（gridSpan 3）', decoratorProps: { gridSpan: 3 } }),
    },
  }),
})

const form = createForm()
</script>
