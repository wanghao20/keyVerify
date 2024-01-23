<template>
    <div class="app-container">
        <el-input
            v-model="filterText"
            placeholder="输入关键字搜索模块"
            style="margin-bottom: 30px"
        />
        <div
            class="custom-tree-container"
            style="height: 600px; overflow-x: hidden; overflow-y: auto"
        >
            <div class="block">
                <p>后台全局模块管理</p>
                <el-tree
                    ref="tree"
                    :filter-node-method="filterNode"
                    :data="data"
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false"
                >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <!-- disabled -->
                        <span>
                            <el-button
                                type="text"
                                size="mini"
                                @click="() => append(data)"
                                >添加子模块</el-button
                            >
                            <el-button
                                type="text"
                                size="mini"
                                @click="() => updata(data)"
                                >修改当前模块</el-button
                            >
                            <el-popconfirm
                                confirmButtonText="确认"
                                cancelButtonText="取消"
                                icon="el-icon-info"
                                iconColor="red"
                                title="确认删除吗?"
                                @onConfirm="remove(node, data)"
                                @keyup.enter.native="remove(node, data)"
                            >
                                <el-button
                                    v-if="node.disabled !== 1"
                                    size="mini"
                                    type="text"
                                    slot="reference"
                                    >{{ "删除当前模块" }}</el-button
                                >
                            </el-popconfirm>
                        </span>
                    </span>
                </el-tree>
            </div>
        </div>
        <!-- 弹窗 -->
        <el-dialog :title="'新建模块'" :visible.sync="dialogFormVisible">
            <el-form
                ref="dataForm"
                :rules="addNodeRules"
                :model="tempNodeData"
                label-position="left"
                label-width="100px"
                autocomplete="on"
                style="margin-left: 50px"
            >
                <el-form-item :label="'父模块名称'" prop="pName">
                    <el-input
                        :disabled="true"
                        v-model="tempNodeData.pName"
                        name="pName"
                        type="text"
                        style="width: 200px"
                    />
                </el-form-item>
                <el-form-item :label="'模块名称'" prop="label">
                    <el-input
                        v-model="tempNodeData.label"
                        name="label"
                        type="text"
                        style="width: 200px"
                        placeholder="请输入模块名"
                    />
                </el-form-item>
                <el-form-item :label="'icon'">
                    <el-input
                        v-model="tempNodeData.icon"
                        name="icon"
                        type="text"
                        style="width: 200px"
                        placeholder="icon图标"
                    />
                </el-form-item>
                <el-form-item :label="'图标支持库'">
                    <el-link
                        href="https://element.eleme.cn/#/zh-CN/component/icon"
                        type="primary"
                        >点击打开页面(右键新建窗口打开)</el-link
                    >
                </el-form-item>
                <el-form-item :label="'模块地址'" prop="modPath">
                    <el-input
                        v-model="tempNodeData.modPath"
                        name="modPath"
                        type="text"
                        style="width: 200px"
                        placeholder="模块地址(有子菜单'/'开头)"
                    />
                </el-form-item>
                <el-form-item :label="'模块标题'" prop="modtTitle">
                    <el-input
                        v-model="tempNodeData.modtTitle"
                        name="modtTitle"
                        type="text"
                        style="width: 200px"
                        placeholder="请输入模块标题"
                    />
                </el-form-item>
                <el-form-item :label="'component'" prop="component">
                    <el-input
                        v-model="tempNodeData.component"
                        name="component"
                        type="text"
                        style="width: 250px"
                        placeholder="component(根节点下:Layout)"
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
                        dialogStatus === 'create' ? saveMod() : updateData()
                    "
                    >{{ "保存" }}</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Tree as ElTree, Form } from "element-ui";
import { TreeData } from "element-ui/types/tree";
import { Mod } from "@/entity/auth/Mod";
import { createMod, getMod, deleteMod, updataMod } from "@/api/auth/mod";
import { findRootId, findNodes } from "@/utils/common/utils";
import { StaticStr } from "@/config/StaticStr";

@Component({
    name: "ModMgmt",
})
export default class extends Vue {
    private filterText = "";
    // 控制弹窗显示
    private dialogFormVisible = false;
    /**
     * 绑定表单对应方法和事件
     */
    private addNodeRules = {
        pName: [{ required: true, message: "必选项", trigger: "change" }],
        label: [{ required: true, message: "必选项", trigger: "change" }],
        modPath: [{ required: true, message: "必填项", trigger: "blur" }],
        modtTitle: [{ required: true, message: "必填项", trigger: "blur" }],
        component: [{ required: true, message: "必填项", trigger: "blur" }],
    };
    // 定义表单绑定对象
    private tempNodeData: Mod = new Mod();
    private pNode: Mod = new Mod();
    // 弹窗上的字符
    private dialogStatus = "";
    private textMap = {
        update: "编辑",
        create: "创建",
    };
    private id = 1000;

    public data: Array<Mod> = [];
    /**
     * 生命周期方法
     * 在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
     */
    created() {
        this.getData();
    }
    /**
     * 获取模块数据
     */
    private async getData() {
        const data: any = await getMod();
        const mods: Array<Mod> = data.data;
        // 递归处理成树形数据
        const pNode: Mod = findRootId(mods);
        pNode.children = findNodes(mods, pNode.id);
        this.data.push(pNode);
    }

    /**
     * 监听过滤方法
     */
    @Watch("filterText")
    private onFilterTextChange(value: string) {
        (this.$refs.tree as ElTree).filter(value);
    }

    /**
     * 过滤节点
     */
    private filterNode(value: string, data: Mod) {
        if (!value) {
            return true;
        }
        return data.label && data.label.indexOf(value) !== -1;
    }
    /**
     * 显示添加模块
     */
    private append(pNode: Mod) {
        this.dialogStatus = "create";
        this.pNode = pNode;
        this.dialogFormVisible = true;
        this.tempNodeData = new Mod();
        this.tempNodeData.pName = pNode.label;
        this.tempNodeData.pId = pNode.id;
    }
    /**
     * 编辑游戏信息
     */
    private updata(row: any) {
        this.dialogStatus = "update";
        this.tempNodeData = row;
        this.dialogFormVisible = true;
    }
    /**
     * 保存模块
     */
    private async saveMod() {
        (this.$refs.dataForm as Form).validate(async (valid) => {
            if (valid) {
                const data: any = await createMod(this.tempNodeData);
                const mod: Mod = data.data;
                //页面上追加数据
                const newChild: Mod = {
                    id: mod.id,
                    pId: this.pNode.id,
                    pName: this.pNode.pName,
                    label: mod.label,
                    children: [],
                };
                if (!this.pNode.children) {
                    this.$set(this.pNode, "children", []);
                }
                this.pNode.children.push(mod);
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
     * 修改
     */
    private async updateData() {
        (this.$refs.dataForm as Form).validate(async (valid) => {
            if (valid) {
                const data: any = await updataMod(this.tempNodeData);
                this.$notify({
                    title: "修改",
                    message:
                        "修改成功!页面刷新后菜单栏变化. 注意在权限菜单设置后才可显示!",
                    type: "success",
                    duration: StaticStr.CODE_TIME,
                });
                this.dialogFormVisible = false;

                // 刷新
                this.data = [];
                this.getData();
            }
        });
    }
    /**
     * 删除节点
     */
    private async remove(node: any, mod: Mod) {
        const obj: any = await deleteMod({ id: mod.id });
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex((d: any) => d.id === mod.id);
        children.splice(index, 1);
    }
}
</script>
