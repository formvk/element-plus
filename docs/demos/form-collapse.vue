<template>
  <OptionsProvider>
    <Form :form="form" layout="vertical">
      <SchemaField :schema="schema" />
      <div :style="actionStyle">
        <ElButton @click="toggleBase">切换基本信息</ElButton>
        <ElButton @click="switchContact">切换到联系方式</ElButton>
      </div>
    </Form>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Form, arrayComponents, createFormCollapse, fieldComponents, voidComponents } from '@formvk/element-plus'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'
import { ElButton } from 'element-plus'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

// 受控实例与 schema 均静态定义
const collapse = createFormCollapse('base')

const schema = createSchema({
  panels: f.FormCollapse({
    componentProps: {
      // 传入 createFormCollapse 实例即可受控
      formCollapse: collapse,
      accordion: true,
    },
    properties: {
      base: f.CollapsePanel({
        componentProps: { key: 'base', header: '基本信息' },
        properties: {
          name: f.Input({ title: '姓名' }),
          email: f.Input({ title: '邮箱' }),
        },
      }),
      contact: f.CollapsePanel({
        componentProps: { key: 'contact', header: '联系方式' },
        properties: {
          mobile: f.Input({ title: '手机号' }),
          address: f.Input({ title: '地址' }),
        },
      }),
    },
  }),
})

const form = createForm()
const actionStyle = { display: 'flex', gap: '8px', marginTop: '12px' }

const toggleBase = () => collapse.toggleActiveKey('base')
const switchContact = () => collapse.setActiveKeys('contact')
</script>
