import Vue from 'vue';
import 'normalize.css';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/index.scss'; //  global css
import App from './App';
import store from './store';
import router from './router';
import filters from './filters';
import utils from './utils';
import audaqueComponent from '@/components/userComponents';
import VueLazyload from 'vue-lazyload';
import mixin from '@/mixins';
import publics from './assets/js/publics';
// import Toast from './toast';
//use audaque/web-lib
import compnents from '@audaque/vue-components'; //组件 filter toast helper方法
import '@audaque/vue-components/lib/js/web-lib.css'; //库自定义组件的样式
import '@audaque/vue-components/lib/index.scss'; //整体样式风格
import loadMore from '@/utils/modules/loadMore'; // 下拉加载更多
import preventReClick from '@/utils/modules/customEvent'; //自定义事件，防止按钮在短时间内被多次点击
//公司库包的引入部分
import { bindInstall } from '@audaque/vue-utils'; //权限指令
import { AudaqueXSSHandle } from '@audaque/web-utils';
import { xssWhitelist } from '@/assets/js/xssWhitelist';
//引入echarts
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts;

Vue.use(loadMore);
Vue.use(preventReClick);
Vue.use(Element, {
    size: 'medium', //  set element-ui default size
    //size: 'small'
});
Vue.use(audaqueComponent); //注册自定义全局组件
Vue.use(VueLazyload); //图片懒加载插件
Vue.use(utils);
// Vue.use(Toast);//公共的弹窗
Vue.use(compnents);
Vue.use(bindInstall({}, { open: false }));
Vue.config.productionTip = false;
Vue.prototype.publics = publics;
Vue.prototype.$xssWhitelist = xssWhitelist;
Vue.prototype.$audaquePreventXss = AudaqueXSSHandle.preventXss;
Object.keys(filters).forEach((key) => Vue.filter(key, filters[key]));
/* eslint-disable no-new */
//全局混入权限菜单的列表值,不用每次都引入一次
Vue.mixin(mixin);
const vue = new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>',
});

export default vue;
