# 阅读态与详情页

本指南介绍如何把同一份 Schema 在「可编辑表单」与「只读详情」之间切换，以及如何控制空值占位与自定义阅读态渲染。

## 第一步：切换到阅读态

表单有四种交互模式：`editable`、`readOnly`、`disabled`、`readPretty`。阅读态通过 `pattern` 切换，支持表单级与字段级：

```ts
// 1. 创建时指定
const form = createForm({ pattern: 'readPretty', values })

// 2. 运行时切换（属性是响应式的）
form.readPretty = true
form.pattern = 'editable'
```

字段级可以在 Schema 上声明 `readPretty: true`，或在联动中调用 `field.setPattern('readPretty')`。

## 第二步：了解哪些组件自带阅读态

下列字段组件通过 `mapReadPretty` 内置了阅读态组件，切换模式后自动渲染纯文本，无需改 Schema：

| 字段组件 | 阅读态组件 | 展示行为 |
| --- | --- | --- |
| `Input` / `TextArea` / `Password` | `TextInput` | 纯文本 |
| `InputNumber` | `TextInputNumber` | 数字，保留 `formatter` |
| `Select` / `RadioGroup` / `CheckboxGroup` | `TextSelect` | 选项 label，多值以 Tag 展示 |
| `TreeSelect` | `TextTreeSelect` | 节点 label，可用 `treeNodeLabelProp` 指定取值字段 |
| `Cascader` | `TextCascader` | 路径以 `/` 连接 |
| `DatePicker` / `DateRangePicker` | `TextDatePicker` / `TextDateRangePicker` | 按 `format` 格式化 |
| `TimePicker` / `TimeRangePicker` | `TextTimePicker` / `TextTimeRangePicker` | 按 `format` 格式化 |

`Switch`、`Transfer`、`Upload` 没有内置阅读态，`readPretty` 下仍渲染组件本身，需要自行用 `Text` 封装。

<demo vue="../../demos/preview-text.vue" title="Text 与占位符" description="切换 readPretty 查看占位与枚举回显" />

## 第三步：统一空值占位

空值（`undefined`、`null`、空字符串）默认展示 `N/A`。通过 `Form` 的 `preview-text-placeholder` 统一设置整张表单的占位文案：

```vue
<Form :form="form" preview-text-placeholder="—">
  <SchemaField :schema="schema" />
</Form>
```

需要局部覆盖时，用 `Placeholder` 包裹子树：

```vue
<script setup lang="ts">
import { Placeholder, Text } from '@formvk/element-plus'
</script>

<template>
  <Placeholder value="暂无">
    <Text :model-value="undefined" />
  </Placeholder>
</template>
```

## 第四步：自定义阅读态展示

直接使用 `Text` 家族组件渲染自定义详情字段：

```vue
<script setup lang="ts">
import { Text } from '@formvk/element-plus'
</script>

<template>
  <!-- 通用文本 -->
  <Text :model-value="field.value" />
</template>
```

`Text` 系列组件统一使用 `modelValue` 接收值；`usePlaceholder` 可以在自定义只读组件中读取当前占位符，它返回 `ComputedRef`，模板中直接使用，脚本中读取 `.value`。

更常见的做法是给自定义业务组件通过 `mapReadPretty` 指定阅读态组件，详见[接入自定义组件](/guide/how-to/custom-component)。

## 内联编辑：Editable

如果需要在同一块区域内「默认只读、点击才编辑」，使用 [Editable](/components/editable) 装饰器或 `EditablePopover`，它会在字段层面自动切换 `editable` / `readPretty`，并在校验失败时保持编辑态。

## 注意事项

- 阅读态的枚举回显依赖字段的 `dataSource`（Schema 的 `enum`）或组件的 `options` / `data`，脱离数据源时无法把值还原成 label。
- `DatePicker` / `TimePicker` 在阅读态沿用编辑态的 `format` / `value-format`，修改格式会同时影响两个模式。
- 阅读态渲染机制的内部原理见[阅读态 Text 渲染机制](/guide/explanation/read-pretty-rendering)。
