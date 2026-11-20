import { connect, mapProps, mapReadPretty } from '@formvk/vue'
import { ElRadio, ElRadioGroup } from 'element-plus'

import { TextSelect } from '../preview-text'

export const InternalRadio = connect(ElRadio)

export const RadioGroup = connect(
  ElRadioGroup,
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty(TextSelect)
)

export const Radio = InternalRadio
