# DatePicker

日期选择组件，基于 Element Plus `DatePicker` 封装。字段值为格式化后的**字符串**，内核会在 `dayjs` 与字符串之间自动转换。阅读态自动切换为 `TextDatePicker`。

<demo vue="../demos/date-picker.vue" title="type / format / DateRangePicker" description="日期、月份、年份、日期时间与范围选择，含 readPretty 阅读态" />

## 何时使用

- 需要录入日期、月份、年份或日期时间。
- 需要选择一个时间区间时使用同包导出的 `DateRangePicker`。
- 字段值需要直接提交给后端、不希望在业务层处理 `dayjs` 对象时。

## 属性

继承 Element Plus [`DatePicker`](https://element-plus.org/zh-CN/component/date-picker.html) 的属性，未列出的属性与 `ElDatePicker` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `modelValue` | `string` | 字段值（字符串），由内核注入并自动转换为 `dayjs` |
| `type` | `'date' \| 'datetime' \| 'week' \| 'month' \| 'year' \| 'daterange' \| 'datetimerange'` | 选择器类型 |
| `showTime` | `boolean` | 是否附加时间选择，为 `true` 时 `type` 取 `datetime` |
| `format` | `string` | 展示格式，不传时按 `type` / `picker` 推导默认值 |
| `valueFormat` | `string` | 绑定值的格式，默认与 `format` 一致 |
| `picker` | `'date' \| 'week' \| 'month' \| 'year'` | 选择器粒度，与 `type` 二选一 |
| `disabled` | `boolean` | 禁用选择 |

### DateRangePicker

`DateRangePicker` 为独立具名导出，字段值为 `[string, string]`，属性与 Element Plus 范围选择器一致。

默认格式推导规则：

| type / picker | 默认 format |
| --- | --- |
| `date` | `YYYY-MM-DD` |
| `month` | `YYYY-MM` |
| `year` | `YYYY` |
| `week` | `YYYY-ww` |
| `datetime` / `datetimerange` | `YYYY-MM-DD HH:mm:ss` |

## 阅读态

`readPretty` 模式下，`DatePicker` 与 `DateRangePicker` 分别切换为 `TextDatePicker` / `TextDateRangePicker`，按 `format` 格式化展示；范围值以 `~` 连接，空值展示 `previewTextPlaceholder`。
