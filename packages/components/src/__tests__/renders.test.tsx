import { TableModel } from '@formvk/models'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { ColumnRender } from '../containers/renders/types'
import { TableRenderProvider, renders } from '../index'

interface IRecord {
  id: number
  name?: string
  status?: number
  level?: number
  avatar?: string
  homepage?: string
  createdAt?: number | string
}

const records: IRecord[] = [
  {
    id: 1,
    name: 'alice',
    status: 1,
    level: 2,
    avatar: 'https://example.com/avatar.png',
    homepage: 'https://example.com',
    createdAt: new Date(2024, 0, 2, 3, 4, 5).getTime(),
  },
  { id: 2 },
]

const createTable = () =>
  new TableModel<IRecord>({
    state: { count: records.length },
    search: async () => records,
  })

interface ICell {
  render: ColumnRender<IRecord, any>
  text?: any
  record?: IRecord
  index?: number
}

const mountCells = (
  cells: ICell[],
  options: { table?: TableModel<IRecord>; placeholder?: any; scope?: Record<string, unknown> } = {}
) => {
  const table = options.table ?? createTable()
  return mount(
    () => (
      <TableRenderProvider value={{ table, placeholder: options.placeholder, scope: options.scope }}>
        <div class="root">
          {cells.map((cell, i) => (
            <div class="cell" key={i}>
              {cell.render(cell.text, cell.record ?? records[0], cell.index ?? 0)}
            </div>
          ))}
        </div>
      </TableRenderProvider>
    ),
    { attachTo: document.body }
  )
}

describe('表格渲染器', () => {
  it('内置渲染器渲染文本、选项、标签、时间与序号', () => {
    const wrapper = mountCells(
      [
        { render: renders.serial(), index: 0 },
        { render: renders.serial(), index: 1 },
        { render: renders.text(), text: 'alice' },
        { render: renders.text(), text: '' },
        {
          render: renders.option([
            { label: '启用', value: 1 },
            { label: '停用', value: 0 },
          ]),
          text: 1,
        },
        {
          render: renders.tag([
            { label: '普通', value: 1, type: 'info' },
            { label: '高级', value: 2, type: 'danger' },
          ]),
          text: 2,
        },
        { render: renders.time(), text: new Date(2024, 0, 2, 3, 4, 5).getTime() },
      ],
      { placeholder: '暂无' }
    )

    const cells = wrapper.findAll('.cell')
    expect(cells[0].text()).toBe('1')
    expect(cells[1].text()).toBe('2')
    expect(cells[2].text()).toBe('alice')
    // 空值回退到上下文的 placeholder
    expect(cells[3].text()).toBe('暂无')
    expect(cells[4].text()).toBe('启用')
    expect(cells[5].text()).toBe('高级')
    expect(wrapper.html()).toContain('el-tag')
    expect(cells[6].text()).toBe('2024-01-02 03:04:05')

    wrapper.unmount()
  })

  it('image 与 link 渲染器输出图片与链接', () => {
    const wrapper = mountCells([
      { render: renders.image({ size: 32 }), text: 'https://example.com/avatar.png' },
      {
        render: renders.link({ format: ({ record }) => `/user/${record.id}` }),
        text: 'https://example.com',
        record: records[0],
      },
    ])

    const html = wrapper.html()
    expect(html).toContain('src="https://example.com/avatar.png"')
    expect(html).toContain('width: 32px')
    expect(html).toContain('height: 32px')
    expect(html).toContain('href="/user/1"')
    expect(html).toContain('target="_blank"')

    wrapper.unmount()
  })

  it('createRender 可读取 table、$state 与自定义 scope', () => {
    const custom = renders.createRender<TableModel<IRecord>, { greeting: string }, IRecord['name']>(props => (
      <span>{`${props.greeting}-${props.text}-${props.$state.count}`}</span>
    ))

    const wrapper = mountCells([{ render: custom, text: 'alice' }], { scope: { greeting: 'hi' } })

    expect(wrapper.text()).toContain('hi-alice-2')

    wrapper.unmount()
  })

  it('缺少 TableRenderProvider 时抛出明确错误', () => {
    expect(() => mount(() => <div>{renders.text()('alice', records[0], 0)}</div>)).toThrow('表格渲染器缺少上下文')
  })
})
