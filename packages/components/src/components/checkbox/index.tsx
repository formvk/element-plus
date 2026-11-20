import { connect, mapProps, mapReadPretty } from '@formvk/vue'
import { ElCheckbox, ElCheckboxGroup } from 'element-plus'

import { TextSelect } from '../preview-text'

export const Checkbox: typeof ElCheckbox = connect(ElCheckbox)

export const CheckboxGroup: typeof ElCheckboxGroup = connect(
  ElCheckboxGroup,
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty(TextSelect, {
    multiple: true,
  })
)
