<template>
  <OptionsProvider>
    <div :style="stackStyle">
      <div :style="{ color: 'var(--vp-c-text-2, #666)' }">点击字段进入编辑态，失焦后恢复为阅读态。</div>
      <Form :form="form" layout="vertical">
        <SchemaField :schema="schema" />
      </Form>
    </div>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Editable, EditablePopover, Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  // Editable / EditablePopover 作为装饰器与容器注册
  voidComponents: { ...voidComponents, Editable, EditablePopover },
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  name: f.Input({ title: '姓名', decorator: 'Editable' }),
  email: f.Input({ title: '邮箱', decorator: 'Editable' }),
  // 容器级编辑：点击标题后在 Popover 中编辑子字段
  profile: f.Object(
    {
      birthday: f.Input({ title: '生日', componentProps: { placeholder: 'YYYY-MM-DD' } }),
      city: f.Input({ title: '城市' }),
    },
    {
      title: '更多信息',
      component: 'EditablePopover',
    }
  ),
})

const form = createForm({
  pattern: 'editable',
  values: { name: 'Alice', email: 'alice@example.com', profile: { birthday: '1995-06-01', city: '杭州' } },
})
const stackStyle = { display: 'grid', gap: '12px' }
</script>
