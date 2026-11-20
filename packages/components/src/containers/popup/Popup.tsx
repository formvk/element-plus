import type { PopupModel } from '@formvk/models'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { DrawerForm, ModalForm } from './widgets'
import type { DrawerFormProps, ModalFormProps } from './widgets'

export type PopupFormProps =
  | (DrawerFormProps & {
      /** 弹窗类型，默认为 drawer */
      type?: 'drawer'
    })
  | (ModalFormProps & {
      type: 'modal'
    })

export const PopupForm = defineComponent({
  name: 'PopupForm',
  inheritAttrs: false,
  props: {
    type: { type: String as PropType<'drawer' | 'modal'>, default: 'drawer' },
    popup: { type: Object as PropType<PopupModel>, required: true },
    schema: { type: null as unknown as PropType<any>, default: undefined },
    scope: Object as PropType<Record<string, unknown>>,
    components: Object as PropType<Record<string, any>>,
    onOk: Function as PropType<DrawerFormProps['onOk']>,
    onCancel: Function as PropType<DrawerFormProps['onCancel']>,
  },
  setup(props, { attrs, slots }) {
    const { type: _type, ...rest } = props
    return () =>
      props.type === 'modal' ? (
        <ModalForm {...(rest as unknown as ModalFormProps)} {...attrs}>
          {slots.default?.()}
        </ModalForm>
      ) : (
        <DrawerForm {...(rest as unknown as DrawerFormProps)} {...attrs}>
          {slots.default?.()}
        </DrawerForm>
      )
  },
})
