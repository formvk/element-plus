<script setup lang="ts">
import {
  AddPopup,
  DataTable,
  EditPopup,
  SearchForm,
  TableRenderProvider,
  arrayComponents,
  fieldComponents,
  renders,
  voidComponents,
} from '@formvk/element-plus'
import type { DataTableProps } from '@formvk/element-plus'
import { TableModel } from '@formvk/models'
import { createSchema, createSchemaOptions } from '@formvk/vue'
import { ElButton, ElCard, ElPopconfirm, ElSpace } from 'element-plus'
import { h } from 'vue'

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
    render: (_text, record) =>
      h(ElSpace, null, () => [
        h(ElButton, { link: true, type: 'primary', onClick: () => table.editPopup.open(record) }, () => '编辑'),
        h(
          ElPopconfirm,
          { title: `确认删除「${record.username}」？`, onConfirm: () => table.onRemove(record) },
          { reference: () => h(ElButton, { link: true, type: 'danger' }, () => '删除') }
        ),
      ]),
  },
]
</script>

<template>
  <OptionsProvider>
    <!-- 一个 Provider 即可让下列组件共享同一个表格模型 -->
    <TableRenderProvider :value="{ table }">
      <ElCard>
        <template #header>
          <div class="demo-header">
            <span>用户列表</span>
            <ElButton type="primary" @click="table.addPopup.open()">新增</ElButton>
          </div>
        </template>
        <div class="demo-body">
          <!-- 搜索表单可放到任意位置，提交后自动刷新表格 -->
          <SearchForm :schema="searchSchema" />
          <DataTable row-key="id" :columns="columns" />
        </div>
      </ElCard>
      <AddPopup type="modal" title="新增用户" :width="480" :schema="formSchema" />
      <EditPopup type="modal" title="编辑用户" :width="480" :schema="formSchema" />
    </TableRenderProvider>
  </OptionsProvider>
</template>

<style scoped>
.demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.demo-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
