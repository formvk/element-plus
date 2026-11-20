import { isArr, isEmpty, isFn } from '@formvk/shared'
import dayjs from 'dayjs'
import type { ConfigType, Dayjs } from 'dayjs'

export function dayjsable(value: ConfigType, format?: string): Dayjs
export function dayjsable(value: ConfigType[], format?: string): Dayjs[]

export function dayjsable(value: ConfigType | ConfigType[], format?: string): any {
  if (!value) return value
  if (Array.isArray(value)) {
    return value.map(val => {
      const date = dayjs(val, format)
      if (date.isValid()) return date
      const parsedDate = dayjs(val)
      return parsedDate.isValid() ? parsedDate : val
    })
  } else {
    const date = dayjs(value, format)
    if (date.isValid()) return date
    const parsedDate = dayjs(value)
    return parsedDate.isValid() ? parsedDate : value
  }
}

export const formatDayjsValue = (value: any, format: any, placeholder?: string): string | string[] => {
  const validFormatDate = (date: any, dateFormat: any) => {
    if (typeof date === 'number') {
      return dayjs(date).format(dateFormat)
    }
    const parsedDate = dayjs(date, dateFormat)
    return parsedDate.isValid() ? parsedDate.format(dateFormat) : date
  }

  const formatDate = (date: any, dateFormat: any, i = 0) => {
    if (!date) return placeholder
    if (isArr(dateFormat)) {
      const formatItem = dateFormat[i]
      if (isFn(formatItem)) {
        return formatItem(date)
      }
      if (isEmpty(formatItem)) {
        return date
      }
      return validFormatDate(date, formatItem)
    } else {
      if (isFn(dateFormat)) {
        return dateFormat(date)
      }
      if (isEmpty(dateFormat)) {
        return date
      }
      return validFormatDate(date, dateFormat)
    }
  }
  if (isArr(value)) {
    return value.map((val, index) => {
      return formatDate(val, format, index)
    })
  } else {
    return value ? formatDate(value, format) : value || placeholder
  }
}
