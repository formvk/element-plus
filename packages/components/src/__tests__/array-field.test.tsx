import { createSchema } from '@formvk/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { Form } from '../index'
import { OptionsProvider, SchemaField, createForm, f } from './helpers'

const countInputs = (html: string) => (html.match(/<input /g) || []).length
const inputValues = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('input').map(input => (input.element as HTMLInputElement).value)

describe('ArrayItems', () => {
  it('对象数组 push/remove 与原始数组 push 后正确渲染', async () => {
    const form = createForm({
      values: {
        users: [{ name: 'a' }],
        tags: ['x'],
      },
    })
    const schema = createSchema({
      users: f.ArrayItems(f.Object({ name: f.Input({ title: '姓名' }) })),
      tags: f.ArrayItems(f.Input()),
    })

    const wrapper = mount(() => (
      <OptionsProvider>
        <Form form={form}>
          <SchemaField schema={schema} />
        </Form>
      </OptionsProvider>
    ))

    await new Promise(resolve => setTimeout(resolve, 0))
    expect(countInputs(wrapper.html())).toBe(2)
    expect(inputValues(wrapper)).toContain('a')

    const usersField = form.query('users').take() as any
    await usersField.push({ name: 'b' })
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(countInputs(wrapper.html())).toBe(3)
    expect(inputValues(wrapper)).toContain('b')

    await usersField.remove(0)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(countInputs(wrapper.html())).toBe(2)
    expect(inputValues(wrapper)).not.toContain('a')
    expect(inputValues(wrapper)).toContain('b')

    const tagsField = form.query('tags').take() as any
    await tagsField.push('y')
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(countInputs(wrapper.html())).toBe(3)
    expect(inputValues(wrapper)).toContain('y')

    wrapper.unmount()
  })
})
