import type { TableModel } from '@formvk/models'
import { isValid } from '@formvk/shared'
import { computed, defineComponent, inject, provide } from 'vue'
import type { Component, ComputedRef, InjectionKey, VNodeChild } from 'vue'

import type { ColumnRenderProps, RenderProps } from '../containers/renders/types'

export interface TableRenderContextValue<Model extends TableModel = TableModel> {
  /** 表格模型，渲染器通过它访问弹窗、删除等能力 */
  table: Model
  /** 单元格空值占位符 */
  placeholder?: VNodeChild
  /** 表达式作用域，会合并进渲染器参数 */
  scope?: Record<string, unknown>
}

export const TableRenderContext: InjectionKey<ComputedRef<TableRenderContextValue>> = Symbol('FormvkTableRenderContext')

export const TableRenderProvider = defineComponent({
  name: 'TableRenderProvider',
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  setup(props, { slots }) {
    provide(
      TableRenderContext,
      computed(() => props.value as TableRenderContextValue)
    )
    return () => slots.default?.()
  },
})

export function useTableRenderContext<Model extends TableModel = TableModel>() {
  const context = inject(TableRenderContext, null)
  if (!context) {
    throw new Error('表格渲染器缺少上下文：请使用 CrudTable，或在自定义表格外层包裹 TableRenderProvider')
  }
  return context as ComputedRef<TableRenderContextValue<Model>>
}

export function useTableModel<Model extends TableModel = TableModel>() {
  return useTableRenderContext<Model>().value.table
}

/** 合并上下文 scope、组件 scope 与模型状态，作为表达式作用域 */
export function useTableScope(scope?: Record<string, unknown>) {
  const context = useTableRenderContext()
  return computed(() => ({
    ...context.value.scope,
    ...scope,
    $table: context.value.table,
    $state: context.value.table.state,
  }))
}

/** 渲染器占位符：优先使用参数，其次上下文，最后回退到 `--` */
export function useTablePlaceholder(value?: VNodeChild) {
  const context = useTableRenderContext()
  return computed(() => {
    const fallback = context.value.placeholder ?? '--'
    return isValid(value) && value !== '' ? value : fallback
  })
}

/** 合并表达式作用域与单元格上下文，作为渲染器的完整入参 */
export function useTableRenderProps<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Record extends object = Model['records'][number],
>(props: ColumnRenderProps<Record>): ComputedRef<RenderProps<Model, Scope, any, Record>> {
  const context = useTableRenderContext<Model>()
  return computed(
    () =>
      ({
        ...(context.value.scope as Scope),
        text: props.text,
        record: props.record,
        index: props.index,
        table: context.value.table,
        $state: context.value.table.state,
      }) as RenderProps<Model, Scope, any, Record>
  )
}

/** 表格列渲染器组件类型 */
export type ColumnRenderComponent<Record extends object = any, Value = any> = Component<
  ColumnRenderProps<Record, Value>
>
