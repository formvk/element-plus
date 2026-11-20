/**
 * 树结构数据平铺为一维列表（纯函数，不含框架状态，故不使用 use 前缀命名）
 */
const flattenOptions = (tree: any[] = []): any[] => {
  const flatData = (data?: any[]): any[] => {
    let list: any[] = []
    data?.forEach(item => {
      list = [...list, item]
      if (item?.children?.length) {
        list = [...list, ...flatData(item.children)]
      }
    })
    return list
  }
  return flatData(tree)
}

export { flattenOptions }
