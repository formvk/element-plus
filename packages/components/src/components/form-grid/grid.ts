import { reactive } from 'vue'

export interface IGridOptions {
  maxRows?: number
  maxColumns?: number | number[]
  minColumns?: number | number[]
  maxWidth?: number | number[]
  minWidth?: number | number[]
  breakpoints?: number[]
  columnGap?: number
  rowGap?: number
  colWrap?: boolean
  strictAutoFit?: boolean
  shouldVisible?: (node: GridNode, grid: Grid<HTMLElement>) => boolean
  onDigest?: (grid: Grid<HTMLElement>) => void
  onInitialized?: (grid: Grid<HTMLElement>) => void
}

const SpanRegExp = /span\s*(\d+)/

const isValid = (value: any) => value !== undefined && value !== null

const calcBreakpointIndex = (breakpoints: number[], width: number) => {
  if (Array.isArray(breakpoints)) {
    for (let i = 0; i < breakpoints.length; i++) {
      if (width <= breakpoints[i]) {
        return i
      }
    }
  }
  return -1
}

const calcFactor = <T>(value: T | T[], breakpointIndex: number): T => {
  if (Array.isArray(value)) {
    if (breakpointIndex === -1) return value[0]
    return value[breakpointIndex] ?? value[value.length - 1]
  }
  return value
}

const parseGridNode = (elements: HTMLCollection): GridNode[] => {
  return Array.from(elements).reduce<GridNode[]>((buf, element, index) => {
    const el = element as HTMLElement
    const style = getComputedStyle(el)
    const visible = !(style.display === 'none')
    const origin = el.getAttribute('data-grid-span')
    const span = parseSpan(style.gridColumnStart) ?? 1
    const originSpan = Number(origin ?? span)
    const node: GridNode = {
      index,
      span,
      visible,
      originSpan,
      element: el,
    }
    if (!origin) {
      el.setAttribute('data-grid-span', String(span))
    }
    return buf.concat(node)
  }, [])
}

const calcChildTotalColumns = (nodes: GridNode[], shadow = false) =>
  nodes.reduce((buf, node) => {
    if (!shadow) {
      if (!node.visible) return buf
    }
    if (node.originSpan === -1) return buf + (node.span ?? 1)
    return buf + (node.span ?? 0)
  }, 0)

const calcChildOriginTotalColumns = (nodes: GridNode[], shadow = false) =>
  nodes.reduce((buf, node) => {
    if (!shadow) {
      if (!node.visible) return buf
    }
    if (node.originSpan === -1) return buf + (node.span ?? 1)
    return buf + (node.originSpan ?? 0)
  }, 0)

const calcSatisfyColumns = (
  width: number,
  maxColumns: number,
  minColumns: number,
  maxWidth: number,
  minWidth: number,
  gap: number
) => {
  const results = []
  for (let columns = minColumns; columns <= maxColumns; columns++) {
    const innerWidth = width - (columns - 1) * gap
    const columnWidth = innerWidth / columns
    if (columnWidth >= minWidth && columnWidth <= maxWidth) {
      results.push(columns)
    } else if (columnWidth < minWidth) {
      results.push(Math.min(Math.floor(innerWidth / minWidth), maxColumns))
    } else if (columnWidth > maxWidth) {
      results.push(Math.min(Math.floor(innerWidth / maxWidth), maxColumns))
    }
  }
  return Math.max(...results)
}

const parseSpan = (gridColumnStart: string) => {
  return Number(String(gridColumnStart).match(SpanRegExp)?.[1] ?? 1)
}

const factor = <T>(value: T | T[], grid: Grid<any>): T =>
  isValid(value) ? calcFactor(value as any, grid.breakpoint) : (value as T)

const resolveChildren = (grid: Grid<any>) => {
  let walked = 0,
    shadowWalked = 0,
    rowIndex = 0,
    shadowRowIndex = 0
  if (!grid.ready) return
  grid.children = grid.children.map(node => {
    const element = node.element as HTMLElement
    const columnIndex = walked % grid.columns
    const shadowColumnIndex = shadowWalked % grid.columns
    const remainColumns = grid.columns - columnIndex
    const originSpan = node.originSpan ?? 1
    const targetSpan = originSpan > grid.columns ? grid.columns : originSpan
    const span = grid.options.strictAutoFit ? targetSpan : targetSpan > remainColumns ? remainColumns : targetSpan
    const gridColumn = originSpan === -1 ? `span ${remainColumns} / -1` : `span ${span} / auto`
    if (element.style.gridColumn !== gridColumn) {
      element.style.gridColumn = gridColumn
    }
    if (node.visible) {
      walked += span
    }
    shadowWalked += span
    if (columnIndex === 0) {
      rowIndex++
    }
    if (shadowColumnIndex == 0) {
      shadowRowIndex++
    }
    node.shadowRow = shadowRowIndex
    node.shadowColumn = shadowColumnIndex + 1
    if (node.visible) {
      node.row = rowIndex
      node.column = columnIndex + 1
    }
    if (grid.options?.shouldVisible) {
      if (!grid.options.shouldVisible(node, grid)) {
        if (node.visible) {
          element.style.display = 'none'
        }
        node.visible = false
      } else {
        if (!node.visible) {
          element.style.display = ''
        }
        node.visible = true
      }
    }
    return node
  })
}

const nextTick = (callback?: () => void) => Promise.resolve(0).then(callback)

export type GridNode = {
  index?: number
  visible?: boolean
  column?: number
  shadowColumn?: number
  row?: number
  shadowRow?: number
  span?: number
  originSpan?: number
  element?: HTMLElement
}

/**
 * 自适应网格引擎（formvk 版）。
 * Vue 侧不再依赖 @formvk/reactive：实例交给 `reactive` 代理，getter 在渲染期读取即完成追踪。
 */
export class Grid<Container extends HTMLElement> {
  options: IGridOptions = {
    breakpoints: [720, 1280, 1920],
    columnGap: 8,
    rowGap: 4,
    minWidth: 100,
    colWrap: true,
    strictAutoFit: false,
  }

  width = 0

  height = 0

  ready = false

  childTotalColumns = 0

  shadowChildTotalColumns = 0

  childOriginTotalColumns = 0

  shadowChildOriginTotalColumns = 0

  children: GridNode[] = []

  container!: Container

  constructor(options?: IGridOptions) {
    this.options = {
      breakpoints: [720, 1280, 1920],
      columnGap: 8,
      rowGap: 4,
      minWidth: 100,
      colWrap: true,
      strictAutoFit: false,
      ...options,
    }
  }

  get breakpoints() {
    return this.options.breakpoints ?? []
  }

  set breakpoints(breakpoints) {
    this.options.breakpoints = breakpoints
  }

  get breakpoint() {
    return calcBreakpointIndex(this.breakpoints, this.width)
  }

  get maxWidth() {
    return factor(this.options.maxWidth, this) ?? Infinity
  }

  set maxWidth(maxWidth) {
    this.options.maxWidth = maxWidth
  }

  get minWidth() {
    return factor(this.options.minWidth, this) ?? 100
  }

  set minWidth(minWidth) {
    this.options.minWidth = minWidth
  }

  get maxColumns() {
    return factor(this.options.maxColumns, this) ?? Infinity
  }

  set maxColumns(maxColumns) {
    this.options.maxColumns = maxColumns
  }

  get maxRows() {
    return this.options.maxRows ?? Infinity
  }

  set maxRows(maxRows) {
    this.options.maxRows = maxRows
  }

  get minColumns() {
    return factor(this.options.minColumns, this) ?? 1
  }

  set minColumns(minColumns) {
    this.options.minColumns = minColumns
  }

  get rowGap() {
    return factor(this.options.rowGap, this) ?? 5
  }

  set rowGap(rowGap) {
    this.options.rowGap = rowGap
  }

  get columnGap() {
    return factor(this.options.columnGap, this) ?? 10
  }

  set columnGap(columnGap) {
    this.options.columnGap = columnGap
  }

  get colWrap() {
    return factor(this.options.colWrap, this) ?? true
  }

  set colWrap(colWrap) {
    this.options.colWrap = colWrap
  }

  get columns() {
    if (!this.ready) return 0

    const originTotalColumns = this.childOriginTotalColumns

    if (this.colWrap === false) {
      return originTotalColumns
    }

    const baseColumns = this.childSize

    const strictMaxWidthColumns = Math.round(this.width / (this.maxWidth + this.columnGap))
    const looseMaxWidthColumns = Math.min(originTotalColumns, strictMaxWidthColumns)
    const maxWidthColumns = this.options.strictAutoFit ? strictMaxWidthColumns : looseMaxWidthColumns

    const strictMinWidthColumns = Math.round(this.width / (this.minWidth + this.columnGap))
    const looseMinWidthColumns = Math.min(originTotalColumns, strictMinWidthColumns)
    const minWidthColumns = this.options.strictAutoFit ? strictMinWidthColumns : looseMinWidthColumns

    const minCalculatedColumns = Math.min(baseColumns, originTotalColumns, maxWidthColumns, minWidthColumns)
    const maxCalculatedColumns = Math.max(baseColumns, originTotalColumns, maxWidthColumns, minWidthColumns)

    const finalColumns = calcSatisfyColumns(
      this.width,
      maxCalculatedColumns,
      minCalculatedColumns,
      this.maxWidth,
      this.minWidth,
      this.columnGap
    )
    if (finalColumns >= this.maxColumns) {
      return this.maxColumns
    }
    if (finalColumns <= this.minColumns) {
      return this.minColumns
    }
    return finalColumns
  }

  get rows() {
    return Math.ceil(this.childTotalColumns / this.columns)
  }

  get shadowRows() {
    return Math.ceil(this.shadowChildTotalColumns / this.columns)
  }

  get templateColumns() {
    if (!this.width) return ''
    if (this.maxWidth === Infinity) {
      return `repeat(${this.columns},minmax(0,1fr))`
    }
    if (this.options.strictAutoFit !== true) {
      const columnWidth = (this.width - (this.columns - 1) * this.columnGap) / this.columns
      if (columnWidth < this.minWidth || columnWidth > this.maxWidth) {
        return `repeat(${this.columns},minmax(0,1fr))`
      }
    }
    return `repeat(${this.columns},minmax(${this.minWidth}px,${this.maxWidth}px))`
  }

  get gap() {
    return `${this.rowGap}px ${this.columnGap}px`
  }

  get childSize() {
    return this.children.length
  }

  get fullnessLastColumn() {
    return this.columns === this.children[this.childSize - 1]?.span
  }

  connect = (container: Container) => {
    if (!container) return () => {}
    this.container = container
    let disposed = false

    const digest = () => {
      if (disposed) return
      this.children = parseGridNode(this.container.children)
      this.childTotalColumns = calcChildTotalColumns(this.children)
      this.shadowChildTotalColumns = calcChildTotalColumns(this.children, true)
      this.childOriginTotalColumns = calcChildOriginTotalColumns(this.children)
      this.shadowChildOriginTotalColumns = calcChildOriginTotalColumns(this.children, true)
      const rect = this.container.getBoundingClientRect()
      if (rect.width && rect.height) {
        this.width = rect.width
        this.height = rect.height
      }
      resolveChildren(this)
      nextTick(() => {
        this.options?.onDigest?.(this as unknown as Grid<HTMLElement>)
      })
    }

    const initialize = () => {
      digest()
      this.ready = true
    }

    const mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(digest)
    })
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(digest)
    })

    resizeObserver.observe(this.container)
    mutationObserver.observe(this.container, {
      attributeFilter: ['data-grid-span'],
      attributes: true,
      childList: true,
      subtree: true,
    })
    initialize()

    return () => {
      disposed = true
      resizeObserver.unobserve(this.container)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      this.children = []
    }
  }

  static id = (options: IGridOptions = {}) => {
    const keys: (keyof IGridOptions)[] = [
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
    ]
    return JSON.stringify(keys.map(key => options[key]))
  }
}

// 让外部可以在模板/测试里直接读取响应式快照
export const createGrid = <Container extends HTMLElement = HTMLElement>(options?: IGridOptions) => {
  const grid = new Grid<Container>(options)
  // 使用 Vue 的 reactive 包装，保证 width/children 等内部字段变化可以驱动模板更新
  return reactive(grid) as Grid<Container>
}
