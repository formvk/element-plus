# Input

单行文本输入组件，基于 Element Plus `Input` 封装。`modelValue` / `update:modelValue` 由表单内核自动注入，字段校验中时后缀会自动展示加载图标；阅读态自动切换为 `TextInput`。

<demo vue="../demos/input.vue" title="Input 与 TextArea" description="可清空、字数限制、禁用与多行文本，含 readPretty 阅读态" />

## 何时使用

- 需要录入单行文本，如姓名、标题、简短描述。
- 需要多行文本时使用同包导出的 `TextArea`。
- 需要密码录入或强度提示时使用 [Password](/components/password)。

## 属性

继承 Element Plus [`Input`](https://element-plus.org/zh-CN/component/input.html) 的属性，未列出的属性与 `ElInput` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `modelValue` | `string` | 字段值，由内核注入，无需手动传入 |
| `clearable` | `boolean` | 是否展示清除按钮 |
| `maxlength` | `number` | 最大输入长度 |
| `showWordLimit` | `boolean` | 是否展示字数统计 |
| `placeholder` | `string` | 占位文案 |
| `disabled` | `boolean` | 禁用输入 |
| `size` | `'small' \| 'default' \| 'large'` | 输入框尺寸 |

前后缀通过 `#prefix` / `#suffix` 插槽传入。

### TextArea

`TextArea` 为独立具名导出，基于 `ElInput type="textarea"`，属性与 Element Plus 文本域保持一致，阅读态同样渲染为 `TextInput`：

```ts
import { fieldComponents } from '@formvk/element-plus'
import { createSchemaOptions } from '@formvk/vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
})
```

`fieldComponents` 已包含 `TextArea`，直接使用 `f.TextArea({ title: '备注' })` 即可。

## 阅读态

表单或字段处于 `readPretty` 模式时，`Input` 与 `TextArea` 自动切换为 `TextInput`，以纯文本展示值；空值展示 `Form` 的 `previewTextPlaceholder`。
