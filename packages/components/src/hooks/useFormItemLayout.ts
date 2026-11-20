import { computed } from 'vue'
import type { VNodeChild } from 'vue'

import type { IFormItemBaseProps } from './useFormLayout'
import { useFormLayout } from './useFormLayout'

export interface IFormItemProps extends IFormItemBaseProps {
  label?: VNodeChild | string
  tooltip?: VNodeChild | string
  addonBefore?: VNodeChild
  addonAfter?: VNodeChild
  extra?: VNodeChild
  feedbackText?: VNodeChild | string[]
  feedbackLayout?: 'loose' | 'terse' | 'popover' | 'none' | (string & {})
  feedbackStatus?: 'error' | 'warning' | 'success' | 'pending' | (string & {})
  feedbackIcon?: VNodeChild
  getPopupContainer?: (node: HTMLElement) => HTMLElement
  asterisk?: boolean
  gridSpan?: number
}

export const useFormItemLayout = (props: IFormItemProps) => {
  const layout = useFormLayout()
  return computed(() => {
    const merged = layout.value
    const layoutType = props.layout ?? merged.layout ?? 'horizontal'
    return {
      ...props,
      layout: layoutType,
      colon: props.colon ?? merged.colon,
      labelAlign:
        layoutType === 'vertical' ? (props.labelAlign ?? 'left') : (props.labelAlign ?? merged.labelAlign ?? 'right'),
      labelWrap: props.labelWrap ?? merged.labelWrap,
      labelWidth: props.labelWidth ?? merged.labelWidth,
      wrapperWidth: props.wrapperWidth ?? merged.wrapperWidth,
      labelCol: props.labelCol ?? merged.labelCol,
      wrapperCol: props.wrapperCol ?? merged.wrapperCol,
      wrapperAlign: props.wrapperAlign ?? merged.wrapperAlign,
      wrapperWrap: props.wrapperWrap ?? merged.wrapperWrap,
      fullness: props.fullness ?? merged.fullness,
      size: props.size ?? merged.size,
      inset: props.inset ?? merged.inset,
      asterisk: props.asterisk,
      bordered: props.bordered ?? merged.bordered,
      feedbackIcon: props.feedbackIcon,
      feedbackLayout: props.feedbackLayout ?? merged.feedbackLayout ?? 'loose',
      tooltipLayout: props.tooltipLayout ?? merged.tooltipLayout ?? 'icon',
      tooltipIcon: props.tooltipIcon ?? merged.tooltipIcon,
    }
  })
}
