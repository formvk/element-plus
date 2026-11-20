import { computed, inject } from 'vue'
import type { ComputedRef, CSSProperties, InjectionKey, VNodeChild } from 'vue'

/**
 * FormLayout 与 FormItem 共用的布局属性。
 * FormLayout 上的配置通过上下文向下传递，FormItem 声明同名属性时优先生效。
 */
export interface IFormItemBaseProps {
  /** 类名前缀 */
  prefixCls?: string
  /** 是否在标签后显示冒号，默认为 true */
  colon?: boolean
  /** 标签超出可用宽度时是否换行 */
  labelWrap?: boolean
  /** 包裹组件超出可用宽度时是否换行 */
  wrapperWrap?: boolean
  /** 反馈信息是否占满整行 */
  fullness?: boolean
  /** 组件尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 是否使用紧凑的内联布局 */
  inset?: boolean
  /** 是否显示边框，FormItem 默认为 true */
  bordered?: boolean
  /** 提示信息的展示形式 */
  tooltipLayout?: 'icon' | 'text'
  /** 自定义提示图标 */
  tooltipIcon?: VNodeChild
  /** 标签宽度 */
  labelWidth?: number | string
  /** 包裹组件宽度 */
  wrapperWidth?: number | string
  /** 布局方向 */
  layout?: 'vertical' | 'horizontal' | 'inline'
  /** 标签对齐方式 */
  labelAlign?: 'left' | 'right'
  /** 包裹组件对齐方式 */
  wrapperAlign?: 'left' | 'right'
  /** 标签占据的栅格列数 */
  labelCol?: number
  /** 包裹组件占据的栅格列数 */
  wrapperCol?: number
  /** 标签行内样式 */
  labelStyle?: CSSProperties
  /** 包裹组件行内样式 */
  wrapperStyle?: CSSProperties
}

export interface IFormLayoutProps extends Omit<
  IFormItemBaseProps,
  'labelAlign' | 'wrapperAlign' | 'layout' | 'labelCol' | 'wrapperCol'
> {
  labelAlign?: IFormItemBaseProps['labelAlign'] | NonNullable<IFormItemBaseProps['labelAlign']>[]
  wrapperAlign?: IFormItemBaseProps['wrapperAlign'] | NonNullable<IFormItemBaseProps['wrapperAlign']>[]
  labelCol?: IFormItemBaseProps['labelCol'] | NonNullable<IFormItemBaseProps['labelCol']>[]
  wrapperCol?: IFormItemBaseProps['wrapperCol'] | NonNullable<IFormItemBaseProps['wrapperCol']>[]
  layout?: IFormItemBaseProps['layout'] | NonNullable<IFormItemBaseProps['layout']>[]
  /** 表单方向，rtl 时整体镜像 */
  direction?: 'rtl' | 'ltr'
  /** 是否只把部分配置（size、colon）透传给子级 */
  shallow?: boolean
  /** 反馈信息的展示形式 */
  feedbackLayout?: 'loose' | 'terse' | 'popover' | 'none'
  /** 响应式断点，数组属性按此切换取值 */
  breakpoints?: number[]
  /** 栅格间距 */
  spaceGap?: number
  /** 栅格列间距 */
  gridColumnGap?: number
  /** 栅格行间距 */
  gridRowGap?: number
}

export interface IFormLayoutContext extends Omit<
  IFormLayoutProps,
  'labelAlign' | 'wrapperAlign' | 'layout' | 'labelCol' | 'wrapperCol'
> {
  labelAlign?: IFormItemBaseProps['labelAlign']
  wrapperAlign?: IFormItemBaseProps['wrapperAlign']
  layout?: IFormItemBaseProps['layout']
  labelCol?: IFormItemBaseProps['labelCol']
  wrapperCol?: IFormItemBaseProps['wrapperCol']
  direction?: 'rtl' | 'ltr'
}

export const FormLayoutDeepContext: InjectionKey<ComputedRef<IFormLayoutContext>> = Symbol('FormLayoutDeepContext')

export const FormLayoutShallowContext: InjectionKey<ComputedRef<IFormLayoutContext>> =
  Symbol('FormLayoutShallowContext')

export const useFormDeepLayout = () =>
  inject(
    FormLayoutDeepContext,
    computed(() => ({}) as IFormLayoutContext)
  )

export const useFormShallowLayout = () =>
  inject(
    FormLayoutShallowContext,
    computed(() => ({}) as IFormLayoutContext)
  )

export const useFormLayout = () =>
  computed(() => ({
    ...useFormDeepLayout().value,
    ...useFormShallowLayout().value,
  }))
