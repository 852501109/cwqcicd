<template>
    <audaque-detail-form-page title="查看详情" :opt-type="$route.query.optType">
        <template>
            <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="130px" class="source-ruleForm">
                <el-col :span="12">
                    <el-form-item label="告警ID：" prop="key">
                        <el-input v-model.trim="ruleForm.key" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="告警名称：" prop="name">
                        <el-input v-model.trim="ruleForm.name" readonly></el-input>
                    </el-form-item>
                </el-col>
                <!--<el-col :span="12">-->
                <!--<el-form-item label="告警分类ID：" prop="name">-->
                <!--<el-input v-model.trim="ruleForm.name" readonly></el-input>-->
                <!--</el-form-item>-->
                <!--</el-col>-->
                <el-col :span="12">
                    <el-form-item label="告警级别：" prop="level">
                        <el-input v-model.trim="ruleForm.level" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="产生时间：" prop="createTime">
                        <span class="customize">{{ruleForm.createTime ? publics.formatTime(ruleForm.createTime,'Y-M-D h:m:s') : ''}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="清除时间：" prop="cleanTime">
                        <span class="customize">{{ruleForm.cleanTime ? publics.formatTime(ruleForm.cleanTime,'Y-M-D h:m:s') : ''}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否可自动清除：" prop="autoClean">
                        <el-input v-model.trim="ruleForm.autoClean" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="清除类型：" prop="cleanType">
                        <el-input v-model.trim="ruleForm.cleanType" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="告警原因：" prop="content">
                        <el-input v-model.trim="ruleForm.content" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="定位信息：">
                    <span class="customize">
                        {{ruleForm.hostInfo + ';' + ruleForm.appKey + ';' + ruleForm.key}}
                    </span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="附加信息：" prop="remark">
                        <el-input v-model.trim="ruleForm.remark" readonly></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
        </template>
    </audaque-detail-form-page>
</template>
<script>
    import {mapActions} from 'vuex'

    export default {
        created() {
            let tenantId = this.$route.query.id;
            if (tenantId) {
                this.GET_ALARM_DETAIL({id:tenantId}).then((res) => {
                    this.ruleForm = res.result;
                }).catch(err => this.loading = false);
            }
        },
        data() {
            return {
                ruleForm: {},
            };
        },
        methods: {
            ...mapActions('webkit', ['GET_ALARM_DETAIL']),
        }
    }
</script>
<style lang='scss' scoped>
    .alarm-manage-details {
        .customize {
            width: 100%;
            line-height: 36px;
            height: 36px;
            border: 1px solid #DCDFE6;
            border-radius: 4px;
            padding: 0 15px;
            color: #606266;
        }
    }

</style>
