/**
 * 1. FormItem网格布局
 * 2. 居中，居右，居左布局
 * 3. 行内布局
 * 4. 吸底布局
 */
import { ElSpace } from 'element-plus'
import { computed, defineComponent, onMounted, ref } from 'vue'
import type { CSSProperties, PropType } from 'vue'

import { cls, usePrefixCls } from '../../shared'
import { BaseItem } from '../form-item'
import type { IFormItemProps } from '../form-item'

type IFormButtonGroupProps = {
  align?: CSSProperties['textAlign']
  gutter?: number
  size?: number | string | [number | string, number | string]
  direction?: 'horizontal' | 'vertical'
  wrap?: boolean
}

type IStickyProps = {
  align?: CSSProperties['textAlign']
  style?: CSSProperties
  class?: string
}

function getDefaultBackground() {
  // have to add to the document in order to use getComputedStyle
  const div = document.createElement('div')
  document.head.appendChild(div)
  const bg = window.getComputedStyle(div).backgroundColor
  document.head.removeChild(div)
  return bg
}

function getInheritedBackgroundColor(el: HTMLElement): string {
  // get default style for current browser
  const defaultStyle = getDefaultBackground() // typically "rgba(0, 0, 0, 0)"
  // get computed color for el
  const backgroundColor = window.getComputedStyle(el).backgroundColor
  // if we got a real value, return it
  if (backgroundColor !== defaultStyle) return backgroundColor
  // if we've reached the top parent el without getting an explicit color, return default
  if (!el.parentElement) return defaultStyle
  // otherwise, recurse and try again on parent element
  return getInheritedBackgroundColor(el.parentElement)
}

const FormButtonGroupItem = defineComponent({
  name: 'FormButtonGroupItem',
  inheritAttrs: false,
  props: {
    gutter: Number as PropType<number>,
  },
  setup(props, { slots, attrs }) {
    return () => {
      const children = slots.default?.() ?? []
      const content = children.length > 1 ? <ElSpace size={props.gutter}>{children}</ElSpace> : children
      return (
        <BaseItem
          {...attrs}
          label=" "
          colon={false}
          style={{
            margin: 0,
            padding: 0,
            ...(attrs.style as CSSProperties),
            width: '100%',
          }}
        >
          {content}
        </BaseItem>
      )
    }
  },
})

const FormButtonGroupSticky = defineComponent({
  name: 'FormButtonGroupSticky',
  inheritAttrs: false,
  props: {
    align: { type: String as PropType<'left' | 'right' | 'center'>, default: 'left' },
  },
  setup(props, { slots, attrs }) {
    const stickyRef = ref<HTMLDivElement>()
    const color = ref('transparent')
    const prefixCls = usePrefixCls('button-group')
    onMounted(() => {
      if (stickyRef.value) {
        const computed = getInheritedBackgroundColor(stickyRef.value)
        if (computed !== color.value) {
          color.value = computed
        }
      }
    })
    const justifyContent = computed(() =>
      props.align === 'left' ? 'flex-start' : props.align === 'right' ? 'flex-end' : 'center'
    )
    return () => (
      <div
        {...attrs}
        class={cls(`${prefixCls}-sticky`, attrs.class as string)}
        style={{
          backgroundColor: color.value,
          ...(attrs.style as CSSProperties),
        }}
      >
        <div
          ref={stickyRef}
          class={`${prefixCls}-sticky-inner`}
          style={{
            ...(attrs.style as CSSProperties),
            justifyContent: justifyContent.value,
          }}
        >
          {slots.default?.()}
        </div>
      </div>
    )
  },
})

const InternalFormButtonGroup = defineComponent({
  name: 'FormButtonGroup',
  inheritAttrs: false,
  props: {
    align: { type: String as PropType<'left' | 'right' | 'center'>, default: 'left' },
    gutter: Number as PropType<number>,
  },
  setup(props, { slots, attrs }) {
    const prefixCls = usePrefixCls('button-group')
    const justifyContent = computed(() =>
      props.align === 'left' ? 'flex-start' : props.align === 'right' ? 'flex-end' : 'center'
    )
    return () => (
      <ElSpace
        {...attrs}
        size={props.gutter}
        class={cls(prefixCls, attrs.class as string)}
        style={{
          ...(attrs.style as CSSProperties),
          justifyContent: justifyContent.value,
          display: 'flex',
        }}
      >
        {slots.default?.()}
      </ElSpace>
    )
  },
})

export const FormButtonGroup: typeof InternalFormButtonGroup & {
  FormItem: typeof FormButtonGroupItem
  Sticky: typeof FormButtonGroupSticky
} = Object.assign(InternalFormButtonGroup, {
  FormItem: FormButtonGroupItem,
  Sticky: FormButtonGroupSticky,
})

export type { IFormButtonGroupProps, IFormItemProps, IStickyProps }
