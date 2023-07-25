<template>
    <audaque-detail-form-page
        class="news-type-sys-edit"
        @submit-click="submitForm"
        :title="formTitle"
        :opt-type="$route.query.optType"
    >
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" :disabled="isView">
            <el-form-item label="标题" prop="title">
                <el-input placeholder="" show-word-limit v-model.trim="ruleForm.title" maxlength="32"> </el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <tinymce :disabled="isView" v-model="ruleForm.content"></tinymce>
            </el-form-item>
            <el-form-item label="摘要" prop="messageAbstract">
                <el-input
                    class="news-type-sys-introduction"
                    type="textarea"
                    autosize
                    placeholder=""
                    show-word-limit
                    maxlength="1000"
                    v-model.trim="ruleForm.messageAbstract"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="紧急程度" prop="level">
                <el-select v-model="ruleForm.level">
                    <el-option :label="item.label" :value="item.value" v-for="item in levelList" :key="item.label">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通告类型" prop="receiveType">
                <el-select v-model="ruleForm.receiveType">
                    <el-option label="全体用户" :value="1"></el-option>
                    <el-option label="指定用户" :value="2"></el-option>
                    <el-option label="指定部门" :value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户" prop="receiveCode" v-if="ruleForm.receiveType === 2">
                <adq-user-list-component
                    v-model="ruleForm.receiveCode"
                    :multiple="true"
                    :userList.sync="userList"
                ></adq-user-list-component>
            </el-form-item>
            <el-form-item label="部门" prop="departmentIds" v-if="ruleForm.receiveType === 3">
                <div class="dept-box">
                    <adq-tree ref="tree" :defaultCheckedKeys="defaultCheckedKeys" :check-strictly="true"> </adq-tree>
                </div>
            </el-form-item>
            <el-form-item label="" v-if="$route.query.optType === 'view'">
                <div class="history-record-item">
                    <div class="history-record-title">公告发布撤销日志</div>
                    <el-table
                        tooltip-effect="light"
                        class="el-table-common__list"
                        highlight-current-row
                        stripe
                        :data="historyList.rows"
                        border
                    >
                        <el-table-column show-overflow-tooltip type="index" label="序号" width="50"> </el-table-column>
                        <el-table-column show-overflow-tooltip prop="createUserName" label="操作人"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="publishStatus" label="操作行为">
                            <template slot-scope="scope">
                                {{ scope.row.publishStatus === 0 ? '撤销' : '发布' }}
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="createTime" label="操作时间">
                            <template slot-scope="scope">
                                {{ publics.formatTime(scope.row.createTime, 'Y-M-D h:m:s') }}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form-item>
        </el-form>
    </audaque-detail-form-page>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { levelList } from './newsSearchJs';
import adqTree from '@/components/adqTree';
export default {
    computed: {
        ...mapState(['upload']),
    },
    data() {
        return {
            formTitle:
                this.$route.query.optType === 'edit'
                    ? '编辑公告'
                    : this.$route.query.optType === 'view'
                    ? '查看公告'
                    : '新增公告',
            ruleForm: {
                type: 1, //公告类型
            },
            rules: {
                title: { required: true, message: '请输入标题', trigger: 'blur' },
                level: { required: true, message: '请选择紧急程度', trigger: 'change' },
                receiveType: { required: true, message: '请选择通告类型', trigger: 'change' },
                content: { required: true, message: '请输入内容', trigger: 'change' },
                // receiveCode: { required: true, message: '请选择用户', trigger: 'change' },
            },
            isView: false,
            levelList,
            userList: [],
            defaultCheckedKeys: [],
            userParams: {
                page: 1,
                rows: 200,
                name: null,
            },
            historyList: [],
        };
    },
    components: { adqTree },
    watch: {
        'ruleForm.content': {
            handler(val) {
                this.$refs.ruleForm.validateField('content');
                if (val && val.length > 0) {
                    /*校验富文本 不主动掉不会把提示信息清除*/
                    this.$refs.ruleForm.clearValidate('content');
                }
            },
            deep: true,
        },
        userList: {
            //将用户列表里没有的数据剔除，以防止直接显示id
            handler(val) {
                let userIds = val.map((item) => {
                    return item.id;
                });
                this.defaultCheckedKeys.forEach((item, index) => {
                    if (userIds.indexOf(item) === -1) {
                        this.defaultCheckedKeys.splice(index, 1);
                    }
                });
            },
            deep: true,
        },
    },
    async created() {
        if (this.$route.query.optType === 'view') {
            this.isView = true;
        }
        if (this.$route.query.id) {
            await this.loadData();
        }
    },
    methods: {
        ...mapActions(['_AJAX']),
        /*初始化数据*/
        loadData() {
            this._AJAX({
                url: 'sys.message.notice.id',
                method: 'GET',
                data: {
                    id: this.$route.query.id,
                    needSendList: 0,
                },
            }).then((res) => {
                if (res.code == 0) {
                    let result = res.result;
                    this.ruleForm = result;
                    /*用户的回显*/
                    if (/[，,]/g.test(result.receiveCode)) {
                        this.ruleForm.receiveCode = result.receiveCode.split(',').map(Number);
                        this.defaultCheckedKeys = this.ruleForm.receiveCode;
                    } else {
                        if (result.receiveCode) this.ruleForm.receiveCode = [Number(result.receiveCode)];
                        if (result.receiveCode) this.defaultCheckedKeys = this.ruleForm.receiveCode;
                    }
                }
            });
            this._AJAX({
                url: 'sys.messagePublishHis.list',
                method: 'GET',
                data: {
                    page: 1,
                    rows: 99999,
                    messageCode: this.$route.query.uuidCode,
                },
            }).then((res) => {
                if (res.code == 0) {
                    this.historyList = res.result;
                }
            });
        },
        /*提交*/
        submitForm() {
            this.$refs['ruleForm'].validate((valid) => {
                let _this = this;
                if (valid) {
                    if (this.ruleForm.content.length > 65535) {
                        return this.$AudaqueToast.error({
                            template: `内容超出允许输入的上限，请整理后重新输入!`,
                            methods: {
                                okEvent() {},
                            },
                        });
                    }
                    let params = Object.assign({}, this.ruleForm);
                    let dep = null;
                    if (this.$refs.tree) {
                        /*部门*/
                        dep = this.$refs.tree.$refs.adqTree.getCheckedKeys();
                        params.receiveCode = dep;
                    }
                    /*处理用户*/
                    if (params.receiveCode && params.receiveCode.length > 0) {
                        params.receiveCode = params.receiveCode.join(',');
                    }
                    if (this.ruleForm.receiveType === 1) {
                        this.$delete(params, 'receiveCode');
                    }
                    this.$store.commit('SHOW_LOADING', true);
                    if (this.$route.query.id) {
                        this._AJAX({
                            url: 'sys.message.edit',
                            method: 'POST',
                            data: params,
                        }).then((res) => {
                            this.$AudaqueToast.tip({
                                template: `编辑成功`,
                                methods: {
                                    okEvent() {
                                        _this.$router.go(-1);
                                    },
                                },
                            });
                        });
                    } else {
                        this._AJAX({
                            url: 'sys.message.add',
                            method: 'POST',
                            data: params,
                        }).then((res) => {
                            this.$AudaqueToast.tip({
                                template: `新增成功`,
                                methods: {
                                    okEvent() {
                                        _this.$router.go(-1);
                                    },
                                },
                            });
                        });
                    }
                } else {
                    return false;
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
/deep/ .news-type-sys-introduction {
    min-height: 90px !important;
    height: auto !important;
    /deep/ .el-textarea__inner {
        min-height: 90px !important;
    }
}
.history-record-item {
    border-top: 1px solid #e0e0e0;
    .history-record-title {
        font-size: 16px;
        padding-top: 10px;
        margin-bottom: 10px;
    }
}
</style>
