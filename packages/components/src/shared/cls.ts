type ClassValue = string | number | null | undefined | false | Record<string, any> | ClassValue[]

const toClassName = (value: ClassValue): string => {
  if (!value) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.map(toClassName).filter(Boolean).join(' ')
  return Object.keys(value)
    .filter(key => value[key])
    .join(' ')
}

/** 轻量 classnames 实现，行为与 antd 版本保持一致的部分即可满足组件场景 */
export const cls = (...args: ClassValue[]): string => args.map(toClassName).filter(Boolean).join(' ')

export default cls
