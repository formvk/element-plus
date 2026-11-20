import { computed, defineComponent, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import type { CSSProperties, PropType } from 'vue'

import { FormGridContext, useFormLayout } from '../../hooks'
import { pickDataProps, usePrefixCls } from '../../shared'
import { cls } from '../../shared'
import { createGrid, Grid } from './grid'
import type { IGridOptions } from './grid'

export { createGrid, Grid } from './grid'
export type { GridNode } from './grid'
export { useFormGrid } from '../../hooks'

export interface IFormGridProps extends IGridOptions {
  grid?: Grid<HTMLElement>
  prefixCls?: string
}

export interface IGridColumnProps {
  gridSpan?: number
  style?: CSSProperties
}

export const createFormGrid = (props: IFormGridProps) => {
  return new Grid(props)
}

const numberOrArray = [Number, Array] as PropType<number | number[]>
const booleanOrUndefined = { type: Boolean, default: undefined }

const GRID_OPTION_KEYS: (keyof IGridOptions)[] = [
  'maxRows',
  'maxColumns',
  'minColumns',
  'maxWidth',
  'minWidth',
  'breakpoints',
  'columnGap',
  'rowGap',
  'colWrap',
  'strictAutoFit',
  'shouldVisible',
  'onDigest',
  'onInitialized',
]

const compactOptions = (options: Record<string, any>): IGridOptions => {
  return GRID_OPTION_KEYS.reduce((buf, key) => {
    if (options[key] !== undefined) {
      ;(buf as any)[key] = options[key]
    }
    return buf
  }, {} as IGridOptions)
}

export const FormGrid = defineComponent({
  name: 'FormGrid',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    grid: Object as PropType<Grid<HTMLElement>>,
    maxRows: Number,
    maxColumns: numberOrArray,
    minColumns: numberOrArray,
    maxWidth: numberOrArray,
    minWidth: numberOrArray,
    breakpoints: Array as PropType<number[]>,
    columnGap: Number,
    rowGap: Number,
    colWrap: booleanOrUndefined,
    strictAutoFit: booleanOrUndefined,
    shouldVisible: Function as PropType<IGridOptions['shouldVisible']>,
    onDigest: Function as PropType<IGridOptions['onDigest']>,
    onInitialized: Function as PropType<IGridOptions['onInitialized']>,
  },
  setup(props, { slots, attrs }) {
    const layout = useFormLayout()
    const prefixCls = usePrefixCls('grid', props)
    const containerRef = ref<HTMLDivElement>()
    const internalGrid = createGrid<HTMLElement>()

    const options = computed<IGridOptions>(() =>
      compactOptions({
        columnGap: layout.value?.gridColumnGap ?? 8,
        rowGap: layout.value?.gridRowGap ?? 4,
        maxRows: props.maxRows,
        maxColumns: props.maxColumns,
        minColumns: props.minColumns,
        maxWidth: props.maxWidth,
        minWidth: props.minWidth,
        breakpoints: props.breakpoints,
        colWrap: props.colWrap,
        strictAutoFit: props.strictAutoFit,
        shouldVisible: props.shouldVisible,
        onDigest: props.onDigest,
        onInitialized: props.onInitialized,
      })
    )

    const grid = computed(() => props.grid ?? internalGrid)

    watch(
      options,
      value => {
        if (!props.grid) {
          internalGrid.options = value
        }
      },
      { immediate: true }
    )

    provide(FormGridContext, grid.value)

    let dispose: (() => void) | undefined
    const connect = (element?: HTMLElement) => {
      dispose?.()
      dispose = undefined
      if (element) {
        dispose = grid.value.connect(element)
      }
    }

    onMounted(() => {
      connect(containerRef.value)
    })

    onBeforeUnmount(() => {
      connect()
    })

    watch(grid, () => {
      connect(containerRef.value)
    })

    return () => (
      <div
        {...pickDataProps(attrs)}
        class={cls(attrs.class as string, `${prefixCls}-layout`)}
        style={{
          ...(attrs.style as CSSProperties),
          gridTemplateColumns: grid.value.templateColumns,
          gap: grid.value.gap,
        }}
        ref={containerRef}
      >
        {slots.default?.()}
      </div>
    )
  },
})

export const GridColumn = defineComponent({
  name: 'GridColumn',
  props: {
    gridSpan: { type: Number, default: 1 },
  },
  setup(props, { slots, attrs }) {
    return () => (
      <div {...attrs} data-grid-span={props.gridSpan}>
        {slots.default?.()}
      </div>
    )
  },
})
