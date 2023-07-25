<template>
    <el-card class="box-card content-card">
        <div slot="header" class="clearfix content-title">
            <span>文件传输趋势图</span>
            <a class="content-view iconfont iconmore operate" @click="gotoUrl"></a>
        </div>
        <div class="item content-hardware" style="height:245px">
            <div ref="lineChart" style="{width: 100%;height: 245px;}"></div>
        </div>
    </el-card>
</template>
<script>
    import { mapActions } from 'vuex';
    
    export default {
        name: 'DailyCharts',
        data() {
            return {
                legend:[],
                xAxis:[],
                series:[],
            }
        },
        created() {
            this.initData();
        },
        mounted() {
            // this.createLineChart();
        },
        methods: {
            ...mapActions('mainPage', ['GET_LINECHART']),
            initData() {
                this.GET_LINECHART({}).then((res) => {
                    this.legend = res.legend;
                    this.xAxis = res.xaxis;
                    this.series = res.series;
                    this.createLineChart();
                });
            },
            createLineChart(){
                const chart = this.$refs.lineChart
                if (chart) {  
                    const myChart = this.$echarts.init(chart)
                    //配置图表
                    const option = {
                        backgroundColor: '#fff',
                        tooltip: {
                            trigger: 'axis',
                             position: function (point, params, dom, rect, size) {
                                var x = 0; // x坐标位置
                                var y = 0; // y坐标位置
                                // 当前鼠标位置
                                var pointX = point[0];
                                var pointY = point[1];
                                // 提示框大小
                                var boxWidth = size.contentSize[0];
                                var boxHeight = size.contentSize[1];

                                // boxWidth > pointX 说明鼠标左边放不下提示框
                                if (boxWidth > pointX) {
                                    x = pointX + 10;
                                } else { // 左边放的下
                                    x = pointX - boxWidth - 10;
                                }

                                // boxHeight > pointY 说明鼠标上边放不下提示框
                                if (boxHeight > pointY) {
                                    y = 5;
                                } else { // 上边放得下
                                    y = pointY - boxHeight;
                                }
                                return [x, y];
                            }
                        },
                        legend: {
                            data: this.legend
                        },
                        grid: {
                            left: '1%',
                            right: '2%',
                            bottom: '1%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: this.xAxis,
                        },
                        yAxis: {
                            type: 'value',
                            // 显示Y轴竖线
                            axisLine:{
                                show:true
                            },
                        },
                        series: this.series,
                    };
                    myChart.setOption(option);
                }
            },
            gotoUrl() {
                this.$router.push('/fileMonitor/fileTaskLogManage');
            },
        },
    }
</script>
<style lang="scss" scoped>
    .content-view {
        float: right;
        font-size: 13px;
    }

    .content-card {
        margin: 0 0.5%;
        width: 99%
    }

    .content-title {
        font-size: 17px;
        font-family: 微软雅黑;
        font-weight: bold;
    }

    .content-item1 {
        font-size: 13px;
        height: 40px;
        padding-left: 5%;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
</style>
