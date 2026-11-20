# 表单校验

本指南覆盖必填、内置格式规则、自定义校验函数以及手动触发校验的常见场景。校验由 `@formvk/validator` 内核执行，`FormItem` 负责把错误信息渲染到字段下方。

## 配方一：必填

在 Schema 上声明 `required: true`，`FormItem` 会自动展示必填星号并在提交时拦截：

```ts
const schema = createSchema({
  username: f.Input({ title: '用户名', required: true }),
})
```

## 配方二：内置格式与 JSON Schema 规则

常用的声明式规则直接写在 Schema 上：

| Schema 字段 | 说明 |
| --- | --- |
| `maxLength` / `minLength` | 字符串长度上下限 |
| `minimum` / `maximum` | 数字范围上下限 |
| `pattern` | 正则表达式（字符串） |
| `enum` / `const` | 枚举值 / 常量值 |
| `maxItems` / `minItems` / `uniqueItems` | 数组数量与唯一性 |
| `format` | 内置格式，见下表 |

内置 `format` 取值：

```
'url' | 'email' | 'ipv4' | 'ipv6' | 'number' | 'integer'
| 'idcard' | 'qq' | 'phone' | 'money' | 'zh' | 'date' | 'zip'
```

```ts
const schema = createSchema({
  email: f.Input({ title: '邮箱', format: 'email' }),
  age: f.InputNumber({ title: '年龄', minimum: 18, maximum: 99 }),
  website: f.Input({ title: '网站', pattern: '^https?://.+' }),
})
```

## 配方三：自定义校验函数

需要跨字段或复杂逻辑时，使用 `validator`。函数签名为 `(value, rule, ctx) => string | boolean | ...`：

- 返回字符串表示错误信息；
- 返回 `false` 表示校验失败（使用默认文案）；
- 不返回 / 返回 `true` 表示通过；
- `ctx.values` 可以读取整个表单的值，适合确认密码这类跨字段校验。

```ts
const schema = createSchema({
  password: f.Password({ title: '密码', required: true }),
  confirm: f.Password({
    title: '确认密码',
    required: true,
    validator(value, _rule, ctx) {
      if (value !== ctx.values.password) return '两次输入的密码不一致'
    },
  }),
})
```

`validator` 也支持异步函数（返回 Promise），例如远程校验用户名是否占用。

## 配方四：控制校验触发时机

通过规则中的 `triggerType` 控制触发时机，取值为 `'onInput'`、`'onBlur'`、`'onFocus'`：

```ts
const schema = createSchema({
  username: f.Input({
    title: '用户名',
    validator: {
      triggerType: 'onBlur',
      validator(value) {
        if (!value) return '用户名不能为空'
      },
    },
  }),
})
```

## 配方五：提交时校验与失败处理

`form.submit()` 会先执行全量校验：

- 校验通过后才调用成功回调；
- 校验失败时 Promise reject，错误反馈写入对应字段并由 `FormItem` 展示。

在组件层有两种接入方式：

```vue
<script setup lang="ts">
import { ElMessage } from 'element-plus'

const save = async (values: any) => {
  // 保存逻辑
}
</script>

<template>
  <!-- 1. Form 容器回调 -->
  <Form
    :form="form"
    :on-auto-submit="values => console.log('提交成功', values)"
    :on-auto-submit-failed="feedbacks => console.warn('校验失败', feedbacks)"
  />

  <!-- 2. Submit 按钮回调 -->
  <Submit
    :on-submit="values => save(values)"
    :on-submit-success="() => ElMessage.success('保存成功')"
    :on-submit-failed="feedbacks => ElMessage.error(`存在 ${feedbacks.length} 个错误`)"
  />
</template>
```

## 配方六：手动触发与重置后校验

```ts
// 手动校验全表或指定路径
await form.validate()
await form.validate('address.*')
```

```vue
<template>
  <!-- 重置后立即重新校验（筛选表单常用） -->
  <Reset validate>重置</Reset>

  <!-- 仅清空值、不恢复初始值 -->
  <Reset force-clear>清空</Reset>
</template>
```

## 注意事项

- Schema 的 `pattern` 字段表示交互模式，**不是**正则；正则校验请写在 `validator` 规则中（如 `{ pattern: '^https?://.+' }`）。
- 数组字段的错误会冒泡到数组容器，`ArrayTabs` 等组件会在标签上展示错误数量。
- 上传组件在文件处于 `error` 状态时会自动写入 `UploadError` 反馈，无需重复实现。
