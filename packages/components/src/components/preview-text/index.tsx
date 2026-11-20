import type { Field } from '@formvk/core'
import { isArr, isValid, toArr } from '@formvk/shared'
import { useField } from '@formvk/vue'
import { ElTag } from 'element-plus'
import { computed, defineComponent } from 'vue'
import type { HTMLAttributes, PropType, VNodeChild } from 'vue'

import { usePlaceholder } from '../../hooks'
import { cls, formatDayjsValue, usePrefixCls } from '../../shared'

export { Placeholder, PlaceholderContext, usePlaceholder } from '../../hooks'

export interface ITextProps extends HTMLAttributes {
  prefixCls?: string
  modelValue?: any
}

/** 输入类预览文本：addon / 前后缀来自字段透传的 attrs */
export interface ITextInputProps extends Omit<ITextProps, 'prefix'> {
  addonBefore?: VNodeChild
  addonAfter?: VNodeChild
  prefix?: VNodeChild
  suffix?: VNodeChild
}

export interface ITextInputNumberProps extends ITextInputProps {
  formatter?: (value: string | number, info?: any) => string
}

export interface ITextSelectProps extends ITextProps {
  options?: any[]
  multiple?: boolean
}

export interface ITextTreeSelectProps extends ITextProps {
  data?: any[]
  multiple?: boolean
  treeNodeLabelProp?: string
}

export interface ITextCascaderProps extends ITextProps {
  options?: any[]
  multiple?: boolean
}

export interface ITextFormatProps extends ITextProps {
  format?: any
}

const useTextPrefixCls = (attrs: Record<string, any>) => usePrefixCls('form-text', { prefixCls: attrs.prefixCls })

export const TextInput = defineComponent<ITextInputProps>({
  name: 'TextInput',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
  },
  setup(props, { attrs }) {
    const prefixCls = useTextPrefixCls(attrs)
    const placeholder = usePlaceholder(() => props.modelValue)
    return () => (
      <span class={cls(prefixCls, attrs.class as string)} style={attrs.style as any}>
        {attrs.addonBefore as VNodeChild}
        {attrs.prefix as VNodeChild}
        {placeholder.value}
        {attrs.suffix as VNodeChild}
        {attrs.addonAfter as VNodeChild}
      </span>
    )
  },
})

export const TextInputNumber = defineComponent<ITextInputNumberProps>({
  name: 'TextInputNumber',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
    formatter: Function as PropType<(value: string | number, info?: any) => string>,
  },
  setup(props, { attrs }) {
    const prefixCls = useTextPrefixCls(attrs)
    const placeholder = usePlaceholder(() => {
      if (props.formatter) {
        return props.formatter(String(props.modelValue), {
          userTyping: false,
          input: '',
        })
      }
      return props.modelValue
    })
    return () => (
      <span class={cls(prefixCls, attrs.class as string)} style={attrs.style as any}>
        {attrs.addonBefore as VNodeChild}
        {attrs.prefix as VNodeChild}
        {placeholder.value}
        {attrs.suffix as VNodeChild}
        {attrs.addonAfter as VNodeChild}
      </span>
    )
  },
})

export const TextSelect = defineComponent<ITextSelectProps>({
  name: 'TextSelect',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
    options: Array as PropType<any[]>,
    multiple: Boolean,
  },
  setup(props, { attrs }) {
    const field = useField<Field>()
    const prefixCls = useTextPrefixCls(attrs)
    const placeholder = usePlaceholder(() => props.modelValue)

    const dataSource = computed<any[]>(() => {
      const fieldDataSource = field.value?.dataSource
      if (fieldDataSource?.length) return fieldDataSource
      const options = props.options ?? (attrs.options as any[])
      return options?.length ? options : []
    })

    const getSelected = () => {
      const value = props.modelValue
      const multiple = props.multiple
      if (multiple) {
        return isArr(value) ? value : []
      }
      return isValid(value) ? [value] : []
    }

    const getLabel = (target: any) => {
      const targetValue = typeof target === 'object' && target !== null ? target.value : target
      return (
        dataSource.value?.find(item => item.value == targetValue)?.label ||
        (typeof target === 'object' && target !== null ? target.label : target) ||
        placeholder.value
      )
    }

    return () => {
      const selected = getSelected()
      if (!selected.length) {
        return (
          <div class={cls(prefixCls, attrs.class as string)} style={attrs.style as any}>
            {placeholder.value}
          </div>
        )
      }
      if (selected.length === 1) {
        return (
          <div class={cls(prefixCls, attrs.class as string)} style={attrs.style as any}>
            {getLabel(selected[0])}
          </div>
        )
      }
      return (
        <div class={cls(prefixCls, attrs.class as string)} style={attrs.style as any}>
          {selected.map((item, key) => (
            <ElTag key={key}>{getLabel(item)}</ElTag>
          ))}
        </div>
      )
    }
  },
})

export const TextTreeSelect = defineComponent<ITextTreeSelectProps>({
  name: 'TextTreeSelect',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
    data: Array as PropType<any[]>,
    multiple: Boolean,
    treeNodeLabelProp: String,
  },
  setup(props, { attrs }) {
    const field = useField<Field>()
    const prefixCls = useTextPrefixCls(attrs)
    const placeholder = usePlaceholder(() => props.modelValue)

    const dataSource = computed<any[]>(() => {
      const fieldDataSource = field.value?.dataSource
      if (fieldDataSource?.length) return fieldDataSource
      const data = props.data ?? (attrs.data as any[])
      return data?.length ? data : []
    })

    const getSelected = () => {
      const value = props.modelValue
      if (props.multiple) {
        return isArr(value) ? value : []
      }
      return value !== undefined && value !== null && value !== '' ? [value] : []
    }

    const findLabel = (value: any, treeData: any[]): any => {
      for (let i = 0; i < treeData?.length; i++) {
        const item = treeData[i]
        if (item?.value === value) {
          return item?.label ?? item[props.treeNodeLabelProp as string]
        } else {
          const childLabel = findLabel(value, item?.children)
          if (childLabel) return childLabel
        }
      }
    }

    return () => {
      const selected = getSelected()
      if (!selected.length) {
        return (
          <div class={cls(prefixCls, attrs.class as string)} style={attrs.style as any}>
            <ElTag>{placeholder.value}</ElTag>
          </div>
        )
      }
      return (
        <div class={cls(prefixCls, attrs.class as string)} style={attrs.style as any}>
          {selected.map((value, key) => (
            <ElTag key={key}>{findLabel(value, dataSource.value) ?? placeholder.value}</ElTag>
          ))}
        </div>
      )
    }
  },
})

export const TextCascader = defineComponent<ITextCascaderProps>({
  name: 'TextCascader',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
    options: Array as PropType<any[]>,
    multiple: Boolean,
  },
  setup(props, { attrs }) {
    const field = useField<Field>()
    const prefixCls = useTextPrefixCls(attrs)
    const placeholder = usePlaceholder(() => props.modelValue)

    const dataSource = computed<any[]>(() => {
      const fieldDataSource = field.value?.dataSource
      if (fieldDataSource?.length) return fieldDataSource
      const options = props.options ?? (attrs.options as any[])
      return options?.length ? options : []
    })

    const findSelectedItems = (sources: any[], selectedValues: any[][]): any[][] => {
      return selectedValues.map(value => {
        const result: any[] = []
        let items = sources
        value.forEach(val => {
          const selectedItem = items?.find(item => item.value == val)
          result.push({
            label: selectedItem?.label ?? '',
            value: selectedItem?.value,
          })
          items = selectedItem?.children ?? []
        })
        return result
      })
    }

    return () => {
      const val = toArr(props.modelValue)
      const selected = props.multiple ? val : [val]
      const values = findSelectedItems(dataSource.value, selected)
      const labels = values.map(items => items.map(item => item.label).join('/')).join(' ')
      return (
        <div class={cls(prefixCls, attrs.class as string)} style={attrs.style as any}>
          {labels || placeholder.value}
        </div>
      )
    }
  },
})

const useFormatLabels = (props: any) => {
  const placeholder = usePlaceholder(() => props.modelValue)
  const prefixCls = useTextPrefixCls(props)
  const labels = formatDayjsValue(props.modelValue, props.format, placeholder.value)
  return {
    prefixCls,
    labels: isArr(labels) ? labels.join('~') : labels,
  }
}

export const TextDatePicker = defineComponent<ITextFormatProps>({
  name: 'TextDatePicker',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
    format: { type: null as unknown as PropType<any>, default: undefined },
  },
  setup(props, { attrs }) {
    return () => {
      const { prefixCls, labels } = useFormatLabels({ ...props, ...attrs, modelValue: props.modelValue })
      return <div class={cls(prefixCls, attrs.class as string)}>{labels}</div>
    }
  },
})

export const TextDateRangePicker = defineComponent<ITextFormatProps>({
  name: 'TextDateRangePicker',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
    format: { type: null as unknown as PropType<any>, default: undefined },
  },
  setup(props, { attrs }) {
    return () => {
      const { prefixCls, labels } = useFormatLabels({ ...props, ...attrs, modelValue: props.modelValue })
      return (
        <div class={cls(prefixCls, attrs.class as string)} style={attrs.style as any}>
          {labels}
        </div>
      )
    }
  },
})

export const TextTimePicker = defineComponent<ITextFormatProps>({
  name: 'TextTimePicker',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
    format: { type: null as unknown as PropType<any>, default: undefined },
  },
  setup(props, { attrs }) {
    return () => {
      const { prefixCls, labels } = useFormatLabels({ ...props, ...attrs, modelValue: props.modelValue })
      return (
        <div class={cls(prefixCls, attrs.class as string)} style={attrs.style as any}>
          {labels}
        </div>
      )
    }
  },
})

export const TextTimeRangePicker = defineComponent<ITextFormatProps>({
  name: 'TextTimeRangePicker',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
    format: { type: null as unknown as PropType<any>, default: undefined },
  },
  setup(props, { attrs }) {
    return () => {
      const { prefixCls, labels } = useFormatLabels({ ...props, ...attrs, modelValue: props.modelValue })
      return (
        <div class={cls(prefixCls, attrs.class as string)} style={attrs.style as any}>
          {labels}
        </div>
      )
    }
  },
})

export const Text = defineComponent<ITextProps>({
  name: 'Text',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
  },
  setup(props, { attrs }) {
    const prefixCls = useTextPrefixCls(attrs)
    const placeholder = usePlaceholder(() => props.modelValue)
    return () => (
      <div class={cls(prefixCls, attrs.class as string)} style={attrs.style as any}>
        {placeholder.value}
      </div>
    )
  },
})
