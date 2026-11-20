# 安装

本页帮助你从零搭建 `@formvk/element-plus` 的运行环境，并完成第一个表单的前置准备。

## 环境要求

| 依赖 | 版本要求 | 仓库实际使用 |
| --- | --- | --- |
| Vue | `^3.5.0`（peerDependencies） | `3.5.44` |
| Element Plus | `^2.14.0`（peerDependencies） | `2.14.7` |
| `@formvk/*` 内核包 | `~1.2.0-beta.3` | `~1.2.0-beta.3` |
| `@formvk/element-plus` | — | `1.0.0-beta.1` |
| TypeScript | 可选，建议 `>=5.0` | `~6.0.3` |
| Node.js（工程环境） | `>=22.18.0` | `>=22.18.0` |

## 安装依赖

```bash
# pnpm
pnpm add @formvk/element-plus @formvk/core @formvk/vue @formvk/schema element-plus vue

# npm
npm install @formvk/element-plus @formvk/core @formvk/vue @formvk/schema element-plus vue

# yarn
yarn add @formvk/element-plus @formvk/core @formvk/vue @formvk/schema element-plus vue
```

`@formvk/element-plus` 只提供组件桥接层：表单实例、`SchemaField` 工厂等内核能力需要从 `@formvk/vue` 导入，因此建议显式安装 `@formvk/core`、`@formvk/vue` 与 `@formvk/schema`。

## 引入样式

`@formvk/element-plus` **不会**在包入口自动引入样式。桥接层样式包含对 Element Plus 类名与 CSS 变量的引用，需要与 Element Plus 的 namespace 保持一致，因此样式交由应用层显式引入。

桥接层组件的类名前缀由 Element Plus 的 namespace 派生：默认为 `el-formvk-*`，通过 `ElConfigProvider` 修改 namespace 后自动变为 `${namespace}-formvk-*`（如 `ns-formvk-*`）。

### 默认前缀

使用 Element Plus 默认的 `el` 前缀时，直接引入编译好的 css：

```ts
import 'element-plus/dist/index.css'
import '@formvk/element-plus/style.css'
```

### 自定义 Element Plus 前缀

通过 `ElConfigProvider` 的 `namespace` 修改 Element Plus 前缀时，样式中的 `.el-*`、`--el-*` 以及桥接层类名 `el-formvk-*` 都会随之变化。此时改用 scss 版本，并在应用的样式入口设置 `$namespace`：

```scss
// styles/index.scss
@use '@formvk/element-plus/style.scss' with ($namespace: 'ns');
```

```vue
<!-- App.vue -->
<template>
  <ElConfigProvider namespace="ns">
    <RouterView />
  </ElConfigProvider>
</template>
```

- `$namespace` 会同时派生桥接层的类名前缀 `$prefix`（默认 `#{$namespace}-formvk`），与运行时 `usePrefixCls` 读取的 namespace 保持一致。
- `style.css` 与 `style.scss` 都随包发布，按项目是否自定义前缀选择其一即可。

Element Plus 支持完整引入或按需引入，桥接组件不要求把 `ElementPlus` 注册为全局插件。桥接层复用 Element Plus 的 CSS 变量，主题色、圆角与暗色模式会跟随 Element Plus 的全局配置。

## 按需导入

容器组件可以通过 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 自动按需引入：

```bash
pnpm add -D unplugin-vue-components
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { FormvkElementPlusResolver } from '@formvk/element-plus'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [FormvkElementPlusResolver()],
    }),
  ],
})
```

解析器只覆盖 `containers` 目录下的容器组件（`SchemaForm`、`PopupForm`、`ModalForm`、`DrawerForm`、`CrudTable`、`DataTable`、`SearchForm`、`AddPopup`、`EditPopup`）。字段、布局与数组组件由 schema 内部解析，不需要注册；`renders` 是渲染函数，也不参与注册。样式仍需按上一节的方式在应用入口引入一次。

## 全量注册

不使用按需插件时，可以通过插件一次性注册全部容器组件：

```ts
import { createApp } from 'vue'
import FormvkElementPlus from '@formvk/element-plus'
import 'element-plus/dist/index.css'
import '@formvk/element-plus/style.css'

createApp(App).use(FormvkElementPlus).mount('#app')
```

全量注册只包含 `containers` 目录下的容器组件；字段、布局与数组组件由 schema 内部解析，不参与注册。

## 下一步

继续阅读[快速开始](/guide/quick-start)，用十分钟完成第一个 Schema 驱动表单。

想了解本包与 formily-element-plus 的完整差异，见[与 formily-element-plus 的差异](/guide/explanation/formily-diff)。
