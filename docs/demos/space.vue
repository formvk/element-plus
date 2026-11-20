<template>
  <OptionsProvider>
    <Form :form="form" layout="vertical" :space-gap="24">
      <SchemaField :schema="schema" />
      <!-- 未显式设置 size 时，Space 使用 FormLayout.spaceGap（下面设置为 24） -->
      <Space>
        <ElButton type="primary">默认间距</ElButton>
        <ElButton>跟随布局</ElButton>
      </Space>
      <Space :size="4" :style="{ marginTop: '12px' }">
        <ElButton>size 4</ElButton>
        <ElButton>size 4</ElButton>
      </Space>
      <Space :size="32" :style="{ marginTop: '12px' }">
        <ElButton>size 32</ElButton>
        <ElButton>size 32</ElButton>
      </Space>
    </Form>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Form, Space, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'
import { ElButton } from 'element-plus'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  name: f.Input({ title: '姓名' }),
  email: f.Input({ title: '邮箱' }),
})

const form = createForm()
</script>
