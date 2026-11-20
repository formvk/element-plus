# 组件总览

`@formvk/element-plus` 提供与 formily-element-plus 对齐的表单组件桥接层，基于 Element Plus。每个组件都提供独立文档与可运行示例，左侧菜单按「表单与布局 / 基础字段 / 数组组件 / 高级组件」分组。

## 表单与布局

| 组件                                             | 说明                                         |
| ------------------------------------------------ | -------------------------------------------- |
| [Form](/components/form)                         | 表单容器，提供表单实例与默认布局             |
| [FormItem](/components/form-item)               | 字段装饰器，负责 label、校验反馈与布局       |
| [FormLayout](/components/form-layout)           | 布局配置容器，支持响应式断点                 |
| [FormGrid](/components/form-grid)               | 响应式栅格布局                               |
| [FormButtonGroup](/components/form-button-group) | 按钮组，支持吸附底部                         |
| [Submit](/components/submit)                     | 提交按钮                                     |
| [Reset](/components/reset)                       | 重置按钮                                     |
| [Space](/components/space)                       | 间距容器，默认间距取自 `FormLayout.spaceGap` |

## 基础字段

| 组件                                  | 说明                                    |
| ------------------------------------- | --------------------------------------- |
| [Input](/components/input)            | 单行输入，多行使用独立的 `TextArea`     |
| [Password](/components/password)      | 密码输入，可显示强度提示                |
| [InputNumber](/components/input-number) | 数字输入                              |
| [Select](/components/select)          | 下拉选择                                |
| [Radio](/components/radio)            | 单选框，分组使用 `RadioGroup`           |
| [Checkbox](/components/checkbox)      | 复选框，分组使用 `CheckboxGroup`        |
| [Switch](/components/switch)          | 开关                                    |
| [DatePicker](/components/date-picker) | 日期选择，范围使用 `DateRangePicker`    |
| [TimePicker](/components/time-picker) | 时间选择，范围使用 `TimeRangePicker`    |
| [Cascader](/components/cascader)      | 级联选择                                |
| [TreeSelect](/components/tree-select) | 树选择                                  |
| [Transfer](/components/transfer)      | 穿梭框                                  |
| [Upload](/components/upload)          | 上传，拖拽使用 `UploadDragger`          |
| [Text](/components/preview-text)      | 阅读态文本渲染                          |

## 数组组件

数组组件包括 `ArrayBase`、`ArrayItems`、`ArrayCards`、`ArrayCollapse`、`ArrayTabs`、`ArrayTable` 与 `SelectTable`，详见左侧「数组组件」分组。

## 高级组件

| 组件                                       | 说明                |
| ------------------------------------------ | ------------------- |
| [Editable](/components/editable)           | 内联编辑 / 弹层编辑 |
| [FormTab](/components/form-tab)            | 标签页布局          |
| [FormCollapse](/components/form-collapse)  | 折叠面板布局        |
| [FormStep](/components/form-step)          | 分步表单            |

::: tip
弹窗表单、CRUD 表格等组合场景由容器提供，见左侧「容器」分组。
:::
