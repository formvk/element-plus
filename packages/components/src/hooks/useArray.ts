import type { ArrayField } from '@formvk/core'
import type { Schema } from '@formvk/schema'
import { inject } from 'vue'
import type { InjectionKey } from 'vue'

import type { IArrayBaseItemProps, IArrayBaseProps } from '../components/array-base'

export interface IArrayBaseContext {
  props: IArrayBaseProps
  field: ArrayField
  schema: Schema
}

export const ArrayBaseContext: InjectionKey<IArrayBaseContext> = Symbol('FormvkArrayBaseContext')

export const ItemContext: InjectionKey<IArrayBaseItemProps> = Symbol('FormvkArrayItemContext')

const takeRecord = (val: any, index?: number) => (typeof val === 'function' ? val(index) : val)

export const useArray = () => {
  return inject(ArrayBaseContext, null)
}

export const useIndex = (index?: number) => {
  const ctx = inject(ItemContext, null)
  return (ctx ? ctx.index : index) || 0
}

export const useRecord = (record?: number) => {
  const ctx = inject(ItemContext, null)
  return takeRecord(ctx ? ctx.record : record, ctx?.index)
}
