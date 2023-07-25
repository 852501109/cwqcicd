<template>
    <el-card class="box-card content-card">
        <div slot="header" class="clearfix content-title">
            <span>告警消息</span>
            <a class="content-view iconfont iconmore operate" @click="gotoUrl"></a>
        </div>
        <div class="item content-hardware" style="height:245px">
            <el-scrollbar style="height: 100%">
                <div v-for="item in alarmMsg" :key="item.id" class="content-hardware-item">
                    <el-row>
                        <el-col :span="12" class="content-item1">
                            <span>{{item.title}}</span>
                        </el-col>
                        <el-col :span="8" class="content-item1">
                            <span>{{item.createTime}}</span>
                        </el-col>
                        <el-col :span="2" class="content-item1">
                            <template>
                                <span v-if="item.readFlag == 1" class="alarm-read">已读</span>
                                <span v-else>未读</span>
                            </template>
                        </el-col>
                        <el-col :span="2" class="content-item1">
                            <router-link title="查看详细"
                                :to="{ path: '/news/userAnnouncementEdit?optType=view&type=4', query: { id: item.id} }"
                                class="iconfont iconchakan11 operate"></router-link>
                        </el-col>
                    </el-row>
                </div>
            </el-scrollbar>
        </div>
    </el-card>
</template>
<script>
    import { mapActions } from 'vuex';
    
    export default {
        name: 'AlarmMsg',
        data() {
            return {
                alarmMsg:[],
                timerAlarm: null
            }
        },
        created() {
            this.initData();
            this.timerAlarm = setInterval(() => {
                this.initData();
            }, 6000);
        },
        beforeDestroy() {
            clearInterval(this.timerAlarm);
            this.timerAlarm = null;
        },
        methods: {
            ...mapActions('mainPage', ['GET_ALARMMSG']),
            initData() {
                this.GET_ALARMMSG({}).then((res) => {
                    this.alarmMsg = res;
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
                this.$router.push('/news/userAnnouncement');
            },
        },
    }
</script>
<style lang="scss" scoped>
    .alarm-read{
        color: red;
    }

    .content-view {
        float: right;
        font-size: 13px;
    }

    .content-card-outer{
        margin: -1% 1%;
    }

    .content-card {
        margin: -1% 1%;
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
