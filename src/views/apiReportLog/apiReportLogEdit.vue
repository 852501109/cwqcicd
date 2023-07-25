<!--
* @description 系统审计表编辑
* @author liyaxin
* @date 2023-06-15 15:51:11
!-->
<template>
    <audaque-detail-form-page
        @submit-click="subBtn"
        :title="!filter ? '系统审计表查看' : rowId ? '系统审计表编辑' : '系统审计表新增'"
        :opt-type="$route.query.filter"
        class=""
    >
        <template>
            <el-form
                :model="param"
                label-width="120px"
                ref="apiReportLogForm"
                :rules="rules"
                class="form-item"
                :disabled="!filter">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="id" prop="id" :rules="rules.id">
                            <el-input :disabled="!filter" v-model.trim="param.id" placeholder="请输入id" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="数据来源：库表：0，接口：1" prop="dataSource" :rules="rules.dataSource">
                            <el-input :disabled="!filter" v-model.trim="param.dataSource" placeholder="请输入数据来源：库表：0，接口：1" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="类别id" prop="categoryId" :rules="rules.categoryId">
                            <el-input :disabled="!filter" v-model.trim="param.categoryId" placeholder="请输入类别id" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="库表或接口名" prop="queryReportName" :rules="rules.queryReportName">
                            <el-input :disabled="!filter" v-model.trim="param.queryReportName" placeholder="请输入库表或接口名" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="查询人id" prop="queryUser" :rules="rules.queryUser">
                            <el-input :disabled="!filter" v-model.trim="param.queryUser" placeholder="请输入查询人id" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="查询开始时间" prop="queryStartTime" :rules="rules.queryStartTime">
                            <el-input :disabled="!filter" v-model.trim="param.queryStartTime" placeholder="请输入查询开始时间" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="查询结束时间" prop="queryEndTime" :rules="rules.queryEndTime">
                            <el-input :disabled="!filter" v-model.trim="param.queryEndTime" placeholder="请输入查询结束时间" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="查询条件" prop="queryCondition" :rules="rules.queryCondition">
                            <el-input :disabled="!filter" v-model.trim="param.queryCondition" placeholder="请输入查询条件" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="相关表/接口id" prop="relationTableApiId" :rules="rules.relationTableApiId">
                            <el-input :disabled="!filter" v-model.trim="param.relationTableApiId" placeholder="请输入相关表/接口id" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="查询excel路径" prop="uploadFileUrl" :rules="rules.uploadFileUrl">
                            <el-input :disabled="!filter" v-model.trim="param.uploadFileUrl" placeholder="请输入查询excel路径" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="查询状态：0 查询中   1 查询完成" prop="queryStatus" :rules="rules.queryStatus">
                            <el-input :disabled="!filter" v-model.trim="param.queryStatus" placeholder="请输入查询状态：0 查询中   1 查询完成" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="查询结果：0 查询中   1 查询成功  2 查询失败" prop="queryResult" :rules="rules.queryResult">
                            <el-input :disabled="!filter" v-model.trim="param.queryResult" placeholder="请输入查询结果：0 查询中   1 查询成功  2 查询失败" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="查询失败消息" prop="queryMsg" :rules="rules.queryMsg">
                            <el-input :disabled="!filter" v-model.trim="param.queryMsg" placeholder="请输入查询失败消息" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="日志入库时间" prop="logTime" :rules="rules.logTime">
                            <el-input :disabled="!filter" v-model.trim="param.logTime" placeholder="请输入日志入库时间" maxlength="200" show-word-limit></el-input>
                        </el-form-item>

                    </el-col>
                </el-row>
            </el-form>
        </template>
    </audaque-detail-form-page>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            value: '',
            rowId: this.$route.query.id,
            filter: this.$route.query.filter  == 'view' ? false : true,
            param: {
                id: '',
                dataSource: '',
                categoryId: '',
                queryReportName: '',
                queryUser: '',
                queryStartTime: '',
                queryEndTime: '',
                queryCondition: '',
                relationTableApiId: '',
                uploadFileUrl: '',
                queryStatus: '',
                queryResult: '',
                queryMsg: '',
                logTime: ''
            },
            rules: {
                id: [
                    { required: true, message: '请输入id', trigger: 'blur' }
                ],
                dataSource: [
                    { required: true, message: '请输入数据来源：库表：0，接口：1', trigger: 'blur' }
                ],
                categoryId: [
                    { required: true, message: '请输入类别id', trigger: 'blur' }
                ],
                queryReportName: [
                    { required: true, message: '请输入库表或接口名', trigger: 'blur' }
                ],
                queryUser: [
                    { required: true, message: '请输入查询人id', trigger: 'blur' }
                ],
                queryStartTime: [
                    { required: true, message: '请输入查询开始时间', trigger: 'blur' }
                ],
                queryEndTime: [
                    { required: true, message: '请输入查询结束时间', trigger: 'blur' }
                ],
                queryCondition: [
                    { required: true, message: '请输入查询条件', trigger: 'blur' }
                ],
                relationTableApiId: [
                    { required: true, message: '请输入相关表/接口id', trigger: 'blur' }
                ],
                uploadFileUrl: [
                    { required: true, message: '请输入查询excel路径', trigger: 'blur' }
                ],
                queryStatus: [
                    { required: true, message: '请输入查询状态：0 查询中   1 查询完成', trigger: 'blur' }
                ],
                queryResult: [
                    { required: true, message: '请输入查询结果：0 查询中   1 查询成功  2 查询失败', trigger: 'blur' }
                ],
                queryMsg: [
                    { required: true, message: '请输入查询失败消息', trigger: 'blur' }
                ],
                logTime: [
                    { required: true, message: '请输入日志入库时间', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
    },
    methods: {
        ...mapActions('apiReportLog', ['GOEDITAPIREPORTLOG', 'MODIFYAPIREPORTLOG', 'ADDAPIREPORTLOG']),
        subBtn() {
            let _this = this;
            this.$refs.apiReportLogForm.validate((valid) => {
                if (valid) {
                    this.$store.commit('SHOW_LOADING', true);
                    if (this.rowId) {
                        let param = this.param;
                        param.id = this.rowId;
                        this.MODIFYAPIREPORTLOG(this.param).then((res) => {
                            if (res.code == 0) {
                                this.$AudaqueToast.tip({
                                    template: `修改成功`,
                                    methods: {
                                        okEvent() {
                                            _this.$router.go(-1);
                                        },
                                    },
                                });
                            }
                        });
                    } else {
                        let param = this.param;
                        this.ADDAPIREPORTLOG(param).then((res) => {
                            if (res.code == 0) {
                                this.$AudaqueToast.tip({
                                    template: `添加成功`,
                                    methods: {
                                        okEvent() {
                                            _this.$router.go(-1);
                                        },
                                    },
                                });
                            }
                        });
                    }
                } else {
                    return false;
                }
            });
        },
    },
    mounted() {},
    created() {
        if (this.rowId) {
            this.GOEDITAPIREPORTLOG({ id: this.rowId }).then((res) => {
                this.param.id = res.id;
                this.param.dataSource = res.dataSource;
                this.param.categoryId = res.categoryId;
                this.param.queryReportName = res.queryReportName;
                this.param.queryUser = res.queryUser;
                this.param.queryStartTime = res.queryStartTime;
                this.param.queryEndTime = res.queryEndTime;
                this.param.queryCondition = res.queryCondition;
                this.param.relationTableApiId = res.relationTableApiId;
                this.param.uploadFileUrl = res.uploadFileUrl;
                this.param.queryStatus = res.queryStatus;
                this.param.queryResult = res.queryResult;
                this.param.queryMsg = res.queryMsg;
                this.param.logTime = res.logTime;
            });
        }
    },
};
</script>
<style lang="scss" scoped>
.get-edit-item {
    padding-top: 20px;
    margin: 0 50px;
    li {
        margin-top: 20px;
        display: flex;
        .get-edit-type {
            height: 40px;
            line-height: 40px;
        }
        .get-edit-title {
            width: 80px;
            color: #3a405b;
            height: 40px;
            line-height: 40px;
        }
        .el-tree {
            width: 100%;
            border: 1px solid #dcdfe6;
            padding: 24px;
        }
    }
}
</style>
