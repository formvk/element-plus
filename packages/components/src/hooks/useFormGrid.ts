import { inject } from 'vue'
import type { InjectionKey } from 'vue'

import type { Grid } from '../components/form-grid/grid'

export const FormGridContext: InjectionKey<Grid<HTMLElement>> = Symbol('FormvkFormGridContext')

export const useFormGrid = () => inject(FormGridContext, null)
