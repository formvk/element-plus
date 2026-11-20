# Select

下拉选择组件，基于 Element Plus `Select` 封装。Schema 中的 `enum` 会通过 `dataSource` 自动映射为 `options`，字段校验中时后缀展示加载图标；阅读态自动切换为 `TextSelect`。

<demo vue="../demos/select.vue" title="单选 / 多选 / 搜索 / options" description="覆盖常见的 Select 配置，含 readPretty 阅读态" />

## 何时使用

- 从一组有限选项中选择一个或多个值。
- 选项来自枚举或远端字典时，优先通过 Schema 的 `enum` 声明，组件自动完成映射。
- 选项需要随输入远程搜索时，配合 `filterable` 与内核的异步数据源能力使用。

## 属性

继承 Element Plus [`Select`](https://element-plus.org/zh-CN/component/select.html) 的属性，未列出的属性与 `ElSelect` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `{ label, value }[]` | 选项数据 |
| `dataSource` | `{ label, value }[]` | 本包映射属性，等价于 `options`；Schema 的 `enum` 会自动注入到这里 |
| `multiple` | `boolean` | 是否多选 |
| `filterable` | `boolean` | 是否可搜索 |
| `clearable` | `boolean` | 是否展示清除按钮 |
| `collapseTags` | `boolean` | 多选时是否折叠展示已选项 |
| `loading` | `boolean` | 加载中状态 |
| `placeholder` | `string` | 占位文案 |

选项渲染通过 `#default` 插槽自定义 `ElOption`；使用 `options` 属性时由组件内部自动生成。

## 阅读态

`readPretty` 模式下自动切换为 `TextSelect`，结合 `options` / `dataSource` 将值回显为选项标签：单值展示文本，多值以 Tag 列表展示；找不到对应选项或值为空时展示 `previewTextPlaceholder`。
