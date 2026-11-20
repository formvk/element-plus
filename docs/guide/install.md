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

Element Plus 与桥接层的样式都需要在应用入口显式引入：

```ts
import 'element-plus/dist/index.css'
import '@formvk/element-plus/style.css'
```

Element Plus 支持完整引入或按需引入，桥接组件不要求把 `ElementPlus` 注册为全局插件。桥接层复用 Element Plus 的 CSS 变量，主题色、圆角与暗色模式会跟随 Element Plus 的全局配置。

## 下一步

继续阅读[快速开始](/guide/quick-start)，用十分钟完成第一个 Schema 驱动表单。

想了解本包与 formily-element-plus 的完整差异，见[与 formily-element-plus 的差异](/guide/explanation/formily-diff)。
