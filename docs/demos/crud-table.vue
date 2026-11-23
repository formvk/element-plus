<script setup lang="tsx">
import { CrudTable, arrayComponents, fieldComponents, renders, voidComponents } from '@formvk/element-plus'
import type { DataTableProps } from '@formvk/element-plus'
import { TableModel } from '@formvk/models'
import { createSchema, createSchemaOptions } from '@formvk/vue'
import { ElButton, ElPopconfirm, ElSpace } from 'element-plus'

// 样式副作用导入，无需绑定变量
// oxlint-disable-next-line import/no-unassigned-import
import 'element-plus/dist/index.css'

interface IUser {
  id: number
  username: string
  email: string
}

let seed = 3
let users: IUser[] = [
  { id: 1, username: 'alice', email: 'alice@example.com' },
  { id: 2, username: 'bob', email: 'bob@example.com' },
]

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const searchSchema = createSchema({
  username: f.Input({ title: '用户名' }),
})

const formSchema = createSchema({
  username: f.Input({ title: '用户名', required: true }),
  email: f.Input({ title: '邮箱', required: true }),
})

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const table = new TableModel<IUser>({
  search: async (values, pagination) => {
    await delay(300)
    const keyword = (values.username ?? '').trim()
    const filtered = users.filter(user => user.username.includes(keyword))
    const start = (pagination.current - 1) * pagination.pageSize
    return {
      records: filtered.slice(start, start + pagination.pageSize),
      pagination: { ...pagination, total: filtered.length },
    }
  },
  add: async values => {
    await delay(300)
    users = [{ id: seed++, username: values.username ?? '', email: values.email ?? '' }, ...users]
    return true
  },
  edit: async values => {
    await delay(300)
    users = users.map(user => (user.id === values.id ? { ...user, ...values } : user))
    return true
  },
  remove: async record => {
    await delay(300)
    users = users.filter(user => user.id !== record.id)
    return true
  },
})

/** columns 里直接使用 renders，无需再包一层 Cell 组件 */
const columns: DataTableProps<IUser>['columns'] = [
  { label: '序号', width: 70, render: renders.serial() },
  { label: '用户名', prop: 'username', render: renders.text() },
  { label: '邮箱', prop: 'email', render: renders.text({ ellipsis: true }) },
  {
    label: '操作',
    width: 140,
    render: (_text, record) => (
      <ElSpace>
        <ElButton link type="primary" onClick={() => table.editPopup.open(record)}>
          编辑
        </ElButton>
        <ElPopconfirm title={`确认删除「${record.username}」？`} onConfirm={() => table.onRemove(record)}>
          {{
            reference: () => (
              <ElButton link type="danger">
                删除
              </ElButton>
            ),
          }}
        </ElPopconfirm>
      </ElSpace>
    ),
  },
]
</script>

<template>
  <OptionsProvider>
    <div class="demo">
      <ElButton type="primary" class="demo-add" @click="table.addPopup.open()">新增</ElButton>
      <CrudTable
        :table="table"
        title="用户"
        row-key="id"
        :columns="columns"
        :search="searchSchema"
        :add="formSchema"
        :edit="formSchema"
        :popup-props="{ type: 'modal', width: 480 }"
      />
    </div>
  </OptionsProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-add {
  align-self: flex-start;
}
</style>
