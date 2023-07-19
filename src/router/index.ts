import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

export const layoutRoutes: Array<RouteRecordRaw> = [
  {
    path: 'license',
    name: '车牌归还业务',
    meta: {
      title: '车牌归还业务',
    },
    component: () => import('@/pages/license/license.vue'),
  },
  {
    path: 'filingsMotorVehicleStatus',
    name: '车牌丢失报备状态',
    meta: {
      title: '车牌丢失报备',
    },
    component: () => import('@/pages/filingsMotorVehicleStatus/filingsMotorVehicleStatus.vue'),
  },
  {
    path: 'filingsMotorVehicleSelf',
    name: '车牌丢失报备',
    meta: {
      title: '车牌丢失报备',
    },
    component: () => import('@/pages/filingsMotorVehicle/filingsMotorVehicleSelf.vue'),
  },
  {
    path: 'filingsMotorVehicleNotSelf',
    name: '非本人机动车车牌丢失报备',
    meta: {
      title: '车牌丢失报备',
    },
    component: () => import('@/pages/filingsMotorVehicle/filingsMotorVehicleNotSelf.vue'),
  },
  {
    path: 'lostLicensePlateReturn',
    name: '遗失车牌归还',
    meta: {
      title: '遗失车牌归还',
    },
    component: () => import('@/pages/lostLicensePlateReturn/lostLicensePlateReturn.vue'),
  },
  {
    path: 'index',
    name: 'index',
    meta: {
      title: 'index',
    },
    component: () => import('@/pages/index.vue'),
  },
  {
    path: 'pinia',
    name: 'pinia',
    meta: {
      title: 'pinia',
    },
    component: () => import('@/pages/pinia/index.vue'),
  },
  {
    path: 'image-rotate',
    name: 'image-rotate',
    meta: {
      title: 'image-rotate',
    },
    component: () => import('@/pages/image-rotate/index.vue'),
  },
];

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/index',
    // 需要layout的页面
    children: layoutRoutes,
  },
  // 不需要layout的页面
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'login',
    },
    component: () => import('@/pages/login/index.vue'),
  },
  // 替代vue2中的'*'通配符路径
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHashHistory(), // history 模式则使用 createWebHistory()
  routes,
});
export default router;
