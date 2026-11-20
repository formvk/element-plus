import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

import { useFormLayout } from './useFormLayout'

export function useOverflow<Container extends HTMLElement, Content extends HTMLElement>() {
  const overflow = ref(false)
  const containerRef = ref<Container>() as Ref<Container>
  const contentRef = ref<Content>() as Ref<Content>
  const layout = useFormLayout()
  const labelCol = () => JSON.stringify(layout.value.labelCol)

  let frame = 0
  let resizeObserver: ResizeObserver | null = null

  const measure = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      if (containerRef.value && contentRef.value) {
        const contentWidth = contentRef.value.getBoundingClientRect().width
        const containerWidth = containerRef.value.getBoundingClientRect().width
        if (contentWidth && containerWidth && containerWidth < contentWidth) {
          overflow.value = true
        } else {
          overflow.value = false
        }
      }
    })
  }

  onMounted(() => {
    measure()
    if (typeof ResizeObserver !== 'undefined' && containerRef.value) {
      resizeObserver = new ResizeObserver(() => measure())
      resizeObserver.observe(containerRef.value)
    }
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    resizeObserver?.disconnect()
  })

  // labelCol 只作为布局变化的重测触发器，测量本身在 DOM 上完成
  watch(labelCol, () => measure())

  return {
    overflow,
    containerRef,
    contentRef,
  }
}
