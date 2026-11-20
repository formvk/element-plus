import { UploadFilled, Upload as UploadIcon } from '@element-plus/icons-vue'
import type { Field } from '@formvk/core'
import { isArr, toArr } from '@formvk/shared'
import { connect, mapProps, useField } from '@formvk/vue'
import { ElButton, ElIcon, ElUpload } from 'element-plus'
import type { UploadPropsPublic } from 'element-plus'
import { defineComponent, watch } from 'vue'
import type { PropType, VNodeChild } from 'vue'

import { usePrefixCls } from '../../shared'
import { UPLOAD_PLACEHOLDER } from './placeholder'

export interface IUploadProps {
  fileList?: any[]
  textContent?: VNodeChild
  onChange?: (fileList: any[]) => void
  serviceErrorMessage?: string
  listType?: string
}

export type IDraggerUploadProps = IUploadProps

type UploadWrapperProps = Omit<UploadPropsPublic, 'fileList' | 'onChange' | 'listType'> & IUploadProps

const testOpts = (ext: RegExp, options: { exclude?: string[]; include?: string[] }) => {
  if (options && isArr(options.include)) {
    return options.include.some(url => ext.test(url))
  }
  if (options && isArr(options.exclude)) {
    return !options.exclude.some(url => ext.test(url))
  }
  return true
}

const getImageByUrl = (url: string, options: any) => {
  for (let i = 0; i < UPLOAD_PLACEHOLDER.length; i++) {
    if (UPLOAD_PLACEHOLDER[i].ext.test(url) && testOpts(UPLOAD_PLACEHOLDER[i].ext, options)) {
      return UPLOAD_PLACEHOLDER[i].icon || url
    }
  }
  return url
}

const getURL = (target: any) => target?.['url'] || target?.['downloadURL'] || target?.['imgURL']
const getThumbURL = (target: any) =>
  target?.['thumbUrl'] || target?.['url'] || target?.['downloadURL'] || target?.['imgURL']

const getErrorMessage = (target: any) => {
  return (
    target?.errorMessage ||
    target?.errMsg ||
    target?.errorMsg ||
    target?.message ||
    (typeof target?.error === 'string' ? target.error : '')
  )
}

const getState = (target: any) => {
  if (target?.success === false) return 'fail'
  if (target?.failed === true) return 'fail'
  if (target?.error) return 'fail'
  return target?.state || target?.status
}

const normalizeFileList = (fileList?: any[]) => {
  if (fileList && fileList.length) {
    return fileList.map((file, index) => {
      return {
        ...file,
        uid: file.uid || `${index}`,
        status: getState(file.response) || getState(file),
        url: getURL(file) || getURL(file?.response),
        thumbUrl: getImageByUrl(getThumbURL(file) || getThumbURL(file?.response), {
          exclude: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.icon', '.tif', '.tiff'],
        }),
      }
    })
  }
  return []
}

const useUploadValidator = (serviceErrorMessage = 'Upload Service Error') => {
  const field = useField<Field>()
  watch(
    () => field.value?.value,
    value => {
      const list = toArr(value)
      let message = ''
      for (let i = 0; i < list.length; i++) {
        const item: any = list[i]
        if (item?.status === 'error' || item?.status === 'fail') {
          message = getErrorMessage(item?.response) || getErrorMessage(item) || serviceErrorMessage
          break
        }
      }
      field.value?.setFeedback({
        type: 'error',
        code: 'UploadError',
        messages: message ? [message] : [],
      })
    }
  )
}

const useUploadProps = (props: Record<string, any>, attrs: Record<string, any>) => {
  const merged = { ...attrs, ...props } as IUploadProps & Record<string, any>
  useUploadValidator(merged.serviceErrorMessage)
  const onChange = (_file: any, uploadFiles: any[]) => {
    merged.onChange?.(normalizeFileList([...uploadFiles]))
  }
  return {
    ...merged,
    fileList: normalizeFileList(merged.fileList),
    onChange,
  }
}

const UploadWrapper = defineComponent<UploadWrapperProps>({
  name: 'Upload',
  inheritAttrs: false,
  props: {
    fileList: { type: Array as PropType<any[]>, default: undefined },
    textContent: { type: null as unknown as PropType<VNodeChild>, default: undefined },
    onChange: Function as PropType<(fileList: any[]) => void>,
    serviceErrorMessage: String,
    listType: String,
  },
  setup(props, { attrs, slots }) {
    return () => {
      const { onChange, ...rest } = useUploadProps(props as any, attrs)
      const placeholder =
        props.listType !== 'picture-card' ? (
          <ElButton>
            <ElIcon>
              <UploadIcon />
            </ElIcon>
            {props.textContent as VNodeChild}
          </ElButton>
        ) : null
      return (
        <ElUpload {...(rest as any)} onChange={onChange}>
          {slots.default?.() ?? placeholder}
        </ElUpload>
      )
    }
  },
})

const DraggerWrapper = defineComponent<UploadWrapperProps>({
  name: 'UploadDragger',
  inheritAttrs: false,
  props: {
    fileList: { type: Array as PropType<any[]>, default: undefined },
    textContent: { type: null as unknown as PropType<VNodeChild>, default: undefined },
    onChange: Function as PropType<(fileList: any[]) => void>,
    serviceErrorMessage: String,
    listType: String,
  },
  setup(props, { attrs, slots }) {
    const prefixCls = usePrefixCls('upload-dragger')
    return () => {
      const { onChange, ...rest } = useUploadProps(props as any, attrs)
      return (
        <div class={prefixCls}>
          <ElUpload {...(rest as any)} drag onChange={onChange}>
            {slots.default?.() ?? (
              <>
                <ElIcon class="el-icon--upload">
                  <UploadFilled />
                </ElIcon>
                {props.textContent && <div class="el-upload__text">{props.textContent as VNodeChild}</div>}
              </>
            )}
          </ElUpload>
        </div>
      )
    }
  },
})

export const Upload = connect(
  UploadWrapper,
  mapProps({
    value: 'fileList',
  })
)

export const UploadDragger = connect(
  DraggerWrapper,
  mapProps({
    value: 'fileList',
  })
)
