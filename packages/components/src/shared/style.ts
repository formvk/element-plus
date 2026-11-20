/**
 * 桥接库统一类名前缀。
 *
 * 组件内部一律使用 `formvk-` 前缀，避免与 Element Plus 的 `el-` 样式冲突；
 * 样式集中在 src/style/index.scss，由包入口副作用引入。
 */
export const PREFIX = 'formvk'

export const prefixCls = (tag?: string) => {
  if (!tag) return PREFIX
  return tag.startsWith(`${PREFIX}-`) ? tag : `${PREFIX}-${tag}`
}

/**
 * 兼容 antd 桥接层的 useStyle 形态：样式已经静态化，这里只做恒等包裹，
 * 保留 `const [wrapSSR, hashId] = useStyle(prefixCls)` 的调用结构。
 */
export const useStyle = (_componentCls?: string) => {
  const wrapSSR = (node: any) => node
  return [wrapSSR, ''] as const
}
