import { connect, mapProps, mapReadPretty } from '@formvk/vue'
import { ElCheckbox, ElCheckboxGroup } from 'element-plus'

import { TextSelect } from '../preview-text'

export const Checkbox = connect(ElCheckbox)

export const CheckboxGroup = connect(
  ElCheckboxGroup,
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty(TextSelect, {
    mode: 'tags',
  })
)
