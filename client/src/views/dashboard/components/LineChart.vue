<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts">
import echarts, { EChartOption } from "echarts";
import { Component, Prop, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ResizeMixin from "@/components/Charts/mixins/resize";

export interface ILineChartData {
    expectedData: number[];
    actualData: number[];
}

@Component({
    name: "LineChart",
})
export default class extends mixins(ResizeMixin) {
    @Prop({ required: true }) private chartData!: ILineChartData;
    @Prop({ default: "chart" }) private className!: string;
    @Prop({ default: "100%" }) private width!: string;
    @Prop({ default: "350px" }) private height!: string;

    @Watch("chartData", { deep: true })
    private onChartDataChange(value: ILineChartData) {
        this.setOptions(value);
    }

    mounted() {
        this.$nextTick(() => {
            this.initChart();
        });
    }

    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
    }

    private initChart() {
        this.chart = echarts.init(this.$el as HTMLDivElement, "macarons");
        this.setOptions(this.chartData);
    }

    private setOptions(chartData: ILineChartData) {
        if (this.chart) {
            this.chart.setOption({
                xAxis: {
                    data: [
                        "周一",
                        "周二",
                        "周三",
                        "周四",
                        "周五",
                        "周六",
                        "周日",
                    ],
                    boundaryGap: false,
                    axisTick: {
                        show: false,
                    },
                },
                grid: {
                    left: 10,
                    right: 10,
                    bottom: 20,
                    top: 30,
                    containLabel: true,
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                    },
                    padding: 8,
                },
                yAxis: {
                    axisTick: {
                        show: false,
                    },
                },
                legend: {
                    data: ["游戏1", "游戏2"],
                },
                series: [
                    {
                        name: "游戏1",
                        itemStyle: {
                            color: "#FF005A",
                            lineStyle: {
                                color: "#FF005A",
                                width: 2,
                            },
                        },
                        smooth: true,
                        type: "line",
                        data: chartData.expectedData,
                        animationDuration: 2800,
                        animationEasing: "cubicInOut",
                    },
                    {
                        name: "游戏2",
                        smooth: true,
                        type: "line",
                        itemStyle: {
                            color: "#3888fa",
                            lineStyle: {
                                color: "#3888fa",
                                width: 2,
                            },
                            areaStyle: {
                                color: "#f3f8ff",
                            },
                        },
                        data: chartData.actualData,
                        animationDuration: 2800,
                        animationEasing: "quadraticOut",
                    },
                ],
            } as EChartOption<EChartOption.SeriesLine>);
        }
    }
}
</script>
