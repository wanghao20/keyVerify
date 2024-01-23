<template>
    <div class="block">
        <el-timeline>
            <el-timeline-item
                v-for="(item, index) of timeline"
                :key="index"
                :timestamp="item.timestamp"
                placement="top"
            >
                <el-card>
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.content }}</p>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script lang="ts">
import { systemLog } from "@/api/auth/user";
import { UserModule } from "@/store/modules/user";
import { Paging, TbLog } from "@/utils/Type";
import { Component, Vue } from "vue-property-decorator";

@Component({
    name: "Timeline",
})
export default class extends Vue {
    // 获取操作接口数据
    private listQuery: Paging = {
        page: 1,
        limit: 10, // 默认获取10条
        condition: {
            name: UserModule.name,
        },
    };
    private timeline: any[] = [];
    /**
     * 生命周期方法
     * 在模板渲染成html后调用，通常是初始化页面完成后，
     * 再对html的dom节点进行一些需要的操作。
     */
    mounted() {
        this.getData();
    }
    /**
     * 获取当前用户的操作记录
     */
    private async getData() {
        const { data } = await systemLog(this.listQuery);
        // 设置值
        data.items.forEach((val: any) => {
            const log = {
                timestamp: val.createdTime,
                title: val.operationType,
                content:
                    "操作模块: " + val.operationMod + ", 操作IP: " + val.ip,
            };
            this.timeline.push(log);
        });
        console.log(data.items);
    }
}
</script>
