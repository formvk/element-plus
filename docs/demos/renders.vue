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

interface ITask {
  id: number
  name: string
  status: number
  level: number
  avatar: string
  homepage: string
  createdAt: number
}

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const editSchema = createSchema({
  name: f.Input({ title: '任务名称', required: true }),
})

const statusOptions = [
  { label: '进行中', value: 1 },
  { label: '已完成', value: 0 },
]

const levelOptions = [
  { label: '普通', value: 1, type: 'primary' },
  { label: '重要', value: 2, type: 'warning' },
  { label: '紧急', value: 3, type: 'danger' },
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

let tasks: ITask[] = [
  {
    id: 1,
    name: '接入内置渲染器',
    status: 1,
    level: 3,
    avatar: 'https://picsum.photos/seed/formvk-1/64/64',
    homepage: 'https://element-plus.org/zh-CN/component/table.html',
    createdAt: new Date(2026, 0, 8, 10, 30, 0).getTime(),
  },
  {
    id: 2,
    name: '补充 CrudTable 弹窗配置',
    status: 0,
    level: 2,
    avatar: 'https://picsum.photos/seed/formvk-2/64/64',
    homepage: 'https://element-plus.org/zh-CN/component/dialog.html',
    createdAt: new Date(2026, 1, 18, 16, 45, 0).getTime(),
  },
  {
    id: 3,
    name: '校验空值占位符',
    status: 1,
    level: 1,
    avatar: '',
    homepage: '',
    createdAt: new Date(2026, 2, 1, 9, 0, 0).getTime(),
  },
]

const table = new TableModel<ITask>({
  search: async () => tasks,
  edit: async values => {
    await delay(200)
    tasks = tasks.map(task => (task.id === values.id ? { ...task, ...values } : task))
    return true
  },
  remove: async record => {
    await delay(200)
    tasks = tasks.filter(task => task.id !== record.id)
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
    <CrudTable :table="table" row-key="id" title="任务" :edit="editSchema" :popup-props="{ type: 'modal', width: 480 }">
      <ElTableColumn label="序号" width="70">
        <template #default="{ $index }">
          <Cell :render="renders.serial()" :index="$index" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="任务名称" prop="name" min-width="180">
        <template #default="{ row, $index }">
          <Cell :render="renders.text({ ellipsis: true })" :text="row.name" :record="row" :index="$index" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="状态" prop="status" width="100">
        <template #default="{ row, $index }">
          <Cell :render="renders.option(statusOptions)" :text="row.status" :record="row" :index="$index" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="优先级" prop="level" width="100">
        <template #default="{ row, $index }">
          <Cell :render="renders.tag(levelOptions)" :text="row.level" :record="row" :index="$index" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="封面" prop="avatar" width="90">
        <template #default="{ row, $index }">
          <Cell
            :render="renders.image({ size: 32, style: { borderRadius: '4px' } })"
            :text="row.avatar"
            :record="row"
            :index="$index"
          />
        </template>
      </ElTableColumn>
      <ElTableColumn label="链接" prop="homepage" min-width="180">
        <template #default="{ row, $index }">
          <Cell :render="renders.link()" :text="row.homepage" :record="row" :index="$index" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="创建时间" prop="createdAt" width="180">
        <template #default="{ row, $index }">
          <Cell :render="renders.time()" :text="row.createdAt" :record="row" :index="$index" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="140">
        <template #default="{ row }">
          <ElSpace>
            <ElButton link type="primary" @click="table.editPopup.open(row)">编辑</ElButton>
            <ElPopconfirm :title="`确认删除「${row.name}」？`" @confirm="table.onRemove(row)">
              <template #reference>
                <ElButton link type="danger">删除</ElButton>
              </template>
            </ElPopconfirm>
          </ElSpace>
        </template>
      </ElTableColumn>
    </CrudTable>
  </OptionsProvider>
</template>
