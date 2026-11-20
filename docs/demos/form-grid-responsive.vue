<template>
  <OptionsProvider>
    <div :style="{ width: `${width}px`, maxWidth: '100%' }">
      <label :style="sliderLabelStyle">
        容器宽度：{{ width }}px
        <ElSlider v-model="width" :min="240" :max="900" />
      </label>
      <Form :form="form" layout="vertical">
        <SchemaField :schema="schema" />
      </Form>
    </div>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'
import { ElSlider } from 'element-plus'
import { ref } from 'vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  grid: f.FormGrid({
    componentProps: {
      // 按断点取值：<= 480px 单列，<= 800px 两列，其余最多四列
      minWidth: [160, 200, 240],
      maxColumns: [1, 2, 4],
      minColumns: [1, 1, 1],
      breakpoints: [480, 800],
    },
    properties: {
      name: f.Input({ title: '姓名' }),
      email: f.Input({ title: '邮箱' }),
      mobile: f.Input({ title: '手机号' }),
      company: f.Input({ title: '公司' }),
      city: f.Input({ title: '城市' }),
      address: f.Input({ title: '地址' }),
    },
  }),
})

const form = createForm()
const width = ref(620)
const sliderLabelStyle = { display: 'block', marginBottom: '12px' }
</script>
