import type { PopupModel } from '@formvk/models'
import { ElButton, ElDialog, ElSpace } from 'element-plus'
import type { DialogProps } from 'element-plus'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { SchemaForm } from '../../form'

/** 弹窗确认/取消回调的事件联合类型，同时覆盖鼠标与键盘触发 */
export type PopupTriggerEvent = KeyboardEvent | MouseEvent | Event

export interface ModalFormProps {
  /** 弹窗表单模型，内部复用模型创建的 form 实例 */
  popup: PopupModel
  schema?: any
  scope?: Record<string, unknown>
  components?: Record<string, any>
  onOk?: (e: PopupTriggerEvent) => boolean | void | Promise<boolean | void>
  onCancel?: (e: PopupTriggerEvent) => boolean | void | Promise<boolean | void>
}

export const ModalForm = defineComponent<ModalFormProps & DialogProps>({
  name: 'ModalForm',
  inheritAttrs: false,
  props: {
    popup: { type: Object as PropType<PopupModel>, required: true },
    schema: Object,
    scope: Object as PropType<Record<string, unknown>>,
    components: Object as PropType<Record<string, any>>,
    onOk: Function as PropType<ModalFormProps['onOk']>,
    onCancel: Function as PropType<ModalFormProps['onCancel']>,
  },
  setup(props, { attrs, slots }) {
    const handleOk = async (e: PopupTriggerEvent) => {
      if ((await props.onOk?.(e)) === false) return
      await props.popup.onSubmit()
    }

    const handleCancel = async (e: PopupTriggerEvent) => {
      if ((await props.onCancel?.(e)) === false) return
      props.popup.close()
    }

    return () => (
      <ElDialog
        {...attrs}
        modelValue={props.popup.visible}
        onUpdate:modelValue={(visible: boolean) => {
          if (!visible) handleCancel(new Event('close'))
        }}
      >
        {{
          default: () => (
            <SchemaForm form={props.popup.form} schema={props.schema} scope={props.scope} components={props.components}>
              {slots.default?.()}
            </SchemaForm>
          ),
          footer: () => (
            <ElSpace>
              <ElButton onClick={(e: MouseEvent) => handleCancel(e)}>取消</ElButton>
              <ElButton type="primary" loading={props.popup.form.submitting} onClick={(e: MouseEvent) => handleOk(e)}>
                确定
              </ElButton>
            </ElSpace>
          ),
        }}
      </ElDialog>
    )
  },
})
