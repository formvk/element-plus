<template>
  <OptionsProvider>
    <div :style="stackStyle">
      <Form :form="form" layout="vertical" preview-text-placeholder="—">
        <SchemaField :schema="schema" />
      </Form>
      <ElSwitch v-model="readPretty" active-text="切换阅读态（空值展示 previewTextPlaceholder）" />
      <div>
        占位符上下文：
        <Placeholder value="N/A">
          <Text />
        </Placeholder>
      </div>
    </div>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Form, Placeholder, Text, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'
import { ElSwitch } from 'element-plus'
import { ref, watch } from 'vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  name: f.Input({ title: '姓名' }),
  role: f.Select({
    title: '角色',
    enum: [
      { label: '管理员', value: 'admin' },
      { label: '访客', value: 'guest' },
    ],
  }),
  company: f.Input({ title: '公司' }),
})

const form = createForm({
  pattern: 'readPretty',
  values: { name: 'Alice', role: 'admin', company: '' },
})
const readPretty = ref(true)
const stackStyle = { display: 'grid', gap: '12px' }

watch(readPretty, value => {
  form.readPretty = value
})
</script>
