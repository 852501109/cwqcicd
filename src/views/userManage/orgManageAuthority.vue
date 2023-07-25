<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="数据权限">
                <span @click="adjustment('add')" class="iconfont iconxinzeng2" title="新增"></span>
                <i class="confont iconfanhui1 audaque-rect-icon" @click="$router.go(-1)">返回</i>
            </audaque-table-title>
        </template>
        <template>
            <el-table
                tooltip-effect="light"
                class="authority-table"
                highlight-current-row
                stripe
                :data="authorityList"
                border
                ref="multipleTable"
            >
                <el-table-column type="index" label="序号" width="55"> </el-table-column>
                <el-table-column prop="appName" label="系统名称"> </el-table-column>
                <el-table-column prop="accessLevel" label="访问范围">
                    <template slot-scope="scope">
                        {{ permissionObj[scope.row.accessLevel] }}
                    </template>
                </el-table-column>
                <!--                    <el-table-column prop="readOnly" label="读写权限">-->
                <!--                        <template slot-scope="scope">-->
                <!--                            {{ scope.row.readOnly ? '只读' : '读写' }}-->
                <!--                        </template>-->
                <!--                    </el-table-column>-->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="iconfont iconFill" title="编辑" @click="adjustment('edit', scope.row)"></span>
                        <span class="iconfont iconShape1" title="删除" @click="del(scope.row)"></span>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <!--调整数据权限-->
        <el-dialog
            :title="dialogTitle"
            :visible.sync="idVisibleDialog"
            width="500"
            @close="closeDialog"
            :close-on-click-modal="false"
            class="data-permission"
        >
            <el-form ref="ruleform" :model="form" label-width="90px" :rules="rules">
                <el-form-item label="应用" prop="appId">
                    <el-select v-model="form.appId" placeholder="请选择" :disabled="isDialogType == 'edit'">
                        <el-option v-for="item in appList" :key="item.id" :label="item.appName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="访问范围" prop="accessLevel">
                    <el-select v-model="form.accessLevel" placeholder="请选择">
                        <el-option
                            v-for="item in permissionList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="访问部门:" label-width="80px" v-if="form.accessLevel === 7">
                    <el-tree
                        class="tree-dashed"
                        :props="defaultProps"
                        show-checkbox
                        :expand-on-click-node="true"
                        node-key="id"
                        @node-click="popHandleNodeClick"
                        @check-change="checkChange"
                        :default-checked-keys="popDefaultCheckedKeys"
                        :render-content="renderTreeItem"
                        :check-strictly="true"
                        ref="tree"
                        :indent="20"
                        lazy
                        :load="loadNode"
                    >
                    </el-tree>
                </el-form-item>
                <!--                <el-form-item label="读写权限" prop="readOnly">-->
                <!--                    <el-radio-group v-model="form.readOnly">-->
                <!--                        <el-radio :label="true">只读</el-radio>-->
                <!--                        <el-radio :label="false">读写</el-radio>-->
                <!--                    </el-radio-group>-->
                <!--                </el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="idVisibleDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitDataPermission">确 定</el-button>
            </span>
        </el-dialog>
    </audaque-table-list-page>
</template>

<script>
import { mapActions } from 'vuex';
import API from '@/api/index';

export default {
    data() {
        return {
            deptId: this.$route.query.deptId,
            deptUserId: this.$route.query.deptUserId,
            authorityList: [],
            multipleSelection: [],
            dataPermissionDialog: false,
            idVisibleDialog: false,
            dialogTitle: '新增',
            isDialogType: null,

            form: {
                appId: '',
                accessLevel: '',
                // readOnly: '',
                accessDeptIds: '',
            },
            rules: {
                appId: [{ trigger: 'change', required: true, message: '应用不能为空' }],
                accessLevel: [{ trigger: 'change', required: true, message: '访问范围不能为空' }],
                // readOnly: [{ trigger: 'change', required: true, message: '请选择读写权限' }],
            },
            permissionObj: {},
            permissionList: [
                { name: '允许访问当前部门及递归子部门的数据', value: 2 },
                { name: '允许访问当前部门的数据', value: 3 },
                { name: '允许访问递归子部门的数据', value: 4 },
                // { name: '只允许访问自己的数据', value: 6 },
                // { name: '自定义访问部门的数据', value: 7 },
            ],
            defaultProps: {
                label: 'name',
                children: 'children',
                isLeaf: 'isEnd',
            },
            popDefaultCheckedKeys: [],
            appList: [],
            pageType: this.$route.query.pageType,
        };
    },
    created() {
        this.permissionList.map((item) => {
            this.permissionObj[item.value] = item.name;
        });
        this.loadData();
    },
    methods: {
        ...mapActions(['_AJAX']),
        loadData() {
            this._AJAX({
                url: this.pageType === 'system' ? 'orguser.findDataAccess' : 'orguser.findMyDataAccess',
                method: 'GET',
                data: {
                    deptId: this.deptId,
                    deptUserId: this.deptUserId,
                },
            }).then((res) => {
                if (res.code === 0) {
                    this.authorityList = res.result ? res.result : [];
                }
            });
        },
        async adjustment(type, row) {
            this.idVisibleDialog = true;
            await this.getAppList();
            if (type == 'edit') {
                //编辑
                this.form = Object.assign({}, row);
                this.popDefaultCheckedKeys = [];
                row.accessDept &&
                    row.accessDept.map((item) => {
                        this.popDefaultCheckedKeys.push(item.accessDeptId);
                    });
                this.$set(this.form, 'accessDeptIds', row.accessDeptIds);
                this.isDialogType = 'edit';
                this.dialogTitle = '编辑';
            }
        },
        del(row) {
            let accessForm = JSON.parse(JSON.stringify(this.authorityList));
            let _this = this;
            accessForm.forEach((item, index) => {
                if (item.id === row.id) {
                    this.$delete(accessForm, index);
                } else {
                    //当不需要修改其他条数据时accessLevel置为空
                    item.accessLevel = null;
                }
            });
            let params = {
                accessForm: accessForm,
                deptId: this.deptId,
                deptUserId: this.deptUserId,
            };
            this._AJAX({
                url: this.pageType === 'system' ? 'orguser.setDataAccess' : 'orguser.setMyDataAccess',
                method: 'POST',
                data: params,
            }).then((res) => {
                if (res.code === 0) {
                    this.$AudaqueToast.tip({
                        template: `删除成功`,
                        methods: {
                            okEvent() {
                                _this.loadData();
                            },
                        },
                    });
                }
            });
        },
        closeDialog() {
            this.$refs.ruleform.resetFields(); //重置表单
            this.isDialogType = null;
            this.form = {};
        },
        getAppList() {
            this._AJAX({
                url: 'orguser.allApp',
                method: 'GET',
                data: {},
            }).then((res) => {
                if (res.code == 0) {
                    let result = res.result;
                    if (this.isDialogType != 'edit') {
                        let arr = [];
                        for (let index = 0; index < result.length; index++) {
                            //过滤掉已经添加的应用
                            const item = result[index];
                            if (!this.authorityList.some((v) => v.appName === item.appName)) {
                                arr.push(item);
                            }
                        }
                        this.appList = arr;
                    } else {
                        this.appList = result;
                    }
                }
            });
        },

        /*懒加载树*/
        loadNode(node, resolve) {
            if (node.level === 0) {
                this.getTreeData(this.deptId, (res) => {
                    resolve(this.parseResNodes(res));
                });
            }
            if (node.level >= 1) {
                this.getTreeData(node.data.id, (res) => {
                    resolve(this.parseResNodes(res));
                });
            }
        },
        parseResNodes(res) {
            if (res.result && res.result.length > 0) {
                return [
                    ...res.result.map((item) => {
                        return Object.assign({}, item, {
                            isEnd: item.childrenNum === 0,
                        });
                    }),
                ];
            } else {
                return [];
            }
        },
        /*获得树的数据*/
        getTreeData(deptId, cb) {
            this._AJAX({
                url: this.pageType === 'system' ? API['org.findChildrenDept'] : API['org.findMyChildren'],
                method: 'GET',
                params: {
                    deptId: deptId,
                },
            }).then((res) => {
                if (res.code == 0) {
                    if (cb) {
                        cb(res);
                    }
                }
            });
        },
        /*请求树的子节点*/
        popHandleNodeClick(data, Node) {},
        checkChange(Node, isCheck) {},
        renderTreeItem(h, { node, data, store }) {
            let className = 'iconfont icondrxx95 group';

            if (data.isPosition) {
                if (data.leader) {
                    className = 'iconfont iconlingdao leader';
                } else {
                    className = 'iconfont iconyuangong people';
                }
            } else if (node.level === 1) {
                className = 'iconfont icondrxx95 root';
            }
            return (
                <span class={className} style="">
                    {' '}
                    {data.name}
                </span>
            );
        },
        getSubmitData() {
            if (this.form.accessLevel === 7) {
                this.form.accessDeptIds = this.$refs.tree.getCheckedKeys();
            } else {
                delete this.form.accessDeptIds;
            }
            let accessForm = JSON.parse(JSON.stringify(this.authorityList));
            accessForm.forEach((item, index) => {
                if (this.form.id && item.id === this.form.id) {
                    this.$set(accessForm, index, {});
                    this.$set(accessForm, index, this.form);
                } else {
                    //当不需要修改其他条数据时accessLevel置为空
                    item.accessLevel = null;
                }
            });
            if (this.isDialogType != 'edit') {
                accessForm.push(this.form);
            }
            let data = {
                accessForm: accessForm,
                deptId: this.deptId,
                deptUserId: this.deptUserId,
            };
            return data;
        },
        submitDataPermission() {
            let _this = this;
            let params = this.getSubmitData();
            this.$refs.ruleform.validate((valid) => {
                if (valid) {
                    this.$store.commit('SHOW_LOADING', true);
                    this._AJAX({
                        url: this.pageType === 'system' ? 'orguser.setDataAccess' : 'orguser.setMyDataAccess',
                        method: 'POST',
                        data: params,
                    }).then((res) => {
                        if (res.code === 0) {
                            this.$AudaqueToast.tip({
                                template: `提交成功`,
                                methods: {
                                    okEvent() {
                                        _this.loadData();
                                        _this.idVisibleDialog = false; //关闭弹窗
                                    },
                                },
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
/deep/ .data-permission {
    .iconfont {
        color: #606266;
    }
    /deep/ .el-form-item__content {
        text-align: left;
    }
}

/*.authority-table {*/
/*height: auto;*/
/*/deep/ .el-table__body-wrapper.is-scrolling-none {*/
/*height: auto;*/
/*}*/
/*}*/
</style>
