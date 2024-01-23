<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts">
import echarts, { EChartOption } from "echarts";
import { Component, Prop } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ResizeMixin from "@/components/Charts/mixins/resize";

const animationDuration = 3000;

@Component({
    name: "RadarChart",
})
export default class extends mixins(ResizeMixin) {
    @Prop({ default: "chart" }) private className!: string;
    @Prop({ default: "100%" }) private width!: string;
    @Prop({ default: "310px" }) private height!: string;

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
        this.chart.setOption({
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            radar: {
                radius: "66%",
                center: ["50%", "42%"],
                splitNumber: 8,
                splitArea: {
                    areaStyle: {
                        color: "rgba(127,95,132,.3)",
                        opacity: 1,
                        shadowBlur: 45,
                        shadowColor: "rgba(0,0,0,.5)",
                        shadowOffsetX: 0,
                        shadowOffsetY: 15,
                    },
                },
                indicator: [
                    { name: "开发成本", max: 10000 },
                    { name: "每日流水", max: 20000 },
                    { name: "今日收入", max: 20000 },
                    { name: "总收入", max: 20000 },
                ],
            },
            legend: {
                left: "center",
                bottom: "10",
                data: ["迷你世界", "王者荣耀", "和平精英"],
            },
            series: [
                {
                    type: "radar",
                    symbolSize: 0,
                    areaStyle: {
                        shadowBlur: 13,
                        shadowColor: "rgba(0,0,0,.2)",
                        shadowOffsetX: 0,
                        shadowOffsetY: 10,
                        opacity: 1,
                    },
                    data: [
                        {
                            value: [5000, 7000, 12000, 5000],
                            name: "迷你世界",
                        },
                        {
                            value: [1000, 20000, 20000, 10000],
                            name: "王者荣耀",
                        },
                        {
                            value: [2000, 11000, 12000, 20000],
                            name: "和平精英",
                        },
                    ],
                    animationDuration: animationDuration,
                },
            ],
        } as EChartOption<EChartOption.SeriesRadar>);
    }
}
</script>
