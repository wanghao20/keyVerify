<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item
                v-for="(item, index) in breadcrumbs"
                :key="index"
            >
                <span
                    v-if="
                        item.redirect === 'noredirect' ||
                        index === breadcrumbs.length - 1
                    "
                    class="no-redirect"
                    >{{ item.meta.title }}</span
                >
                <a v-else @click.prevent="handleLink(item)">{{
                    item.meta.title
                }}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script lang="ts">
import pathToRegexp from "path-to-regexp";
import { Component, Vue, Watch } from "vue-property-decorator";
import { RouteRecord, Route } from "vue-router";

@Component({
    name: "Breadcrumb",
})
export default class extends Vue {
    /**
     * 路由配置
     */
    private breadcrumbs: RouteRecord[] = [];

    /**
     * 路由改变时触发
     */
    @Watch("$route")
    private onRouteChange(route: Route) {
        // console.log("路由改变了" + route);
        // 如果您转到重定向页面，请不要更新 路由配置
        if (route.path.startsWith("/redirect/")) {
            return;
        }
        this.getBreadcrumb();
    }

    created() {
        this.getBreadcrumb();
    }

    /**
     * 获取路由配置
     */
    private getBreadcrumb() {
        let matched = this.$route.matched.filter(
            (item) => item.meta && item.meta.title
        );
        const first = matched[0];
        if (!this.isDashboard(first)) {
            matched = [
                { path: "/dashboard", meta: { title: "首页" } } as RouteRecord,
            ].concat(matched);
        }
        this.breadcrumbs = matched.filter((item) => {
            return (
                item.meta && item.meta.title && item.meta.breadcrumb !== false
            );
        });
    }

    /**
     * 判断是否是主页
     */
    private isDashboard(route: RouteRecord) {
        const name = route && route.meta && route.meta.title;
        return name === "主页";
    }

    /**
     * 路径编译
     */
    private pathCompile(path: string) {
        // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
        const { params } = this.$route;
        const toPath = pathToRegexp.compile(path);
        return toPath(params);
    }

    /**
     * 处理链接
     */
    private handleLink(item: any) {
        const { redirect, path } = item;
        if (redirect) {
            this.$router.push(redirect);
            return;
        }
        this.$router.push(this.pathCompile(path));
    }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
    font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;

    .no-redirect {
        color: #97a8be;
        cursor: text;
    }
}
</style>
