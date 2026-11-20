import { createSchema } from '@formvk/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { Form } from '../index'
import { OptionsProvider, SchemaField, createForm, f } from './helpers'

const mountForm = (form: ReturnType<typeof createForm<any>>, schema: any, formProps: Record<string, any> = {}) =>
  mount(
    () => (
      <OptionsProvider>
        <Form form={form} {...formProps}>
          <SchemaField schema={schema} />
        </Form>
      </OptionsProvider>
    ),
    { attachTo: document.body }
  )

describe('SchemaField 基础渲染', () => {
  it('渲染 Input / Select，回填初始值并渲染 FormItem 标题', async () => {
    const form = createForm({ values: { name: 'alice', role: 'admin' } })
    const schema = createSchema({
      name: f.Input({ title: '姓名' }),
      role: f.Select({
        title: '角色',
        componentProps: {
          options: [
            { label: '管理员', value: 'admin' },
            { label: '访客', value: 'guest' },
          ],
        },
      }),
    })

    const wrapper = mountForm(form, schema)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('姓名')
    expect(wrapper.text()).toContain('角色')
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect((input.element as HTMLInputElement).value).toBe('alice')
    expect(wrapper.html()).toContain('el-select')

    wrapper.unmount()
  })

  it('readPretty 通过 Text 阅读态组件渲染纯文本，不渲染 input', async () => {
    const form = createForm({ values: { name: 'bob' }, readPretty: true })
    const schema = createSchema({
      name: f.Input({ title: '名称' }),
    })

    const wrapper = mountForm(form, schema)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('bob')
    expect(wrapper.find('input').exists()).toBe(false)

    wrapper.unmount()
  })

  it('容器组件通过 f 构造（FormGrid / TabPane / CollapsePanel）', async () => {
    const form = createForm()
    const schema = createSchema({
      grid: f.FormGrid({
        properties: {
          g: f.Input({ title: 'G' }),
        },
      }),
      tabs: f.FormTab({
        properties: {
          pane: f.TabPane({
            properties: {
              t: f.Input({ title: 'T' }),
            },
          }),
        },
      }),
      collapse: f.FormCollapse({
        properties: {
          panel: f.CollapsePanel({
            properties: {
              c: f.Input({ title: 'C' }),
            },
          }),
        },
      }),
    })

    const wrapper = mountForm(form, schema)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.html()).toContain('formvk-grid')
    expect(wrapper.html()).toContain('el-tabs')
    expect(wrapper.html()).toContain('el-collapse')

    wrapper.unmount()
  })
})
