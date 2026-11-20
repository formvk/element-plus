import { isVoidField } from '@formvk/core'
import { connect, mapProps } from '@formvk/vue'
import { ElTransfer } from 'element-plus'

export const Transfer = connect(
  ElTransfer,
  mapProps((props, field) => {
    if (isVoidField(field) || !field) return props
    const dataSource = field.dataSource ?? (props as any).data ?? (props as any).dataSource ?? []
    return {
      ...props,
      data: dataSource.map((item: any) => {
        return {
          ...item,
          label: item.label ?? item.title,
          key: item.key ?? item.value,
        }
      }),
      props: {
        key: 'key',
        label: 'label',
        ...((props as any).props ?? {}),
      },
    }
  })
)
