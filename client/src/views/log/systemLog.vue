<template>
    <div class="app-container">
        <!-- 过滤-->
        <div class="filter-container">
            <el-input
                v-model="listQuery.condition.name"
                :placeholder="'用户'"
                style="width: 200px"
                class="filter-item"
                @keyup.enter.native="handleFilter"
            />
            <el-input
                v-model="listQuery.condition.Mod"
                :placeholder="'模块'"
                style="width: 200px"
                class="filter-item"
                @keyup.enter.native="handleFilter"
            />
            <el-select
                v-model="listQuery.condition.type"
                :placeholder="'操作'"
                clearable
                class="filter-item"
                style="width: 130px"
            >
                <el-option
                    v-for="item in calendarTypeOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                />
            </el-select>
            <el-button
                v-waves
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="handleFilter"
                >{{ "搜索" }}</el-button
            >
        </div>
        <!-- 表格 -->
        <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
            @sort-change="sortChange"
        >
            <el-table-column label="操作用户" width="150" align="center">
                <template slot-scope="scope">{{ scope.row.username }}</template>
            </el-table-column>
            <el-table-column label="操作模块" width="100" align="center">
                <template slot-scope="scope">{{
                    scope.row.operationMod
                }}</template>
            </el-table-column>

            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">{{
                    scope.row.operationType
                }}</template>
            </el-table-column>
            <el-table-column label="操作时间" width="180" align="center">
                <template slot-scope="scope">{{
                    scope.row.createdTime
                }}</template>
            </el-table-column>
            <el-table-column label="ip" width="150" align="center">
                <template slot-scope="scope">{{ scope.row.ip }}</template>
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
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { startLoading, endLoading, formatJson } from "@/utils/common/utils";
import { exportJson2Excel } from "@/utils/common/excel";
import { User } from "@/entity/auth/User";
import { Form, Input } from "element-ui";
import Pagination from "@/components/Pagination/index.vue";
import { systemLog } from "@/api/auth/user";
import { getRoles } from "@/api/auth/role";
import { Paging, TbLog } from "@/utils/Type";
const calendarTypeOptions: any = [];

@Component({
    name: "SystemLog",
    components: {
        Pagination,
    },
})
export default class extends Vue {
    private list: TbLog[] = [];
    private listLoading = true;
    // 分页对象
    private total = 0;
    private listQuery: Paging = {
        page: 1,
        limit: 10,
        condition: {
            name: "",
            Mod: "",
            type: "",
        },
    };
    private downloadLoading = false;
    //select
    private calendarTypeOptions = calendarTypeOptions;

    /**
     * 生命周期方法
     * 在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
     */
    created() {
        this.getList();
    }

    /**
     * 获取用户数据
     */
    private async getList() {
        startLoading(this.listLoading);
        const { data } = await systemLog(this.listQuery);
        this.list = data.items;
        this.total = data.total;
        this.calendarTypeOptions = [
            { id: "查询", label: "查询" },
            { id: "新增", label: "新增" },
            { id: "删除", label: "删除" },
            { id: "更新", label: "更新" },
        ];
        // 模拟加载中结束
        this.listLoading = false;
    }

    /**
     * 搜索
     */
    private async handleFilter() {
        this.listQuery.page = 1;
        startLoading(this.listLoading);
        const { data } = await systemLog(this.listQuery);
        this.list = data.items;
        this.total = data.total;
        // 模拟加载中结束
        this.listLoading = false;
    }
    private sortChange(data: any) {
        const { prop, order } = data;
        if (prop === "id") {
        }
    }
}
</script>
