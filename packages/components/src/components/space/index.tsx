import { ElSpace } from 'element-plus'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { useFormLayout } from '../../hooks'

export type ISpaceProps = {
  size?: number | string | [number | string, number | string]
  direction?: 'horizontal' | 'vertical'
  wrap?: boolean
  alignment?: 'stretch' | 'center' | 'start' | 'end' | 'baseline'
  fill?: boolean
}

export const Space = defineComponent({
  name: 'Space',
  inheritAttrs: false,
  props: {
    size: {
      type: [Number, String, Array] as PropType<ISpaceProps['size']>,
      default: undefined,
    },
  },
  setup(props, { slots, attrs }) {
    const layout = useFormLayout()
    return () => (
      <ElSpace {...attrs} size={(props.size ?? layout.value?.spaceGap) as any}>
        {slots.default?.()}
      </ElSpace>
    )
  },
})
