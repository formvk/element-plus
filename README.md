# @formvk/element-plus

基于 [Formvk](https://formvk.github.io/core/) 内核的 Element Plus 表单桥接层，提供 Schema 驱动的表单、布局、数组与 CRUD 容器组件。

- 文档站点：<https://formvk.github.io/element-plus/>
- 内核文档：<https://formvk.github.io/core/>

## 特性

- **Schema 驱动**：用一份 Schema 描述字段、布局与联动，字段状态、校验与生命周期由 Formvk 内核统一管理。
- **完整的组件桥接**：覆盖表单、布局、基础字段、数组组件、表格选择与可编辑组件，行为与 formily-element-plus 对齐。
- **Element Plus 样式体系**：直接复用 Element Plus 的控件与 CSS 变量，主题、暗色模式与全局配置天然一致。
- **TypeScript**：完整类型声明，支持 `createSchema + fragment` 的类型推导，并提供全局组件与 Volar 类型支持。
- **容器能力**：内置 `SchemaForm`、`PopupForm`、`CrudTable`、`SearchForm` 等容器，可通过插件全量注册或按需自动导入。

## 仓库结构

| 路径                          | 说明                                 |
| ----------------------------- | ------------------------------------ |
| `packages/components`         | 发布的 `@formvk/element-plus` 组件库 |
| `docs`                        | VitePress 文档站点与示例             |
| `vendor/formily-element-plus` | formily-element-plus 参考实现        |

## 快速开始

```bash
pnpm add @formvk/element-plus @formvk/core @formvk/vue @formvk/schema element-plus vue
```

```vue
<script setup lang="ts">
import { Form, Submit, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { SchemaField, createForm, createSchema, createSchemaOptions } from '@formvk/vue'

import 'element-plus/dist/index.css'
import '@formvk/element-plus/style.css'

const form = createForm()

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名' }),
})
</script>

<template>
  <OptionsProvider>
    <Form :form="form" layout="vertical">
      <SchemaField :schema="schema" />
      <Submit :on-submit="values => console.log(values)">提交</Submit>
    </Form>
  </OptionsProvider>
</template>
```

更多用法见[快速开始](https://formvk.github.io/element-plus/guide/quick-start)与[组件总览](https://formvk.github.io/element-plus/components/)。

## 开发

环境要求：Node.js `>=22.18.0`、pnpm `12`。

```bash
pnpm install       # 安装依赖
pnpm dev           # 组件库构建（watch）
pnpm build         # 构建组件库
pnpm test          # 运行单元测试
pnpm typecheck     # 类型检查
pnpm lint          # oxlint 代码检查
pnpm format:check  # oxfmt 格式检查
pnpm docs:dev      # 本地启动文档
pnpm docs:build    # 构建文档
```

提交前会通过 husky + lint-staged 自动执行 lint 与格式化。

## License

[MIT](https://opensource.org/licenses/MIT)
