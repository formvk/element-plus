import { connect, mapReadPretty } from '@formvk/vue'
import { ElInputNumber } from 'element-plus'

import { TextInputNumber } from '../preview-text'

export type InputNumberRef = InstanceType<typeof ElInputNumber>

export const InputNumber: typeof ElInputNumber = connect(ElInputNumber, mapReadPretty(TextInputNumber))
