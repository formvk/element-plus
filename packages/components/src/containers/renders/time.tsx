import type { TableModel } from '@formvk/models'
import dayjs from 'dayjs'
import type { VNodeChild } from 'vue'

import { useTablePlaceholder } from '../../hooks'
import { createRender } from './createRender'
import type { RenderProps } from './types'

export interface TimeRenderOptions<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Record extends object = Model['records'][number],
> {
  /** 空值占位符，默认继承 CrudTable 的 placeholder */
  placeholder?: VNodeChild
  /** dayjs 格式化模板，或自定义渲染函数 */
  format?: string | ((props: RenderProps<Model, Scope, string, Record>) => VNodeChild)
}

/** 时间渲染，默认格式 `YYYY-MM-DD HH:mm:ss` */
export function time<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Record extends object = Model['records'][number],
>(options: TimeRenderOptions<Model, Scope, Record> | TimeRenderOptions<Model, Scope, Record>['format'] = {}) {
  const config = typeof options === 'string' || typeof options === 'function' ? { format: options } : options
  const { format = 'YYYY-MM-DD HH:mm:ss' } = config

  return createRender<Model, Scope, string, Record>(props => {
    const placeholder = useTablePlaceholder(config.placeholder)
    if (typeof format === 'function') {
      return format(props) ?? placeholder.value
    }
    return props.text ? dayjs(props.text).format(format) : placeholder.value
  })
}
