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
    users: [{ name: 'Alice' }, { name: 'Bob' }],
    archived: [{ name: 'Carol' }],
  },
})

const schema = createSchema({
  users: f.ArrayItems(
    f.Object({
      index: f.Index(),
      name: f.Input({ title: '姓名', required: true }),
      sort: f.SortHandle(),
      copy: f.Copy({ title: '复制' }),
      up: f.MoveUp({ title: '上移' }),
      down: f.MoveDown({ title: '下移' }),
      remove: f.Remove({ title: '删除' }),
    }),
    {
      properties: {
        add: f.Addition({ title: '新增成员' }),
      },
    }
  ),
  archived: f.ArrayItems(
    f.Object({
      index: f.Index(),
      name: f.Input({ title: '姓名' }),
      remove: f.Remove({ title: '删除' }),
    }),
    {
      title: '已归档（disabled）',
      // 字段级 disabled：操作组件自动隐藏，Addition 保留
      disabled: true,
      properties: {
        add: f.Addition({ title: '新增成员' }),
      },
    }
  ),
})
</script>

<template>
  <OptionsProvider>
    <Form :form="form">
      <SchemaField :schema="schema" />
    </Form>
  </OptionsProvider>
</template>
