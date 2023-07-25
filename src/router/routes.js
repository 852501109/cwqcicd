//  根据context 动态引入依赖
//  see: https:// doc.webpack-china.org/guides/dependency-management/#require-context
import Router from 'vue-router'
const modulesContext = require.context('./modules/', true, /\.js$/) //  route文件名以Route结尾，e.g: testRoute.js
const chunks = modulesContext.keys().reduce((modules, key) => {
  modules[key.replace(/(^\.\/)|(\.js$)/g, '')] = modulesContext(key).default
  return modules
}, {})
const moduleNames = Object.keys(chunks)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default () => moduleNames.reduce((routes, moduleName) => {
  routes = routes.concat(chunks[moduleName])
  return routes
}, [])
