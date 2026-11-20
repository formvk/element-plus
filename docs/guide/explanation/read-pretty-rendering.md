# 阅读态 Text 渲染机制

本页解释字段切换到 `readPretty` 后发生了什么：`mapReadPretty` 如何替换组件、`Text*` 家族如何把值还原成可读文案，以及空值占位符的上下文传递。

## mapReadPretty：按 pattern 切换组件

桥接组件通过 `connect` 连接字段与 Element Plus 控件，并可以用 `mapReadPretty` 声明阅读态组件：

```ts
import { connect, mapProps, mapReadPretty } from '@formvk/vue'
import { ElSelect } from 'element-plus'

import { TextSelect } from '@formvk/element-plus'

export const Select = connect(ElSelect, mapProps({ dataSource: 'options' }), mapReadPretty(TextSelect))
```

渲染时内核检查字段的 `pattern`：

- 不是 `readPretty` → 渲染原始控件（Select）；
- 是 `readPretty` → 渲染 `mapReadPretty` 指定的组件（TextSelect），并把同一批 props 透传下去。

因为判断发生在连接层，业务代码与 Schema 不需要为详情页维护第二份字段定义，切换 `form.pattern` 即可整表转换。

## Text 家族如何回显文案

只读组件拿到的是控件的原始值（主键、路径数组、时间字符串），需要结合数据源还原成人类可读的内容：

| 阅读态组件 | 回显策略 |
| --- | --- |
| `TextInput` | 直接展示值，保留 `prefix` / `suffix` / `addonBefore` / `addonAfter` |
| `TextInputNumber` | 配置了 `formatter` 时先格式化再展示 |
| `TextSelect` | 用值在 `field.dataSource` / `options` 中查 `label`；多值渲染为 Tag 列表 |
| `TextTreeSelect` | 在 `data` 中递归查找节点 label，多值渲染 Tag |
| `TextCascader` | 按值路径逐级查 `options`，标签以 `/` 连接，多路径以空格分隔 |
| `TextDatePicker` / `TextTimePicker` | 复用编辑态的 `format` 格式化字符串，区间值以 `~` 连接 |

这解释了两个常见现象：

1. 阅读态枚举显示成占位符，通常是因为 Schema 没有声明 `enum`（运行时没有 `dataSource`），组件无法把 value 反查为 label；
2. 修改 `DatePicker` 的 `format` 会同时影响编辑态与阅读态，因为两者共用同一个 props。

## 空值占位符的三级上下文

空值（`undefined`、`null`、空字符串）不直接渲染空白，而是走占位符机制：

```text
Form 的 previewTextPlaceholder
        ↓ 渲染为 Placeholder（provide / inject）
字段组件内的 usePlaceholder(value)
        ↓ 值为空时返回上下文占位符，否则返回值本身
Text* 组件输出
```

- `Form` 接收 `previewTextPlaceholder` 后，通过 `Placeholder` 向下注入；
- 任何子树都可以再包一层 `<Placeholder value="暂无">` 局部覆盖；
- 未提供任何上下文时，默认占位符为 `N/A`；
- `usePlaceholder` 返回 `ComputedRef`，让自定义只读组件复用同一套规则。

## 为什么部分组件没有阅读态

`Switch`、`Transfer`、`Upload` 没有调用 `mapReadPretty`：

- `Switch` 的布尔语义在详情页通常需要文案化（「是 / 否」「已开启 / 已关闭」），组件层无法替业务决定；
- `Transfer` 的已选项文案依赖业务数据结构；
- `Upload` 的文件列表本身就是可读的卡片 / 链接列表，保留原组件更实用。

这些场景可以在 Schema 中把字段组件替换为 `Text` 家族或自研只读组件，接入方式见[接入自定义组件](/guide/how-to/custom-component)。

## 延伸阅读

- [阅读态与详情页](/guide/how-to/read-pretty)：操作步骤与完整组件支持表
- [Text 组件参考](/components/preview-text)：全部 `Text*` 组件与属性
- [Schema 驱动与表单状态模型](/guide/explanation/schema-driven)：pattern 在状态模型中的位置
