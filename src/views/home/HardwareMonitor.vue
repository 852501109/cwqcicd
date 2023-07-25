<template>
    <el-card class="box-card content-card-outer">
        <el-carousel :interval="5000" arrow="always"  >
            <el-carousel-item v-for="info in hardwareInfo" :key="info.title">
                <el-card class="box-card content-card-inner">
                        <!--滑动栏里的内容 -->
                        <div slot="header" class="clearfix content-title">
                            <span class="content-name">服务监控 - {{info.title}}</span>
                            <span class="content-summary">{{info.summary}}</span>
                            <a class="content-view iconfont iconmore operate" @click="gotoUrl"></a>
                        </div>
                        <div class="item content-hardware" style="height:200px">
                            <el-scrollbar style="height: 100%">
                                <div v-for="item in info.index" :key="item.host" class="content-hardware-item">
                                    <div style="margin-top:8px">
                                        <div style="text-align:left; padding-left:20px">
                                            <span>{{item.type}}&nbsp;&nbsp;{{item.host}}&nbsp;&nbsp;</span>
                                            <span v-if="item.healthy" class="online-service iconfont icon-zaixian operate"></span>
                                            <span v-if="!item.healthy" class="offline-service iconfont icon-lixian operate"></span>
                                        </div>
                                        <div style="margin-top:3px">
                                            <el-progress :percentage="item.percentage" :color="customColorMethod"></el-progress>
                                        </div>
                                    </div>
                                </div>
                            </el-scrollbar>
                        </div>
                </el-card>
            </el-carousel-item>
        </el-carousel>
    </el-card>
</template>
<script>
    import { mapActions } from 'vuex';
    
    export default {
        name: 'HardwareMonitor',
        data() {
            return {
                hardwareInfo: [],
                timerHardware: null
            }
        },
        created() {
            this.initData();
            this.timerHardware = setInterval(() => {
                this.initData();
            }, 3000);
        },
        beforeDestroy() {
            clearInterval(this.timerHardware);
            this.timerHardware = null;
        },
        methods: {
            ...mapActions('mainPage', ['GET_HARDWARES']),
            initData() {
                this.GET_HARDWARES({}).then((res) => {
                    this.hardwareInfo = res;
                });
            },
            customColorMethod(percentage) {
                if (percentage < 30) {
                    return '#313ddd';
                } else if (percentage < 90) {
                    return '#31dd65';
                } else {
                    return '#dd3131';
                }
            },
            gotoUrl() {
                this.$router.push('/fileMonitor/serviceMonitorManage');
            },
        }
    }
</script>
<style lang="scss" scoped>
    .content-view {
        float: right;
        font-size: 13px;
        width: 2%;
    }

    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 200px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color:#fff;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color:#fff;
    }

    ::v-deep .el-carousel__button {
        display: block;
        opacity: .48;
        width: 30px;
        height: 2px;
        background-color: #475669;
        border: none;
        outline: 0;
        padding: 0;
        margin: 0;
        cursor: pointer;
        -webkit-transition: .3s;
        transition: .3s;
    }

    .content-card-inner {
        margin: 0 0%;
    }
    
    .content-card-outer{
        margin: -1% 1%;
    }

    .content-hardware {
        text-align: center;
    }

    .content-title {
        font-size: 17px;
        font-family: 微软雅黑;
        font-weight: bold;
        display:flex;
        justify-content: space-between;
    }

    .content-name {
        width: 70%;
    }

    .content-title .content-summary{
        font-size: 5px;
        font-family: 微软雅黑;
        color: #b1b4b8;
        width: 29%;
    }

    .content-hardware-item {
        font-size: 13px;
        height: 40px;
        width: 95%;
        text-align: center;
        padding-left: 3%;
    }

    .online-service {
        font-size: 13px;
    }

    .offline-service {
        font-size: 13px;
        color: red;
    }

    .content-hardware-item {
        font-size: 13px;
        height: 40px;
        width: 95%;
        text-align: center;
        padding-left: -1%;
    }
</style>
