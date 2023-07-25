<template>
    <audaque-detail-form-page
        @submit-click="submitForm"
        :title="$route.query.tenantId ? '编辑租户' : '新增租户'"
        :opt-type="$route.query.optType"
    >
        <!--物理租户-->
        <el-form
            v-if="tenantMode == 1"
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="120px"
            class="source-ruleForm"
        >
            <el-form-item class="source-list" label="租户名称" prop="name">
                <el-input
                    :disabled="$route.query.tenantId ? true : false"
                    v-model.trim="ruleForm.name"
                    maxlength="15"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item class="source-list" label="管理域" prop="realm">
                <el-input :disabled="$route.query.tenantId ? true : false" v-model.trim="ruleForm.realm"></el-input>
            </el-form-item>
            <el-form-item class="source-list" label="邮箱" prop="email">
                <el-input v-model.trim="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item class="source-list" label="平台租户" prop="extTenant">
                <el-input v-model.trim="ruleForm.extTenant"></el-input>
            </el-form-item>
        </el-form>
        <!--逻辑租户-->
        <el-form
            v-if="tenantMode == 2"
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="120px"
            class="source-ruleForm"
        >
            <el-form-item class="source-list" label="租户名称" prop="name">
                <el-input
                    :disabled="$route.query.tenantId ? true : false"
                    v-model.trim="ruleForm.name"
                    maxlength="15"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item class="source-list" label="租户管理员" prop="managerId">
                <adq-user-list-component v-model="ruleForm.managerId" :multiple="false"></adq-user-list-component>
            </el-form-item>
            <el-form-item label="功能权限">
                <el-tree
                    class="resource"
                    :data="treeData"
                    show-checkbox
                    node-key="value"
                    ref="tree"
                    highlight-current
                    :default-checked-keys="myResource"
                    :props="defaultProps"
                >
                </el-tree>
            </el-form-item>
        </el-form>
    </audaque-detail-form-page>
</template>
<style lang="scss" scoped>
.source-ruleForm {
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
}
</style>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    data() {
        let validateEmail = (rule, value, callback) => {
            if (/^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/.test(value)) {
                callback();
            } else {
                callback(new Error('输入的不是有效的邮箱格式'));
            }
        };
        return {
            ruleForm: {
                // id: '',
                // name: '',
                // realm: '',
                // email: '',
                // extTenant: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入租户名称', trigger: 'blur' },
                    { min: 2, max: 15, message: '租户名称长度为2-15个字符', trigger: 'blur' },
                ],
                realm: [
                    { required: true, message: '请输入管理域', trigger: 'blur' },
                    { min: 3, max: 50, message: '管理域长度为3-50个字符', trigger: 'blur' },
                ],
                managerId: [{ required: false, message: '请选择租户管理员', trigger: 'change' }],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { min: 5, max: 50, message: '邮箱长度为5-50个字符', trigger: 'blur' },
                    { validator: validateEmail, trigger: 'blur' },
                ],
            },
            myResource: [],
            defaultProps: {
                label: 'name',
                disabled: 'other',
            },
            query: {
                userId: this.$route.query.userId,
                tenantId: this.$route.query.tenantId,
                name: this.$route.query.name,
            },
            treeData: [],
        };
    },
    async created() {
        /*获得功能权限树*/
        if (this.$route.query.optType === 'add') {
            //新增
            await this.RESOURCELIST({ filter: true }).then(() => {
                this.treeData = this.resourceList;
            });
        } else {
            //编辑
            await this.GET_RESOURCE_LIST({
                filter: true,
                userId: this.query.userId,
                tenantId: this.query.tenantId,
            }).then(() => {
                this.treeData = this.getResourceList;
            });
        }
        if (this.query.tenantId) {
            //物理租户
            if (this.tenantMode == 1) {
                await this.TENANT_DETAIL(this.query.tenantId).then((res) => {
                    this.ruleForm = res.result;
                    this.ruleForm.id = res.result.tenantId;
                    delete this.ruleForm.tenantId;

                    // /*权限树的回显*/
                    this.GET_EDIT_USER(this.query.tenantId)
                        .then((res) => {
                            this.myResource = res.result.myResource.split(',');
                        })
                        .catch((err) => (this.loading = false));
                });
            } else {
                //逻辑租户
                await this._AJAX({
                    url: 'user.getTenantIdManagerUser',
                    method: 'GET',
                    data: { userId: this.query.userId, tenantId: this.query.tenantId },
                }).then((res) => {
                    if (res.code === 0) {
                        this.$set(this.ruleForm, 'name', this.query.name); //回显用户名
                        this.myResource = res.result.myResource.split(','); //回显权限树的

                        this.$set(this.ruleForm, 'managerId', Number(this.query.userId)); //回显租户管理员
                        if (this._userList && this._userList.length > 0) {
                            let users = this._userList.map((item) => {
                                return item.id;
                            });
                            //如果列表中没有该id就置空
                            if (users.indexOf(Number(this.query.userId)) != -1) {
                                this.$set(this.ruleForm, 'managerId', Number(this.query.userId)); //回显租户管理员
                            } else {
                                this.$set(this.ruleForm, 'managerId', null); //回显租户管理员
                            }
                        }
                    }
                });
            }
        }
    },
    computed: {
        ...mapState('webkit', ['userInfo', 'getResourceList', 'resourceList', 'securityUserList', 'tenantMode']),
        ...mapState(['_userList']),
    },
    methods: {
        ...mapActions('webkit', [
            'ADD_TENANT',
            'MODIFY_TENANT',
            'TENANT_DETAIL',
            'GET_RESOURCE_LIST',
            'RESOURCELIST',
            'SECURTY_TENANT_USER_LIST',
        ]),
        ...mapActions('user', ['GET_EDIT_USER']),
        ...mapActions(['_AJAX']),
        submitForm() {
            const _this = this;
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    // let data = Object.assign({}, this.ruleForm);
                    let resources = {};
                    let data = {};
                    if (this.tenantMode == 1) {
                        /*物理租户*/
                    } else if (this.tenantMode == 2) {
                        /*逻辑租户*/
                        let treeName = '';
                        this.$refs.tree.getCheckedNodes().forEach((item, index) => {
                            if (item && item.value) {
                                if (item.value.split('.')[1]) {
                                    treeName = item.value.split('.')[0];
                                    if (resources[treeName] == undefined) {
                                        resources[treeName] = '';
                                    }
                                    resources[treeName] += ',' + item.value.split('.')[1];
                                }
                            }
                        });
                        data.resources = resources; //功能权限
                    }
                    if (this.ruleForm.managerId == this.query.userId) {
                        //租户管理员没有修改
                        data.name = this.ruleForm.name; //用户名
                        data.userId = this.ruleForm.managerId; //现在租户管理员的id
                        data.managerId = null; //老的租户管理员
                        data.defTenant = this.query.tenantId; //租户id
                    } else {
                        data.name = this.ruleForm.name; //用户名
                        data.userId = this.ruleForm.managerId; //现在租户管理员的id
                        data.managerId = this.query.userId; //老的租户管理员
                        data.defTenant = this.query.tenantId; //租户id
                    }
                    this.$store.commit('SHOW_LOADING', true);
                    this.$route.query.tenantId
                        ? this._AJAX({
                              url: 'webkit.modifyTenant',
                              method: 'POST',
                              data: data,
                          }).then((res) => {
                              if (res.code === 0) {
                                  this.$AudaqueToast.tip({
                                      template: `修改成功`,
                                      methods: {
                                          okEvent() {
                                              _this.$router.replace('/webkit/tenantManage');
                                          },
                                      },
                                  });
                              }
                          })
                        : this.ADD_TENANT({
                              managerId: this.ruleForm.managerId,
                              name: this.ruleForm.name,
                              resources: resources,
                          }).then((res) => {
                              this.$AudaqueToast.tip({
                                  template: `添加成功`,
                                  methods: {
                                      okEvent() {
                                          _this.$router.replace('/webkit/tenantManage');
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
