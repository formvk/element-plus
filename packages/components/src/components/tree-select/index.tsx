import { connect, mapProps, mapReadPretty } from '@formvk/vue'
import { ElTreeSelect } from 'element-plus'

import { TextTreeSelect } from '../preview-text'

export const TreeSelect = connect(
  ElTreeSelect,
  mapProps({
    dataSource: 'data',
  }),
  mapReadPretty(TextTreeSelect)
)
