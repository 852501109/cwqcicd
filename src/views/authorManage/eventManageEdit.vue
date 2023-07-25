<template>
    <audaque-detail-form-page title="查看详情" :opt-type="$route.query.optType">
        <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="130px" class="source-ruleForm">
            <el-col :span="12">
                <el-form-item label="事件ID：" prop="key">
                    <el-input v-model.trim="ruleForm.key" readonly></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="事件名称：" prop="name">
                    <el-input v-model.trim="ruleForm.name" readonly></el-input>
                </el-form-item>
            </el-col>
            <!--<el-col :span="12">-->
            <!--<el-form-item label="事件分类ID：" prop="name">-->
            <!--<el-input v-model.trim="ruleForm.name" readonly></el-input>-->
            <!--</el-form-item>-->
            <!--</el-col>-->
            <el-col :span="12">
                <el-form-item label="事件级别：" prop="level">
                    <el-input v-model.trim="ruleForm.level" readonly></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="产生时间：" prop="createTime">
                    <span class="customize">{{ruleForm.createTime ? publics.formatTime(ruleForm.createTime,'Y-M-D h:m:s') : ''}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="事件原因：" prop="content">
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
    </audaque-detail-form-page>
</template>
<script>
    import {mapActions} from 'vuex'

    export default {
        created() {
            let tenantId = this.$route.query.id;
            if (tenantId) {
                this.GET_EVENT_DETAIL({id:tenantId}).then((res) => {
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
            ...mapActions('webkit', ['GET_EVENT_DETAIL']),
        }
    }
</script>
