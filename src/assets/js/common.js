export function load (view, component) {
  if (component) return () => import(`@/components/${view}`)
  return () => import(`@/views/${view}`)
}
export function loadfunc(path) {
    return () => import(`@/${path}`);
}
export function generateTitle (title) {
  const hasKey = 'route.' + title
  const translatedTitle = 'route.' + title //  $t :this method from vue-i18n, inject in @/lang/report.js

  if (hasKey) {
    return translatedTitle
  }
  return title
}
export function isvalidUsername (str) {
  const validMap = /^[a-zA-Z0-9_-]{4,16}$/  // ['audaque', 'admin', 'editor', 'aaa']
  return validMap.test(str.trim())
}
//  合法url
export function validateURL (textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

//  小写字母
export function validateLowerCase (str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

//  大写字母
export function validateUpperCase (str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

//  大小写字母
export function validateAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

//  验证邮箱
export function validateEmail (email) {
  const re = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
  return re.test(email)
}
