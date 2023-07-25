<template>
    <audaque-detail-form-page
        class="process-config-edit"
        @submit-click="submitForm"
        :title="formTitle"
        :opt-type="$route.query.optType"
    >
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" :disabled="isView">
            <el-form-item label="业务名称" prop="name">
                <el-input v-model.trim="ruleForm.name" maxlength="24" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="业务编号" prop="code">
                <el-input v-model.trim="ruleForm.code" maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <!--<el-form-item label="类型" prop="type">-->
            <!--<el-input v-model.trim="ruleForm.type"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="备注" prop="description">
                <el-input
                    class="news-type-sys-introduction"
                    type="textarea"
                    autosize
                    placeholder=""
                    maxlength="100"
                    show-word-limit
                    v-model.trim="ruleForm.description"
                >
                </el-input>
            </el-form-item>
        </el-form>
    </audaque-detail-form-page>
</template>
<style lang="scss" scoped>
.process-config-edit {
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
import { mapActions } from 'vuex';
import API from '@/api/index';

export default {
    data() {
        return {
            formTitle:
                this.$route.query.optType === 'edit'
                    ? '编辑业务注册'
                    : this.$route.query.optType === 'view'
                    ? '查看业务注册'
                    : '新增业务注册',
            preview: '',
            ruleForm: {
                name: null,
                code: null,
                description: null,
            },
            rules: {
                name: [{ required: true, message: '业务名称不能为空', trigger: 'blur' }],
                code: [
                    { required: true, message: '业务编码不能为空', trigger: 'blur' },
                    { pattern: /^[A-Za-z0-9_\-]+$/gi, message: '只能包含数字、字母、下划线', trigger: 'blur' },
                ],
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
            let url = API['sys.category.id'] + '/' + this.$route.query.id;
            this._AJAX({
                url: url,
                method: 'GET',
                data: {},
            }).then((res) => {
                if (res.code == 0) {
                    this.ruleForm = res.result;
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
                            url: 'sys.category.update',
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
                            url: 'sys.category.insert',
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
