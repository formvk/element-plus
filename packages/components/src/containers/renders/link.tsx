import type { TableModel } from '@formvk/models'
import { h } from 'vue'
import type { VNodeChild } from 'vue'

import { useTablePlaceholder } from '../../hooks'
import { createRender } from './createRender'
import type { RenderProps } from './types'
import { renderPlaceholder } from './utils'

export interface LinkRenderOptions<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Record extends object = Model['records'][number],
> {
  /** 空值占位符，默认继承 CrudTable 的 placeholder */
  placeholder?: VNodeChild
  /** 由单元格值推导链接地址，默认使用单元格值 */
  format?: (props: RenderProps<Model, Scope, string, Record>) => string
  /** 打开方式，默认新窗口 */
  target?: string
  rel?: string
  class?: string
  style?: any
}

/** 链接渲染，默认新窗口打开 */
export function link<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Record extends object = Model['records'][number],
>(options: LinkRenderOptions<Model, Scope, Record> | LinkRenderOptions<Model, Scope, Record>['format'] = {}) {
  const config = typeof options === 'function' ? { format: options } : options
  const { placeholder: _placeholder, format, target = '_blank', ...rest } = config

  return createRender<Model, Scope, string, Record>(props => {
    const placeholder = useTablePlaceholder(_placeholder)
    const url = format && props.text ? format(props) : props.text

    if (!url) {
      return renderPlaceholder(props.text, placeholder.value)
    }

    return h('a', { ...rest, href: url, target }, props.text || url)
  })
}
