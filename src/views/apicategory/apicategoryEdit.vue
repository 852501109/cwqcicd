<!--
* @description 接口查询类别表编辑
* @author liyaxin
* @date 2023-06-15 08:49:03
!-->
<template>
    <audaque-detail-form-page
        @submit-click="subBtn"
        :title="!filter ? '接口类别查看' : rowId ? '接口类别编辑' : '接口类别添加'"
        :opt-type="$route.query.filter"
        class=""
    >
        <template>
            <el-form
                :model="param"
                label-width="120px"
                ref="apicategoryForm"
                :rules="rules"
                class="form-item"
                :disabled="!filter"
            >
                <el-row>
                    <el-col :span="24">
                        <!-- <el-form-item label="id" prop="id" :rules="rules.id">
                            <el-input :disabled="!filter" v-model.trim="param.id" placeholder="请输入id" maxlength="200" show-word-limit></el-input>
                        </el-form-item> -->
                        <el-form-item label="编码" prop="code" :rules="rules.code">
                            <el-input
                                :disabled="!filter"
                                v-model.trim="param.code"
                                placeholder="请输入编码"
                                maxlength="50"
                                show-word-limit
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="名称" prop="name" :rules="rules.name">
                            <el-input
                                :disabled="!filter"
                                v-model.trim="param.name"
                                placeholder="请输入名称"
                                maxlength="50"
                                show-word-limit
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="排序号" prop="sortNum" :rules="rules.sortNum">
                            <el-input
                                :disabled="!filter"
                                v-model.trim="param.sortNum"
                                placeholder="请输入排序号"
                                maxlength="5"
                                show-word-limit
                            ></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="创建人" prop="createUser" :rules="rules.createUser">
                            <el-input :disabled="!filter" v-model.trim="param.createUser" placeholder="请输入创建人" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间" prop="createTime" :rules="rules.createTime">
                            <el-input :disabled="!filter" v-model.trim="param.createTime" placeholder="请输入创建时间" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="更新人" prop="updateUser" :rules="rules.updateUser">
                            <el-input :disabled="!filter" v-model.trim="param.updateUser" placeholder="请输入更新人" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="更新时间" prop="updateTime" :rules="rules.updateTime">
                            <el-input :disabled="!filter" v-model.trim="param.updateTime" placeholder="请输入更新时间" maxlength="200" show-word-limit></el-input>
                        </el-form-item> -->
                    </el-col>
                </el-row>
            </el-form>
        </template>
    </audaque-detail-form-page>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    name: 'ApicategoryEdit',
    data() {
        return {
            value: '',
            rowId: this.$route.query.id,
            filter: this.$route.query.filter == 'view' ? false : true,
            param: {
                id: '',
                name: '',
                code: '',
                sortNum: '',
                createUser: '',
                createTime: '',
                updateUser: '',
                updateTime: '',
            },
            rules: {
                id: [{ required: true, message: '请输入id', trigger: 'blur' }],
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
                sortNum: [
                    {
                        pattern: /^[0-9]*$/,
                        message: '排序号必须是数字',
                        trigger: 'blur',
                    },
                ],
                createUser: [{ required: true, message: '请输入创建人', trigger: 'blur' }],
                createTime: [{ required: true, message: '请输入创建时间', trigger: 'blur' }],
                updateUser: [{ required: true, message: '请输入更新人', trigger: 'blur' }],
                updateTime: [{ required: true, message: '请输入更新时间', trigger: 'blur' }],
            },
        };
    },
    computed: {},
    methods: {
        ...mapActions('apicategory', ['GOEDITAPICATEGORY', 'MODIFYAPICATEGORY', 'ADDAPICATEGORY']),
        subBtn() {
            let _this = this;
            this.$refs.apicategoryForm.validate((valid) => {
                if (valid) {
                    this.$store.commit('SHOW_LOADING', true);
                    if (this.rowId) {
                        let param = this.param;
                        param.id = this.rowId;
                        this.MODIFYAPICATEGORY(this.param).then((res) => {
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
                        this.ADDAPICATEGORY(param).then((res) => {
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
            this.GOEDITAPICATEGORY({ id: this.rowId }).then((res) => {
                this.param.id = res.id;
                this.param.name = res.name;
                this.param.code = res.code;
                this.param.sortNum = res.sortNum;
                this.param.createUser = res.createUser;
                this.param.createTime = res.createTime;
                this.param.updateUser = res.updateUser;
                this.param.updateTime = res.updateTime;
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
