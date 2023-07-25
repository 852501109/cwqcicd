<template>
    <audaque-detail-form-page
        @submit-click="subTreeBtn"
        :title="!filter ? '查看角色' : roleId ? '编辑角色' : '新增角色'"
        :opt-type="$route.query.filter"
        class=""
    >
        <template>
            <el-form
                :model="param"
                label-width="120px"
                ref="ruleform"
                :rules="rules"
                class="form-item"
                :disabled="!filter"
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input
                        :disabled="!filter"
                        v-model.trim="param.roleName"
                        placeholder="请输入内容"
                        maxlength="20"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item label="功能权限">
                    <el-tree
                        class="get-edit-el-tree"
                        :data="resourceList"
                        show-checkbox
                        :default-expanded-keys="isArr"
                        :default-checked-keys="defaultCheckedKeys"
                        node-key="value"
                        ref="tree"
                        highlight-current
                        :props="defaultProps"
                    >
                    </el-tree>
                </el-form-item>
            </el-form>
        </template>
    </audaque-detail-form-page>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        let validateInput = (rule, value, callback) => {
            if (!this.checkSpecialKey(value)) {
                callback(new Error('不能含有特殊字符'));
            } else if (value.length < 2 || value.length > 20) {
                callback(new Error('请输入2-20位字符'));
            } else {
                callback();
            }
        };
        return {
            defaultCheckedKeys: [],
            roleId: this.$route.query.roleId,
            filter: this.$route.query.filter == 'view' ? false : true, //filter == 'view'为查看状态
            param: {
                resources: {},
                roleName: '',
            },
            rules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { validator: validateInput, trigger: 'blur' },
                ],
            },
            defaultProps: {
                children: 'children',
                label: 'name',
                disabled: 'other',
            },
        };
    },
    computed: {
        ...mapState('webkit', ['resourceList', 'isArr', 'checkedObj']),
    },
    methods: {
        ...mapActions('webkit', ['RESOURCELIST', 'GOEDITROLE', 'MODIFYROLE', 'ADDROLE']),
        checkSpecialKey(str) {
            let specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，,、？]‘'";
            for (let i = 0; i < str.length; i++) {
                if (specialKey.indexOf(str.substr(i, 1)) != -1) {
                    return false;
                }
            }
            return true;
        },
        subTreeBtn() {
            let _this = this;
            this.$refs.ruleform.validate((valid) => {
                if (valid) {
                    let getCheckedKeys = this.$refs.tree.getCheckedKeys();
                    getCheckedKeys.forEach((item) => {
                        if (item != null && item != '') {
                            let key = item.split('.')[0];
                            if (!this.param.resources[key]) {
                                this.param.resources[key] = item.split('.')[1];
                            } else {
                                this.param.resources[key] = this.param.resources[key] + ',' + item.split('.')[1];
                            }
                        }
                    });
                    this.$store.commit('SHOW_LOADING', true);
                    if (this.roleId) {
                        let param = this.param;
                        param['roleId'] = this.roleId;
                        this.MODIFYROLE(this.param).then((res) => {
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
                        this.ADDROLE(param).then((res) => {
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
        this.RESOURCELIST({ filter: this.filter });
        if (this.roleId) {
            this.GOEDITROLE({ roleId: this.roleId }).then((res) => {
                this.defaultCheckedKeys = res.result.myResource.split(',');
                this.param.roleName = res.result.myRole.name;
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
