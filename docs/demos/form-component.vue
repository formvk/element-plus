<template>
  <OptionsProvider>
    <div :style="stackStyle">
      <!-- component 指定渲染容器；preview-text-placeholder 控制阅读态空值占位符 -->
      <Form :form="form" component="div" layout="vertical" preview-text-placeholder="暂无数据" :style="panelStyle">
        <SchemaField :schema="schema" />
      </Form>
      <ElSwitch v-model="readPretty" active-text="切换阅读态" />
    </div>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
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
  company: f.Input({ title: '公司' }),
})

const form = createForm({
  pattern: 'readPretty',
  values: { name: 'Alice', company: '' },
})
const readPretty = ref(true)
const stackStyle = { display: 'grid', gap: '12px' }
const panelStyle = {
  padding: '12px',
  border: '1px solid var(--vp-c-border, #d9d9d9)',
  borderRadius: '8px',
}

watch(readPretty, value => {
  form.readPretty = value
})
</script>
