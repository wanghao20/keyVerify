<template>
    <el-table :data="list" style="width: 100%; padding-top: 15px">
        <el-table-column label="用户" width="195" align="center">
            <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column label="操作模块" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.operationMod }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">{{
                scope.row.operationType
            }}</template>
        </el-table-column>
        <el-table-column label="操作时间" width="180" align="center">
            <template slot-scope="scope">{{ scope.row.createdTime }}</template>
        </el-table-column>
        <el-table-column label="ip" width="150" align="center">
            <template slot-scope="scope">{{ scope.row.ip }}</template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts">
import { systemLog } from "@/api/auth/user";
import { Paging, TbLog } from "@/utils/Type";
import { Component, Vue } from "vue-property-decorator";

@Component({
    name: "TransactionTable",
})
export default class extends Vue {
    private list: TbLog[] = [];
    private listQuery: Paging = {
        page: 1,
        limit: 10,
        condition: {
            name: "",
            Mod: "",
            type: "",
        },
    };
    created() {
        this.fetchData();
    }

    private async fetchData() {
        const { data } = await systemLog(this.listQuery);
        this.list = data.items.slice(0, 8);
    }
}
</script>
