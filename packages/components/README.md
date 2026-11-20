# @formvk/element-plus

基于 [Formvk](https://formvk.github.io/core/) 内核的 Element Plus 表单桥接层，提供 Schema 驱动的表单、布局、数组与 CRUD 容器组件。

- 文档站点：<https://formvk.github.io/element-plus/>
- 内核文档：<https://formvk.github.io/core/>

## 特性

- **Schema 驱动**：用一份 Schema 描述字段、布局与联动，字段状态、校验与生命周期由 Formvk 内核统一管理。
- **完整的组件桥接**：覆盖表单、布局、基础字段、数组组件、表格选择与可编辑组件。
- **Element Plus 样式体系**：复用 Element Plus 的控件与 CSS 变量，主题、暗色模式与全局配置天然一致。
- **容器能力**：内置 `SchemaForm`、`PopupForm`、`ModalForm`、`DrawerForm`、`CrudTable`、`DataTable`、`SearchForm`、`AddPopup`、`EditPopup`。
- **TypeScript**：完整类型声明，提供按需导入 Resolver 与 Volar 全局组件类型。

## 环境要求

| 依赖                | 版本        |
| ------------------- | ----------- |
| Vue                 | `^3.5.0`    |
| Element Plus        | `^2.14.0`   |
| Node.js（工程环境） | `>=22.18.0` |

## 安装

```bash
pnpm add @formvk/element-plus @formvk/core @formvk/vue @formvk/schema element-plus vue
```

本包只提供组件桥接层，表单实例、`SchemaField` 等内核能力需要从 `@formvk/vue` 导入，因此建议显式安装 `@formvk/core`、`@formvk/vue` 与 `@formvk/schema`。

## 使用

```vue
<script setup lang="ts">
import { Form, Submit, arrayComponents, fieldComponents, voidComponents } from '@formvk/element-plus'
import { SchemaField, createForm, createSchema, createSchemaOptions } from '@formvk/vue'

const form = createForm()

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名' }),
  role: f.Select({
    title: '角色',
    enum: [
      { label: '管理员', value: 'admin' },
      { label: '访客', value: 'guest' },
    ],
  }),
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

`OptionsProvider` 是应用级上下文，只需在应用最外层注入一次；内部的 `Form`、`SchemaField` 以及 `SchemaForm`、`CrudTable` 等容器会自动继承。

## 样式

本包不会在入口自动引入样式。桥接层类名默认以 Element Plus 的 namespace 派生为 `el-formvk-*`，需要与 Element Plus 样式一起显式引入：

```ts
import 'element-plus/dist/index.css'
import '@formvk/element-plus/style.css'
```

通过 `ElConfigProvider` 的 `namespace` 修改前缀时，改用 scss 版本并设置 `$namespace`：

```scss
// styles/index.scss
@use '@formvk/element-plus/style.scss' with (
  $namespace: 'ns'
);
```

## 按需导入

容器组件支持通过 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 自动按需引入：

```ts
import { FormvkElementPlusResolver } from '@formvk/element-plus/resolver'
import Components from 'unplugin-vue-components/vite'
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [FormvkElementPlusResolver()],
    }),
  ],
})
```

解析器只覆盖 `containers` 目录下的容器组件，字段、布局与数组组件由 schema 内部解析，无需注册。

## 全量注册

```ts
import FormvkElementPlus from '@formvk/element-plus'
import { createApp } from 'vue'

import 'element-plus/dist/index.css'
import '@formvk/element-plus/style.css'

createApp(App).use(FormvkElementPlus).mount('#app')
```

## Volar 支持

使用 Volar 时，可通过 `tsconfig.json` 引入全局组件类型，获得模板中的 props 与事件提示：

```json
{
  "compilerOptions": {
    "types": ["@formvk/element-plus/global"]
  }
}
```

使用 `unplugin-vue-components` 时会自动生成 `components.d.ts`，无需再引入此类型。

## 包导出

| 路径                              | 说明                                     |
| --------------------------------- | ---------------------------------------- |
| `@formvk/element-plus`            | 组件、容器、hooks 与安装插件             |
| `@formvk/element-plus/resolver`   | `unplugin-vue-components` 按需导入解析器 |
| `@formvk/element-plus/global`     | Volar 全局组件类型                       |
| `@formvk/element-plus/style.css`  | 编译后的样式（默认 `el` 前缀）           |
| `@formvk/element-plus/style.scss` | 支持自定义 namespace 的样式源码          |

## License

[MIT](https://opensource.org/licenses/MIT)
