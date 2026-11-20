# FormButtonGroup

表单操作按钮组，基于 Element Plus `Space` 封装，支持左 / 中 / 右对齐与滚动吸附底部，并提供与表单项 label 对齐的 `FormButtonGroup.Item` 子组件。

<demo vue="../demos/form-button-group.vue" title="align / gutter / FormItem / Sticky" description="对齐方式、按钮间距、表单项对齐与底部吸附" />

## 何时使用

- 承载表单底部的提交、重置等操作按钮，并需要统一对齐方式与间距。
- 希望按钮与上方字段的控件区域左对齐（跳过 label 列）时，使用 `FormButtonGroup.Item`。
- 长表单需要操作区始终可见时，使用 `FormButtonGroup.Sticky` 吸附在视口底部。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `align` | `'left' \| 'right' \| 'center'` | `'left'` | 对齐方式 |
| `gutter` | `number` | — | 按钮间距，透传给 `ElSpace` 的 `size` |
| `size` | `number \| string \| [number, number]` | — | `ElSpace` 间距 |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 排列方向 |
| `wrap` | `boolean` | `false` | 是否自动换行 |
| `class` / `style` | `string` / `CSSProperties` | — | 自定义类名与样式 |

### 子组件

| 子组件 | 说明 |
| --- | --- |
| `FormButtonGroup.Item` | 以 `FormItem` 的方式对齐按钮，支持 `gutter`，适合与表单字段左对齐 |
| `FormButtonGroup.Sticky` | 吸附容器，滚动时固定在底部，支持 `align`（`left` / `right` / `center`）与自定义 `class` / `style` |

```vue
<FormButtonGroup.Sticky align="right">
  <Submit>提交</Submit>
  <Reset>重置</Reset>
</FormButtonGroup.Sticky>
```

## 注意事项

- `Sticky` 依赖父级滚动容器工作，并会自动读取祖先背景色，避免滚动内容透出。
- `FormButtonGroup.Item` 内部自带 `Space`，多个子按钮会按 `gutter` 自动排列。
