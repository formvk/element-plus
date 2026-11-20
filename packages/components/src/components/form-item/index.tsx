import { CircleCheck, CircleClose, QuestionFilled, Warning } from '@element-plus/icons-vue'
import { isVoidField } from '@formvk/core'
import { connect, mapProps } from '@formvk/vue'
import { ElTooltip } from 'element-plus'
import { computed, defineComponent, h, provide, ref } from 'vue'
import type { CSSProperties, PropType, VNodeChild } from 'vue'

import { useFormItemLayout, useOverflow } from '../../hooks'
import type { IFormItemProps } from '../../hooks'
import { pickDataProps, usePrefixCls } from '../../shared'
import { cls } from '../../shared'
import { FormLayoutShallowContext } from '../form-layout'

export * from './hooks'

const ICON_MAP: Record<string, any> = {
  error: CircleClose,
  success: CircleCheck,
  warning: Warning,
}

const EMPTY_LAYOUT = {}

/**
 * 清空浅层布局上下文：FormItem 内部组件不再继承外层布局配置。
 * Vue 没有 Context.Provider 语法，用一个只做 provide 的包装组件替代。
 */
const EmptyLayoutProvider = defineComponent({
  name: 'FormItemEmptyLayoutProvider',
  setup(_, { slots }) {
    provide(
      FormLayoutShallowContext,
      computed(() => EMPTY_LAYOUT)
    )
    return () => slots.default?.()
  },
})

const anyProp = { type: null as unknown as PropType<any>, default: undefined }
const booleanOrUndefined = { type: Boolean, default: undefined }

export const BaseItem = defineComponent({
  name: 'BaseItem',
  inheritAttrs: false,
  props: {
    label: anyProp,
    tooltip: anyProp,
    labelStyle: Object as PropType<CSSProperties>,
    wrapperStyle: Object as PropType<CSSProperties>,
    addonBefore: anyProp,
    addonAfter: anyProp,
    extra: anyProp,
    feedbackText: anyProp,
    feedbackLayout: String as PropType<IFormItemProps['feedbackLayout']>,
    feedbackStatus: String as PropType<IFormItemProps['feedbackStatus']>,
    feedbackIcon: anyProp,
    getPopupContainer: Function as PropType<(node: HTMLElement) => HTMLElement>,
    asterisk: booleanOrUndefined,
    gridSpan: Number,
    prefixCls: String,
    colon: booleanOrUndefined,
    labelWrap: booleanOrUndefined,
    wrapperWrap: booleanOrUndefined,
    fullness: booleanOrUndefined,
    size: String as PropType<IFormItemProps['size']>,
    inset: booleanOrUndefined,
    bordered: booleanOrUndefined,
    tooltipLayout: String as PropType<IFormItemProps['tooltipLayout']>,
    tooltipIcon: anyProp,
    labelWidth: [String, Number] as PropType<string | number>,
    wrapperWidth: [String, Number] as PropType<string | number>,
    layout: String as PropType<IFormItemProps['layout']>,
    labelAlign: String as PropType<IFormItemProps['labelAlign']>,
    wrapperAlign: String as PropType<IFormItemProps['wrapperAlign']>,
    labelCol: Number,
    wrapperCol: Number,
  },
  setup(props, { slots, attrs }) {
    const active = ref(false)
    const formLayout = useFormItemLayout(props as IFormItemProps)
    const { containerRef, contentRef, overflow } = useOverflow<HTMLDivElement, HTMLSpanElement>()
    const prefixCls = usePrefixCls('item', props)

    const merged = computed(() => {
      const layout = formLayout.value
      return {
        ...layout,
        colon: layout.colon ?? true,
        bordered: layout.bordered ?? true,
        wrapperAlign: layout.wrapperAlign ?? 'left',
      }
    })

    const labelStyle = computed<CSSProperties>(() => {
      const style = { ...(merged.value.labelStyle || {}) }
      const layout = merged.value
      if (layout.labelWidth) {
        style.width = layout.labelWidth === 'auto' ? undefined : (layout.labelWidth as any)
        style.maxWidth = layout.labelWidth === 'auto' ? undefined : (layout.labelWidth as any)
      }
      return style
    })

    const wrapperStyle = computed<CSSProperties>(() => {
      const style = { ...(merged.value.wrapperStyle || {}) }
      const layout = merged.value
      if (layout.wrapperWidth) {
        style.width = layout.wrapperWidth === 'auto' ? undefined : (layout.wrapperWidth as any)
        style.maxWidth = layout.wrapperWidth === 'auto' ? undefined : (layout.wrapperWidth as any)
      }
      return style
    })

    const enableCol = computed(() => {
      const layout = merged.value
      if (!(layout.labelCol || layout.wrapperCol)) return false
      return !labelStyle.value.width && !wrapperStyle.value.width && layout.layout !== 'vertical'
    })

    const renderFeedbackStatusIcon = () => {
      const status = merged.value.feedbackStatus
      const Icon = status ? ICON_MAP[status] : null
      return Icon ? <Icon /> : null
    }

    const renderOverflowTooltip = () => (
      <div>
        <div>{merged.value.label}</div>
        <div>{merged.value.tooltip}</div>
      </div>
    )

    const renderLabelText = () => {
      const layout = merged.value
      const labelChildren = (
        <div class={`${prefixCls}-label-content`} ref={containerRef}>
          <span ref={contentRef}>
            {layout.asterisk && <span class={`${prefixCls}-asterisk`}>{'*'}</span>}
            <label>{layout.label}</label>
          </span>
        </div>
      )

      if ((layout.tooltipLayout === 'text' && layout.tooltip) || overflow.value) {
        return (
          <ElTooltip placement="top" persistent={false}>
            {{
              content: () => (overflow.value ? renderOverflowTooltip() : layout.tooltip),
              default: () => labelChildren,
            }}
          </ElTooltip>
        )
      }
      return labelChildren
    }

    const renderTooltipIcon = () => {
      const layout = merged.value
      if (layout.tooltip && layout.tooltipLayout === 'icon' && !overflow.value) {
        return (
          <span class={`${prefixCls}-label-tooltip-icon`}>
            <ElTooltip placement="top" persistent={false}>
              {{
                content: () => layout.tooltip,
                default: () => layout.tooltipIcon ?? h(QuestionFilled),
              }}
            </ElTooltip>
          </span>
        )
      }
      return null
    }

    const renderLabel = () => {
      const layout = merged.value
      if (!layout.label) return null
      return (
        <div
          class={cls({
            [`${prefixCls}-label`]: true,
            [`${prefixCls}-label-tooltip`]: !!((layout.tooltip && layout.tooltipLayout === 'text') || overflow.value),
            [`${prefixCls}-item-col-${layout.labelCol}`]: enableCol.value && !!layout.labelCol,
          })}
          style={labelStyle.value}
        >
          {renderLabelText()}
          {renderTooltipIcon()}
          {layout.label !== ' ' && <span class={`${prefixCls}-colon`}>{layout.colon ? ':' : ''}</span>}
        </div>
      )
    }

    const renderContent = () => slots.default?.()

    const renderFeedback = () => {
      const layout = merged.value
      if (layout.feedbackLayout === 'popover') {
        return (
          <ElTooltip placement="top" visible={!!layout.feedbackText} persistent={false}>
            {{
              content: () => (
                <div
                  class={cls({
                    [`${prefixCls}-${layout.feedbackStatus}-help`]: !!layout.feedbackStatus,
                    [`${prefixCls}-help`]: true,
                  })}
                >
                  {renderFeedbackStatusIcon()} {layout.feedbackText}
                </div>
              ),
              default: () => renderContent(),
            }}
          </ElTooltip>
        )
      }
      return renderContent()
    }

    return () => {
      const layout = merged.value
      return (
        <div
          {...pickDataProps(attrs)}
          style={attrs.style as CSSProperties}
          data-grid-span={props.gridSpan}
          class={cls(attrs.class as string, {
            [`${prefixCls}`]: true,
            [`${prefixCls}-layout-${layout.layout}`]: true,
            [`${prefixCls}-${layout.feedbackStatus}`]: !!layout.feedbackStatus,
            [`${prefixCls}-feedback-has-text`]: !!layout.feedbackText,
            [`${prefixCls}-size-${layout.size}`]: !!layout.size,
            [`${prefixCls}-feedback-layout-${layout.feedbackLayout}`]: !!layout.feedbackLayout,
            [`${prefixCls}-fullness`]: !!layout.fullness || !!layout.inset || !!layout.feedbackIcon,
            [`${prefixCls}-inset`]: !!layout.inset,
            [`${prefixCls}-active`]: active.value,
            [`${prefixCls}-inset-active`]: !!layout.inset && active.value,
            [`${prefixCls}-label-align-${layout.labelAlign}`]: true,
            [`${prefixCls}-control-align-${layout.wrapperAlign}`]: true,
            [`${prefixCls}-label-wrap`]: !!layout.labelWrap,
            [`${prefixCls}-control-wrap`]: !!layout.wrapperWrap,
            [`${prefixCls}-bordered-none`]: layout.bordered === false || !!layout.inset || !!layout.feedbackIcon,
          })}
          onFocusin={() => {
            if (layout.feedbackIcon || layout.inset) {
              active.value = true
            }
          }}
          onFocusout={() => {
            if (layout.feedbackIcon || layout.inset) {
              active.value = false
            }
          }}
        >
          {renderLabel()}
          <div
            class={cls({
              [`${prefixCls}-control`]: true,
              [`${prefixCls}-item-col-${layout.wrapperCol}`]: enableCol.value && !!layout.wrapperCol && !!layout.label,
            })}
          >
            <div class={cls(`${prefixCls}-control-content`)}>
              {layout.addonBefore && <div class={cls(`${prefixCls}-addon-before`)}>{layout.addonBefore}</div>}
              <div
                style={wrapperStyle.value}
                class={cls({
                  [`${prefixCls}-control-content-component`]: true,
                  [`${prefixCls}-control-content-component-has-feedback-icon`]: !!layout.feedbackIcon,
                })}
              >
                <EmptyLayoutProvider>{renderFeedback()}</EmptyLayoutProvider>
                {layout.feedbackIcon && <div class={cls(`${prefixCls}-feedback-icon`)}>{layout.feedbackIcon}</div>}
              </div>
              {layout.addonAfter && <div class={cls(`${prefixCls}-addon-after`)}>{layout.addonAfter}</div>}
            </div>
            {!!layout.feedbackText && layout.feedbackLayout !== 'popover' && layout.feedbackLayout !== 'none' && (
              <div
                class={cls({
                  [`${prefixCls}-${layout.feedbackStatus}-help`]: !!layout.feedbackStatus,
                  [`${prefixCls}-help`]: true,
                  [`${prefixCls}-help-enter`]: true,
                  [`${prefixCls}-help-enter-active`]: true,
                })}
              >
                {layout.feedbackText as VNodeChild}
              </div>
            )}
            {layout.extra && <div class={cls(`${prefixCls}-extra`)}>{layout.extra}</div>}
          </div>
        </div>
      )
    }
  },
})

// 适配：把字段状态映射成 BaseItem 的展示属性
export const FormItem = connect(
  BaseItem,
  mapProps((props, field) => {
    if (isVoidField(field))
      return {
        ...props,
        label: field.title || props.label,
        asterisk: props.asterisk,
        extra: props.extra || field.description,
      }
    if (!field) return props
    const takeFeedbackStatus = () => {
      if (field.validating) return 'pending'
      return field.decoratorProps.feedbackStatus || field.validateStatus
    }
    const takeMessage = () => {
      const split = (messages: any[]) => {
        return messages.reduce((buf, text, index) => {
          if (!text) return buf
          return index < messages.length - 1 ? buf.concat([text, ', ']) : buf.concat([text])
        }, [])
      }
      if (field.validating) return
      if (props.feedbackText) return props.feedbackText
      if (field.selfErrors.length) return split(field.selfErrors)
      if (field.selfWarnings.length) return split(field.selfWarnings)
      if (field.selfSuccesses.length) return split(field.selfSuccesses)
    }
    const takeAsterisk = () => {
      if ('asterisk' in props) {
        return props.asterisk
      }
      if (field.required && field.pattern !== 'readPretty') {
        return true
      }
      return false
    }
    return {
      ...props,
      label: props.label || field.title,
      feedbackStatus: takeFeedbackStatus(),
      feedbackText: takeMessage(),
      asterisk: takeAsterisk(),
      extra: props.extra || field.description,
    }
  })
)
