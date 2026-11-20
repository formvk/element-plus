import { ElTooltip } from 'element-plus'
import { defineComponent, ref } from 'vue'
import type { CSSProperties, PropType } from 'vue'

import { useOverflow } from '../../hooks'

export interface EllipsisTextProps {
  tooltipProps?: Record<string, any>
  style?: CSSProperties
}

/** 单行省略文本，内容溢出时通过 Tooltip 展示完整内容 */
export const EllipsisText = defineComponent<EllipsisTextProps>({
  name: 'EllipsisText',
  inheritAttrs: false,
  props: {
    tooltipProps: Object as PropType<Record<string, any>>,
    style: Object as PropType<CSSProperties>,
  },
  setup(props, { slots }) {
    const { containerRef, contentRef, overflow } = useOverflow<HTMLDivElement, HTMLSpanElement>()
    const open = ref(false)

    return () => (
      <ElTooltip
        {...props.tooltipProps}
        visible={overflow.value && open.value}
        onUpdate:visible={(next: boolean) => {
          open.value = overflow.value ? next : false
        }}
      >
        {{
          content: () => slots.default?.(),
          default: () => (
            <div
              ref={containerRef}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                ...props.style,
              }}
            >
              <span ref={contentRef}>{slots.default?.()}</span>
            </div>
          ),
        }}
      </ElTooltip>
    )
  },
})
