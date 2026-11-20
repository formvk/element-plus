import { connect, mapReadPretty } from '@formvk/vue'
import { ElDatePicker } from 'element-plus'
import type { DatePickerPropsPublic } from 'element-plus'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { TextDatePicker, TextDateRangePicker } from '../preview-text'

type DatePickerWrapperProps = DatePickerPropsPublic & {
  /** 快捷选择器类型，用于推导默认 format */
  picker?: string
  /** 是否启用时间选择，等价于 type="datetime" */
  showTime?: boolean
}

const getDefaultFormat = (type: string, picker?: string) => {
  if (picker === 'month' || type === 'month') return 'YYYY-MM'
  if (picker === 'year' || type === 'year') return 'YYYY'
  if (picker === 'week' || type === 'week') return 'YYYY-ww'
  if (type === 'datetime' || type === 'datetimerange') return 'YYYY-MM-DD HH:mm:ss'
  return 'YYYY-MM-DD'
}

const createDatePicker = (defaultType: string, name: string) =>
  defineComponent<DatePickerWrapperProps>({
    name,
    inheritAttrs: false,
    props: {
      picker: String,
      format: { type: null as unknown as PropType<any>, default: undefined },
      valueFormat: { type: null as unknown as PropType<any>, default: undefined },
      showTime: Boolean,
    },
    setup(props, { attrs, slots }) {
      return () => {
        const type = (attrs.type as string) ?? (props.showTime ? 'datetime' : defaultType)
        const format = props.format ?? getDefaultFormat(type, props.picker)
        return (
          <ElDatePicker {...attrs} type={type as any} format={format} valueFormat={props.valueFormat ?? format}>
            {slots}
          </ElDatePicker>
        )
      }
    },
  })

export const DatePicker = connect(createDatePicker('date', 'DatePicker'), mapReadPretty(TextDatePicker))

export const DateRangePicker = connect(
  createDatePicker('daterange', 'DateRangePicker'),
  mapReadPretty(TextDateRangePicker)
)
