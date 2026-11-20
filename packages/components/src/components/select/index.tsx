import { connect, mapProps, mapReadPretty } from '@formvk/vue'
import { ElSelect } from 'element-plus'

import { TextSelect } from '../preview-text'

export const Select: typeof ElSelect = connect(
  ElSelect,
  mapProps({
    dataSource: 'options',
    loading: true,
  }),
  mapReadPretty(TextSelect)
)
