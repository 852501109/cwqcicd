<template lang="html">
    <div class="cron" :val="value_">
        <el-tabs v-model="activeName">
            <el-tab-pane label="秒" name="s">
                <second-and-minute v-model="sVal" lable="秒"></second-and-minute>
            </el-tab-pane>
            <el-tab-pane label="分" name="m">
                <second-and-minute v-model="mVal" lable="分"></second-and-minute>
            </el-tab-pane>
            <el-tab-pane label="时" name="h">
                <hour v-model="hVal" lable="时"></hour>
            </el-tab-pane>
            <el-tab-pane label="日" name="d">
                <day v-model="dVal" lable="日"></day>
            </el-tab-pane>
            <el-tab-pane label="月" name="month">
                <month v-model="monthVal" lable="月"></month>
            </el-tab-pane>
            <el-tab-pane label="周" name="week">
                <week v-model="weekVal" lable="周"></week>
            </el-tab-pane>
            <el-tab-pane label="年" name="year">
                <year v-model="yearVal" lable="年"></year>
            </el-tab-pane>
        </el-tabs>
        <!-- table -->
        <el-table
            tooltip-effect="light"
            highlight-current-row
            v-loading="$store.state.isSHowButtonLoading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255, 255, 255, 0.6)"
            :data="tableData"
            size="mini"
            border
            style="width: 100%"
        >
            <el-table-column show-overflow-tooltip prop="sVal" label="秒" width="70"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="mVal" label="分" width="70"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="hVal" label="时" width="70"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="dVal" label="日" width="70"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="monthVal" label="月" width="70"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="weekVal" label="周" width="70"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="yearVal" label="年"> </el-table-column>
        </el-table>
        <div class="cron-opera">
            <el-input v-model="cronVal" style="width: 335px" placeholder="请输入内容"></el-input>
            <span>
                <el-button @click="$emit('input', defaultVal)">还原</el-button>
                <el-button type="primary" @click="CALCRUNTIME({ cron: cronVal })">同步</el-button>
            </span>
        </div>
        <div class="cron-recent-times">
            <h2>最近5次运行时间:</h2>
            <ul>
                <li v-for="item in calcRunTime" :key="item" v-html="item"></li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import SecondAndMinute from './secondAndMinute';
import hour from './hour';
import day from './day';
import month from './month';
import week from './week';
import year from './year';
export default {
    props: {
        value: {
            type: String,
        },
    },
    data() {
        return {
            //
            defaultVal: this.value,
            cronVal: this.value,
            activeName: 's',
            sVal: '',
            mVal: '',
            hVal: '',
            dVal: '',
            monthVal: '',
            weekVal: '',
            yearVal: '',
            createdStatic: false,
        };
    },
    watch: {
        value(newVal, oldVal) {
            this.cronVal = newVal;
        },
        cronVal(a, b) {
            // let spaceCnt = a.replace(/\S/g, '').length;
            // if(spaceCnt<5) {
            //     this.$AudaqueToast.error({
            //         template: `错误的表达式`,
            //         methods: {
            //             okEvent() {
            //
            //             }
            //         }
            //     });
            //     this.$emit('input', '')
            //     return false
            // }
            this.$emit('input', a);
            this.updateVal();
        },
    },
    computed: {
        ...mapState('webkit', ['calcRunTime']),
        tableData() {
            return [
                {
                    sVal: this.sVal,
                    mVal: this.mVal,
                    hVal: this.hVal,
                    dVal: this.dVal,
                    monthVal: this.monthVal,
                    weekVal: this.weekVal,
                    yearVal: this.yearVal,
                },
            ];
        },
        value_() {
            // if (!this.dVal && !this.weekVal) {
            //   return ''
            // }
            // if (this.dVal === '?' && this.weekVal === '?') {
            //   this.$message.error('日期与星期不可以同时为“不指定”')
            // }
            // if (this.dVal !== '?' && this.weekVal !== '?') {
            //   this.$message.error('日期与星期必须有一个为“不指定”')
            // }
            let v = `${this.sVal} ${this.mVal} ${this.hVal} ${this.dVal} ${this.monthVal} ${this.weekVal}`;
            if (this.yearVal && this.yearVal != '') v += ' ' + this.yearVal;
            this.$emit('input', v);
            if (this.monthVal.length > 0 && this.weekVal.length > 0) {
                let msg = '';
                if (
                    this.sVal == '?' ||
                    this.mVal == '?' ||
                    this.hVal == '?' ||
                    this.dVal == '?' ||
                    this.yearVal == '?'
                ) {
                    msg = '秒、分钟、小时、日、年必须配置';
                } else if (this.monthVal == '?' && this.weekVal == '?') {
                    msg = '月和周必须配置一个';
                } else if (this.monthVal != '?' && this.weekVal != '?') {
                    msg = '月和周二者只能配置一个';
                }
                if (msg.length != 0) {
                    this.$message.error(msg);
                    return false;
                }
            }
            return v;
        },
    },
    methods: {
        ...mapActions('webkit', ['CALCRUNTIME']),
        updateVal() {
            if (!this.value) {
                return;
            }
            // this.cronVal = this.value
            let arrays = this.cronVal.split(' ');
            if (!this.createdStatic) {
                //默认初始化值
                this.sVal = '*';
                this.mVal = '*';
                this.hVal = '*';
                this.dVal = '*';
                this.monthVal = '*';
                this.weekVal = '?';
                this.yearVal = '*';
                this.createdStatic = true;
                return;
            }
            this.sVal = this.$utils.cronToNum(arrays[0]);
            this.mVal = this.$utils.cronToNum(arrays[1]);
            this.hVal = this.$utils.cronToNum(arrays[2]);
            this.dVal = this.$utils.cronToNum(arrays[3] == 0 ? 1 : arrays[3]);
            this.monthVal = arrays[4];
            this.weekVal = arrays[5];
            this.yearVal = arrays[6];
        },
    },
    created() {
        this.updateVal();
    },
    components: {
        SecondAndMinute,
        hour,
        day,
        month,
        week,
        year,
    },
};
</script>

<style lang="scss">
.cron-opera {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    .el-input.is-disabled .el-input__inner {
        background: #fff;
    }
}
.cron-recent-times {
    color: #3a405b;
    font-size: 14px;
    h2 {
        font-size: 14px;
        margin: 20px 0 8px;
        font-weight: normal;
    }
    ul {
        overflow: hidden;
        padding-left: 0;
        width: 100%;
        margin: 0 0 8px;
    }
    li {
        float: left;
        margin-right: 20px;
        line-height: 28px;
    }
}
.cron {
    text-align: left;
    padding: 10px;
    background: #fff;
    border: 1px solid #dcdfe6;
    /*box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);*/
}
</style>
