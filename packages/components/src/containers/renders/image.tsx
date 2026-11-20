import type { TableModel } from '@formvk/models'
import { h } from 'vue'
import type { CSSProperties, VNodeChild } from 'vue'

import { useTablePlaceholder } from '../../hooks'
import { createRender } from './createRender'
import type { RenderProps } from './types'

export interface ImageRenderOptions<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Record extends object = Model['records'][number],
> {
  /** 空值占位符，默认继承 CrudTable 的 placeholder */
  placeholder?: VNodeChild
  /** 由单元格值推导图片地址 */
  format?: (props: RenderProps<Model, Scope, string, Record>) => string
  /** 图片宽高，默认 `20` */
  size?: number
  class?: string
  style?: CSSProperties
}

/** 图片渲染：把 URL 渲染为固定尺寸的缩略图 */
export function image<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Record extends object = Model['records'][number],
>(options: ImageRenderOptions<Model, Scope, Record> | ImageRenderOptions<Model, Scope, Record>['format'] = {}) {
  const config = typeof options === 'function' ? { format: options } : options
  const { class: className, style, format, size = 20 } = config

  return createRender<Model, Scope, string, Record>(props => {
    const placeholder = useTablePlaceholder(config.placeholder)
    const url = format && props.text ? format(props) : props.text

    return url
      ? h('img', {
          alt: '',
          class: className,
          src: url,
          style: { width: `${size}px`, height: `${size}px`, ...style },
        })
      : placeholder.value
  })
}
