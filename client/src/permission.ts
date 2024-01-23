import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { Mod } from './entity/auth/Mod'
import { findRootId, findNodes } from './utils/common/utils'
import Layout from '@/layout/index.vue'
/**
 * 进度条配置
 */
NProgress.configure({ showSpinner: false })
/**
 * 路径白名单
 * 不验证令牌
 */
const whiteList = ['/login']

/**
 * 懒加载路由
 * @param viewPath 
 */
const loadView = (viewPath: string) => {
    // 用字符串模板实现动态 import 从而实现路由懒加载
    return () => import(`@/views/${viewPath}`)
}
/**
 * 动态获取路由
 */
const getRouteList = (mods: any) => {

    // 遍历成树形数据
    const pNode: Mod = findRootId(mods);
    const dataList = findNodes(mods, pNode.id);
    return filter(dataList)
}
/**
 * 递归处理数据为路由数据
 * @param mods 
 */
const filter = (mods: Array<Mod>) => {
    const routeList: any = []
    mods.filter((data) => {
        const route: any = {
            meta: {
                title: '',
                // icon: 'component', 
                noCache: true,
                alwaysShow: true
            },
        }
        if (data.component) {
            route.name = data.modPath
            route.path = data.modPath
            route.meta.title = data.modtTitle
            if (data.component === 'Layout') {
                // 如果 component = Layout 说明是布局组件
                // 将真正的布局组件赋值给它
                route.component = Layout
                route.redirect = data.modPath
            } else {
                // 如果不是布局组件就只能是页面的引用了
                // 利用懒加载函数将实际页面赋值给它
                route.component = loadView(data.component)
            }
            // 判断是否存在子路由，并递归调用自己
            if (data.children.length > 0) {
                route.children = filter(data.children)
            }
            routeList.push(route)
        }
    })
    return routeList
}

/**
 * 获取成菜单栏数据(解决缩小菜单时不显示图标问题单独获取菜单处理)
 * @param mods 
 */
const getRouteListfilterMenu = (mods: any) => {
    // 遍历成树形数据
    const pNode: Mod = findRootId(mods);
    const dataList = findNodes(mods, pNode.id);
    return filterMenu(dataList)
}
/**
 * 递归过滤数据为菜单栏需要数据
 * @param mods 
 */
const filterMenu = (mods: Array<Mod>) => {
    const routeList: any = []
    mods.filter((data) => {
        const route: any = {
            meta: {
                title: '',
                // icon: 'component', 
                noCache: false,
                alwaysShow: true
            },
        }
        if (data.component) {
            route.name = data.modPath
            route.path = data.modPath
            route.meta.title = data.modtTitle
            route.meta.icon = data.icon
            if (data.component === 'Layout') {
                // 如果 component = Layout 说明是布局组件
                // 将真正的布局组件赋值给它
                route.component = Layout
                route.redirect = data.modPath

            } else {
                route.meta.noCache = true
                // 如果不是布局组件就只能是页面的引用了
                // 利用懒加载函数将实际页面赋值给它
                route.component = loadView(data.component)
            }
            // 判断是否存在子路由，并递归调用自己
            if (data.children.length > 0) {
                route.children = filterMenu(data.children)
            }
            routeList.push(route)
        }
    })
    return routeList
}
/**
 * 动态路由处理
 * @param to 
 * @param next 
 */
function routerGo(to: any, next: (arg0: any) => void) {
    const routes: any[] = getRouteList(mods)
    // 最后追加404页面
    routes.push({
        "path": '/',
        "redirect": '/dashboard/dashboard',
    })
    routes.push({
        "path": '*',
        "redirect": '/404',
        "meta": { "hidden": true, title: "找不到页面!", }
    })
    router.addRoutes(routes, true)
    const menu = getRouteListfilterMenu(mods)
    // 处理成菜单栏数据
    router.options.routes = router.options.routes.concat(menu);
    // 设置replace：true，因此导航不会留下历史记录
    next({ ...to, replace: true })
}
let mods: any = []

/**
 * 路由改变时触发
 */
router.beforeEach(async (to: Route, _: Route, next: any) => {
    // 开始进度条
    NProgress.start()
    // 确定用户是否已登录
    if (UserModule.token) {
        if (to.path === '/login') {
            // 如果已登录，重定向到主页
            next({ path: '/dashboard/dashboard' })
            NProgress.done()
        } else {
            // 检查用户是否已获得其权限角色
            if (UserModule.roles === "") {
                try {
                    // 获取用户信息，包括角色
                    // 获取到对应权限的mods
                    mods = []
                    mods = await UserModule.GetUserInfo();
                    routerGo(to, next)//执行路由跳转方法

                } catch (err) {
                    // 删除令牌并重定向到登录页面
                    UserModule.ResetToken()
                    Message.error(err || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            } else {
                try {
                    next()
                } catch (err) {
                    console.log(err)
                }
            }
        }
    } else {
        // 没有令牌
        if (whiteList.indexOf(to.path) !== -1) {
            // 在登录白名单中，直接进入
            next()
        } else {
            // 其他无权访问的页面将重定向到登录页面。
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})
/**
 * 路由结束方法
 */
router.afterEach((to: Route) => {
    // 完成进度条
    NProgress.done()

    // 设置页面标题
    document.title = to.meta.title
})
