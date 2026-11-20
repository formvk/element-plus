import Sortable from 'sortablejs'
import { defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue'

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
    handle: { type: String, default: '.formvk-array-base-sort-handle' },
    tag: { type: String, default: 'div' },
    onSortStart: Function,
    onSortEnd: Function,
    sortableOptions: Object,
  },
  setup(props, { slots, attrs }) {
    const containerRef = ref<HTMLElement>()
    let sortable: Sortable | null = null

    onMounted(() => {
      if (!containerRef.value) return
      sortable = Sortable.create(containerRef.value, {
        animation: 150,
        handle: props.handle,
        ghostClass: 'formvk-sort-ghost',
        chosenClass: 'formvk-sort-chosen',
        dragClass: 'formvk-sort-drag',
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

/** 排序手柄统一类名，Sortable 通过该选择器限定拖拽区域 */
export const SORT_HANDLE_CLASS = 'formvk-array-base-sort-handle'
