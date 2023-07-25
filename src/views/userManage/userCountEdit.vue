<template>
    <audaque-detail-form-page @submit-click="submitForm" title="添加用户" opt-type="add">
        <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="120px"
            class="source-ruleForm"
        >
            <el-form-item class="source-list add-user" label="用户" prop="userIds">
                <adq-user-list-component v-model="ruleForm.userIds" :multiple="true"></adq-user-list-component>
                <!--                                <el-select multiple filterable allow-create default-first-option v-model="ruleForm.userIds" placeholder="请选择用户">-->
                <!--                                    <el-option v-for="(user,index) in securityUserList" :key="index" :label="user.name" :value="user.id"></el-option>-->
                <!--                                </el-select>-->
            </el-form-item>
        </el-form>
    </audaque-detail-form-page>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
    created() {
        // this.SECURTY_TENANT_USER_LIST(this.param)
    },
    computed: {
        ...mapState('webkit', ['securityUserList']),
    },
    data() {
        return {
            param: {
                page: 1,
                rows: 2147483647,
                includeRole: false,
            },
            ruleForm: {
                tenantId: this.$route.query.id,
                userIds: [],
            },
            rules: {
                userIds: [{ required: true, message: '请选择用户', trigger: 'blur' }],
            },
        };
    },
    methods: {
        ...mapActions('webkit', ['ADD_TENANT_USER', 'SECURTY_TENANT_USER_LIST']),
        submitForm() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    const _this = this;
                    this.$store.commit('SHOW_LOADING', true);
                    this.ADD_TENANT_USER(this.ruleForm).then((res) => {
                        this.$AudaqueToast.tip({
                            template: `添加成功`,
                            methods: {
                                okEvent() {
                                    _this.$router.replace('/webkit/userCount?id=' + _this.ruleForm.tenantId);
                                },
                            },
                        });
                    });
                } else {
                    return false;
                }
            });
        },
    },
};
</script>
