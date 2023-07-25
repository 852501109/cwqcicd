<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="6">
                <AdqIndexCard title="通道总数" :value="channelSumNum" corner-title="启用" url="/channel/channelManage" :corner-value="channelUseNum"></AdqIndexCard>
            </el-col>
            <el-col :span="6">
                <AdqIndexCard title="传输文件总数" :value="fileSumNum"  corner-title="失败" url="/fileMonitor/fileTaskLogManage" :corner-value="fileFailNum"></AdqIndexCard>
            </el-col>
            <el-col :span="6">
                <AdqIndexCard title="传输文件总大小" :value="fileSumSize" url="/fileMonitor/fileTaskLogManage" corner-title="单位 M"></AdqIndexCard>
            </el-col>
            <el-col :span="6">
                <AdqIndexCard title="服务" :value="serviceSumNum" corner-title="在线/离线" url="/fileMonitor/serviceMonitorManage" :corner-value="serviceCornerNum"></AdqIndexCard>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <HardwareMonitor></HardwareMonitor>
            </el-col>
            <el-col :span="12">
                <AlarmMsg></AlarmMsg>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <DailyCharts></DailyCharts>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import AdqIndexCard from '@/components/adqIndexCard';
import HardwareMonitor from '@/views/home/HardwareMonitor';
import AlarmMsg from '@/views/home/AlarmMsg';
import DailyCharts from '@/views/home/DailyCharts';

export default {
    data() {
        return {
            channelSumNum: "0",
            channelUseNum: "0",
            fileSumNum: "0",
            fileFailNum: "0",
            fileSumSize: "0",
            serviceSumNum: "0",
            serviceCornerNum: "0 / 0",
            timerIndex: null
        };
    },
    components: {AdqIndexCard, HardwareMonitor, AlarmMsg,DailyCharts},
    created() {
        this.initData();
        this.timerIndex = setInterval(() => {
            this.initData();
        }, 3000);
    },
    mounted() {
    },
    beforeDestroy() {
      clearInterval(this.timerIndex);
      this.timerIndex = null;
    },
    methods: {
        ...mapActions('mainPage', ['GET_INDEXS']),
        initData() {
            this.GET_INDEXS({}).then((res) => {
                this.channelSumNum = res.channelSumNum + '';
                this.channelUseNum = res.channelUseNum + '';
                this.fileSumNum = res.fileSumNum + '';
                this.fileFailNum = res.fileFailNum + '';
                this.fileSumSize = res.fileSumSize + '';
                this.serviceSumNum = res.serviceSumNum + '';
                this.serviceCornerNum = res.serviceOnlineNum + " / " + res.serviceOfflineNum;
            });
        },
    },
};
</script>

<style lang="scss">
    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .el-col {
        border-radius: 4px;
    }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
