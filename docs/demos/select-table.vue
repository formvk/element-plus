<script setup lang="ts">
import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { FormConsumer, createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const dataSource = [
  { key: 1, name: 'Alice', age: 24 },
  { key: 2, name: 'Bob', age: 28 },
  { key: 3, name: 'Carol', age: 31 },
  { key: 4, name: 'Dave', age: 35 },
]

const form = createForm({
  values: {
    // optionAsValue 时字段值为整行数据
    users: [dataSource[1]],
    // 单选取主键
    single: 3,
  },
})

// schema 静态定义，dataSource 与过滤函数都放在上层作用域
const schema = createSchema({
  users: f.SelectTable(
    f.Object({
      name: f.Column({
        componentProps: { dataIndex: 'name', title: '姓名' },
      }),
      age: f.Column({
        componentProps: { dataIndex: 'age', title: '年龄' },
      }),
    }),
    {
      title: '成员（多选）',
      componentProps: {
        dataSource,
        showSearch: true,
        searchProps: { placeholder: '搜索姓名' },
        // 自定义过滤：参数依次为搜索关键词与候选行
        filterOption: (keyword: string, option: any) => option.name.includes(keyword),
        // 按照年龄倒序
        filterSort: (a: any, b: any) => b.age - a.age,
        // 选中项以整行数据作为值
        optionAsValue: true,
      },
    }
  ),
  single: f.SelectTable(
    f.Object({
      name: f.Column({
        componentProps: { dataIndex: 'name', title: '姓名' },
      }),
    }),
    {
      title: '负责人（单选）',
      componentProps: {
        mode: 'single',
        dataSource,
        // valueType 控制树形数据的输出值形态：all / parent / child / path
        valueType: 'all',
      },
    }
  ),
})
</script>

<template>
  <OptionsProvider>
    <Form :form="form">
      <SchemaField :schema="schema" />
      <FormConsumer v-slot="{ form: consumerForm }">
        <pre class="demo-values">{{ JSON.stringify(consumerForm.values, null, 2) }}</pre>
      </FormConsumer>
    </Form>
  </OptionsProvider>
</template>

<style scoped>
.demo-values {
  margin: 0;
  padding: 12px;
  background: var(--vp-c-bg-soft, #f6f8fa);
  border-radius: 8px;
}
</style>
