<template>
    <div class="app-container">
        <el-container>
            <el-aside width="400px">
                <div class="chart-wrapper">
                    <pie-chart />
                </div>
            </el-aside>
            <el-container>
                <el-header>
                    <div class="app-container">
                        <el-select
                            v-model="listQuery.condition.roles"
                            :placeholder="'操作类型'"
                            clearable
                            class="filter-item"
                            style="width: 130px"
                        >
                            <el-option
                                v-for="item in calendarTypeOptions"
                                :key="item"
                                :label="item"
                                :value="item"
                            />
                        </el-select>
                        <el-button
                            v-waves
                            :loading="downloadLoading"
                            class="filter-item"
                            type="primary"
                            icon="el-icon-download"
                            @click="handleDownload"
                            >{{ "导出" }}</el-button
                        >
                    </div>
                </el-header>
                <el-main>
                    <div class="app-container">
                        <!-- 过滤-->
                        <div class="filter-container">
                            <el-input
                                v-model="listQuery.condition.name"
                                :placeholder="'用户名'"
                                style="width: 200px"
                                class="filter-item"
                            />
                            <el-button
                                v-waves
                                class="filter-item"
                                type="primary"
                                icon="el-icon-search"
                                >{{ "搜索" }}</el-button
                            >
                        </div>
                        <!-- 表格 -->
                        <el-table
                            :key="tableKey"
                            v-loading="listLoading"
                            :data="list"
                            element-loading-text="Loading"
                            @selection-change="handleSelectionChange"
                        >
                            >
                            <el-table-column
                                fixed
                                type="selection"
                                width="55"
                            ></el-table-column>
                            <el-table-column label="玩家名称">
                                <template slot-scope="scope">{{
                                    scope.row.name
                                }}</template>
                            </el-table-column>
                            <el-table-column
                                label="封号类型"
                                width="180"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.rolesName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="created_at"
                                label="封号时间"
                                width="250"
                            >
                                <template slot-scope="scope">
                                    <i class="el-icon-time" />
                                    <span>{{ scope.row.createdTime }}</span>
                                </template>
                            </el-table-column>
                            <!-- 操作按钮 -->
                            <el-table-column
                                fixed="right"
                                :label="'操作'"
                                align="center"
                                width="230"
                                class-name="fixed-width"
                            >
                                <template slot-scope="{ row, $index }">
                                    <!-- @click="handleUpdate(row)" -->
                                    <el-popconfirm
                                        confirmButtonText="确认"
                                        cancelButtonText="取消"
                                        icon="el-icon-info"
                                        iconColor="red"
                                        title="确认吗?"
                                        @onConfirm="handleDelete(row, $index)"
                                        @keyup.enter.native="
                                            handleDelete(row, $index)
                                        "
                                    >
                                        <el-button
                                            v-if="row.status !== 'deleted'"
                                            size="mini"
                                            type="warning"
                                            slot="reference"
                                            >{{ "封号" }}</el-button
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
                    </div>
                </el-main>
                <el-footer>保存操作按钮区</el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script lang="ts">
import "echarts/theme/macarons.js"; //用于条形图、线形图、PieChart和RadarChart的主题

import { Component, Vue } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";
import RadarChart from "./components/RadarChart.vue";
import PieChart from "./components/PieChart.vue";
import { User } from "@/entity/auth/User";
import { Paging } from "@/utils/Type";
import Pagination from "@/components/Pagination/index.vue";
import { formatJson, startLoading } from "@/utils/common/utils";
import { getUsers } from "@/api/auth/user";
import { exportJson2Excel } from "@/utils/common/excel";
const calendarTypeOptions: any = [];

@Component({
    name: "Seal",
    components: {
        PieChart,
        Pagination,
    },
})
export default class extends Vue {
    private tableKey = 0;
    private list: User[] = [];
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
    //select
    private calendarTypeOptions = calendarTypeOptions;
    // 加载动画
    private downloadLoading = false;
    multipleSelection = [];
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
        const { data } = await getUsers(this.listQuery);
        this.calendarTypeOptions = ["批量解封", "批量封号"];
        this.list = data.items;
        this.total = data.total;
        // 模拟加载中结束
        this.listLoading = false;
    }
    handleSelectionChange(val: any) {
        this.multipleSelection = val;
    }
    /**
     * 导出Excel
     */
    private handleDownload() {
        this.downloadLoading = true;
          const keys = Object.keys(this.list[0]);
        const tHeader = keys;
        const filterVal = keys;
        const data = formatJson(filterVal, this.list);
        exportJson2Excel(tHeader, data, "table-list");
        this.downloadLoading = false;
    }
}
</script>

<style lang="scss" scoped>
</style>
