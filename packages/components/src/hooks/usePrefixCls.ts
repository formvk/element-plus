import { useGetDerivedNamespace } from 'element-plus'

/** 桥接层类名的固定后缀，完整前缀为 `${namespace}-formvk`（默认 `el-formvk`） */
const PREFIX_SUFFIX = 'formvk'

/**
 * 计算组件类名，前缀跟随 Element Plus 的 namespace。
 * - 默认返回 `el-formvk-item`
 * - `ElConfigProvider` 设置 `namespace="ns"` 后返回 `ns-formvk-item`
 * - 显式 `prefixCls` 优先
 */
export const usePrefixCls = (tag?: string, props?: { prefixCls?: string }) => {
  if (props?.prefixCls) return props.prefixCls
  const prefix = `${useGetDerivedNamespace().value}-${PREFIX_SUFFIX}`
  if (!tag) return prefix
  return tag.startsWith(`${prefix}-`) ? tag : `${prefix}-${tag}`
}
