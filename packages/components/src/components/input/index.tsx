import { Loading } from '@element-plus/icons-vue'
import { connect, mapReadPretty, useField } from '@formvk/vue'
import { ElIcon, ElInput } from 'element-plus'
import type { InputProps } from 'element-plus'
import { defineComponent } from 'vue'

import { TextInput } from '../preview-text'

const InputWrapper = defineComponent<InputProps>(
  (_, { attrs, slots }) => {
    const field = useField()
    return () => (
      <ElInput {...attrs}>
        {{
          ...slots,
          suffix: () => {
            const currentField = field.value as any
            if (currentField?.loading || currentField?.validating) {
              return (
                <ElIcon class="is-loading">
                  <Loading />
                </ElIcon>
              )
            }
            return slots.suffix?.()
          },
        }}
      </ElInput>
    )
  },
  { name: 'Input', inheritAttrs: false }
)

const TextAreaWrapper = defineComponent<InputProps>(
  (_, { attrs, slots }) => {
    return () => (
      <ElInput {...attrs} type="textarea">
        {slots}
      </ElInput>
    )
  },
  { name: 'TextArea', inheritAttrs: false }
)

export const Input = connect(InputWrapper, mapReadPretty(TextInput))

export const TextArea = connect(TextAreaWrapper, mapReadPretty(TextInput))
