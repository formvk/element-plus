import type { TableModel } from '@formvk/models'
import { isValid } from '@formvk/shared'
import { h } from 'vue'
import type { VNodeChild } from 'vue'

import { EllipsisText } from '../../components/ellipsis-text'
import { useTablePlaceholder } from '../../hooks'
import { createRender } from './createRender'
import type { RenderProps } from './types'

export interface TextRenderOptions<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Row extends object = Model['records'][number],
> {
  /** 空值占位符，默认继承 CrudTable 的 placeholder */
  placeholder?: VNodeChild
  /** 内容溢出时单行省略，并通过 Tooltip 展示完整内容 */
  ellipsis?: boolean
  tooltipProps?: Record<string, any>
  /** 自定义渲染 */
  format?: (props: RenderProps<Model, Scope, string, Row>) => VNodeChild
}

/** 纯文本渲染，支持占位符、省略与自定义格式化 */
export function text<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Row extends object = Model['records'][number],
>(options: TextRenderOptions<Model, Scope, Row> | TextRenderOptions<Model, Scope, Row>['format'] = {}) {
  const config = typeof options === 'function' ? { format: options } : options
  const { ellipsis, format, tooltipProps } = config

  return createRender<Model, Scope, string, Row>(props => {
    const placeholder = useTablePlaceholder(config.placeholder)
    const content = format
      ? (format(props) ?? placeholder.value)
      : isValid(props.text) && props.text !== ''
        ? props.text
        : placeholder.value

    return ellipsis ? h(EllipsisText, { tooltipProps }, { default: () => content }) : content
  })
}
