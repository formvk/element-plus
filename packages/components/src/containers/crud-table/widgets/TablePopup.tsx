import type { ISchema } from '@formvk/schema'
import type { DialogPropsPublic, DrawerPropsPublic } from 'element-plus'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { useTableModel, useTableScope } from '../../../hooks'
import { PopupForm } from '../../popup'
import type { DrawerFormProps, ModalFormProps } from '../../popup'

/** 新增 / 编辑弹窗配置，`type` 默认 `drawer` */
export type TablePopupProps =
  | (Omit<DrawerFormProps, 'popup'> & { type?: 'drawer' })
  | (Omit<ModalFormProps, 'popup'> & { type: 'modal' })

/** 公开 props：抽屉与对话框属性合并，弹窗类型由 `type` 切换 */
type TablePopupPublicProps = Omit<DrawerFormProps, 'popup'> &
  Omit<DrawerPropsPublic, keyof DialogPropsPublic> &
  DialogPropsPublic & { type?: 'drawer' | 'modal' }

function createTablePopup(type: 'add' | 'edit') {
  const TablePopup = defineComponent<TablePopupPublicProps>({
    name: type === 'add' ? 'AddPopup' : 'EditPopup',
    inheritAttrs: false,
    props: {
      type: { type: String as PropType<'drawer' | 'modal'>, default: 'drawer' },
      schema: Object as PropType<ISchema>,
      scope: Object as PropType<Record<string, unknown>>,
      components: Object as PropType<Record<string, any>>,
      onOk: Function as PropType<DrawerFormProps['onOk']>,
      onCancel: Function as PropType<DrawerFormProps['onCancel']>,
    },
    setup(props, { attrs, slots }) {
      const table = useTableModel()
      const expressionScope = useTableScope(props.scope)

      return () => (
        <PopupForm
          {...attrs}
          type={props.type}
          popup={type === 'add' ? table.addPopup : table.editPopup}
          schema={props.schema}
          scope={expressionScope.value}
          components={props.components}
          onOk={props.onOk}
          onCancel={props.onCancel}
        >
          {slots.default?.()}
        </PopupForm>
      )
    },
  })

  return TablePopup
}

/** 新增弹窗，复用 `table.addPopup` */
export const AddPopup = createTablePopup('add')
/** 编辑弹窗，复用 `table.editPopup` */
export const EditPopup = createTablePopup('edit')
