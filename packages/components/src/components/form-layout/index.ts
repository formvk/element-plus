import { isValid } from '@formvk/shared'
import { computed, defineComponent, h, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import type { CSSProperties, PropType } from 'vue'

import { FormLayoutDeepContext, FormLayoutShallowContext, useFormDeepLayout } from '../../hooks'
import type { IFormLayoutContext, IFormLayoutProps } from '../../hooks'
import { usePrefixCls } from '../../shared'
import { cls } from '../../shared'

export type { IFormItemBaseProps, IFormLayoutContext, IFormLayoutProps, IFormItemProps } from '../../hooks'
export { useFormDeepLayout, useFormLayout, useFormShallowLayout } from '../../hooks'
export { FormLayoutDeepContext, FormLayoutShallowContext } from '../../hooks'

const calcBreakpointIndex = (breakpoints: number[] | undefined, width: number) => {
  if (!breakpoints) return undefined
  for (let i = 0; i < breakpoints.length; i++) {
    if (width <= breakpoints[i]) return i
  }
  return undefined
}

const calcFactor = <T>(value: T | T[], breakpointIndex?: number): T => {
  if (Array.isArray(value)) {
    if (breakpointIndex === -1) return value[0]
    return value[breakpointIndex || value.length - 1] ?? value[value.length - 1]
  }
  return value
}

const factor = <T>(value: T | T[], breakpointIndex?: number): T =>
  isValid(value) ? calcFactor(value, breakpointIndex) : (value as T)

const stringOrNumber = [String, Number] as PropType<any>
const booleanOrUndefined = { type: Boolean, default: undefined }

export const FormLayout = defineComponent({
  name: 'FormLayout',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    colon: booleanOrUndefined,
    labelWrap: booleanOrUndefined,
    wrapperWrap: booleanOrUndefined,
    fullness: booleanOrUndefined,
    size: String as PropType<IFormLayoutProps['size'] & string>,
    inset: booleanOrUndefined,
    bordered: booleanOrUndefined,
    tooltipLayout: String as PropType<IFormLayoutProps['tooltipLayout']>,
    tooltipIcon: { type: null as unknown as PropType<any>, default: undefined },
    labelWidth: stringOrNumber,
    wrapperWidth: stringOrNumber,
    layout: { type: [String, Array] as PropType<any>, default: undefined },
    labelAlign: { type: [String, Array] as PropType<any>, default: undefined },
    wrapperAlign: { type: [String, Array] as PropType<any>, default: undefined },
    labelCol: { type: [Number, Array] as PropType<any>, default: undefined },
    wrapperCol: { type: [Number, Array] as PropType<any>, default: undefined },
    labelStyle: Object as PropType<CSSProperties>,
    wrapperStyle: Object as PropType<CSSProperties>,
    direction: String as PropType<'rtl' | 'ltr'>,
    shallow: { type: Boolean, default: true },
    feedbackLayout: String as PropType<IFormLayoutProps['feedbackLayout']>,
    breakpoints: Array as PropType<number[]>,
    spaceGap: Number,
    gridColumnGap: Number,
    gridRowGap: Number,
  },
  setup(props, { slots, attrs }) {
    const width = ref(0)
    const elementRef = ref<HTMLDivElement>()
    let resizeObserver: ResizeObserver | null = null

    onMounted(() => {
      if (!props.breakpoints || !elementRef.value) return
      const measure = () => {
        if (elementRef.value) {
          width.value = elementRef.value.clientWidth
        }
      }
      measure()
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(measure)
        resizeObserver.observe(elementRef.value)
      }
    })

    onBeforeUnmount(() => resizeObserver?.disconnect())

    const resolved = computed<IFormLayoutContext>(() => {
      const breakpointIndex = props.breakpoints ? calcBreakpointIndex(props.breakpoints, width.value) : undefined
      return {
        ...(props as unknown as IFormLayoutContext),
        layout: factor(props.layout, breakpointIndex),
        labelAlign: factor(props.labelAlign, breakpointIndex),
        wrapperAlign: factor(props.wrapperAlign, breakpointIndex),
        labelCol: factor(props.labelCol, breakpointIndex),
        wrapperCol: factor(props.wrapperCol, breakpointIndex),
      }
    })

    const deepLayout = useFormDeepLayout()
    const newDeepLayout = computed<IFormLayoutContext>(() => {
      const layout: IFormLayoutContext = {
        ...deepLayout.value,
      }
      if (!props.shallow) {
        Object.assign(layout, resolved.value)
      } else {
        if (resolved.value.size) layout.size = resolved.value.size
        if (resolved.value.colon) layout.colon = resolved.value.colon
      }
      return layout
    })

    provide(FormLayoutDeepContext, newDeepLayout)
    provide(
      FormLayoutShallowContext,
      computed(() => (props.shallow ? resolved.value : ({} as IFormLayoutContext)))
    )

    const formPrefixCls = usePrefixCls('form', props)
    const layoutPrefixCls = usePrefixCls('layout', props)

    return () => {
      const layoutProps = resolved.value
      return h(
        'div',
        {
          ...attrs,
          ref: elementRef,
          class: cls(
            layoutPrefixCls,
            {
              [`${formPrefixCls}-${layoutProps.layout}`]: true,
              [`${formPrefixCls}-rtl`]: layoutProps.direction === 'rtl',
              [`${formPrefixCls}-${layoutProps.size}`]: layoutProps.size,
            },
            attrs.class as string
          ),
          style: attrs.style as CSSProperties,
        },
        slots.default?.()
      )
    }
  },
})

// 兼容按需导入的类型使用方
export type { IFormLayoutProps as FormLayoutProps }
