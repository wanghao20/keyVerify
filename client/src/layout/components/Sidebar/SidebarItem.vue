<template>
    <div
        v-if="!item.meta || !item.meta.hidden"
        :class="[
            'menu-wrapper',
            isCollapse ? 'simple-mode' : 'full-mode',
            { 'first-level': isFirstLevel },
        ]"
    >
        <template v-if="theOnlyOneChild && !theOnlyOneChild.children">
            <sidebar-item-link
                v-if="theOnlyOneChild.meta"
                :to="resolvePath(theOnlyOneChild.path)"
            >
                <el-menu-item
                    :index="resolvePath(theOnlyOneChild.path)"
                    :class="{ 'submenu-title-noDropdown': isFirstLevel }"
                >
                    <!-- 子菜单 -->
                    <!-- <svg-icon v-if="theOnlyOneChild.meta.icon" :name="theOnlyOneChild.meta.icon" /> -->
                    <span
                        v-if="theOnlyOneChild.meta.icon"
                        class="svg-container"
                    >
                        <i
                            style="width: 45px; font-size: 22px; color: #dfe4ed"
                            :class="theOnlyOneChild.meta.icon"
                        ></i>
                    </span>
                    <span v-if="theOnlyOneChild.meta.title" slot="title">{{
                        theOnlyOneChild.meta.title
                    }}</span>
                </el-menu-item>
            </sidebar-item-link>
        </template>
        <el-submenu
            v-else
            :index="resolvePath(item.path)"
            popper-append-to-body
        >
            <template slot="title">
                <!-- 父菜单 -->
                <!-- <svg-icon v-if="item.meta && item.meta.icon" :name="item.meta.icon" /> -->
                <span v-if="item.meta && item.meta.icon" class="svg-container">
                    <i
                        style="width: 45px; font-size: 22px; color: #dfe4ed"
                        :class="item.meta.icon"
                    ></i>
                </span>
                <!-- 因为icon标签和标题显示标签span重复,添加id span对文字进行隐藏图标
        解决了缩小菜单后的图片显示异常 -->
                <span
                    id="span"
                    v-if="item.meta && item.meta.title"
                    slot="title"
                    >{{ item.meta.title }}</span
                >
            </template>
            <template v-if="item.children">
                <sidebar-item
                    v-for="child in item.children"
                    :key="child.path"
                    :item="child"
                    :is-collapse="isCollapse"
                    :is-first-level="false"
                    :base-path="resolvePath(child.path)"
                    class="nest-menu"
                />
            </template>
        </el-submenu>
    </div>
</template>

<script lang="ts">
import path from "path";
import { Component, Prop, Vue } from "vue-property-decorator";
import { Route, RouteConfig } from "vue-router";
import { isExternal } from "@/utils/common/validate";
import SidebarItemLink from "./SidebarItemLink.vue";

@Component({
    // 在此处设置“名称”以防止uglifyjs导致递归组件不起作用
    // See https://medium.com/haiiro-io/element-component-name-with-vue-class-component-f3b435656561 for detail
    name: "SidebarItem",
    components: {
        SidebarItemLink,
    },
})
export default class extends Vue {
    @Prop({ required: true }) private item!: RouteConfig;
    @Prop({ default: false }) private isCollapse!: boolean;
    @Prop({ default: true }) private isFirstLevel!: boolean;
    @Prop({ default: "" }) private basePath!: string;

    get showingChildNumber() {
        if (this.item.children) {
            const showingChildren = this.item.children.filter((item) => {
                if (item.meta && item.meta.hidden) {
                    return false;
                } else {
                    return true;
                }
            });
            return showingChildren.length;
        }
        return 0;
    }

    get theOnlyOneChild() {
        if (this.showingChildNumber > 1) {
            return null;
        }
        if (this.item.children) {
            for (let child of this.item.children) {
                if (!child.meta || !child.meta.hidden) {
                    return child;
                }
            }
        }
        //如果没有子级，则返回自身并删除路径，因为
        //.this.basePath已包含项目路径信息
        return { ...this.item, path: "" };
    }

    private resolvePath(routePath: string) {
        if (isExternal(routePath)) {
            return routePath;
        }
        if (isExternal(this.basePath)) {
            return this.basePath;
        }
        return path.resolve(this.basePath, routePath);
    }
}
</script>

<style lang="scss">
.el-submenu.is-active > .el-submenu__title {
    color: $subMenuActiveText !important;
}

.full-mode {
    .nest-menu .el-submenu > .el-submenu__title,
    .el-submenu .el-menu-item {
        min-width: $sideBarWidth !important;
        background-color: $subMenuBg !important;

        &:hover {
            background-color: $subMenuHover !important;
        }
    }
}

.simple-mode {
    &.first-level {
        .submenu-title-noDropdown {
            padding: 0 !important;
            position: relative;

            .el-tooltip {
                padding: 0 !important;
            }
        }

        .el-submenu {
            overflow: hidden;

            & > .el-submenu__title {
                padding: 0px !important;

                .el-submenu__icon-arrow {
                    display: none;
                }

                & > #span {
                    visibility: hidden;
                }
            }
        }
    }
}
</style>

<style lang="scss" scoped>
.svg-icon {
    margin-right: 16px;
}

.simple-mode {
    .svg-icon {
        margin-left: 20px;
    }
}
</style>
