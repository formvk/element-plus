import SortableJS from 'sortablejs'
import { defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue'

import { usePrefixCls } from '../hooks/usePrefixCls'

export interface ISortableContainerProps {
  list: any[]
  start?: number
  /** 拖拽手柄选择器，为空时整项可拖拽 */
  handle?: string
  /** 渲染标签，表格场景可传 tbody */
  tag?: string
  onSortStart?: (event: { oldIndex: number; newIndex: number }) => void
  onSortEnd?: (event: { oldIndex: number; newIndex: number }) => void
  sortableOptions?: Record<string, any>
}

/**
 * 基于 SortableJS 的排序容器。
 * 数组项使用 data-array-index 标记，拖拽结束后把索引（含 start 偏移）交给调用方写回字段。
 */
export const SortableContainer = defineComponent({
  name: 'SortableContainer',
  inheritAttrs: false,
  props: {
    list: { type: Array, default: () => [] },
    start: { type: Number, default: 0 },
    handle: String,
    tag: { type: String, default: 'div' },
    onSortStart: Function,
    onSortEnd: Function,
    sortableOptions: Object,
  },
  setup(props, { slots, attrs }) {
    const prefixCls = usePrefixCls()
    const containerRef = ref<HTMLElement>()
    let sortable: SortableJS | null = null

    onMounted(() => {
      if (!containerRef.value) return
      sortable = SortableJS.create(containerRef.value, {
        animation: 150,
        handle: props.handle || `.${prefixCls}-array-base-sort-handle`,
        ghostClass: `${prefixCls}-sort-ghost`,
        chosenClass: `${prefixCls}-sort-chosen`,
        dragClass: `${prefixCls}-sort-drag`,
        ...props.sortableOptions,
        onStart: event => {
          props.onSortStart?.({ oldIndex: event.oldIndex ?? 0, newIndex: event.newIndex ?? 0 })
        },
        onEnd: event => {
          const oldIndex = (event.oldIndex ?? 0) + props.start
          const newIndex = (event.newIndex ?? 0) + props.start
          props.onSortEnd?.({ oldIndex, newIndex })
        },
      })
    })

    onBeforeUnmount(() => sortable?.destroy())

    return () => h(props.tag, { ref: containerRef, ...attrs }, slots.default?.())
  },
})
