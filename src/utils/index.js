const utilsArr = require.context('./modules', true, /\.js$/)
let utils = {}
utilsArr.keys().forEach((item) => {
    let util = utilsArr(item).default
    utils = Object.assign(utils, util)
})
export default {
    install(Vue) {
        Vue.utils = utils
        Vue.prototype.$utils = utils
    },
    $utils: utils
}
export const $utils = utils
//console.log($utils)