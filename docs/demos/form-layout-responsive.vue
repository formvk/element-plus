<template>
  <OptionsProvider>
    <div :style="{ width: `${width}px`, maxWidth: '100%' }">
      <div :style="controlAreaStyle">
        <label>
          容器宽度：{{ width }}px
          <ElSlider v-model="width" :min="320" :max="860" />
        </label>
        <label :style="controlStyle">
          direction：
          <ElSegmented v-model="direction" :options="directions" />
        </label>
      </div>
      <!-- 数组按 breakpoints 生效：宽屏 inline/左对齐，窄屏 vertical/右对齐 -->
      <Form
        :form="form"
        :direction="direction"
        :layout="['vertical', 'horizontal', 'inline']"
        :label-align="['left', 'right', 'right']"
        :label-col="[24, 6, 6]"
        :wrapper-col="[24, 12, 12]"
        :breakpoints="[480, 720]"
        :space-gap="12"
        :grid-column-gap="16"
        :grid-row-gap="8"
      >
        <SchemaField :schema="schema" />
      </Form>
    </div>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'
import { ElSegmented, ElSlider } from 'element-plus'
import { ref } from 'vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名' }),
  email: f.Input({ title: '邮箱' }),
  role: f.Select({
    title: '角色',
    enum: [
      { label: '管理员', value: 'admin' },
      { label: '访客', value: 'guest' },
    ],
  }),
  remark: f.Input({ title: '备注' }),
})

const form = createForm()
const width = ref(520)
const direction = ref<'ltr' | 'rtl'>('ltr')
const directions = ['ltr', 'rtl']
const controlAreaStyle = { display: 'grid', gap: '8px', marginBottom: '12px' }
const controlStyle = { display: 'flex', alignItems: 'center', gap: '8px' }
</script>
