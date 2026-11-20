<script setup lang="ts">
import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const form = createForm({
  values: {
    users: [
      { name: 'Alice', email: 'alice@example.com', age: 24 },
      { name: 'Bob', email: 'bob@example.com', age: 28 },
      { name: 'Carol', email: 'carol@example.com', age: 31 },
    ],
  },
})

const schema = createSchema({
  users: f.ArrayTable(
    f.Object({
      name: f.Column({
        componentProps: { title: '姓名', dataIndex: 'name', width: 180 },
        properties: { name: f.Input({ required: true }) },
      }),
      email: f.Column({
        componentProps: { title: '邮箱', dataIndex: 'email', width: 240 },
        properties: { email: f.Input() },
      }),
      age: f.Column({
        componentProps: { title: '年龄', dataIndex: 'age', width: 120 },
        properties: { age: f.Input() },
      }),
      actions: f.Column({
        componentProps: { title: '操作', dataIndex: 'actions', width: 220 },
        properties: {
          action: f.FormItem({
            properties: {
              // 排序手柄由 SortableJS 识别，用于拖拽行
              sort: f.SortHandle(),
              remove: f.Remove({ title: '删除' }),
              up: f.MoveUp(),
              down: f.MoveDown(),
            },
          }),
        },
      }),
    }),
    {
      componentProps: {
        // 分页由 ArrayTable 自行接管
        pagination: { pageSize: 2 },
      },
      properties: {
        // 新增超出当前页时自动翻页
        add: f.ArrayTableAddition({ title: '新增一行' }),
      },
    }
  ),
})
</script>

<template>
  <OptionsProvider>
    <Form :form="form" layout="vertical">
      <SchemaField :schema="schema" />
    </Form>
  </OptionsProvider>
</template>
