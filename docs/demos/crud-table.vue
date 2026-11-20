<script setup lang="ts">
import { CrudTable, arrayComponents, fieldComponents, renders, voidComponents } from '@formvk/element-plus'
import { TableModel } from '@formvk/models'
import { createSchema, createSchemaOptions } from '@formvk/vue'
import { ElButton, ElPopconfirm, ElSpace, ElTableColumn } from 'element-plus'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

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

/** 把 renders 的列渲染函数适配成 ElTableColumn 默认插槽可用的组件 */
const Cell = defineComponent({
  name: 'RenderCell',
  inheritAttrs: false,
  props: {
    render: {
      type: Function as PropType<(text: any, record: any, index: number) => any>,
      required: true,
    },
    text: { type: null as unknown as PropType<any>, default: undefined },
    record: { type: Object as PropType<Record<string, any>>, default: undefined },
    index: { type: Number, default: 0 },
  },
  setup(props) {
    return () => props.render(props.text, props.record, props.index)
  },
})
</script>

<template>
  <OptionsProvider>
    <div class="demo">
      <ElButton type="primary" class="demo-add" @click="table.addPopup.open()">新增</ElButton>
      <CrudTable
        :table="table"
        title="用户"
        row-key="id"
        :search="searchSchema"
        :add="formSchema"
        :edit="formSchema"
        :popup-props="{ type: 'modal', width: 480 }"
      >
        <ElTableColumn label="序号" width="70">
          <template #default="{ $index }">
            <Cell :render="renders.serial()" :index="$index" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="用户名" prop="username">
          <template #default="{ row, $index }">
            <Cell :render="renders.text()" :text="row.username" :record="row" :index="$index" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="邮箱" prop="email">
          <template #default="{ row, $index }">
            <Cell :render="renders.text({ ellipsis: true })" :text="row.email" :record="row" :index="$index" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="140">
          <template #default="{ row }">
            <ElSpace>
              <ElButton link type="primary" @click="table.editPopup.open(row)">编辑</ElButton>
              <ElPopconfirm :title="`确认删除「${row.username}」？`" @confirm="table.onRemove(row)">
                <template #reference>
                  <ElButton link type="danger">删除</ElButton>
                </template>
              </ElPopconfirm>
            </ElSpace>
          </template>
        </ElTableColumn>
      </CrudTable>
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
