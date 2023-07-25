<template>
    <audaque-detail-form-page
        class="news-type-sys-edit"
        @submit-click="submitForm"
        :title="formTitle"
        :opt-type="$route.query.optType"
    >
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" :disabled="isView">
            <el-form-item label="类型编号" prop="code">
                <el-input v-model.trim="ruleForm.code" maxlength="24" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="类型名称" prop="name">
                <el-input v-model.trim="ruleForm.name" maxlength="24" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input
                    class="news-type-sys-introduction"
                    type="textarea"
                    autosize
                    placeholder=""
                    maxlength="100"
                    show-word-limit
                    v-model.trim="ruleForm.remark"
                >
                </el-input>
            </el-form-item>
        </el-form>
    </audaque-detail-form-page>
</template>
<style lang="scss" scoped>
.news-type-sys-edit {
    /deep/ .news-type-sys-introduction {
        min-height: 90px !important;
        height: auto !important;
        /deep/ .el-textarea__inner {
            min-height: 90px !important;
        }
    }
}
</style>
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
                    ? '编辑消息类型'
                    : this.$route.query.optType === 'view'
                    ? '查看消息类型'
                    : '新增消息类型',
            preview: '',
            ruleForm: {
                code: '',
                name: '',
                remark: '',
            },
            rules: {
                code: [{ required: true, message: '类型编号不能为空', trigger: 'blur' }],
                name: [{ required: true, message: '类型名称不能为空', trigger: 'blur' }],
            },
            isView: false,
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
                url: 'news.sys.msg.type.id',
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
                    this.$store.commit('SHOW_LOADING', true);
                    if (this.$route.query.id) {
                        this._AJAX({
                            url: 'news.sys.msg.edit',
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
                            url: 'news.sys.msg.new',
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
