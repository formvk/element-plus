import { connect, mapReadPretty } from '@formvk/vue'
import { ElTimePicker } from 'element-plus'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { TextTimePicker, TextTimeRangePicker } from '../preview-text'

const createTimePicker = (range: boolean, name: string) =>
  defineComponent({
    name,
    inheritAttrs: false,
    props: {
      format: { type: null as unknown as PropType<any>, default: undefined },
      valueFormat: { type: null as unknown as PropType<any>, default: undefined },
    },
    setup(props, { attrs, slots }) {
      return () => {
        const format = props.format ?? 'HH:mm:ss'
        return (
          <ElTimePicker {...attrs} isRange={range} format={format} valueFormat={props.valueFormat ?? format}>
            {slots}
          </ElTimePicker>
        )
      }
    },
  })

export const TimePicker = connect(createTimePicker(false, 'TimePicker'), mapReadPretty(TextTimePicker))

export const TimeRangePicker = connect(createTimePicker(true, 'TimeRangePicker'), mapReadPretty(TextTimeRangePicker))
