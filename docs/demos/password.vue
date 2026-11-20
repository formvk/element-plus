<template>
  <OptionsProvider>
    <div :style="stackStyle">
      <Form :form="form" layout="vertical">
        <SchemaField :schema="schema" />
      </Form>
      <div>
        <div :style="sectionTitleStyle">阅读态（readPretty）</div>
        <Form :form="readPrettyForm" layout="vertical" preview-text-placeholder="—">
          <SchemaField :schema="schema" />
        </Form>
      </div>
    </div>
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
  password: f.Password({
    title: '密码',
    required: true,
    // checkStrength 开启密码强度条
    componentProps: { checkStrength: true, placeholder: '请输入密码' },
  }),
  confirm: f.Password({
    title: '确认密码',
    required: true,
    componentProps: { checkStrength: false, placeholder: '再次输入密码' },
    validator(value: any, _rule: any, ctx: any) {
      if (value !== ctx.values.password) return '两次输入的密码不一致'
    },
  }),
})

const createInitialValues = () => ({
  password: 'Formvk@2026',
  confirm: 'Formvk@2026',
})

const form = createForm({ values: createInitialValues() })
const readPrettyForm = createForm({ pattern: 'readPretty', values: createInitialValues() })
const stackStyle = { display: 'grid', gap: '16px' }
const sectionTitleStyle = { marginBottom: '12px', fontWeight: '600' }
</script>
