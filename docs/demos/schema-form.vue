<script setup lang="ts">
import { SchemaForm, Submit, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { createForm, createSchema, createSchemaOptions } from '@formvk/vue'
import { ref } from 'vue'

// 样式副作用导入，无需绑定变量
// oxlint-disable-next-line import/no-unassigned-import
import 'element-plus/dist/index.css'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名', required: true }),
  role: f.Select({
    title: '角色',
    required: true,
    enum: [
      { label: '管理员', value: 'admin' },
      { label: '访客', value: 'guest' },
    ],
  }),
})

const form = createForm()
const result = ref('')
const error = ref('')

const handleSubmit = (values: Record<string, unknown>) => {
  error.value = ''
  result.value = `提交成功：${JSON.stringify(values)}`
}

const handleSubmitFailed = () => {
  result.value = ''
  error.value = '校验未通过，请检查必填项'
}
</script>

<template>
  <OptionsProvider>
    <div class="demo">
      <SchemaForm
        :form="form"
        layout="vertical"
        :schema="schema"
        :on-auto-submit="handleSubmit"
        :on-auto-submit-failed="handleSubmitFailed"
      >
        <Submit>提交</Submit>
      </SchemaForm>
      <div v-if="result" class="demo-result">{{ result }}</div>
      <div v-if="error" class="demo-error">{{ error }}</div>
    </div>
  </OptionsProvider>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 12px;
}

.demo-result {
  color: var(--el-color-success, #67c23a);
}

.demo-error {
  color: var(--el-color-danger, #f56c6c);
}
</style>
