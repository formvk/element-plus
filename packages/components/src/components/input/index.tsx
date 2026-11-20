import { Loading } from '@element-plus/icons-vue'
import { connect, mapReadPretty, useField } from '@formvk/vue'
import { ElIcon, ElInput } from 'element-plus'
import { defineComponent } from 'vue'

import { TextInput } from '../preview-text'

const InputWrapper = defineComponent({
  name: 'Input',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
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
})

const TextAreaWrapper = defineComponent({
  name: 'TextArea',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => (
      <ElInput {...attrs} type="textarea">
        {slots}
      </ElInput>
    )
  },
})

export const Input = connect(InputWrapper, mapReadPretty(TextInput))

export const TextArea = connect(TextAreaWrapper, mapReadPretty(TextInput))
