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
    componentProps: { minWidth: 200, maxColumns: 3 },
    properties: {
      // 放在首位，保证它从某一行第一列开始，右侧有足够列数可供跨列
      remark: f.Input({
        title: '备注（gridSpan 占 2 列）',
        decoratorProps: { gridSpan: 2 },
      }),
      username: f.Input({ title: '用户名（默认占 1 列）' }),
      email: f.Input({ title: '邮箱（默认占 1 列）' }),
      company: f.Input({ title: '公司' }),
      role: f.Input({ title: '角色' }),
      city: f.Input({ title: '城市' }),
    },
  }),
})

const form = createForm()
</script>
