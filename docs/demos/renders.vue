<script setup lang="tsx">
import { CrudTable, arrayComponents, fieldComponents, renders, voidComponents } from '@formvk/element-plus'
import type { DataTableProps } from '@formvk/element-plus'
import { TableModel } from '@formvk/models'
import { createSchema, createSchemaOptions } from '@formvk/vue'
import { ElButton, ElPopconfirm, ElSpace } from 'element-plus'

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

/** columns 里直接使用 renders，无需再包一层 Cell 组件 */
const columns: DataTableProps<ITask>['columns'] = [
  { label: '序号', width: 70, render: renders.serial() },
  { label: '任务名称', prop: 'name', minWidth: 180, render: renders.text({ ellipsis: true }) },
  { label: '状态', prop: 'status', width: 100, render: renders.option(statusOptions) },
  { label: '优先级', prop: 'level', width: 100, render: renders.tag(levelOptions) },
  { label: '封面', prop: 'avatar', width: 90, render: renders.image({ size: 32, style: { borderRadius: '4px' } }) },
  { label: '链接', prop: 'homepage', minWidth: 180, render: renders.link() },
  { label: '创建时间', prop: 'createdAt', width: 180, render: renders.time() },
  {
    label: '操作',
    width: 140,
    render: (_text, record) => (
      <ElSpace>
        <ElButton link type="primary" onClick={() => table.editPopup.open(record)}>
          编辑
        </ElButton>
        <ElPopconfirm title={`确认删除「${record.name}」？`} onConfirm={() => table.onRemove(record)}>
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
    <CrudTable
      :table="table"
      row-key="id"
      title="任务"
      :columns="columns"
      :edit="editSchema"
      :popup-props="{ type: 'modal', width: 480 }"
    />
  </OptionsProvider>
</template>
