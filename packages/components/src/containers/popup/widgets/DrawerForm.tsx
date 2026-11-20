import type { PopupModel } from '@formvk/models'
import { ElButton, ElDrawer, ElSpace } from 'element-plus'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { SchemaForm } from '../../form'
import type { PopupTriggerEvent } from './ModalForm'

export interface DrawerFormProps {
  /** 弹窗表单模型，内部复用模型创建的 form 实例 */
  popup: PopupModel
  schema?: any
  scope?: Record<string, unknown>
  components?: Record<string, any>
  onOk?: (e: PopupTriggerEvent) => boolean | void | Promise<boolean | void>
  onCancel?: (e: PopupTriggerEvent) => boolean | void | Promise<boolean | void>
}

export const DrawerForm = defineComponent({
  name: 'DrawerForm',
  inheritAttrs: false,
  props: {
    popup: { type: Object as PropType<PopupModel>, required: true },
    schema: Object,
    scope: Object as PropType<Record<string, unknown>>,
    components: Object as PropType<Record<string, any>>,
    onOk: Function as PropType<DrawerFormProps['onOk']>,
    onCancel: Function as PropType<DrawerFormProps['onCancel']>,
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
      <ElDrawer
        {...attrs}
        size={(attrs.size as string | number | undefined) ?? 600}
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
      </ElDrawer>
    )
  },
})
