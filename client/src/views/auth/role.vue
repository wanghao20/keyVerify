<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="12">
                <!-- 过滤-->
                <div class="filter-container">
                    <el-input
                        v-model="listQuery.condition.name"
                        :placeholder="'角色名'"
                        style="width: 200px"
                        class="filter-item"
                        @keyup.enter.native="handleFilter"
                    />
                    <el-button
                        v-waves
                        class="filter-item"
                        type="primary"
                        icon="el-icon-search"
                        @click="handleFilter"
                        >{{ "搜索" }}</el-button
                    >
                    <el-button
                        class="filter-item"
                        style="margin-left: 10px"
                        type="primary"
                        icon="el-icon-edit"
                        @click="handleCreate"
                        >{{ "新增" }}</el-button
                    >
                </div>
                <!-- 表格 -->
                <el-table
                    :key="tableKey"
                    v-loading="listLoading"
                    :data="list"
                    element-loading-text="Loading"
                    border
                    fit
                    highlight-current-row
                    @sort-change="sortChange"
                >
                    <el-table-column align="center" label="ID" width="95">
                        <template slot-scope="scope">{{
                            scope.$index
                        }}</template>
                    </el-table-column>
                    <el-table-column label="角色名">
                        <template slot-scope="scope">{{
                            scope.row.roleName
                        }}</template>
                    </el-table-column>
                    <!-- 操作按钮 -->
                    <el-table-column
                        :label="'操作'"
                        align="center"
                        width="230"
                        class-name="fixed-width"
                    >
                        <template slot-scope="{ row, $index }">
                            <el-button
                                type="primary"
                                size="mini"
                                @click="handleUpdate(row)"
                                >{{ "编辑模块权限" }}</el-button
                            >
                            <el-popconfirm
                                confirmButtonText="确认"
                                cancelButtonText="取消"
                                icon="el-icon-info"
                                iconColor="red"
                                title="确认删除吗?"
                                @onConfirm="handleDelete(row, $index)"
                                @keyup.enter.native="handleDelete(row, $index)"
                            >
                                <el-button
                                    v-if="row.status !== 'deleted'"
                                    size="mini"
                                    type="danger"
                                    slot="reference"
                                    >{{ "删除" }}</el-button
                                >
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <pagination
                    v-show="total > 0"
                    :total="total"
                    :page.sync="listQuery.page"
                    :limit.sync="listQuery.limit"
                    @pagination="getList"
                />
            </el-col>
            <el-col
                :span="12"
                style="height: 705px; overflow-x: hidden; overflow-y: auto"
            >
                <p>角色权限对应关系</p>
                <div style="overflow: auto">
                    <el-tree
                        :data="data"
                        show-checkbox
                        default-expand-all
                        node-key="id"
                        ref="tree"
                        highlight-current
                        :props="defaultProps"
                    ></el-tree>
                </div>

                <el-button
                    type="primary"
                    style="display: inline; float: right"
                    @click="saveMods"
                    >{{ "保存" }}</el-button
                >
            </el-col>
        </el-row>

        <!-- 弹窗(新建编辑) -->
        <el-dialog
            :title="textMap[dialogStatus]"
            :visible.sync="dialogFormVisible"
        >
            <el-form
                ref="dataForm"
                :rules="saveRules"
                :model="tempRoleData"
                label-position="left"
                label-width="100px"
                autocomplete="on"
                style="width: 400px; margin-left: 50px"
            >
                <el-form-item :label="'角色名'" prop="roleName">
                    <el-input
                        v-model="tempRoleData.roleName"
                        name="roleName"
                        type="text"
                        style="width: 200px"
                        placeholder="请输入角色名"
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">{{
                    "取消"
                }}</el-button>
                <el-button
                    type="primary"
                    @click="
                        dialogStatus === 'create' ? createData() : updateData()
                    "
                    >{{ "保存" }}</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import {
    startLoading,
    endLoading,
    formatJson,
    findRootId,
    findNodes,
    getNoPnodes,
    takeOutNodes,
    deepClone,
} from "@/utils/common/utils";
import { exportJson2Excel } from "@/utils/common/excel";
import Pagination from "@/components/Pagination/index.vue";
import {
    getRoles,
    getRolesPage,
    createRole,
    updateRole,
    delectRole,
    getRolesMods,
} from "@/api/auth/role";
import { Role } from "@/entity/auth/Role";
import { getMod } from "@/api/auth/mod";
import { Mod } from "@/entity/auth/Mod";
import { Paging, ResData } from "@/utils/Type";
import { StaticStr } from "@/config/StaticStr";

import { Component, Vue } from "vue-property-decorator";

import { Form, Input } from "element-ui";

@Component({
    name: "Roles",
    components: {
        Pagination,
    },
})
export default class extends Vue {
    private tableKey = 0;
    private list: Role[] = [];
    private listLoading = true;
    // 分页对象
    private total = 0;
    private listQuery: Paging = {
        page: 1,
        limit: 10,
        condition: {
            name: "",
            roles: "",
        },
    };
    // 弹窗上的字符
    private dialogStatus = "";
    // 控制弹窗显示
    private dialogFormVisible = false;
    private dialogFormDelete = false;
    private tempRoleData: Role = new Role();
    public data: Array<Mod> = [];
    public allMods: Array<Mod> = [];

    private textMap = {
        update: "编辑",
        create: "创建",
    };
    private defaultProps = {
        children: "children",
        label: "label",
    };
    /**
     * 绑定表单对应方法和事件
     */
    private saveRules = {
        roleName: [{ required: true, message: "必选项", trigger: "change" }],
    };

    /**
     * 生命周期方法
     * 在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
     */
    created() {
        this.getList();
        this.getData();
    }

    /**
     * 获取模块数据
     */
    private async getData() {
        const data: any = await getMod();
        const mods: Array<Mod> = data.data;
        this.allMods = getNoPnodes(deepClone(data.data));
        // 递归处理成树形数据
        const pNode: Mod = findRootId(mods);
        pNode.children = findNodes(mods, pNode.id);
        this.data.push(pNode);
    }
    private sortChange(data: any) {
        const { prop, order } = data;
        if (prop === "id") {
        }
    }

    /**
     * 保存
     */
    private async saveMods() {
        if (this.tempRoleData.id == "") {
            this.$notify({
                title: "提示",
                message: "请先选择角色",
                type: "warning",
                duration: StaticStr.CODE_TIME,
            });
            return;
        }
        if (this.tempRoleData.mods) {
            const pNode = findRootId(this.tempRoleData.mods);
            let mods: Array<Mod> = (<any>this.$refs.tree).getCheckedNodes(
                false,
                true
            );
            mods = mods.filter(({ id }) => id !== findRootId(mods).id);
            mods = takeOutNodes(deepClone(mods));
            mods.push(pNode);
            this.tempRoleData.mods = mods;
            await updateRole(this.tempRoleData);
            this.$notify({
                title: StaticStr.SUCCESS_CODE_CREATE,
                message: StaticStr.SUCCESS_CODE_SAVE_STR,
                type: "success",
                duration: StaticStr.CODE_TIME,
            });
        }
    }
    /**
     * 编辑模块权限信息
     */
    private async handleUpdate(row: any) {
        // 拿到当前角色对应的mods
        const data: any = await getRolesMods({ id: row.id });

        this.tempRoleData = data.data;
        if (this.tempRoleData.mods) {
            // 去掉root节点
            const rplesMods = getNoPnodes(this.tempRoleData.mods);
            // 遍历模块树形设置值
            (<any>this.$refs.tree).setCheckedNodes(rplesMods);
            const keys: any[] = [];
            rplesMods.forEach((element) => {
                keys.push(element.id);
            });
            // 把未勾选的子节点重新设置为不勾选
            this.allMods.forEach((element) => {
                if (keys.indexOf(element.id) === -1) {
                    console.log(element.label);
                    (<any>this.$refs.tree).setChecked(element.id, false, true);
                }
            });
            this.$notify({
                title: StaticStr.SUCCESS_CODE_CREATE,
                message: "获取数据成功!",
                type: "success",
                duration: StaticStr.CODE_TIME,
            });
        }
    }
    /**
     * 获取角色数据
     */
    private async getList() {
        startLoading(this.listLoading);
        const { data } = await getRolesPage(this.listQuery);
        this.list = data.items;
        this.total = data.total;
        // 模拟加载中结束
        this.listLoading = false;
    }
    /**
     * 创建角色
     */
    private handleCreate() {
        // 清理当前对象数据
        this.tempRoleData = new Role();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
            (this.$refs.dataForm as Form).clearValidate();
        });
    }
    /**
     * 搜索
     */
    private async handleFilter() {
        this.listQuery.page = 1;
        startLoading(this.listLoading);
        const { data } = await getRolesPage(this.listQuery);
        this.list = data.items;
        this.total = data.total;
        // 模拟加载中结束
        this.listLoading = false;
    }

    /**
     * 创建角色信息
     */
    private createData() {
        (this.$refs.dataForm as Form).validate(async (valid) => {
            if (valid) {
                const role = this.tempRoleData;
                const { data } = await createRole(role);
                data.timestamp = Date.parse(data.timestamp);
                this.list.unshift(data);
                this.dialogFormVisible = false;
                this.$notify({
                    title: StaticStr.SUCCESS_CODE_CREATE,
                    message: StaticStr.SUCCESS_CODE_CREATE_STR,
                    type: "success",
                    duration: StaticStr.CODE_TIME,
                });
            }
        });
    }

    /**
     * 删除角色信息
     */
    private async handleDelete(row: any, index: number) {
        const { data } = await delectRole(row);
        this.$notify({
            title: StaticStr.SUCCESS_CODE_CREATE,
            message: StaticStr.SUCCESS_CODE_DEL_STR,
            type: "success",
            duration: StaticStr.CODE_TIME,
        });
        this.list.splice(index, 1);
    }
}
</script>
