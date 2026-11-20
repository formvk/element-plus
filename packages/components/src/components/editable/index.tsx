import { ChatDotRound, Close, EditPen } from '@element-plus/icons-vue'
import { isVoidField } from '@formvk/core'
import type { Field } from '@formvk/core'
import { useField } from '@formvk/vue'
import { ElIcon, ElPopover } from 'element-plus'
import { computed, defineComponent, ref, watchEffect } from 'vue'
import type { CSSProperties, PropType } from 'vue'

import { useClickAway } from '../../hooks'
import { cls, usePrefixCls } from '../../shared'
import { BaseItem } from '../form-item'
import type { IFormItemProps } from '../form-item'

const useParentPattern = () => {
  const field = useField<Field>()
  return computed(() => field.value?.parent?.pattern || field.value?.form?.pattern)
}

const useEditable = () => {
  const pattern = useParentPattern()
  const field = useField<Field>()
  watchEffect(() => {
    if (pattern.value === 'editable' && field.value) {
      field.value.setPattern('readPretty')
    }
  })
  const editable = computed(() => field.value?.pattern === 'editable')
  const setEditable = (payload: boolean) => {
    if (pattern.value !== 'editable') return
    field.value?.setPattern(payload ? 'editable' : 'readPretty')
  }
  return [editable, setEditable] as const
}

const useFormItemProps = () => {
  const field = useField()
  return computed<IFormItemProps>(() => {
    const currentField: any = field.value
    if (!currentField || isVoidField(currentField)) return {}
    const takeMessage = () => {
      if (currentField.selfErrors.length) return currentField.selfErrors
      if (currentField.selfWarnings.length) return currentField.selfWarnings
      if (currentField.selfSuccesses.length) return currentField.selfSuccesses
    }
    return {
      feedbackStatus: currentField.validateStatus === 'validating' ? 'pending' : currentField.validateStatus,
      feedbackText: takeMessage(),
      extra: currentField.description,
    } as IFormItemProps
  })
}

export const Editable = defineComponent({
  name: 'Editable',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const [editable, setEditable] = useEditable()
    const pattern = useParentPattern()
    const itemProps = useFormItemProps()
    const field = useField<Field>()
    const basePrefixCls = usePrefixCls()
    const prefixCls = usePrefixCls('editable')
    const innerRef = ref<HTMLDivElement>()
    const recover = () => {
      if (editable.value && !field.value?.errors?.length) {
        setEditable(false)
      }
    }

    useClickAway(e => {
      const target = e.target as HTMLElement
      if (target?.closest(`.${basePrefixCls}-select-dropdown`)) return
      if (target?.closest(`.${basePrefixCls}-picker-dropdown`)) return
      if (target?.closest(`.${basePrefixCls}-cascader-menus`)) return
      if (target?.closest('.el-select__popper')) return
      if (target?.closest('.el-picker__popper')) return
      if (target?.closest('.el-cascader__dropdown')) return
      recover()
    }, innerRef)

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const close = innerRef.value?.querySelector(`.${prefixCls}-close-btn`) || null
      if (target?.contains(close) || close?.contains(target)) {
        recover()
      } else if (!editable.value) {
        setTimeout(() => {
          setEditable(true)
          setTimeout(() => {
            innerRef.value?.querySelector('input')?.focus()
          })
        })
      }
    }

    const renderEditHelper = () => {
      if (editable.value) return null
      return (
        <BaseItem {...attrs} {...itemProps.value}>
          {pattern.value === 'editable' ? (
            <ElIcon class={`${prefixCls}-edit-btn`}>
              <EditPen />
            </ElIcon>
          ) : (
            <ElIcon class={`${prefixCls}-edit-btn`}>
              <ChatDotRound />
            </ElIcon>
          )}
        </BaseItem>
      )
    }

    const renderCloseHelper = () => {
      if (!editable.value) return null
      return (
        <BaseItem {...attrs}>
          <ElIcon class={`${prefixCls}-close-btn`}>
            <Close />
          </ElIcon>
        </BaseItem>
      )
    }

    return () => (
      <div class={cls(prefixCls, attrs.class as string)} ref={innerRef} onClick={onClick}>
        <div class={`${prefixCls}-content`}>
          <BaseItem {...attrs} {...itemProps.value}>
            {slots.default?.()}
          </BaseItem>
          {renderEditHelper()}
          {renderCloseHelper()}
        </div>
      </div>
    )
  },
})

export const EditablePopover = defineComponent({
  name: 'EditablePopover',
  inheritAttrs: false,
  props: {
    title: { type: null as unknown as PropType<any>, default: undefined },
    style: Object as PropType<CSSProperties>,
  },
  setup(props, { attrs, slots }) {
    const field = useField<Field>()
    const pattern = useParentPattern()
    const open = ref(false)
    const prefixCls = usePrefixCls('editable')

    const closePopover = async () => {
      const currentField = field.value
      if (!currentField) {
        open.value = false
        return
      }
      try {
        await currentField.form.validate(`${currentField.address}.*`)
      } catch {
        // 校验失败时错误反馈已写入 form，保持 Popover 打开
        return
      }
      const errors = currentField.form.queryFeedbacks({
        type: 'error',
        address: `${currentField.address}.*`,
      })
      if (errors?.length) return
      open.value = false
    }

    return () => {
      if (!field.value) return null
      return (
        <ElPopover
          {...attrs}
          title={props.title || field.value.title}
          visible={open.value}
          class={cls(prefixCls, attrs.class as string)}
          trigger="click"
          onUpdate:visible={(visible: boolean) => {
            if (visible) {
              open.value = true
            } else {
              closePopover()
            }
          }}
        >
          {{
            default: () => (
              <div>
                <BaseItem class={`${prefixCls}-trigger`}>
                  <div class={`${prefixCls}-content`}>
                    <span class={`${prefixCls}-preview`}>{props.title || field.value?.title}</span>
                    {pattern.value === 'editable' ? (
                      <ElIcon class={`${prefixCls}-edit-btn`}>
                        <EditPen />
                      </ElIcon>
                    ) : (
                      <ElIcon class={`${prefixCls}-edit-btn`}>
                        <ChatDotRound />
                      </ElIcon>
                    )}
                  </div>
                </BaseItem>
              </div>
            ),
            content: () => slots.default?.(),
          }}
        </ElPopover>
      )
    }
  },
})
