<script setup lang="ts">
import { PopupForm, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { PopupModel } from '@formvk/models'
import { createSchema, createSchemaOptions } from '@formvk/vue'
import { ElButton, ElSegmented, ElSpace } from 'element-plus'
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
  email: f.Input({ title: '邮箱', required: true }),
})

const typeOptions = [
  { label: '抽屉', value: 'drawer' },
  { label: '对话框', value: 'modal' },
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const type = ref<'drawer' | 'modal'>('drawer')
const result = ref('')

const popup = new PopupModel(async (values: Record<string, unknown>) => {
  await delay(400)
  result.value = `保存成功：${JSON.stringify(values)}`
  return true
})
</script>

<template>
  <OptionsProvider>
    <div class="demo">
      <ElSpace>
        <ElSegmented v-model="type" :options="typeOptions" />
        <ElButton type="primary" @click="popup.open()">新增用户</ElButton>
      </ElSpace>
      <PopupForm :type="type" :popup="popup" title="新增用户" :schema="schema" />
      <div v-if="result" class="demo-result">{{ result }}</div>
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
</style>
