<template>
    <audaque-detail-form-page
        class="news-type-sys-edit"
        @submit-click="submitForm"
        :title="formTitle"
        :opt-type="$route.query.optType"
    >
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" :disabled="isView">
            <el-form-item label="模板标题" prop="templateName">
                <el-input placeholder="" show-word-limit v-model.trim="ruleForm.templateName" maxlength="64">
                </el-input>
            </el-form-item>
            <el-form-item label="模板编码" prop="templateCode">
                <el-input
                    placeholder=""
                    :disabled="$route.query.optType != 'add'"
                    show-word-limit
                    maxlength="64"
                    v-model.trim="ruleForm.templateCode"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="模板用途" prop="templateType">
                <el-select v-model="ruleForm.templateType">
                    <el-option :label="item.label" :value="item.value" v-for="item in templateList" :key="item.label">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="模板内容" prop="templateContent">
                <tinymce :disabled="isView" v-model="ruleForm.templateContent"></tinymce>
            </el-form-item>
            <el-form-item label="模板格式" prop="templateTestJson">
                <el-input
                    class="news-type-sys-introduction"
                    type="textarea"
                    autosize
                    placeholder=""
                    show-word-limit
                    maxlength="1000"
                    v-model.trim="ruleForm.templateTestJson"
                >
                </el-input>
            </el-form-item>
        </el-form>
    </audaque-detail-form-page>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['upload']),
    },
    data() {
        return {
            formTitle:
                this.$route.query.optType === 'edit'
                    ? '编辑消息模板'
                    : this.$route.query.optType === 'view'
                    ? '查看消息模板'
                    : '新增消息模板',
            preview: '',
            ruleForm: {},
            rules: {
                templateCode: { required: true, message: '请输入模板编码', trigger: 'blur' },
                templateType: { required: true, message: '请选择模板用途', trigger: 'change' },
                templateName: { required: true, message: '请输入模板标题', trigger: 'blur' },
                templateContent: { required: true, message: '请输入模板内容', trigger: 'change' },
                // templateTestJson: { required: true, message: '请输入模板格式', trigger: 'blur' },
            },
            isView: false,
            templateList: [
                // { label: '短信', value: 0 },
                // { label: '邮件', value: 1 },
                // { label: '微信', value: 2 },
                { label: '系统', value: 3 },
            ],
        };
    },
    created() {
        if (this.$route.query.id) {
            this.loadData();
        }
        if (this.$route.query.optType === 'view') {
            this.isView = true;
        }
    },
    methods: {
        ...mapActions(['_AJAX']),
        loadData() {
            this._AJAX({
                url: 'sys.message.template.id',
                method: 'GET',
                data: {
                    id: this.$route.query.id,
                },
            }).then((res) => {
                if (res.code == 0) {
                    let result = res.result;
                    this.ruleForm = result;
                }
            });
        },

        submitForm() {
            this.$refs['ruleForm'].validate((valid) => {
                let _this = this;
                if (valid) {
                    let params = Object.assign({}, this.ruleForm);
                    if (this.$route.query.id) {
                        this._AJAX({
                            url: 'sys.message.template.edit',
                            method: 'POST',
                            data: params,
                        }).then((res) => {
                            this.$AudaqueToast.tip({
                                template: `修改成功`,
                                methods: {
                                    okEvent() {
                                        _this.$router.go(-1);
                                    },
                                },
                            });
                        });
                    } else {
                        this._AJAX({
                            url: 'sys.message.template.add',
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
</style>
