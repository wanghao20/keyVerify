import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import { constantRoutes } from '@/router'
import store from '@/store'

const hasPermission = (roles: string[], route: RouteConfig) => {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

export const filterAsyncRoutes = (routes: RouteConfig[], roles: string[]) => {
    const res: RouteConfig[] = []
    routes.forEach(route => {
        const r = { ...route }
        if (hasPermission(roles, r)) {
            if (r.children) {
                r.children = filterAsyncRoutes(r.children, roles)
            }
            res.push(r)
        }
    })
    return res
}

export interface IPermissionState {
    routes: RouteConfig[]
    dynamicRoutes: RouteConfig[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
    public routes: RouteConfig[] = []
    public dynamicRoutes: RouteConfig[] = []

    @Mutation
    private SET_ROUTES(routes: RouteConfig[]) {
        this.routes = constantRoutes.concat(routes)
        this.dynamicRoutes = routes
    }


}

export const PermissionModule = getModule(Permission)
