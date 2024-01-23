<template>
    <el-row :gutter="40" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
            <div
                class="card-panel"
                @click="handleSetLineChartData('newVisitis')"
            >
                <div class="card-panel-icon-wrapper icon-user">
                    <svg-icon name="user" class="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">今日新玩家</div>
                    1000
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('messages')">
                <div class="card-panel-icon-wrapper icon-peoples">
                    <svg-icon name="peoples" class="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">总玩家数</div>
                    10000000
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
            <div
                class="card-panel"
                @click="handleSetLineChartData('purchases')"
            >
                <div class="card-panel-icon-wrapper icon-money">
                    <svg-icon name="money" class="card-panel-icon" />
                </div>

                <div class="card-panel-description">
                    <div class="card-panel-text">今日收入</div>
                    10w
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
            <div
                class="card-panel"
                @click="handleSetLineChartData('shoppings')"
            >
                <div class="card-panel-icon-wrapper icon-chart">
                    <svg-icon name="chart" class="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">总收入</div>
                    10000w
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
    name: "PanelGroup",
})
export default class extends Vue {
    private handleSetLineChartData(type: string) {
        this.$emit("handleSetLineChartData", type);
    }
}
</script>

<style lang="scss" scoped>
.panel-group {
    margin-top: 18px;

    .card-panel-col {
        margin-bottom: 32px;
    }

    .card-panel {
        height: 108px;
        cursor: pointer;
        font-size: 12px;
        position: relative;
        overflow: hidden;
        color: #666;
        background: #fff;
        box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
        border-color: rgba(0, 0, 0, 0.05);

        &:hover {
            .card-panel-icon-wrapper {
                color: #fff;
            }

            .icon-user {
                background: #40c9c6;
            }

            .icon-peoples {
                background: #36a3f7;
            }

            .icon-money {
                background: #f4516c;
            }

            .icon-chart {
                background: #34bfa3;
            }
        }

        .icon- user {
            color: #40c9c6;
        }

        .icon- users {
            color: #36a3f7;
        }

        .icon-money {
            color: #f4516c;
        }

        .icon-shopping {
            color: #34bfa3;
        }

        .card-panel-icon-wrapper {
            float: left;
            margin: 14px 0 0 14px;
            padding: 16px;
            transition: all 0.38s ease-out;
            border-radius: 6px;
        }

        .card-panel-icon {
            float: left;
            font-size: 48px;
        }

        .card-panel-description {
            float: right;
            font-weight: bold;
            margin: 26px;
            margin-left: 0px;

            .card-panel-text {
                line-height: 18px;
                color: rgba(0, 0, 0, 0.45);
                font-size: 16px;
                margin-bottom: 12px;
            }

            .card-panel-num {
                font-size: 20px;
            }
        }
    }
}

@media (max-width: 550px) {
    .card-panel-description {
        display: none;
    }

    .card-panel-icon-wrapper {
        float: none !important;
        width: 100%;
        height: 100%;
        margin: 0 !important;

        .svg-icon {
            display: block;
            margin: 14px auto !important;
            float: none !important;
        }
    }
}
</style>
