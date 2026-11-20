import { connect, mapProps, mapReadPretty } from '@formvk/vue'
import { ElCascader } from 'element-plus'

import { TextCascader } from '../preview-text'

export const Cascader: typeof ElCascader = connect(
  ElCascader,
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty(TextCascader)
)
