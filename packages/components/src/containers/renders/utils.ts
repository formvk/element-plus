import { isValid } from '@formvk/shared'
import type { VNodeChild } from 'vue'

/** 空值回退到占位符 */
export function renderPlaceholder(value?: unknown, placeholder: VNodeChild = '--') {
  return isValid(value) && value !== '' ? (value as VNodeChild) : placeholder
}

/** 在选项树中查找目标值，返回从根到目标节点的链路 */
export function findOption<T extends { value?: any; children?: T[] }>(tree: T[], targetValue: unknown): T[] {
  const chain: T[] = []

  const traverse = (nodes: T[], parent: T[]): boolean => {
    const target = nodes.find(node => node.value === targetValue)
    if (target) {
      chain.push(...parent, target)
      return true
    }
    return nodes.some(node => (node.children?.length ? traverse(node.children as T[], [...parent, node]) : false))
  }

  if (!isValid(targetValue)) return chain

  traverse(tree, [])
  return chain
}
