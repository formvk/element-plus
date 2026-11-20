import { TableModel } from '@formvk/models'
import { createSchema } from '@formvk/vue'
import { mount } from '@vue/test-utils'
import { ElTableColumn } from 'element-plus'
import { describe, expect, it } from 'vitest'

import { CrudTable, renders } from '../index'
import { OptionsProvider, f } from './helpers'

interface IRecord {
  id: number
  name: string
}

const records: IRecord[] = [
  { id: 1, name: 'alice' },
  { id: 2, name: 'bob' },
]

const createTable = () =>
  new TableModel<IRecord>({
    state: { count: records.length },
    search: async () => records,
  })

describe('CrudTable', () => {
  it('渲染搜索表单、数据列与分页', async () => {
    const table = createTable()
    await table.onSearch()

    const searchSchema = createSchema({
      keyword: f.Input({ title: '关键字' }),
    })

    const wrapper = mount(() => (
      <OptionsProvider>
        <CrudTable table={table} row-key="id" search={searchSchema}>
          {{
            default: () => (
              <ElTableColumn label="名称" min-width="120">
                {{
                  default: ({ row, $index }: any) => renders.text()(row.name, row, $index),
                }}
              </ElTableColumn>
            ),
          }}
        </CrudTable>
      </OptionsProvider>
    ))

    await new Promise(resolve => setTimeout(resolve, 0))

    const html = wrapper.html()
    expect(html).toContain('关键字')
    expect(html).toContain('alice')
    expect(html).toContain('bob')
    // 分页在 total 大于 0 时由 ElPagination 渲染
    expect(html).toContain('el-pagination')

    wrapper.unmount()
  })
})
