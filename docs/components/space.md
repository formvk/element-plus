# Space

间距容器，基于 Element Plus `Space` 封装。未显式传入 `size` 时，间距自动取 `FormLayout.spaceGap`，保证与表单整体间距一致。

<demo vue="../demos/space.vue" title="size 与 FormLayout.spaceGap" description="不传 size 时自动跟随布局配置" />

## 何时使用

- 在表单项内部横向排列多个控件或按钮，又希望间距跟随表单布局配置时。
- 纯通用间距场景也可以直接使用 Element Plus 的 `ElSpace`。

## 属性

继承 Element Plus [`Space`](https://element-plus.org/zh-CN/component/space.html) 的属性，仅 `size` 的默认值被调整：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `number \| string \| [number, number]` | `FormLayout.spaceGap`（默认 `8`） | 间距；显式传入时以传入值为准 |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 排列方向 |
| `wrap` | `boolean` | `false` | 是否自动换行 |
| `alignment` | `'stretch' \| 'center' \| 'start' \| 'end' \| 'baseline'` | — | 交叉轴对齐方式 |
| `fill` | `boolean` | `false` | 子元素是否撑满容器 |
| 其他 | `SpaceProps` | — | 透传给 `ElSpace` |

## 注意事项

- `size` 传数组时表示 `[水平间距, 垂直间距]`，与 Element Plus `Space` 的行为一致。
- 组件通过 `useFormLayout()` 读取布局配置，脱离表单上下文时回退到 Element Plus 的默认间距。
