import type { IFieldResetOptions, IFormFeedback } from '@formvk/core'
import { isForm } from '@formvk/core'
import { isFn } from '@formvk/shared'
import { useParentForm } from '@formvk/vue'
import { ElButton } from 'element-plus'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export interface IResetProps extends IFieldResetOptions {
  onClick?: (e: MouseEvent) => any
  onResetValidateSuccess?: (payload: any) => void
  onResetValidateFailed?: (feedbacks: IFormFeedback[]) => void
}

export const Reset = defineComponent({
  name: 'Reset',
  inheritAttrs: false,
  props: {
    forceClear: Boolean,
    validate: Boolean,
    onClick: Function as PropType<(e: MouseEvent) => any>,
    onResetValidateSuccess: Function as PropType<(payload: any) => void>,
    onResetValidateFailed: Function as PropType<(feedbacks: IFormFeedback[]) => void>,
  },
  setup(props, { slots, attrs }) {
    const form = useParentForm()
    return () => (
      <ElButton
        {...attrs}
        onClick={(e: MouseEvent) => {
          if (isFn(props.onClick)) {
            if (props.onClick(e) === false) return
          }
          if (!form.value) return
          // Form.reset 接收 (pattern, options)；Field/ObjectField.reset 已固化 .** 模式，只接收 options
          const task = isForm(form.value)
            ? form.value.reset('*', {
                forceClear: props.forceClear,
                validate: props.validate,
              })
            : form.value.reset({
                forceClear: props.forceClear,
                validate: props.validate,
              })
          task.then(props.onResetValidateSuccess).catch(props.onResetValidateFailed)
        }}
      >
        {slots.default?.()}
      </ElButton>
    )
  },
})
