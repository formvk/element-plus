# 字段联动

本指南解决「一个字段的状态依赖另一个字段」的常见问题：控制显隐、禁用、动态组件属性与数据源。

## 前置知识

联动写在 Schema 的 `reactions` 字段中，最常用的是**函数形式**：函数在字段初始化时执行，内部读取到的响应式数据变化时会自动重新执行，对字段属性赋值即触发视图更新。

```ts
const schema = createSchema({
  country: f.Select({
    title: '国家',
    enum: [
      { label: '中国', value: 'CN' },
      { label: '美国', value: 'US' },
    ],
  }),
  city: f.Input({
    title: '城市',
    reactions: [
      field => {
        // 读取同级字段 country 的值，变化时本函数自动重跑
        field.visible = field.query('.country').value() === 'CN'
      },
    ],
  }),
})
```

`reactions` 既可以传单个函数，也可以传函数数组。

## 配方一：控制显隐与展示

字段的 `visible` / `hidden` / `display` 都可以在 reaction 中赋值：

```ts
reactions: [
  field => {
    const type = field.query('.type').value()
    field.visible = type !== 'hidden'
    // display: 'none' 会保留字段值但不渲染；visible = false 同样不参与提交展示
    field.display = type === 'none' ? 'none' : 'visible'
  },
]
```

## 配方二：控制禁用与交互模式

```ts
reactions: [
  field => {
    const approved = field.query('.approved').value()
    field.disabled = approved === false
    // 也可以直接切换交互模式：editable / readOnly / disabled / readPretty
    field.pattern = approved ? 'editable' : 'readOnly'
  },
]
```

## 配方三：动态修改组件属性

通过字段实例的 `setComponentProps`（表达式作用域中为 `$props`）修改组件属性，适合动态 `placeholder`、`maxLength`、`options` 等：

```ts
reactions: [
  field => {
    const isCompany = field.query('.subject').value() === 'company'
    field.setComponentProps({
      placeholder: isCompany ? '请输入企业名称' : '请输入个人姓名',
    })
  },
]
```

## 配方四：表达式字符串

`componentProps` / `decoratorProps` 的字符串叶子支持 <span v-pre>`{{ ... }}`</span> 形式的表达式，适合简单的单向派生，无需写完整 reaction：

```ts
const schema = createSchema({
  count: f.InputNumber({ title: '数量' }),
  total: f.InputNumber({
    title: '总价',
    componentProps: {
      placeholder: '{{$values.count ? "单价 × " + $values.count : "请先填写数量"}}',
      disabled: '{{!$values.count}}',
    },
  }),
})
```

## 配方五：对象式 reactions

需要声明依赖、条件与副作用分离时，使用对象形式。`when` 为条件表达式，`fulfill.state` 描述命中后的字段状态：

```ts
const schema = createSchema({
  needInvoice: f.Switch({ title: '需要发票' }),
  invoiceTitle: f.Input({
    title: '发票抬头',
    reactions: {
      dependencies: ['needInvoice'],
      when: '{{$deps.needInvoice === true}}',
      fulfill: {
        state: { visible: true },
      },
      otherwise: {
        state: { visible: false },
      },
    },
  }),
})
```

## 作用域变量速查

reaction 函数通过字段实例操作；表达式字符串与对象式 reaction 中可直接使用内置作用域：

| 变量 | 说明 |
| --- | --- |
| `$self` | 当前字段 |
| `$form` | 当前表单实例 |
| `$values` | 表单值 |
| `$record` / `$records` / `$index` | 数组项场景下的当前记录、记录数组与下标 |
| `$props` | 当前字段的 `setComponentProps` |
| `$effect` / `$memo` / `$observable` | 高级响应式能力，分别等同 `autorun`、立即求值、转 observable |

完整的 Schema 字段与作用域清单见 [Schema 参考](/guide/schema)。

## 注意事项

- reaction 函数中不要直接写副作用请求（如接口调用），数据请求建议放在外层 effect 或 `onInput` 类回调中，reaction 只负责派生状态。
- 路径查询 `field.query('.xxx')` 中的 `.` 表示同级字段；跨层级查询使用 FormPath 模式字符串。
- reaction 中读到的是字段实例的可观察属性，Vue 侧无需手动 `watch`，赋值后视图会自动更新。
