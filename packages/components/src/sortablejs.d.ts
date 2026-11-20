declare module 'sortablejs' {
  export interface SortableEvent {
    oldIndex?: number
    newIndex?: number
    item?: HTMLElement
    from?: HTMLElement
    to?: HTMLElement
  }

  export interface SortableOptions {
    animation?: number
    handle?: string
    ghostClass?: string
    chosenClass?: string
    dragClass?: string
    onStart?: (event: SortableEvent) => void
    onEnd?: (event: SortableEvent) => void
    [key: string]: any
  }

  export default class Sortable {
    constructor(element: HTMLElement, options?: SortableOptions)
    static create(element: HTMLElement, options?: SortableOptions): Sortable
    destroy(): void
    option(name: string, value?: any): any
  }
}
