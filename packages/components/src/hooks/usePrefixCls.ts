import { PREFIX } from '../shared/style'

/**
 * 计算组件类名。
 * - 传入 `item` 返回 `formvk-item`
 * - 传入 `formvk-item` 原样返回
 * - 显式 prefixCls 优先
 */
export const usePrefixCls = (tag?: string, props?: { prefixCls?: string }) => {
  if (props?.prefixCls) return props.prefixCls
  if (!tag) return PREFIX
  return tag.startsWith(`${PREFIX}-`) ? tag : `${PREFIX}-${tag}`
}
