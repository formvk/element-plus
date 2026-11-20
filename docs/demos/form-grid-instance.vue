<template>
  <OptionsProvider>
    <Form :form="form" layout="vertical">
      <div :style="digestStyle">
        {{ ready ? `列数：${columns}，行数：${rows}` : '等待布局完成' }}
      </div>
      <SchemaField :schema="schema" />
    </Form>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Form, arrayComponents, createFormGrid, fieldComponents, voidComponents } from '@formvk/element-plus'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'
import { ref } from 'vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const ready = ref(false)
const columns = ref(0)
const rows = ref(0)

// 实例在模块作用域创建，schema 保持静态
const grid = createFormGrid({
  minWidth: 180,
  maxColumns: 3,
  // 返回 false 的节点会被自动隐藏并跳过占位
  shouldVisible: node => (node.index ?? 0) < 7,
  onInitialized: () => {
    ready.value = true
  },
  onDigest: instance => {
    columns.value = instance.columns
    rows.value = instance.rows
  },
})

const schema = createSchema({
  grid: f.FormGrid({
    componentProps: { grid },
    properties: {
      name: f.Input({ title: '姓名' }),
      email: f.Input({ title: '邮箱' }),
      mobile: f.Input({ title: '手机号' }),
      company: f.Input({ title: '公司' }),
      city: f.Input({ title: '城市' }),
      address: f.Input({ title: '地址' }),
      remark: f.Input({ title: '备注（跨两列）', decoratorProps: { gridSpan: 2 } }),
      hidden: f.Input({ title: '这一项会被 shouldVisible 隐藏' }),
    },
  }),
})

const form = createForm()
const digestStyle = { marginBottom: '8px', color: 'var(--vp-c-text-2, #666)' }
</script>
