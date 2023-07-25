import Vue from 'vue'
import Vuex from 'vuex'
import global from '@/store/modules/global'
import createModules from './modules'
import handleReqeust from '@/api/handleRequest'
import API from '@/api/index'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: createModules(handleReqeust, API),
    ...global(handleReqeust, API)
})
export default store
