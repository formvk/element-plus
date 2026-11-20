import type { Form as FormType, IFormFeedback, ObjectField } from '@formvk/core'
import { FormProvider, useParentForm } from '@formvk/vue'
import { defineComponent, h } from 'vue'
import type { PropType, VNodeChild } from 'vue'

import { Placeholder } from '../../hooks'
import { FormLayout } from '../form-layout'
import type { IFormLayoutProps } from '../form-layout'

export interface FormProps extends IFormLayoutProps {
  form?: FormType
  component?: any
  onAutoSubmit?: (values: any) => any
  onAutoSubmitFailed?: (feedbacks: IFormFeedback[]) => void
  previewTextPlaceholder?: VNodeChild
}

export const Form = defineComponent<FormProps>({
  name: 'Form',
  inheritAttrs: false,
  props: {
    form: Object as PropType<FormType>,
    component: { type: [String, Object] as PropType<any>, default: 'form' },
    onAutoSubmit: Function as PropType<(values: any) => any>,
    onAutoSubmitFailed: Function as PropType<(feedbacks: IFormFeedback[]) => void>,
    previewTextPlaceholder: { type: null as unknown as PropType<VNodeChild>, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const top = useParentForm()

    const renderContent = (innerForm: FormType | ObjectField) => (
      <Placeholder value={props.previewTextPlaceholder}>
        <FormLayout {...attrs}>
          {h(
            props.component,
            {
              onSubmit(e: Event) {
                e?.stopPropagation?.()
                e?.preventDefault?.()
                innerForm.submit(props.onAutoSubmit).catch(props.onAutoSubmitFailed)
              },
            },
            slots.default?.()
          )}
        </FormLayout>
      </Placeholder>
    )

    return () => {
      if (props.form) {
        return <FormProvider form={props.form}>{renderContent(props.form)}</FormProvider>
      }
      const current = top.value
      if (!current) throw new Error('must pass form instance by createForm')
      return renderContent(current)
    }
  },
})
