# FormCollapse

折叠面板布局容器，子面板通过 `CollapsePanel` 声明，适合分组多、默认只展开部分内容的长表单。

<demo vue="../demos/form-collapse.vue" title="FormCollapse 示例" description="受控实例、默认展开与手风琴模式" />

## 何时使用

- 表单分组较多，希望默认折叠次要分组、缩短页面长度。
- 需要在代码中精确控制哪些分组展开 / 收起时，配合 `createFormCollapse` 受控实例使用。

## 属性

继承 Element Plus [`Collapse`](https://element-plus.org/zh-CN/component/collapse.html) 的属性，并扩展：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `formCollapse` | `IFormCollapse` | `createFormCollapse` 创建的受控实例，不传时内部自动创建 |
| `activeKey` | `string \| number \| (string \| number)[]` | 当前展开的面板 |
| `modelValue` | `string \| number \| (string \| number)[]` | 同 `activeKey`，支持 `v-model` |
| `defaultActiveKey` | `string \| number \| (string \| number)[]` | 默认展开的面板 |
| `accordion` | `boolean` | 是否手风琴模式 |
| `prefixCls` | `string` | 样式前缀 |

### CollapsePanel

| 子组件 | 说明 |
| --- | --- |
| `CollapsePanel` | 面板，`componentProps` 支持 `key`、`header` / `title`、`disabled` 等属性 |

### 受控实例

`createFormCollapse(defaultActiveKeys?)` 返回响应式实例：

| 成员 | 说明 |
| --- | --- |
| `activeKeys` | 当前展开的 key 列表 |
| `setActiveKeys(keys)` | 设置展开项 |
| `addActiveKey(key)` | 展开指定面板 |
| `removeActiveKey(key)` | 收起指定面板 |
| `toggleActiveKey(key)` | 切换指定面板 |
| `hasActiveKey(key)` | 判断面板是否展开 |

## 用法

```ts
const collapse = createFormCollapse(['base'])

const schema = createSchema({
  panels: f.FormCollapse({
    componentProps: { formCollapse: collapse, accordion: true },
    properties: {
      base: f.CollapsePanel({
        componentProps: { key: 'base', header: '基本信息' },
        properties: {
          name: f.Input({ title: '姓名' }),
        },
      }),
    },
  }),
})
```

## 注意事项

- 手风琴模式下面板的 key 必须唯一，`activeKeys` 使用单个 key 而不是数组。
- `createFormCollapse` 使用 Vue `reactive` 承载状态，外部读取 `collapse.activeKeys` 具备响应式。
- 面板内字段存在校验错误时，标题会包裹 `ElBadge` 展示错误数量。
