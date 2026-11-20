<template>
  <OptionsProvider>
    <div :style="stackStyle">
      <Form :form="form" layout="vertical">
        <SchemaField :schema="schema" />
        <div :style="actionStyle">
          <Submit>保存</Submit>
          <!-- forceClear 清除值，validate 在重置后触发校验 -->
          <Reset
            force-clear
            :validate="validate"
            @reset-validate-success="handleValidateSuccess"
            @reset-validate-failed="handleValidateFailed"
          >
            重置
          </Reset>
          <ElCheckbox v-model="validate">validate</ElCheckbox>
        </div>
      </Form>
      <div v-if="result">{{ result }}</div>
    </div>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Form, Reset, Submit, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'
import { ElCheckbox } from 'element-plus'
import { ref } from 'vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名', required: true }),
  email: f.Input({ title: '邮箱' }),
})

const form = createForm({
  values: { username: 'alice', email: '' },
})
const result = ref('')
const validate = ref(false)
const stackStyle = { display: 'grid', gap: '12px' }
const actionStyle = { display: 'flex', gap: '8px', alignItems: 'center' }

const handleValidateSuccess = () => {
  result.value = '重置并校验成功'
}

const handleValidateFailed = () => {
  result.value = '重置后校验失败'
}
</script>
