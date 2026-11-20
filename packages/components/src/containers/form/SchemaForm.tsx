import type { Form as FormType, IFormFeedback } from '@formvk/core'
import type { ISchema } from '@formvk/schema'
import { SchemaField } from '@formvk/vue'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { Form } from '../../components/form'
import type { FormProps } from '../../components/form'

export interface SchemaFormProps {
  /** 表单模型 */
  form?: FormType
  /** 表单 schema */
  schema?: ISchema
  /** 表达式作用域 */
  scope?: Record<string, unknown>
  /** 组件映射，由使用方自行传入，不预绑定内置组件 */
  components?: Record<string, any>
  onAutoSubmit?: (values: any) => any
  onAutoSubmitFailed?: (feedbacks: IFormFeedback[]) => void
}

export const SchemaForm = defineComponent<SchemaFormProps & FormProps>({
  name: 'SchemaForm',
  inheritAttrs: false,
  props: {
    form: Object as PropType<FormType>,
    schema: Object as PropType<ISchema>,
    scope: Object as PropType<Record<string, unknown>>,
    components: Object as PropType<Record<string, any>>,
    onAutoSubmit: Function as PropType<(values: any) => any>,
    onAutoSubmitFailed: Function as PropType<(feedbacks: IFormFeedback[]) => void>,
  },
  setup(props, { attrs, slots }) {
    return () => (
      <Form
        {...attrs}
        form={props.form}
        onAutoSubmit={props.onAutoSubmit}
        onAutoSubmitFailed={props.onAutoSubmitFailed}
      >
        <SchemaField schema={props.schema ?? {}} scope={props.scope} components={props.components} />
        {slots.default?.()}
      </Form>
    )
  },
})
