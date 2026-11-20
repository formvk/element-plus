# FormLayout

布局配置容器，`Form` 内部已内置一层，通常无需手动使用。所有配置都支持数组形式，并按 `breakpoints` 断点生效（容器宽度小于等于断点时命中对应下标）。

## 何时使用

- 需要在表单内部划分不同布局的区域时，用 `FormLayout` 包裹局部字段覆盖外层配置。
- 需要实现响应式布局（如窄屏自动切换为纵向布局）时，通过数组属性配合 `breakpoints` 声明。

## 布局方向

<demo vue="../demos/form-layout-basic.vue" title="layout：horizontal / vertical / inline" description="切换布局方向查看 label 与控件的排列变化" />

## 宽度与对齐

<demo vue="../demos/form-layout-width.vue" title="labelWidth / wrapperWidth / labelAlign / wrapperAlign / labelWrap / wrapperWrap" description="统一设置 label 与控件的宽度、对齐与换行" />

## 栅格列宽

<demo vue="../demos/form-layout-col.vue" title="labelCol / wrapperCol" description="类栅格布局：label 占 4 列，控件占 8 列" />

## 反馈、尺寸与边框

<demo vue="../demos/form-layout-feedback.vue" title="feedbackLayout / tooltipLayout / size / bordered / inset / fullness" description="布局级别的反馈与视觉配置" />

## 响应式与间距

<demo vue="../demos/form-layout-responsive.vue" title="breakpoints / direction / spaceGap / gridColumnGap / gridRowGap" description="拖动容器宽度查看断点切换效果" />

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `layout` | `'vertical' \| 'horizontal' \| 'inline'` 及数组 | `'horizontal'` | 布局方向 |
| `labelAlign` | `'right' \| 'left'` 及数组 | `'right'` | label 对齐方式，`vertical` 布局下默认 `left` |
| `labelWrap` | `boolean` | `false` | label 是否可换行 |
| `labelWidth` | `number` | — | label 固定宽度 |
| `labelCol` | `number` 及数组 | — | label 栅格宽度 |
| `wrapperAlign` | `'right' \| 'left'` 及数组 | `'left'` | 控件对齐方式 |
| `wrapperWidth` | `number` | — | 控件固定宽度 |
| `wrapperCol` | `number` 及数组 | — | 控件栅格宽度 |
| `wrapperWrap` | `boolean` | `false` | 控件是否可换行 |
| `colon` | `boolean` | `true` | 是否显示冒号 |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` | 控件尺寸 |
| `feedbackLayout` | `'loose' \| 'terse' \| 'popover' \| 'none'` | `'loose'` | 校验信息布局 |
| `tooltipLayout` | `'icon' \| 'text'` | `'icon'` | 提示信息布局 |
| `tooltipIcon` | `VNodeChild` | `QuestionFilled` | 提示图标 |
| `bordered` | `boolean` | `true` | 是否显示表单项边框 |
| `fullness` | `boolean` | `false` | 控件是否撑满整行 |
| `inset` | `boolean` | `false` | 是否隐藏两侧留白 |
| `direction` | `'ltr' \| 'rtl'` | `'ltr'` | 文字方向 |
| `spaceGap` | `number` | `8` | [Space](/components/space) 的默认间距 |
| `gridColumnGap` | `number` | `8` | [FormGrid](/components/form-grid) 的默认列间距 |
| `gridRowGap` | `number` | `4` | FormGrid 的默认行间距 |
| `breakpoints` | `number[]` | — | 响应式断点，数组属性按此切换取值 |
| `shallow` | `boolean` | `true` | 为 `true` 时只向下传递浅层配置，避免覆盖内层布局 |
| `prefixCls` | `string` | `'formvk'` | 样式前缀 |
| `class` / `style` | `string` / `CSSProperties` | — | 自定义类名与样式 |

## 注意事项

- `Form` 已经渲染了一层 `FormLayout`，全表配置直接写在 `Form` 上即可，无需手动再包一层。
- 数组属性与 `breakpoints` 一一对应：容器宽度 `<= breakpoints[i]` 时，取属性数组的第 `i` 项；超出全部断点时取最后一项。
