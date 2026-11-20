# 接入自定义组件

本指南介绍如何把任意 Vue 控件接入 Schema 体系：从最简单的受控组件，到支持数据源映射与阅读态的完整桥接组件。

## 方式一：useField 受控组件

适合一次性使用、逻辑简单的场景。用 `useField` 拿到字段引用，手动绑定 `modelValue` 与 `setValue`：

```vue
<script setup lang="ts">
import type { Field } from '@formvk/core'
import { useField } from '@formvk/vue'
import { ElOption, ElSelect } from 'element-plus'

defineProps<{
  options?: Array<{ label: string; value: string }>
}>()

const field = useField<Field>()
</script>

<template>
  <ElSelect
    :model-value="field?.value"
    :disabled="field?.disabled || field?.readOnly"
    @update:model-value="field?.setValue($event)"
  >
    <ElOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </ElSelect>
</template>
```

注册到工厂后即可在 Schema 中使用：

```ts
const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: { SelectField },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})
```

## 方式二：connect + mapProps（推荐）

可复用的桥接组件推荐使用 `connect`：绑定层会自动注入 `modelValue` / `onUpdate:modelValue`，并用 `mapProps` 描述字段到组件 props 的映射。映射对象的键值含义为 `字段侧属性: 组件侧属性`。

先准备一个接收 `options` 的 Vue 包装组件：

```vue
<!-- BaseSelect.vue -->
<script setup lang="ts">
import { ElOption, ElSelect } from 'element-plus'

defineProps<{
  options?: Array<{ label: string; value: string }>
}>()

const model = defineModel<string>()
</script>

<template>
  <ElSelect v-model="model" v-bind="$attrs">
    <ElOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </ElSelect>
</template>
```

再用 `connect` 完成字段与控件的桥接：

```ts
import { connect, mapProps, mapReadPretty } from '@formvk/vue'
import { TextSelect } from '@formvk/element-plus'

import BaseSelect from './BaseSelect.vue'

export const Select = connect(
  BaseSelect,
  // dataSource 映射为 options；值本身由绑定层通过 modelValue 双向同步
  mapProps({ dataSource: 'options' }),
  // 阅读态自动切换为 TextSelect
  mapReadPretty(TextSelect)
)
```

常见映射写法：

| 映射 | 含义 | 典型组件 |
| --- | --- | --- |
| `mapProps({ dataSource: 'options' })` | Schema `enum` 映射到 `options` | Select / RadioGroup / CheckboxGroup |
| `mapProps({ dataSource: 'data' })` | 映射到树 / 穿梭框数据 | TreeSelect / Transfer |

函数形式的 mapper 适合做更复杂的转换，签名为 `(props, field) => props`。

## 处理值格式转换

Element Plus 的日期组件通过 `value-format` 直接控制值格式，桥接层的 `DatePicker` 已默认把 `value-format` 设为 `format`，字段拿到的是格式化后的字符串，不需要手动做 dayjs 双向转换。需要覆盖格式时，在 mapper 中补上 `valueFormat`：

```ts
import { connect, mapProps } from '@formvk/vue'
import { ElDatePicker } from 'element-plus'

export const DatePicker = connect(
  ElDatePicker,
  mapProps(props => ({
    ...props,
    valueFormat: props.valueFormat ?? 'YYYY-MM-DD',
  }))
)
```

## 支持阅读态

`mapReadPretty(Component)` 会在字段 `pattern === 'readPretty'` 时自动替换渲染组件。可以复用本包导出的 `Text` / `TextSelect` 等，也可以传自研的只读组件：

```ts
connect(MyPicker, mapReadPretty(MyPickerText))
```

阅读态组件从 props 中读取 `modelValue`，空值占位由 `Placeholder` 上下文统一处理。

## 自定义装饰器

装饰器（如 `FormItem`）负责 label、校验反馈与布局。自定义装饰器同样用 `useField` 读取字段状态，纯展示版本可以基于本包导出的 `BaseItem` 封装：

```vue
<script setup lang="ts">
import { useField } from '@formvk/vue'
import { BaseItem } from '@formvk/element-plus'

defineOptions({ name: 'MyDecorator' })

const field = useField()
</script>

<template>
  <BaseItem v-bind="$attrs" :feedback-text="field?.selfErrors?.join(', ')">
    <slot />
  </BaseItem>
</template>
```

## 注意事项

- Vue 版不需要 `observer` 之类的包裹：`useField` 返回字段引用，在模板或 `computed` 中读取字段状态即可获得响应式更新；`connect` / `mapProps` / `mapReadPretty` 已在绑定层完成追踪与透传。
- 自定义控件约定通过 `modelValue` / `onUpdate:modelValue` 通信；控件事件签名不同时，在函数 mapper 或包装组件里转换为表单需要的值。
- 数组类自定义组件可参考 `ArrayBase` 的上下文能力（`useArray` / `useIndex` / `useRecord`），见 [ArrayBase 参考](/components/array-base)。
