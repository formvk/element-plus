import DefaultTheme from 'vitepress/theme'

// 样式副作用导入，无需绑定变量
// oxlint-disable-next-line import/no-unassigned-import
import 'element-plus/dist/index.css'
// 组件库样式不再由入口自动引入，文档站按源码方式引入 scss
// oxlint-disable-next-line import/no-unassigned-import
import '../../../packages/components/src/style/index.scss'
// oxlint-disable-next-line import/no-unassigned-import
import './custom.css'

export default DefaultTheme
