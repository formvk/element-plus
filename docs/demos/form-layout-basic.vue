<template>
  <OptionsProvider>
    <div :style="stackStyle">
      <label :style="controlStyle">
        layout：
        <ElSegmented v-model="layout" :options="layouts" />
      </label>
      <Form :form="form" :layout="layout">
        <SchemaField :schema="schema" />
      </Form>
    </div>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'
import { ElSegmented } from 'element-plus'
import { ref } from 'vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名', required: true }),
  role: f.Select({
    title: '角色',
    enum: [
      { label: '管理员', value: 'admin' },
      { label: '访客', value: 'guest' },
    ],
  }),
  remark: f.Input({ title: '备注' }),
})

const layouts = [
  { label: 'horizontal', value: 'horizontal' },
  { label: 'vertical', value: 'vertical' },
  { label: 'inline', value: 'inline' },
]

const form = createForm()
const layout = ref<'horizontal' | 'vertical' | 'inline'>('horizontal')
const stackStyle = { display: 'grid', gap: '12px' }
const controlStyle = { display: 'flex', alignItems: 'center', gap: '8px' }
</script>
