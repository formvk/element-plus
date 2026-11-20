# FormItem

字段装饰器，负责 label、必填标记、tooltip 与校验反馈的展示，并把表单级布局配置应用到单个字段。通常作为 `createSchemaOptions` 的默认装饰器使用：

```ts
import { fieldComponents, voidComponents } from '@formvk/element-plus'
import { createSchemaOptions } from '@formvk/vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  defaultDecorator: 'FormItem',
})
```

## 何时使用

- 几乎所有需要 label、校验信息或统一对齐的字段，都应通过默认装饰器包裹 `FormItem`。
- 需要在纯模板中组合自定义字段、又希望复用统一的 label / 反馈布局时，直接使用 `BaseItem`。

## label / tooltip / extra

<demo vue="../demos/form-item-basic.vue" title="label、colon、tooltip、extra、asterisk" description="覆盖 label 展示、冒号、提示与必填星号" />

## addonBefore / addonAfter 与 label 宽度

<demo vue="../demos/form-item-addon.vue" title="addon 与 labelAlign / labelWidth / labelWrap" description="label 前后插槽、对齐方式、固定宽度与换行" />

## wrapper 相关属性

<demo vue="../demos/form-item-width.vue" title="wrapperAlign / wrapperWidth / wrapperWrap / fullness / inset / bordered" description="控制控件区域的对齐、宽度、换行、撑满与边框" />

## 校验反馈

<demo vue="../demos/form-item-feedback.vue" title="feedbackStatus / feedbackText / feedbackLayout / feedbackIcon" description="通过下拉框切换 feedbackLayout，表达式会实时同步到所有字段" />

## gridSpan

<demo vue="../demos/form-item-grid-span.vue" title="gridSpan" description="在 FormGrid 中让表单项占据多列" />

## 其他布局属性

<demo vue="../demos/form-item-advanced.vue" title="layout / size / tooltipLayout / tooltipIcon / labelCol / labelStyle / getPopupContainer" description="单项级别的布局与样式覆盖" />

## 属性

Element Plus 参考：[FormItem](https://element-plus.org/zh-CN/component/form.html)。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `label` | `VNodeChild \| string` | 标签内容，传 `' '` 可隐藏标签但保留占位 |
| `colon` | `boolean` | 是否显示冒号 |
| `tooltip` | `VNodeChild \| string` | 标签后的提示内容 |
| `tooltipIcon` | `VNodeChild` | 提示图标，默认为 `QuestionFilled` |
| `tooltipLayout` | `'icon' \| 'text'` | 提示展示方式 |
| `layout` | `'vertical' \| 'horizontal' \| 'inline'` | 单项布局，覆盖 FormLayout 配置 |
| `labelAlign` | `'left' \| 'right'` | label 对齐方式 |
| `labelWrap` | `boolean` | label 是否允许换行 |
| `labelWidth` | `number \| string` | label 宽度，`'auto'` 为自适应 |
| `labelCol` | `number` | label 栅格宽度 |
| `labelStyle` | `CSSProperties` | label 自定义样式 |
| `wrapperAlign` | `'left' \| 'right'` | 控件对齐方式 |
| `wrapperWidth` | `number \| string` | 控件宽度，`'auto'` 为自适应 |
| `wrapperWrap` | `boolean` | 控件是否允许换行 |
| `wrapperCol` | `number` | 控件栅格宽度 |
| `wrapperStyle` | `CSSProperties` | 控件自定义样式 |
| `fullness` | `boolean` | 控件是否撑满整行 |
| `inset` | `boolean` | 隐藏两侧留白与边框，呈现内联编辑样式 |
| `bordered` | `boolean` | 是否显示边框，默认 `true` |
| `size` | `'small' \| 'default' \| 'large'` | 控件尺寸 |
| `addonBefore` | `VNodeChild` | label 前置内容 |
| `addonAfter` | `VNodeChild` | label 后置内容 |
| `extra` | `VNodeChild` | 控件下方的补充说明；Schema 中取字段 `description` |
| `feedbackText` | `VNodeChild \| string[]` | 自定义校验信息，缺省取字段的 errors / warnings / successes |
| `feedbackStatus` | `'error' \| 'warning' \| 'success' \| 'pending'` | 反馈状态，校验中自动为 `pending` |
| `feedbackLayout` | `'loose' \| 'terse' \| 'popover' \| 'none'` | 反馈信息布局 |
| `feedbackIcon` | `VNodeChild` | 自定义反馈图标 |
| `getPopupContainer` | `(node: HTMLElement) => HTMLElement` | 兼容属性，自定义反馈浮层的挂载节点 |
| `asterisk` | `boolean` | 是否显示必填星号，缺省跟随字段 `required` |
| `gridSpan` | `number` | 在 `FormGrid` 中占据的列数 |
| `class` / `style` | `string` / `CSSProperties` | 自定义类名与样式 |

在 Schema 中通过 `decoratorProps` 传入上述属性，例如 `f.Input({ title: '姓名', decoratorProps: { labelWidth: 120 } })`。

### BaseItem

`BaseItem` 是不带字段连接的纯展示版本，属性与 `FormItem` 相同，可用于自定义装饰器或 [Editable](/components/editable) 等内部组合场景。

## 注意事项

- `getPopupContainer` 仅为兼容保留；Element Plus 的 Tooltip 通过 teleport 渲染浮层，需要自定义挂载位置时请使用 `teleported` / `append-to` 等 Element Plus 属性。
- `feedbackLayout="popover"` 的提示由 `ElTooltip` 渲染，`feedbackText` 为空时不会展示浮层。
