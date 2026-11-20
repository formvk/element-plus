import { SchemaField, createForm, createSchemaOptions } from '@formvk/vue'

import { arrayComponents, fieldComponents, voidComponents } from '../index'

/** 测试统一使用与文档一致的注册表 */
export const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

export { SchemaField, createForm }
