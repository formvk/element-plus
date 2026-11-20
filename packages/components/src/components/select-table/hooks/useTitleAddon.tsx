import { ElCheckbox } from 'element-plus'
import type { VNode } from 'vue'

import { completedKeys, getCompatibleAllSelected } from '../utils'

// 重写表格表头 Checkbox（节点状态按全完整数据计算，节点操作按筛选数据计算）
const getTitleAddon = (
  selected: any[],
  flatDataSource: any[],
  flatFilteredDataSource: any[],
  primaryKey: string | undefined,
  mode: string | undefined,
  disabled: boolean,
  readOnly: boolean,
  checkStrictly: boolean | undefined,
  onChange: (selectedRowKeys: any[], record: any[]) => any
): VNode | null => {
  if (mode === 'single') {
    return null
  }
  const rowKey = primaryKey ?? ''
  // 全选框是否选中
  const checked = Boolean(selected?.length && selected?.length === flatDataSource.filter(item => !item.disabled).length)
  // 全选框是否未完全选中
  const indeterminate = Boolean(selected?.length && !checked)

  const onInnerChange = (checkedValue: boolean) => {
    if (readOnly) return
    let isSelected = checkedValue
    // 当前可执行全选的 keys
    const usableKeys = flatFilteredDataSource.filter(item => !item.disabled).map(item => item?.[rowKey])
    // 在筛选状态下（按钮的 indeterminate 状态处于异常）需要通过数据对比判断是否处于全选中状态
    if (getCompatibleAllSelected(selected, flatFilteredDataSource, usableKeys, checkStrictly, rowKey)) {
      isSelected = false
    }

    let newSelected: any[] = []
    if (isSelected) {
      // 执行全选
      newSelected = [...new Set([...selected, ...usableKeys])]
    } else {
      // 执行取消全选
      newSelected = selected.filter(key => !usableKeys.includes(key))
    }
    newSelected = completedKeys(flatDataSource, newSelected, rowKey)
    onChange?.(newSelected, [])
  }

  return (
    <ElCheckbox
      key="titleAddons"
      disabled={disabled}
      modelValue={checked}
      indeterminate={indeterminate}
      onChange={onInnerChange as any}
    />
  )
}

export { getTitleAddon }
