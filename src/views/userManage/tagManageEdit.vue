<template>
    <audaque-detail-form-page
        @submit-click="subTreeBtn"
        :title="$route.query.optType === 'add' ? '新增标签' : '编辑标签'"
    >
        <template>
            <el-form :model="param" status-icon :rules="rules" ref="ruleForm" label-width="120px">
                <el-form-item label="标签名称" prop="name">
                    <el-input
                        :maxlength="20"
                        show-word-limit
                        v-model.trim="param.name"
                        placeholder="请输入标签名称"
                    ></el-input>
                </el-form-item>
                <!--                <el-form-item label="标签标识" prop="flag">-->
                <!--                    <el-input-->
                <!--                        :maxlength="20"-->
                <!--                        show-word-limit-->
                <!--                        v-model="param.flag"-->
                <!--                        :disabled="$route.query.id"-->
                <!--                        placeholder="请输入标签标识"-->
                <!--                    ></el-input>-->
                <!--                </el-form-item>-->
            </el-form>
        </template>
    </audaque-detail-form-page>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            param: {
                name: '',
                id: this.$route.query.id,
            },
            optType: this.$route.query.optType,
            rules: {
                name: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('标签名称不能为空'));
                            } else if (value.length < 2) {
                                callback(new Error('标签名称不能小于两位'));
                            } else {
                                callback();
                            }
                        },
                    },
                ],
            },
        };
    },
    created() {
        if (this.optType === 'edit') {
            this.GOEDITTAG({ id: this.param.id }).then((res) => {
                this.param = res.result;
            });
        }
    },
    methods: {
        ...mapActions('webkit', ['GOEDITTAG', 'MODIFYTAG', 'ADDTAG']),
        subTreeBtn() {
            let _this = this;
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    if (this.optType === 'edit') {
                        this.$store.commit('SHOW_LOADING', true);
                        this.MODIFYTAG(this.param).then((res) => {
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
                        this.$store.commit('SHOW_LOADING', true);
                        this.ADDTAG(this.param).then((res) => {
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
};
</script>
