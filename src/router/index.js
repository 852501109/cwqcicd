import Vue from 'vue';
import VueRouter from 'vue-router';
import createRoute from './routes';
import store from '../store/index.js';

let metaTitle = window.title;
const router = new VueRouter({
    //创建 router 实例
    routes: createRoute(),
    scrollBehavior(to, from, savedPosition) {
        return {
            x: 0,
            y: 0,
        };
    },
});

//  路由解析开始
router.beforeEach(async (to, from, next) => {

    store.state.routerHistory.push(to.path);//存储路由历史记录
    let checkArr = Array.isArray(to.meta.permission) ? to.meta.permission : [],
        storeListLength;
    store.state.RouterShow = [].concat(checkArr);
    if (!to.path.startsWith('/redirect/') && !['/login', '/modifyPassword', '/modifyPassword_changShu', '/retrievePassword', '/noPermission', '/404', '/401'].includes(to.path)) {
        //请求接口会返回1002,跳回登录页会出现死循环,所有界面除了登录页进去前先获得权限校验,权限ID配置在路由的meta.permission中
        await store
            .dispatch('ACCESSIBLES', checkArr.join(','))
            .then((res) => {
                store.state.Permission = [].concat(res.result);
                storeListLength = store.getters.storeListLength;
                sessionStorage.setItem('isLogin', true);
                //没有该页面的权限 直接跳转到无权限的页面 默认进来就有首页的权限
                if (!res.result.includes(true) && !(to.path == '/report/display' || to.path == '/api/display' || to.path == '/main')) {
                    next({
                        path: '/noPermission',
                    });
                }
                next();
            })
            .catch((e) => {
                sessionStorage.setItem('isLogin', false);
            });
    } else {
        next();
    }
    //  修改html title
    let title = to.meta.title;
    document.title = title ? title : metaTitle;
    // next();
});

//  路由解析结束
router.afterEach((route) => {
    if (route.meta && route.meta.bodyClass) document.querySelector('body').className = route.meta.bodyClass;
});
Vue.use(VueRouter);

//解决   重复点击一个跳转的路由会出现报错
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch((err) => err);
};
export default router;
