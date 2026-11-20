import { isValid } from '@formvk/shared'
import { computed, defineComponent, inject, provide } from 'vue'
import type { ComputedRef, InjectionKey, PropType } from 'vue'

export const PlaceholderContext: InjectionKey<ComputedRef<any>> = Symbol('FormvkPlaceholderContext')

export const usePlaceholder = (value?: any) => {
  const placeholderRef = inject(
    PlaceholderContext,
    computed(() => 'N/A')
  )
  return computed(() => {
    const current = typeof value === 'function' ? value() : value
    return isValid(current) && current !== '' ? current : placeholderRef.value
  })
}

/** 提供空值占位符，Form 通过 previewTextPlaceholder 配置 */
export const Placeholder = defineComponent({
  name: 'Placeholder',
  props: {
    value: {
      type: null as unknown as PropType<any>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    provide(
      PlaceholderContext,
      computed(() => {
        const value = props.value
        return isValid(value) && value !== '' ? value : 'N/A'
      })
    )
    return () => slots.default?.()
  },
})
