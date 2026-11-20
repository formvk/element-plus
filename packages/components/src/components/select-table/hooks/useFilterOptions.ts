import { isArr, isFn } from '@formvk/shared'
import { computed, isVNode } from 'vue'

type IFilterOption = boolean | ((option: any, keyword: string) => boolean)

function includes(test: unknown, search: string) {
  return toArray(test).join('').toUpperCase().includes(search)
}

function includesOption(option: any, search: string) {
  const searched = new Set()
  const searchOption = (target: any): boolean => {
    const keys = Object.keys(target || {})
    return keys.some(key => {
      if (key === '__level') {
        return false
      }
      const value = target[key]
      if (isVNode(value)) return false
      if (key !== 'children' && !searched.has(value)) {
        if (typeof value === 'object') {
          searched.add(value)
          return searchOption(value)
        }
        return includes(value, search)
      }
      return false
    })
  }
  return searchOption(option)
}

function toArray<T>(value: T | T[]): T[] {
  if (isArr(value)) {
    return value
  }
  return value !== undefined ? [value] : []
}

const useFilterOptions = (
  options: () => any[],
  searchValue: () => string | string[] | undefined,
  filterOption: () => IFilterOption | undefined,
  checkStrictly: () => boolean | undefined
) =>
  computed(() => {
    const data = options()
    const keyword = searchValue()
    const filter = filterOption()
    if (!keyword || filter === false) {
      return data
    }
    const filterFunc = isFn(filter) ? filter : (value: any, option: any) => includesOption(option, value.toUpperCase())

    const doFilter = (arr: any[]): any[] => {
      const filterArr: any[] = []
      arr?.forEach(item => {
        if (item?.children?.length) {
          const filterChildren = doFilter(item.children)
          if (filterChildren.length) {
            filterArr.push({ ...item, children: filterChildren })
          } else if (filterFunc(keyword, item) && checkStrictly() !== false) {
            // 父子关系启用时，没有可用子元素，不添加父元素
            filterArr.push({ ...item, children: [] })
          }
        } else if (filterFunc(keyword, item)) {
          filterArr.push(item)
        }
      })
      return filterArr
    }

    return doFilter(data)
  })

export { useFilterOptions }
