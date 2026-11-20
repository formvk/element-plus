import type { ISchema } from '@formvk/schema'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import type { IFormLayoutProps } from '../../../hooks'
import { useTableModel, useTableScope } from '../../../hooks'
import { SchemaForm } from '../../form'
import type { SchemaFormProps } from '../../form'

export type SearchFormProps = Omit<SchemaFormProps, 'form' | 'onAutoSubmit' | 'onAutoSubmitFailed'> & IFormLayoutProps

/** 表格搜索表单，提交时自动调用模型的 `search` */
export const SearchForm = defineComponent<SearchFormProps>({
  name: 'SearchForm',
  inheritAttrs: false,
  props: {
    schema: Object as PropType<ISchema>,
    scope: Object as PropType<Record<string, unknown>>,
    components: Object as PropType<Record<string, any>>,
  },
  setup(props, { attrs, slots }) {
    const table = useTableModel()
    const expressionScope = useTableScope(props.scope)

    return () => (
      <SchemaForm
        {...({ layout: 'inline', feedbackLayout: 'terse', wrapperWidth: 200 } as any)}
        {...attrs}
        scope={expressionScope.value}
        form={table.form}
        schema={props.schema}
        components={props.components}
        onAutoSubmit={() => table.search()}
      >
        {slots.default?.()}
      </SchemaForm>
    )
  },
})
