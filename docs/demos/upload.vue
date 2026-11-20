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
  basic: f.Upload({
    title: '基础上传',
    componentProps: {
      action: '#',
      // autoUpload 关闭后仅收集文件，不发起上传请求
      autoUpload: false,
      textContent: '选择文件',
    },
  }),
  dragger: f.UploadDragger({
    title: '拖拽上传',
    componentProps: {
      action: '#',
      autoUpload: false,
      textContent: '点击或拖拽文件到此区域',
    },
  }),
  multiple: f.Upload({
    title: '多文件 + 限制数量',
    componentProps: {
      action: '#',
      autoUpload: false,
      multiple: true,
      limit: 3,
      textContent: '最多 3 个文件',
    },
  }),
  picture: f.Upload({
    title: '图片卡片',
    componentProps: {
      action: '#',
      autoUpload: false,
      listType: 'picture-card',
    },
  }),
})

const form = createForm({
  values: {
    basic: [{ uid: '1', name: 'readme.md', status: 'success', url: '#' }],
  },
})
</script>
