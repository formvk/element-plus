import type { TableModel } from '@formvk/models'
import { defineComponent, h } from 'vue'
import type { PropType, VNodeChild } from 'vue'

import { useTableRenderProps } from '../../hooks'
import type { ColumnRender, ColumnRenderProps, RenderProps } from './types'

/**
 * 将渲染函数转换为表格列渲染函数。
 * 单元格组件会在 setup 中注入 TableRenderProvider 的 `table` / `$state` / `scope`。
 */
export function createRender<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Value = any,
  Record extends object = Model['records'][number],
>(Component: (props: RenderProps<Model, Scope, Value, Record>) => VNodeChild): ColumnRender<Record, Value> {
  const Render = defineComponent({
    name: 'TableRenderCell',
    props: {
      text: { type: null as unknown as PropType<any>, default: undefined },
      record: { type: Object as PropType<any>, default: undefined },
      index: { type: Number, default: 0 },
    },
    setup(props) {
      const renderProps = useTableRenderProps<Model, Scope, Record>(props as ColumnRenderProps<any, any>)
      return () => Component(renderProps.value as RenderProps<Model, Scope, Value, Record>)
    },
  })

  return (text, record, index) => h(Render, { text, record, index })
}
