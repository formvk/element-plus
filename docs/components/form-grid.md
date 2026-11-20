# FormGrid

响应式栅格布局容器，按容器宽度自动计算列数。既可以在 Schema 中作为 void 组件使用，也可以直接以模板方式组合 `GridColumn`。

## 何时使用

- 表单字段较多、希望随容器宽度自动从多列收敛为单列时。
- 需要字段跨列（`gridSpan`）或严格控制每列宽度上下限时。
- 仅需固定 label / 控件对齐时，[FormLayout](/components/form-layout) 更简单。

## 基础栅格

<demo vue="../demos/form-grid-basic.vue" title="minWidth / minColumns / maxColumns / colWrap" description="按容器宽度自动计算列数，最多三列" />

## 响应式断点

<demo vue="../demos/form-grid-responsive.vue" title="breakpoints 与数组取值" description="拖动滑块改变容器宽度，观察列数按断点变化" />

## 列宽与间距

<demo vue="../demos/form-grid-strict.vue" title="maxWidth / columnGap / rowGap / strictAutoFit / gridSpan" description="严格适配模式下的列宽与跨列布局" />

## 自定义 Grid 实例

<demo vue="../demos/form-grid-instance.vue" title="grid / shouldVisible / onInitialized / onDigest" description="通过 createFormGrid 创建实例并监听布局过程" />

## 属性

Element Plus 参考：[Layout 布局](https://element-plus.org/zh-CN/component/layout.html)。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `grid` | `Grid<HTMLElement>` | — | 自定义栅格实例，由 `createFormGrid` 创建 |
| `minWidth` | `number \| number[]` | `100` | 单列最小宽度 |
| `maxWidth` | `number \| number[]` | `Infinity` | 单列最大宽度 |
| `minColumns` | `number \| number[]` | `1` | 最少列数 |
| `maxColumns` | `number \| number[]` | `Infinity` | 最多列数 |
| `maxRows` | `number` | — | 最大行数 |
| `breakpoints` | `number[]` | `[720, 1280, 1920]` | 响应式断点 |
| `columnGap` | `number` | 取布局配置（默认 `8`） | 列间距 |
| `rowGap` | `number` | 取布局配置（默认 `4`） | 行间距 |
| `colWrap` | `boolean` | `true` | 是否允许换行 |
| `strictAutoFit` | `boolean` | `false` | 是否严格按最小 / 最大宽度适配 |
| `shouldVisible` | `(node, grid) => boolean` | — | 控制节点是否展示 |
| `onDigest` | `(grid) => void` | — | 每次重新布局完成后的回调 |
| `onInitialized` | `(grid) => void` | — | 首次布局完成后的回调 |
| `prefixCls` | `string` | `'formvk'` | 样式前缀 |
| `class` / `style` | `string` / `CSSProperties` | — | 自定义类名与样式 |

### GridColumn

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `gridSpan` | `number` | `1` | 占据列数 |
| `class` / `style` | `string` / `CSSProperties` | — | 自定义类名与样式 |

### createFormGrid / useFormGrid

```ts
import { createFormGrid, FormGrid, GridColumn } from '@formvk/element-plus'

const grid = createFormGrid({ minWidth: 200, maxColumns: 3 })
```

```vue
<FormGrid :grid="grid">
  <GridColumn>...</GridColumn>
</FormGrid>
```

`useFormGrid()` 可以在子组件中获取当前栅格实例。

## 注意事项

- 非 `strictAutoFit` 模式下，跨列节点会收缩到当前行的剩余列数；需要稳定跨列时，把节点放在行首，或开启 `strictAutoFit`。
- 列 / 行间距缺省读取 `FormLayout` 的 `gridColumnGap` / `gridRowGap`，可在属性上直接覆盖。
- 栅格实例与 `shouldVisible`、`onDigest` 等回调在模块作用域创建时，需用 `ref` 承接布局结果，Vue 中不存在 `observer` 包装。
