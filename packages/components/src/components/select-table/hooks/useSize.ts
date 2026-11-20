type SizeType = 'small' | 'default' | 'large'

interface ISize {
  (
    fieldSize: SizeType | undefined,
    searchSize: SizeType | undefined,
    tableSize: SizeType | undefined
  ): {
    searchSize: SizeType
    tableSize: SizeType
  }
}

// 纯函数，故不使用 use 前缀命名
const getSize: ISize = (fieldSize = 'default', searchSize, tableSize) => {
  const fieldSizeMap: Record<string, { searchSize: SizeType; tableSize: SizeType }> = {
    small: {
      searchSize: 'small',
      tableSize: 'small',
    },
    default: {
      searchSize: 'default',
      tableSize: 'default',
    },
    large: {
      searchSize: 'large',
      tableSize: 'default',
    },
  }
  const { searchSize: fieldSearchSize, tableSize: fieldTableSize } = fieldSizeMap[fieldSize as string] || {}

  return {
    searchSize: searchSize || fieldSearchSize || 'default',
    tableSize: tableSize || fieldTableSize || 'default',
  }
}

export { getSize }
