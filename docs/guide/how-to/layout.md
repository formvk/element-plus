# 响应式布局

本指南解决三个问题：统一 label 与控件的排列方式、让表单随容器宽度响应式变化、用栅格组织多列表单。

## 统一布局：写在 Form 上即可

`Form` 内部已经内置了一层 `FormLayout`，全表布局直接写在 `Form` 的 attrs 上，不需要手动再包一层：

```vue
<Form :form="form" layout="vertical" label-align="left" size="small">
  <SchemaField :schema="schema" />
</Form>
```

常用布局属性：

| 属性 | 说明 |
| --- | --- |
| `layout` | `horizontal`（默认）/ `vertical` / `inline` |
| `label-align` / `wrapper-align` | label / 控件对齐 |
| `label-width` / `wrapper-width` | 固定宽度，传 `'auto'` 自适应 |
| `label-col` / `wrapper-col` | 标签 / 控件占据的栅格列数 |
| `colon` / `bordered` / `inset` / `fullness` | 冒号、边框、留白与撑满 |
| `feedback-layout` | 校验信息布局：`loose` / `terse` / `popover` / `none` |
| `size` | 控件尺寸：`small` / `default` / `large` |

需要局部覆盖时，再用 `FormLayout` 包裹对应区域，或在单个 `FormItem` 上设置同名属性。

## 响应式断点：数组属性 + breakpoints

`layout`、`label-align` 等属性都支持传数组，配合 `breakpoints` 使用：容器宽度小于等于 `breakpoints[i]` 时，取数组的第 `i` 项。

```vue
<Form
  :form="form"
  :breakpoints="[720, 1280]"
  :layout="['vertical', 'horizontal', 'horizontal']"
  :label-align="['left', 'right', 'right']"
>
  <SchemaField :schema="schema" />
</Form>
```

上例中：宽度 `<= 720` 时纵向布局、label 左对齐；`720 ~ 1280` 与更宽时恢复横向布局。

## 多列栅格：FormGrid

`FormGrid` 按容器宽度自动计算列数，在 Schema 中作为 void 组件使用：

```ts
const schema = createSchema({
  grid: f.FormGrid({
    componentProps: {
      minWidth: 240,
      maxColumns: 3,
    },
    properties: {
      username: f.Input({ title: '用户名' }),
      email: f.Input({ title: '邮箱' }),
    },
  }),
})
```

<demo vue="../../demos/layout-grid.vue" title="FormGrid 自适应栅格" description="拖动改变容器宽度，列数会按 minWidth 自动调整" />

模板方式与跨列：

```vue
<script setup lang="ts">
import { FormGrid, FormItem, GridColumn } from '@formvk/element-plus'
</script>

<template>
  <FormGrid :min-width="240" :max-columns="3">
    <GridColumn :grid-span="2">
      <FormItem label="备注"><!-- 占两列 --></FormItem>
    </GridColumn>
    <GridColumn>
      <FormItem label="状态"><!-- 占一列 --></FormItem>
    </GridColumn>
  </FormGrid>
</template>
```

`FormItem` 也支持 `grid-span`，在栅格中直接让表单项跨列。

## 自定义栅格实例

需要监听布局过程或在外部控制栅格时，使用 `createFormGrid` 创建实例：

```ts
import { createFormGrid } from '@formvk/element-plus'

const grid = createFormGrid({ minWidth: 200, maxColumns: 3 })
```

```vue
<FormGrid :grid="grid">
  <!-- ... -->
</FormGrid>
```

子组件中可以用 `useFormGrid()` 读取当前栅格实例（未注入时返回 `null`）。

## 注意事项

- 非 `strictAutoFit` 模式下，跨列节点会收缩到当前行剩余列数；需要稳定跨列时，把节点放在行首或开启 `strictAutoFit`。
- `FormGrid` 的列 / 行间距缺省读取 `FormLayout` 的 `gridColumnGap`（默认 `8`）/ `gridRowGap`（默认 `4`）。
- 完整属性表见 [FormLayout](/components/form-layout) 与 [FormGrid](/components/form-grid) 参考页。
