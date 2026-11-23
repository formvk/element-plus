import { ArrowDown, ArrowUp, CopyDocument, Delete, Plus, Rank } from '@element-plus/icons-vue'
import type { ArrayField } from '@formvk/core'
import type { Schema } from '@formvk/schema'
import { clone, isStr, isUndef, isValid } from '@formvk/shared'
import { useField, useFieldSchema } from '@formvk/vue'
import { ElButton } from 'element-plus'
import type { ButtonProps } from 'element-plus'
import { defineComponent, provide } from 'vue'
import type { HTMLAttributes, PropType } from 'vue'

import { ArrayBaseContext, ItemContext, useArray, useIndex } from '../../hooks'
import { cls, usePrefixCls } from '../../shared'

export interface IAdditionProps {
  title?: string
  method?: 'push' | 'unshift'
  defaultValue?: any
  [key: string]: any
}

export interface IArrayBaseItemProps {
  index: number
  record: ((index: number) => Record<string, any>) | Record<string, any>
}

export interface IArrayBaseProps {
  disabled?: boolean
  onAdd?: (index: number) => void
  onCopy?: (index: number) => void
  onRemove?: (index: number) => void
  onMoveDown?: (index: number) => void
  onMoveUp?: (index: number) => void
}

/** 操作按钮透传 ElButton 属性，这里合并按钮类型与数组操作自有属性 */
type IArrayActionProps = ButtonProps & {
  index?: number
  title?: string
}

type IArrayCopyProps = IArrayActionProps & {
  copyRecord?: (record: any, index: number) => any
}

type IArrayAdditionProps = ButtonProps & {
  title?: string
  method?: 'push' | 'unshift'
  defaultValue?: any
  onClick?: (e: MouseEvent) => void
}

export { useArray, useIndex, useRecord } from '../../hooks'
export type { IArrayBaseContext } from '../../hooks'

const getSchemaDefaultValue = (schema?: Schema): any => {
  if (schema?.type === 'array') return []
  if (schema?.type === 'object') return {}
  if (schema?.type === 'void') {
    const properties = schema.properties
    if (!properties) return
    for (const key of Object.keys(properties)) {
      const value = getSchemaDefaultValue(properties[key])
      if (isValid(value)) return value
    }
  }
}

const getDefaultValue = (defaultValue: any, schema: Schema) => {
  if (isValid(defaultValue)) return clone(defaultValue)
  if (Array.isArray(schema?.items)) return getSchemaDefaultValue(schema?.items[0])
  return getSchemaDefaultValue(schema?.items)
}

/**
 * 数组容器上下文提供者。
 * field / schema 以 getter 形式暴露，保证内部读取时仍能追踪响应式变化。
 */
export const ArrayBase = defineComponent({
  name: 'ArrayBase',
  props: {
    disabled: Boolean,
    onAdd: Function as PropType<(index: number) => void>,
    onCopy: Function as PropType<(index: number) => void>,
    onRemove: Function as PropType<(index: number) => void>,
    onMoveDown: Function as PropType<(index: number) => void>,
    onMoveUp: Function as PropType<(index: number) => void>,
  },
  setup(props, { slots }) {
    const field = useField<ArrayField>()
    const schema = useFieldSchema()
    provide(ArrayBaseContext, {
      props: props as IArrayBaseProps,
      get field() {
        return field.value as ArrayField
      },
      get schema() {
        return schema.value as Schema
      },
    })
    return () => slots.default?.()
  },
})

export const ArrayBaseItem = defineComponent({
  name: 'ArrayBaseItem',
  props: {
    index: { type: Number, required: true },
    record: {
      type: [Function, Object] as PropType<IArrayBaseItemProps['record']>,
      required: true,
    },
  },
  setup(props, { slots }) {
    provide(ItemContext, props as IArrayBaseItemProps)
    return () => slots.default?.()
  },
})

/** 排序手柄，类名与 SortableContainer 的默认 handle 选择器一致 */
export const SortHandle = defineComponent<ButtonProps>(
  (_, { attrs }) => {
    const array = useArray()
    const prefixCls = usePrefixCls('array-base')
    return () => {
      if (!array) return null
      if (array.field?.pattern !== 'editable') return null
      return (
        <ElButton
          {...attrs}
          text
          size="small"
          icon={Rank}
          class={cls(`${prefixCls}-sort-handle`, attrs.class as string)}
        />
      )
    }
  },
  { name: 'ArrayBaseSortHandle', inheritAttrs: false }
)

export const Index = defineComponent<HTMLAttributes>(
  (_, { attrs }) => {
    const index = useIndex()
    const prefixCls = usePrefixCls('array-base')
    return () => (
      <span {...attrs} class={cls(`${prefixCls}-index`, attrs.class as string)}>
        #{index + 1}.
      </span>
    )
  },
  { name: 'ArrayBaseIndex', inheritAttrs: false }
)

export const Addition = defineComponent<IArrayAdditionProps>({
  name: 'ArrayBaseAddition',
  inheritAttrs: false,
  props: {
    title: String,
    method: String as PropType<'push' | 'unshift'>,
    defaultValue: { type: null as unknown as PropType<any>, default: undefined },
    onClick: Function as PropType<(e: MouseEvent) => void>,
  },
  setup(props, { attrs, slots }) {
    const self = useField()
    const array = useArray()
    const prefixCls = usePrefixCls('array-base')

    const handleClick = (e: MouseEvent) => {
      if (!array) return
      if (array.props?.disabled) return
      const defaultValue = getDefaultValue(props.defaultValue, array.schema)
      if (props.method === 'unshift') {
        array.field?.unshift?.(defaultValue)
        array.props?.onAdd?.(0)
      } else {
        array.field?.push?.(defaultValue)
        array.props?.onAdd?.((array.field?.value?.length ?? 0) - 1)
      }
      props.onClick?.(e)
    }

    return () => {
      if (!array) return null
      if (array.field?.pattern !== 'editable' && array.field?.pattern !== 'disabled') return null
      return (
        <ElButton
          {...attrs}
          disabled={self.value?.disabled}
          class={cls(`${prefixCls}-addition`, attrs.class as string)}
          icon={isUndef(attrs.icon) ? Plus : (attrs.icon as any)}
          onClick={handleClick}
        >
          {slots.default?.() ?? props.title ?? self.value?.title}
        </ElButton>
      )
    }
  },
})

export const Copy = defineComponent<IArrayCopyProps>({
  name: 'ArrayBaseCopy',
  inheritAttrs: false,
  props: {
    index: Number,
    title: String,
    copyRecord: Function as PropType<(record: any, index: number) => any>,
  },
  setup(props, { attrs, slots }) {
    const self = useField()
    const array = useArray()
    const index = useIndex(props.index)
    const prefixCls = usePrefixCls('array-base')

    const handleClick = (e: MouseEvent) => {
      if (self.value?.disabled) return
      e.stopPropagation()
      if (!array) return
      if (array.props?.disabled) return
      ;(attrs.onClick as any)?.(e)
      if (e.defaultPrevented) return
      const source = array.field?.value?.[index]
      const value = props.copyRecord ? props.copyRecord(source, index) : clone(source)
      const recordKey = array.field?.recordKey
      // 默认克隆会带上原记录的 key，移除字符串形式的 recordKey 字段避免副本重复
      if (!props.copyRecord && isStr(recordKey) && value && typeof value === 'object') {
        delete value[recordKey]
      }
      const distIndex = index + 1
      array.field?.insert?.(distIndex, value)
      array.props?.onCopy?.(distIndex)
    }

    return () => {
      if (!array) return null
      if (array.field?.pattern !== 'editable') return null
      return (
        <ElButton
          {...attrs}
          text
          size="small"
          disabled={self.value?.disabled}
          class={cls(`${prefixCls}-copy`, attrs.class as string)}
          icon={isUndef(attrs.icon) ? CopyDocument : (attrs.icon as any)}
          onClick={handleClick}
        >
          {slots.default?.() ?? props.title}
        </ElButton>
      )
    }
  },
})

export const Remove = defineComponent<IArrayActionProps>({
  name: 'ArrayBaseRemove',
  inheritAttrs: false,
  props: {
    index: Number,
    title: String,
  },
  setup(props, { attrs, slots }) {
    const index = useIndex(props.index)
    const self = useField()
    const array = useArray()
    const prefixCls = usePrefixCls('array-base')

    const handleClick = (e: MouseEvent) => {
      if (self.value?.disabled) return
      e.stopPropagation()
      if (!array) return
      ;(attrs.onClick as any)?.(e)
      if (e.defaultPrevented) return
      array.field?.remove?.(index)
      array.props?.onRemove?.(index)
    }

    return () => {
      if (!array) return null
      if (array.field?.pattern !== 'editable') return null
      return (
        <ElButton
          {...attrs}
          text
          size="small"
          disabled={self.value?.disabled}
          class={cls(`${prefixCls}-remove`, attrs.class as string)}
          icon={isUndef(attrs.icon) ? Delete : (attrs.icon as any)}
          onClick={handleClick}
        >
          {slots.default?.() ?? props.title}
        </ElButton>
      )
    }
  },
})

export const MoveDown = defineComponent<IArrayActionProps>({
  name: 'ArrayBaseMoveDown',
  inheritAttrs: false,
  props: {
    index: Number,
    title: String,
  },
  setup(props, { attrs, slots }) {
    const index = useIndex(props.index)
    const self = useField()
    const array = useArray()
    const prefixCls = usePrefixCls('array-base')

    const handleClick = (e: MouseEvent) => {
      if (self.value?.disabled) return
      e.stopPropagation()
      if (!array) return
      ;(attrs.onClick as any)?.(e)
      if (e.defaultPrevented) return
      array.field?.moveDown?.(index)
      array.props?.onMoveDown?.(index)
    }

    return () => {
      if (!array) return null
      if (array.field?.pattern !== 'editable') return null
      return (
        <ElButton
          {...attrs}
          text
          size="small"
          disabled={self.value?.disabled}
          class={cls(`${prefixCls}-move-down`, attrs.class as string)}
          icon={isUndef(attrs.icon) ? ArrowDown : (attrs.icon as any)}
          onClick={handleClick}
        >
          {slots.default?.() ?? props.title}
        </ElButton>
      )
    }
  },
})

export const MoveUp = defineComponent<IArrayActionProps>({
  name: 'ArrayBaseMoveUp',
  inheritAttrs: false,
  props: {
    index: Number,
    title: String,
  },
  setup(props, { attrs, slots }) {
    const index = useIndex(props.index)
    const self = useField()
    const array = useArray()
    const prefixCls = usePrefixCls('array-base')

    const handleClick = (e: MouseEvent) => {
      if (self.value?.disabled) return
      e.stopPropagation()
      if (!array) return
      ;(attrs.onClick as any)?.(e)
      if (e.defaultPrevented) return
      array.field?.moveUp?.(index)
      array.props?.onMoveUp?.(index)
    }

    return () => {
      if (!array) return null
      if (array.field?.pattern !== 'editable') return null
      return (
        <ElButton
          {...attrs}
          text
          size="small"
          disabled={self.value?.disabled}
          class={cls(`${prefixCls}-move-up`, attrs.class as string)}
          icon={isUndef(attrs.icon) ? ArrowUp : (attrs.icon as any)}
          onClick={handleClick}
        >
          {slots.default?.() ?? props.title}
        </ElButton>
      )
    }
  },
})
