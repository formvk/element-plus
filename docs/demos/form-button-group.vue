<template>
  <OptionsProvider>
    <div :style="{ display: 'grid', gap: '24px' }">
      <label :style="controlStyle">
        align：
        <ElSegmented v-model="align" :options="aligns" />
      </label>

      <Form :form="form">
        <SchemaField :schema="schema" />
        <!-- gutter 控制按钮间距 -->
        <FormButtonGroup :align="align" :gutter="16">
          <Submit>提交</Submit>
          <Reset>重置</Reset>
        </FormButtonGroup>
        <!-- FormItem 内部自带 Space，适合放置多个操作项 -->
        <FormButtonGroup.Item :gutter="12">
          <Submit>保存</Submit>
          <Reset>取消</Reset>
        </FormButtonGroup.Item>
      </Form>

      <div>
        <div :style="{ marginBottom: '8px' }">FormButtonGroup.Sticky：滚动时吸附在底部</div>
        <div :style="scrollOuterStyle">
          <div :style="{ height: '400px' }">
            <Form :form="form">
              <SchemaField :schema="schema" />
              <FormButtonGroup.Sticky align="right">
                <Submit>提交</Submit>
                <Reset>重置</Reset>
              </FormButtonGroup.Sticky>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </OptionsProvider>
</template>

<script setup lang="ts">
import {
  Form,
  FormButtonGroup,
  Reset,
  Submit,
  arrayComponents,
  fieldComponents,
  voidComponents,
} from '@formvk/element-plus'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'
import { ElSegmented } from 'element-plus'
import { ref } from 'vue'

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
const align = ref<'left' | 'center' | 'right'>('left')
const aligns = ['left', 'center', 'right']
const controlStyle = { display: 'flex', alignItems: 'center', gap: '8px' }
const scrollOuterStyle = {
  height: '180px',
  overflow: 'auto',
  border: '1px solid var(--vp-c-border, #d9d9d9)',
  borderRadius: '8px',
  padding: '12px',
}
</script>
