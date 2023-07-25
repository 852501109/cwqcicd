<!-- 类别编辑-->
<template>
    <audaque-detail-form-page @submit-click="submit" :title="operateName" :opt-type="optType" class="category-edit">
        <template>
            <el-form
                ref="ruleform"
                :model="form"
                label-width="120px"
                :rules="rules"
                :disabled="optType === 'view'"
                class="form-item"
            >
                <el-row>
                    <el-col :span="23">
                        <el-form-item label="编码" prop="code">
                            <el-input v-model.trim="form.code" maxlength="50" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model.trim="form.name" maxlength="50" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                        <el-form-item label="排序号" prop="sortNum">
                            <el-input v-model.trim="form.sortNum" maxlength="5" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="optType === 'view'">
                    <el-col :span="23">
                        <el-form-item label="创建人" prop="createUserName">
                            <el-input v-model.trim="form.createUserName" maxlength="100" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="optType === 'view'">
                    <el-col :span="23">
                        <el-form-item label="创建时间" prop="createTime">
                            <el-input v-model.trim="form.createTime" maxlength="100" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="optType === 'view'">
                    <el-col :span="23">
                        <el-form-item label="更新人" prop="updateUserName">
                            <el-input v-model.trim="form.updateUserName" maxlength="100" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="optType === 'view'">
                    <el-col :span="23">
                        <el-form-item label="更新时间" prop="updateTime">
                            <el-input v-model.trim="form.updateTime" maxlength="100" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </template>
    </audaque-detail-form-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            form: {
                code: '',
                name: '',
                sortNum: null,
                createUserName: '',
                createTime: '',
                updateUserName: '',
                updateTime: '',
            },
            rules: {
                code: [{ required: true, message: '编码不能为空' }],
                name: [{ required: true, message: '名称不能为空' }],
                sortNum: [
                    {
                        pattern: /^[0-9]*$/,
                        message: '排序号必须是数字',
                        trigger: 'blur',
                    },
                ],
            },
            operateName: '',
            optId: this.$route.query.id,
            optType: this.$route.query.optType,
            userMaxLength: window.accountMaxLength,
            isCluster: window.isCluster, //是否是集群环境
        };
    },
    watch: {},
    computed: {
        ...mapState('webkit', ['reportCategoryDetail']),
    },
    created() {
        if ((this.isCluster && !this.optType) || (this.isCluster && this.optType === 'add')) this.optType = 'view'; //集群环境没有新增功能

        if (this.optType === 'view') {
            this.operateName = '查看类别';
        } else if (this.optType === 'edit') {
            this.operateName = '编辑类别';
        } else {
            if (!this.isCluster) this.operateName = '新增类别';
        }
        if (this.optType !== 'add') {
            this.queryDetail();
        }
    },

    methods: {
        ...mapActions('webkit', ['ADD_REPORT_CATEGORY', 'UPDATE_REPORT_CATEGORY', 'QUERY_REPORT_CATEGORY_DETAIL']),
        ...mapActions(['_AJAX']),
        async queryDetail() {
            let params = { id: this.optId };
            await this.QUERY_REPORT_CATEGORY_DETAIL(params).then(() => {
                this.form.code = this.reportCategoryDetail.code;
                this.form.name = this.reportCategoryDetail.name;
                this.form.sortNum = this.reportCategoryDetail.sortNum;
                this.form.createUserName = this.reportCategoryDetail.createUserName;
                this.form.createTime = this.reportCategoryDetail.createTime;
                this.form.updateUserName = this.reportCategoryDetail.updateUserName;
                this.form.updateTime = this.reportCategoryDetail.updateTime;
            });
        },
        submit() {
            let data = {
                code: this.form.code,
                name: this.form.name,
                sortNum: this.form.sortNum,
            };
            this.$refs.ruleform.validate((valid) => {
                if (valid) {
                    let _this = this;
                    _this.$store.commit('SHOW_LOADING', true);
                    if (this.optType === 'edit') {
                        data.id = this.optId;
                        this.UPDATE_REPORT_CATEGORY(data)
                            .then((res) => {
                                this.$AudaqueToast.tip({
                                    template: `修改成功`,
                                    methods: {
                                        okEvent() {
                                            _this.$router.go(-1);
                                        },
                                    },
                                });
                            })
                            .catch((err) => (this.loading = false));
                    } else {
                        //add
                        this.ADD_REPORT_CATEGORY(data)
                            .then((res) => {
                                this.$AudaqueToast.tip({
                                    template: `添加成功`,
                                    methods: {
                                        okEvent() {
                                            _this.$router.go(-1);
                                        },
                                    },
                                });
                            })
                            .catch((err) => (this.loading = false));
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
.category-edit {
    /deep/ .resource {
        border: 1px solid #e1dfdc;
    }

    /deep/ .submit-wrap {
        text-align: center;
        margin-top: 0.2rem;
    }
    /deep/ .el-tree {
        height: 3.5rem;
        overflow-y: scroll;
    }
    .paf-title {
        cursor: pointer;
    }
    .agree {
        color: red;
    }
    /deep/.form-item {
        width: 99%;
        padding-right: 0;
    }
}
</style>
