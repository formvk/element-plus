import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export type ICollapsePanelProps = {
  /** 面板标题 */
  title?: string
  /** 面板标识 */
  key?: string | number
  name?: string | number
  disabled?: boolean
}

export type IColumnProps = {
  /** 列标题 */
  title?: string
  /** 列标识 */
  dataIndex?: string
  key?: string | number
  width?: number | string
  fixed?: boolean | 'left' | 'right'
}

export interface ITabPaneProps {
  /** 面板标识 */
  key: string | number
  name?: string | number
  /** 标签文案 */
  label?: string
  disabled?: boolean
}

export type IStepPaneProps = {
  /** 步骤标题 */
  title?: string
  /** 步骤描述 */
  description?: string
  /** 自定义图标 */
  icon?: any
  status?: string
}

/**
 * 折叠面板结构标记。
 * 实际面板由 FormCollapse / ArrayCollapse 读取 schema 后渲染，这里只透传 children。
 */
export const CollapsePanel = defineComponent({
  name: 'CollapsePanel',
  inheritAttrs: false,
  props: {
    title: String,
    name: [String, Number] as PropType<string | number>,
    disabled: Boolean,
  },
  setup(_, { slots }) {
    return () => slots.default?.()
  },
})

/**
 * 表格列结构标记。
 * 实际列由 ArrayTable / SelectTable 读取 schema 后渲染，这里不产出任何内容。
 */
export const Column = defineComponent({
  name: 'Column',
  props: {
    title: String,
    dataIndex: [String, Number] as PropType<string | number>,
    width: [String, Number] as PropType<string | number>,
    fixed: [String, Boolean] as PropType<boolean | 'left' | 'right'>,
  },
  setup() {
    return () => null
  },
})

/**
 * 标签页面板结构标记。
 * 实际面板由 FormTab 读取 schema 后渲染，这里只透传 children。
 */
export const TabPane = defineComponent({
  name: 'TabPane',
  inheritAttrs: false,
  props: {
    label: String,
    name: [String, Number] as PropType<string | number>,
    disabled: Boolean,
  },
  setup(_, { slots }) {
    return () => slots.default?.()
  },
})

/**
 * 步骤面板结构标记。
 * 实际步骤由 FormStep 读取 schema 后渲染，这里只透传 children。
 */
export const StepPane = defineComponent({
  name: 'StepPane',
  inheritAttrs: false,
  props: {
    title: String,
    description: String,
    status: String,
    icon: { type: null as unknown as PropType<any>, default: undefined },
  },
  setup(_, { slots }) {
    return () => slots.default?.()
  },
})
