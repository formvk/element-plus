import { connect, mapProps, mapReadPretty } from '@formvk/vue'
import { ElRadio, ElRadioGroup } from 'element-plus'

import { TextSelect } from '../preview-text'

export const InternalRadio: typeof ElRadio = connect(ElRadio)

export const RadioGroup: typeof ElRadioGroup = connect(
  ElRadioGroup,
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty(TextSelect)
)

export const Radio: typeof ElRadio = InternalRadio
