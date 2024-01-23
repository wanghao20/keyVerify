import Vue from 'vue'
/* Layout */
import Layout from '@/layout/index.vue'
import Router, { RouteConfig } from 'vue-router'
Vue.use(Router)
/**
   恒定路线
   没有权限要求的基本页面
   可以访问所有角色
*/
export const constantRoutes: RouteConfig[] = [
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        meta: { hidden: true, title: '用户登录', }
    },
    {
        path: '/404',
        component: () => import('@/views/404.vue'),
        meta: { hidden: true }
    },
    {
        path: '/profile',
        component: Layout,
        redirect: '/profile/index',
        meta: { hidden: true },
        children: [
            {
                path: 'index',
                component: () => import('@/views/profile/index.vue'),
                name: '个人中心',
                meta: {
                    title: '个人中心',
                    icon: 'user',
                    noCache: true
                }
            }
        ]
    }
]

const createRouter = () => new Router({

    // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
    scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    base: process.env.BASE_URL,
    routes: constantRoutes
})

const router: any = createRouter()
/**
 * 重置注册的路由导航map
 * 主要是为了通过addRoutes方法动态注入新路由时，避免重复注册相同name路由
 */
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    router.options.routes = [];
    const newRouter = createRouter();
    (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
