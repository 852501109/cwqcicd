<template>
    <div style="height: 100%">
        <audaque-resize-split-page v-loading="loading">
            <template slot="title">
                <audaque-table-title :title="pageType === 'system' ? '组织管理' : '我的组织'"> </audaque-table-title>
            </template>

            <template slot="leftPane">
                <audaque-tree-title title="组织架构" icon="icon-jichutubiao-" class="operate-zoom">
                    <!--<template>
                        <el-dropdown trigger="click" placement="bottom" style="margin-right: 5px">
                            <i class="iconfont iconpiliang-copy audaque-rect-icon" title="导入导出"></i>
                            <el-dropdown-menu slot="dropdown" class="title-dropdown-item">
                                <el-dropdown-item divided>
                                    <div
                                        class="option-btn"
                                        title="导出组织模板"
                                        @click="exportTemplate('/org/orgTemplateDown.do')"
                                    >
                                        导出组织模板
                                    </div>
                                </el-dropdown-item>
                                <el-dropdown-item divided v-if="clickedRow.id">
                                    <div
                                        title="导入组织"
                                        class="import-template option-btn"
                                        @click="$refs.upload.click()"
                                    >
                                        导入组织
                                        <input
                                            class="inputFile"
                                            @change="uploadFile($event)"
                                            type="file"
                                            ref="upload"
                                            accept=".xls,.xlsx"
                                            multiple
                                        />
                                    </div>
                                </el-dropdown-item>
                                <el-dropdown-item divided>
                                    <div class="option-btn" title="导出组织" @click="exportFun('/org/orgListDown.do')">
                                        导出组织
                                    </div>
                                </el-dropdown-item>
                                <el-dropdown-item divided>
                                    <div
                                        class="option-btn"
                                        title="导出组织用户模板"
                                        @click="exportTemplate('/orguser/orgUserTemplateDown.do')"
                                    >
                                        导出组织用户模板
                                    </div>
                                </el-dropdown-item>
                                <el-dropdown-item divided v-if="clickedRow.id">
                                    <div
                                        title="导入组织用户关系"
                                        class="import-template option-btn"
                                        @click="$refs.upload1.click()"
                                    >
                                        导入组织用户关系
                                        <input
                                            class="inputFile"
                                            @change="uploadFile_1($event)"
                                            type="file"
                                            ref="upload1"
                                            accept=".xls,.xlsx"
                                            multiple
                                        />
                                    </div>
                                </el-dropdown-item>
                                <el-dropdown-item divided>
                                    <div
                                        class="option-btn"
                                        title="导出组织用户"
                                        @click="exportFun('/orguser/orgUserListDown.do')"
                                    >
                                        导出组织用户
                                    </div>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>-->
                    <template>
                        <em
                            class="iconfont iconpeizhi"
                            v-if="
                                (permitFun(permitList.setDeptManager, permitList.setMyDeptManager) &&
                                    clickedRow.isEdit &&
                                    clickedRow.isMyDept) ||
                                clickedRow.isShowFirstNode
                            "
                            @click="addManager"
                            title="设置管理员"
                        ></em>
                        <em
                            class="iconfont iconShape1"
                            v-if="
                                permitFun(permitList.deleteDepartment, permitList.deleteMyDepartment) &&
                                clickedRow.isMyDept
                            "
                            @click="treeDeleteDept"
                            title="删除组织"
                        ></em>
                        <em
                            class="iconfont iconFill"
                            v-if="
                                permitFun(permitList.modifyDepartment, permitList.modifyMyDepartment) &&
                                clickedRow.isEdit &&
                                clickedRow.isMyDept
                            "
                            @click="treeOperaDept('edit')"
                            title="编辑组织"
                        ></em>
                        <em
                            class="iconfont iconxinzeng"
                            v-if="permitFun(permitList.addDepartment, permitList.addMyDepartment) && clickedRow.myDept"
                            @click="treeOperaDept('add')"
                            title="添加组织"
                        ></em>
                    </template>
                </audaque-tree-title>
                <!--<el-input-->
                <!--placeholder="输入关键字进行过滤"-->
                <!--clearable-->
                <!--v-model="filterText">-->
                <!--</el-input>-->
                <el-tree
                    class="tree-dashed"
                    :indent="20"
                    :props="defaultProps"
                    ref="tree"
                    node-key="id"
                    :default-expanded-keys="defaultExpanded"
                    :expand-on-click-node="false"
                    @node-click="handleNodeClick"
                    :render-content="renderTreeItem"
                    :filter-node-method="filterNode"
                    lazy
                    :load="loadNode"
                >
                </el-tree>
            </template>

            <template slot="rightPane">
                <audaque-table-title title="组织信息" style="background-color: white"></audaque-table-title>
                <ul class="node-info-list">
                    <li>
                        <span class="title">组织类型:</span>
                        <span class="node-info">{{ nodeTypeObj[clickedRow.deptType] }}</span>
                    </li>
                    <li>
                        <span class="title">组织名称:</span>
                        <span class="node-info">{{ clickedRow.name }}</span>
                    </li>
                    <li>
                        <span class="title">管理员:</span>
                        <span class="node-info">{{ clickedRow.managers && clickedRow.managers.join(' ,') }}</span>
                    </li>
                </ul>

                <audaque-table-title title="用户信息" style="background-color: white">
                    <!--<el-button @click="searchBarVisible = true">查询</el-button>-->
                    <i
                        class="iconfont iconxuanzeyonghux audaque-rect-icon"
                        v-if="permitFun(permitList.addDeptUser, permitList.addMyDeptUser) && clickedRow.myDept"
                        @click="addUser('pull')"
                        >拉取用户</i
                    >
                    <i
                        class="iconfont iconxinzeng audaque-rect-icon"
                        v-if="
                            !isCluster &&
                            permitFun(permitList.addDeptUser, permitList.addMyDeptUser) &&
                            clickedRow.myDept &&
                            defTenant === 0
                        "
                        @click="addUser('add')"
                        >用户</i
                    >
                </audaque-table-title>
                <el-table
                    highlight-current-row
                    ref="multipleTable"
                    :data="userList.rows"
                    :border="true"
                    style="width: 100%"
                >
                    <el-table-column
                        type="index"
                        label="序号"
                        :index="
                            (index) => {
                                return $utils._indexMethod(index, userListForm.page, userListForm.rows);
                            }
                        "
                        align="center"
                        width="50"
                    >
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="用户账户">
                        <template slot-scope="scope">{{ scope.row.account }}</template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="用户名称">
                        <template slot-scope="scope">{{ scope.row.name }}</template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="手机">
                        <template slot-scope="scope">{{ scope.row.phone }}</template>
                    </el-table-column>
                    <el-table-column label="邮箱">
                        <template slot-scope="scope">{{ scope.row.email }}</template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="操作" width="120">
                        <template slot-scope="scope">
                            <span
                                class="iconfont iconFill"
                                v-if="permitFun(permitList.modifyDeptUser, permitList.addMyDeptUser)"
                                title="编辑"
                                @click="editUser(scope.row, 'edit')"
                            ></span>
                            <span
                                class="iconfont iconchakan11"
                                v-if="permitFun(permitList.modifyDeptUser, permitList.addMyDeptUser)"
                                title="查看"
                                @click="editUser(scope.row, 'view')"
                            ></span>
                            <span
                                class="iconfont iconShape1"
                                v-if="permitFun(permitList.deleteDeptUser, permitList.deleteMyDeptUser)"
                                title="移除"
                                @click="deleteUser(scope.row)"
                            ></span>
                            <span
                                class="iconfont iconpeizhi"
                                v-if="permitFun(permitList.setDataAccess, permitList.setMyDataAccess)"
                                title="数据权限"
                                @click="dataAuthority(scope.row)"
                            ></span>
                        </template>
                    </el-table-column>
                </el-table>
                <adq-pagination
                    @size-change="handleUserSizeChange"
                    @current-change="handleUserCurrentChange"
                    :total="userList.total"
                    :page-size="userListForm.rows"
                    :current-page="userListForm.page"
                ></adq-pagination>
            </template>
        </audaque-resize-split-page>
        <!--查询职位人员信息-->
        <audaque-table-search
            @close="searchBarVisible = false"
            v-show="searchBarVisible"
            @search="queryListFn(1)"
            @reset="queryListFn(0)"
        >
            <audaque-table-search-item title="用户账号">
                <el-input
                    type="text"
                    placeholder="请输入用户账号"
                    clearable
                    v-model.trim="userListForm.account"
                ></el-input>
            </audaque-table-search-item>
            <audaque-table-search-item title="用户姓名">
                <el-input
                    type="text"
                    placeholder="请输入用户姓名"
                    clearable
                    v-model.trim="userListForm.name"
                ></el-input>
            </audaque-table-search-item>
        </audaque-table-search>

        <el-dialog
            :title="treeDialogTitle"
            @open="openTreeDialogEvent"
            :visible.sync="treeDialogVisible"
            width="400"
            @close="closeDialog"
            :close-on-click-modal="false"
        >
            <el-form :model="treeDialog" :rules="rules" ref="rulesF">
                <el-form-item label="组织类型:" label-width="140px" prop="deptType">
                    <el-select v-model="treeDialog.deptType" placeholder="请选择节点类型">
                        <el-option
                            :label="item.label"
                            :value="item.value"
                            v-for="item in nodeTypeList"
                            :key="'addDept-' + item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="
                        treeDialog.deptType == 2 ? '区划名称:' : treeDialog.deptType == 3 ? '虚拟组织:' : '组织名称:'
                    "
                    label-width="140px"
                    prop="name"
                >
                    <el-input
                        v-model.trim="treeDialog.name"
                        placeholder="请输入"
                        maxlength="20"
                        show-word-limit
                        @keyup.native="handleKeyup($event)"
                    ></el-input>
                </el-form-item>
                <el-form-item label="组织编码:" label-width="140px" prop="deptCode">
                    <el-input
                        v-model.trim="treeDialog.deptCode"
                        placeholder=""
                        :disabled="treeDialogType === 'edit'"
                    ></el-input>
                </el-form-item>
                <el-form-item label="区划代码:" label-width="140px" prop="zoneCode" v-if="treeDialog.deptType == 2">
                    <el-input v-model.trim="treeDialog.zoneCode" placeholder=""></el-input>
                </el-form-item>
                <el-form-item
                    v-if="treeDialog.deptType == 1"
                    label="所属行业:"
                    label-width="140px"
                    prop="industryCategory"
                >
                    <el-select v-model="treeDialog.industryCategory" placeholder="请选择">
                        <el-option
                            :label="item.name"
                            :value="item.id"
                            v-for="item in industryList"
                            :key="'addDept-' + item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <!--                <el-form-item-->
                <!--                    v-if="treeDialog.deptType == 1"-->
                <!--                    label="社会统一信用代码:"-->
                <!--                    label-width="140px"-->
                <!--                    prop="creditCode"-->
                <!--                >-->
                <!--                    <el-input-->
                <!--                        v-model.trim="treeDialog.creditCode"-->
                <!--                        maxlength="50"-->
                <!--                        show-word-limit-->
                <!--                        placeholder="请输入社会统一信用代码"-->
                <!--                    ></el-input>-->
                <!--                </el-form-item>-->
                <el-form-item label="可用角色:" label-width="140px" prop="roleIds">
                    <el-select v-model="treeDialog.roleIds" placeholder="请选择" multiple filterable clearable>
                        <el-option
                            :label="item.name"
                            :value="item.id"
                            v-for="item in availableCharacterList"
                            :key="'addDept-' + item.id"
                        >
                            <span
                                :title="item.disabled ? '没有权限删除该角色' : ''"
                                :style="{ color: item.disabled ? '#c0c4cc' : '#606266' }"
                                >{{ item.name }}</span
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="可用标签:" label-width="140px" prop="tagIds">
                    <el-select v-model="treeDialog.tagIds" placeholder="请选择" multiple filterable>
                        <el-option
                            :label="item.name"
                            :value="item.id"
                            v-for="item in availableTagList"
                            :key="'addDept-' + item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="treeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitTreeModify" v-preventReClick>确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import API from '@/api/index';

const pinyin = require('pinyin');
export default {
    data() {
        return {
            clickedRow: {},
            nodeClickData: {},
            defaultProps: {
                label: 'name',
                children: 'children',
                isLeaf: 'isEnd',
            },
            defaultExpanded: [],
            defaultShowNodes: [],
            treeDialog: {
                title: '',
                /*组织类型*/
                deptType: 1,
                zoneCode: '', //区划代码
                name: '',
                deptCode: '',
                industryCategory: '3',
                creditCode: '',
                roleIds: [],
                tagIds: [],
            },
            treeDialogVisible: false,
            treeDialogTitle: '',
            treeDialogType: '',
            /*部门标签列表*/
            deptTags: [],
            industryList: [
                { name: '党委', id: '1' },
                { name: '人大', id: '2' },
                { name: '政府', id: '3' },
                { name: '政协', id: '4' },
                { name: '法院', id: '5' },
                { name: '检察院', id: '6' },
                { name: '地方', id: '7' },
                { name: '企业', id: '8' },
            ],
            /*节点类型列表*/
            nodeTypeList: [
                { label: '实体组织', value: 1 },
                { label: '行政区划', value: 2 },
                { label: '虚拟组织', value: 3 },
                { label: '部门/团队', value: 4 },
                { label: '科室', value: 5 },
            ],
            nodeTypeObj: {},
            /*可用角色列表*/
            availableCharacterList: [],
            /*可用标签*/
            availableTagList: [],
            tmpResolvephoto: null,
            rules: {
                deptType: [{ required: true, message: '请选择组织类型', trigger: 'change' }],
                name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
                deptCode: [{ required: true, message: '请输入组织名称的首字母', trigger: 'blur' }],
                industryCategory: [{ required: true, message: '请输入所属行业', trigger: 'change' }],
                // creditCode: [{ required: true, message: '请输入社会统一信息代码', trigger: 'blur' }],
                zoneCode: [{ required: true, message: '请输入区化代码', trigger: 'blur' }],
            },
            isDeleteUser: false,
            searchBarVisible: false,
            userList: {
                rows: [],
                total: 0,
            },
            userListForm: {
                deptId: null,
                account: '',
                name: '',
                page: 1,
                rows: 10,
            },
            path: this.$route.path,
            filterText: '',
            deptRoleList: [], //部门角色
            treeNode: null,
            formData: null, //上传组织
            loading: false,
            isCluster: window.isCluster, //是否是集群环境
        };
    },
    props: {
        pageType: {
            type: String,
            default: '', //system 系统组织  dept 部门组织
        },
    },
    watch: {
        $route: {
            handler: function (val, oldVal) {
                this.getUserList();
            },
            deep: true,
        },
        filterText(val) {
            this.$refs.tree.filter(val);
        },
    },
    mounted() {},
    created() {
        this.loadNodeType();
    },
    computed: {
        ...mapState('webkit', ['defTenant']),
    },
    methods: {
        ...mapActions(['_AJAX']),
        /*
         * 按钮权限的实现
         * systemPermit 系统组织的按钮权限
         * deptPermit 部门组织的按钮权限
         * */
        permitFun(systemPermit, deptPermit) {
            if (this.pageType === 'system') return systemPermit;
            else if (this.pageType === 'dept') return deptPermit;
        },
        /*输入部门名称自动转化为首字母*/
        handleKeyup(event) {
            if (this.treeDialogType === 'edit') {
                return false;
            }
            /*
             * pinyin 用法  https://www.npmjs.com/package/pinyin
             * */
            let a = pinyin(event.target.value, {
                style: pinyin.STYLE_FIRST_LETTER,
            });
            this.treeDialog.deptCode = a.join('');
        },
        queryListFn(type) {
            this.userListForm.page = 1;
            if (type === 1) {
                //查询
                this.getUserList();
            } else {
                //重置
                this.userListForm.account = '';
                this.userListForm.name = '';
            }
        },
        loadNodeType() {
            this.nodeTypeList.forEach((item) => {
                this.nodeTypeObj[item.value] = item.label;
            });
        },
        /*树节点的过滤*/
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        /*懒加载树*/
        loadNode(node, resolve) {
            if (node.level === 0) {
                this.treeNode = node;
                this._AJAX({
                    url: this.pageType === 'system' ? 'org.findRootDept' : 'org.findMyDept',
                    method: 'GET',
                    data: {},
                }).then((res) => {
                    if (res.code == 0 && res.result) {
                        this.defaultExpanded.push(res.result.id); //默认展开一级节点
                        resolve([
                            {
                                name: res.result.name,
                                id: res.result.id,
                                level: res.result.level,
                                children: res.result.children,
                                isEnd: res.result.childrenNum === 0,
                                managerList: res.result.managerList,
                                isFirstNode: true, //是否是顶级节点
                                myDept: this.pageType === 'system' ? true : res.result.myDept, //是否有权限操作(系统组织下全部都是有权限 部门组织要根据myDept判断)
                            },
                        ]);
                    }
                });
            }
            if (node.level >= 1) {
                if (node.level === 1 && this.pageType === 'dept') {
                    node.data.children.map((item1) => {
                        this.defaultExpanded.push(item1.id); //在我的部门下面 默认展开二级节点
                    });
                }
                if (node.data.children.length === 0) {
                    this.loadTreeData(node.data.id, (res) => {
                        resolve(this.parseRes2Nodes(res));
                    });
                } else {
                    resolve([
                        ...node.data.children.map((item) => {
                            return Object.assign({}, item, {
                                id: item.id,
                                isEnd: item.childrenNum === 0,
                                level: item.level,
                                children: item.children,
                                isEdit: true, //节点权限可以编辑(不可编辑自身节点的数据)
                                myDept: this.pageType === 'system' ? true : item.myDept, //是否有权限操作(系统组织下全部都是有权限 部门组织要根据myDept判断)
                            });
                        }),
                    ]);
                }
            }
        },
        parseRes2Nodes(res, type) {
            if (res.result && res.result.length > 0) {
                return [
                    ...res.result.map((item) => {
                        return Object.assign({}, item, {
                            // isEnd: type === 'addDept' ? true : item.childrenNum === 0,
                            id: item.id,
                            level: item.level,
                            isEnd: item.childrenNum === 0,
                            isEdit: true, //节点权限可以编辑(不可编辑自身节点的数据)
                            myDept: this.pageType === 'system' ? true : item.myDept, //是否有权限操作(系统组织下全部都是有权限 部门组织要根据myDept判断)
                        });
                    }),
                ];
            } else {
                return [];
            }
        },
        /*根据节点id获得下级节点的数据*/
        loadTreeData(id, cb) {
            this._AJAX({
                url:
                    (this.pageType === 'system' ? API['org.findChildrenDept'] : API['org.findMyChildren']) +
                    '?deptId=1',
                method: 'GET',
                params: {
                    deptId: 1,
                },
            }).then((res) => {
                if (res.code == 0) {
                    cb(res);
                }
            });
        },
        partialRefreshpartialRefresh(node) {
            //设置loaded为false；模拟一次节点展开事件，加载重命名后的新数据；
            node.loaded = false;
            node.expand();
            //新建子节点是刷新一次本节点的展开请求，而重命名和删除则需要刷新父级节点的的展开事件，
            //可以设置node.parent.loaded = false;node.parent.expand();
        },

        updateTreeNode(row, type, isSetNodeAdmin) {
            let p_uuid = null;
            if (row.isShowFirstNode && isSetNodeAdmin === 'setNodeAdmin') {
                //针对系统组织页面 顶级节点可设置管理员的特殊操作
                this.partialRefreshpartialRefresh(this.treeNode); //自动刷新顶级节点
                return;
                // p_uuid = row.id;
            } else {
                p_uuid = type === 'add' ? row.id : row.pid;
            }

            this.loadTreeData(p_uuid, (res) => {
                if (type == 'edit') {
                    this.removeTreeNode(row.id);
                } else {
                    this.nodeClickData.children = [];
                }
                /*延时刷新不然会有问题*/
                setTimeout(() => {
                    this.$refs.tree.updateKeyChildren(p_uuid, this.parseRes2Nodes(res, 'addDept'));
                }, 100);
            });
        },
        removeTreeNode(id) {
            this.$refs.tree.remove(id);
        },
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

        /*设置管理员*/
        addManager() {
            const _this = this;
            let ruleForm = {
                accountList: [{ index: 1, account: '' }],
            };
            let validatorAccountOnly = (rule, value, callback) => {
                let num = 0;
                ruleForm.accountList &&
                    ruleForm.accountList.forEach((item) => {
                        if (item.account === value) {
                            ++num;
                            if (num > 1) return callback(new Error('用户不能重复'));
                        }
                    });
                callback();
            };
            this.$AudaqueToast.dialog({
                title: '设置节点管理员',
                align: 'left',
                className: '',
                width: '600px',
                data: {
                    ruleForm,
                    rules: {
                        account: [
                            { trigger: 'blur', required: true, message: '请输入用户名' },
                            { validator: validatorAccountOnly, trigger: 'blur' },
                        ],
                    },
                    userMaxLength: window.accountMaxLength,
                },
                mounted() {
                    if (_this.clickedRow.managerList) {
                        let arr = [];
                        _this.clickedRow.managerList.map((item) => {
                            let obj = {};
                            obj.account = item.account;
                            obj.id = item.id;
                            arr.push(obj);
                        });
                        this.ruleForm.accountList = arr;
                    }
                },
                template: `
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="set-administrator-form">
                                <el-form-item label=" " >
                                    <div style="text-align: left;">
                                        <el-button class="add-system-btn" @click="publics.addLine(ruleForm.accountList,true)">添加管理员</el-button>
                                    </div>
                                    <el-table
                                            tooltip-effect='light'
                                            class="el-table-common__list"
                                            highlight-current-row
                                            stripe
                                            :data="ruleForm.accountList"
                                            border
                                    >
                                        <el-table-column
                                                show-overflow-tooltip
                                                type="index"
                                                align="center"
                                                width="50"
                                                label="序号"
                                        >
                                        </el-table-column>
                                         <el-table-column
                                                show-overflow-tooltip
                                                label="用户"
                                                prop="account"
                                        >
                                            <template slot-scope="scope">
                                                <el-form-item :prop="'accountList.' + scope.$index + '.account'"
                                                  :rules='rules.account'>
                                                    <el-input v-model.trim="scope.row.account" :maxlength="userMaxLength" show-word-limit></el-input>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                show-overflow-tooltip
                                                label="操作"
                                                width="80"
                                        >
                                            <template slot-scope="scope">
                                                     <span
                                                             title="删除"
                                                             :class="['iconfont', 'iconShape1', 'operate']"
                                                             @click="publics.removeLine(ruleForm.accountList,[ruleForm.accountList[scope.$index]])"
                                                     ></span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                              </el-form-item>
                            </el-form>
                        `,
                methods: {
                    okEvent() {
                        let pass = false;
                        this.$refs.ruleForm.validate((valid) => {
                            if (valid) {
                                _this.$store.commit('SHOW_LOADING', true);
                                _this
                                    ._AJAX({
                                        url:
                                            _this.pageType === 'system' ? 'org.setDeptManager' : 'org.setMyDeptManager',
                                        method: 'POST',
                                        data: {
                                            deptId: _this.clickedRow.id,
                                            users: this.ruleForm.accountList,
                                        },
                                    })
                                    .then((res) => {
                                        if (res.code == 0) {
                                            _this.$AudaqueToast.tip({
                                                template: `设置成功`,
                                                methods: {
                                                    okEvent() {
                                                        _this.getTreeDataInfo(_this.clickedRow.id);
                                                        _this.updateTreeNode(_this.clickedRow, 'edit', 'setNodeAdmin'); //更新节点数据
                                                    },
                                                },
                                            });
                                        }
                                    })
                                    .catch(() => {});
                            } else {
                                pass = true;
                                return false;
                            }
                        });
                        return pass;
                    },
                    cancelEvent() {},
                },
            });
        },
        /*获得节点管理员*/
        setNodeSys() {
            let managers = [],
                data = Object.assign({}, this.clickedRow);
            if (data.managerList) {
                data.managerList.map((item) => {
                    managers.push(item.account);
                });
            }
            this.$set(this.clickedRow, 'managers', managers);
        },
        /*编辑、新增组织*/
        async treeOperaDept(type) {
            let row = Object.assign({}, this.clickedRow);
            if (type == 'add') {
                this.getDeptRole(row.id, row, type);
                this.getDeptTag(row.id);
                this.treeDialogTitle = '新增组织';
                this.treeDialogType = 'add';
            } else {
                await this.getDeptRole(row.pid, row, type); //查找父级节点可用的角色
                await this.getDeptTag(row.pid); //查找父级节点可用的标签
                this.treeDialogTitle = '编辑组织';
                this.treeDialogType = 'edit';
                /*根据id查找节点详情*/
                await this.getTreeDataInfo(row.id);
            }
            this.closeDialog(); //打开弹窗前前清空数据
            this.treeDialogVisible = true;
        },
        /*根据id查找节点详情*/
        getTreeDataInfo(id) {
            this._AJAX({
                url: this.pageType === 'system' ? 'org.findDepartment' : 'org.findMyDepartment',
                method: 'GET',
                data: {
                    deptId: id,
                },
            }).then((res) => {
                if (res.code == 0) {
                    let result = res.result;
                    this.treeDialog = result;
                    this.clickedRow = Object.assign(this.clickedRow, result);
                    if (this.pageType === 'system') {
                        this.clickedRow.myDept = true;
                    }
                    this.deptRoleList = [];
                    this.deptRoleList = result.roleList; //当前点击编辑部门的角色
                    this.loadRoleList();
                    this.setNodeSys();
                }
            });
        },
        /*处理可用角色   当前登录用户的角色 + 部门的角色（无权限编辑修改部门的角色。只能编辑当前登录用户的角色）*/
        loadRoleList() {
            /*统一将部门的的角色禁用*/
            this.deptRoleList &&
                this.deptRoleList.map((item) => {
                    return (item.disabled = true);
                });

            /*合并*/
            let arr = this.availableCharacterList.concat(this.deptRoleList);
            let temp = {},
                result = [];
            /*将重复的数据剔除*/
            arr.map((item) => {
                if (!temp[item.id]) {
                    result.push(item);
                    temp[item.id] = true;
                }
            });

            this.availableCharacterList = result;
        },
        /*部门可用角色*/
        getDeptRole(id, row, type) {
            let url = null;
            if (this.pageType === 'system') {
                //部门
                /*当是一级节点时只能取当前用户拥有的角色*/
                if (row.level === 1) {
                    url = 'role.myRoleList';
                } else if (row.level === 2) {
                    url = type === 'edit' ? 'role.myRoleList' : 'org.getDeptRole';
                } else {
                    url = 'org.getDeptRole';
                }
            } else {
                //组织
                if (row.level === 1) {
                    url = 'role.myRoleList';
                } else if (row.level === 2) {
                    url = type === 'edit' ? 'role.myRoleList' : 'org.getMyDeptRole';
                } else {
                    url = 'org.getMyDeptRole';
                }
            }
            this._AJAX({
                url: url,
                method: 'GET',
                data: {
                    deptId: id,
                },
            }).then((res) => {
                if (res.code == 0) {
                    this.availableCharacterList = res.result;
                }
            });
        },

        /*部门可用标签*/
        getDeptTag(id) {
            this._AJAX({
                url: this.pageType === 'system' ? 'org.getDeptTag' : 'org.getMyDeptTag',
                method: 'GET',
                data: {
                    deptId: id,
                },
            }).then((res) => {
                if (res.code == 0) {
                    this.availableTagList = res.result;
                }
            });
        },
        /*删除部门*/
        treeDeleteDept() {
            let row = Object.assign({}, this.clickedRow);
            let _this = this;
            this._AJAX({
                url: this.pageType === 'system' ? 'org.deleteDepartment' : 'org.deleteMyDepartment',
                method: 'POST',
                data: {
                    adq: row.id,
                },
            }).then((res) => {
                if (res.code == 0) {
                    this.$AudaqueToast.tip({
                        template: `删除成功`,
                        methods: {
                            okEvent() {
                                _this.removeTreeNode(row.id);
                                _this.clickedRow = {};
                            },
                        },
                    });
                }
            });
        },
        /**/
        submitTreeModify() {
            let row = Object.assign({}, this.clickedRow),
                _this = this;
            this.$refs.rulesF.validate((valid) => {
                if (valid) {
                    this.$store.commit('SHOW_LOADING', true);
                    let params = Object.assign({}, this.treeDialog);
                    params.pid = row.id;
                    if (this.treeDialogType === 'add') {
                        /*新增*/
                        this._AJAX({
                            url: this.pageType === 'system' ? 'org.addDepartment' : 'org.addMyDepartment',
                            method: 'POST',
                            data: params,
                        }).then((res) => {
                            if (res.code == 0) {
                                this.$AudaqueToast.tip({
                                    template: `新增成功`,
                                    methods: {
                                        okEvent() {
                                            _this.treeDialogVisible = false;
                                            _this.updateTreeNode(row, 'add');
                                            _this.defaultExpanded.push(row.id); //展开该节点的树
                                        },
                                    },
                                });
                            }
                        });
                    } else {
                        /*修改*/
                        /*检测角色或标签是否有在使用 */
                        this._AJAX({
                            url: 'org.checkModify',
                            method: 'POST',
                            data: params,
                        })
                            .then((res1) => {
                                if (res1.code === 0) {
                                    _this.modifyDept(params, row);
                                }
                            })
                            .catch((err) => {
                                if (err.code === 999999) {
                                    this.$AudaqueToast.warn({
                                        template: err.msg,
                                        methods: {
                                            okEvent() {
                                                _this.modifyDept(params, row);
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

        /*修改部门*/
        modifyDept(params, row) {
            let _this = this;
            this._AJAX({
                url: this.pageType === 'system' ? 'org.modifyDepartment' : 'org.modifyMyDepartment',
                method: 'POST',
                data: params,
            }).then((res) => {
                if (res.code == 0) {
                    this.$AudaqueToast.tip({
                        template: `修改成功`,
                        methods: {
                            okEvent() {
                                _this.treeDialogVisible = false;
                                _this.updateTreeNode(row, 'edit');
                                _this.getTreeDataInfo(row.id);
                                _this.defaultExpanded.push(row.id); //展开该节点的树
                            },
                        },
                    });
                }
            });
        },

        addUser(addType) {
            if (this.clickedRow.id) {
                this.$router.push({
                    path: '/webkit/orgManageAddUser',
                    query: {
                        pid: this.clickedRow.pid,
                        deptId: this.clickedRow.id,
                        deptName: this.clickedRow.name,
                        optType: 'add',
                        pageType: this.pageType,
                        addType: addType, // add 添加用户  pull 拉取用户
                    },
                });
            } else {
                this.$AudaqueToast.tip({
                    template: `请先选择组织架构`,
                    methods: {
                        okEvent() {},
                    },
                });
            }
        },

        handleNodeClick(data, node) {
            this.nodeClickData = data;
            if (node.parent.data && node.parent.data.myDept) {
                //当本身节点的myDept和父节点的myDept都为true时才有权限操作
                data.isMyDept = true;
            } else {
                if (this.pageType === 'system' && data.isFirstNode) {
                    //在系统组织顶级节点时显示设置管理员按钮（特殊操作）
                    data.isShowFirstNode = true;
                }
                data.isMyDept = false;
            }
            this.clickedRow = Object.assign({}, data);
            this.userListForm.deptId = data.id;
            this.setNodeSys();
            if (data.myDept) {
                //有权限操作
                /*获取人员信息列表*/
                this.getUserList();
            } else {
                this.userList = {
                    rows: [],
                    total: 0,
                };
            }
        },

        openTreeDialogEvent() {},
        closeDialog() {
            this.treeDialog = {
                title: '',
                /*组织类型*/
                deptType: 1,
                name: '',
                deptCode: '',
                industryCategory: '3',
                creditCode: '',
                zoneCode: '', //区划代码
                roleIds: [],
                tagIds: [],
            };
            this.availableCharacterList = [];
            this.availableTagList = [];
        },

        /*获取人员信息列表*/
        getUserList() {
            if (this.clickedRow.id) {
                // let params = Object.assign({deptId: this.clickedRow.id}, this.userListForm);
                let params = Object.assign({}, this.userListForm);
                this._AJAX({
                    url: this.pageType === 'system' ? 'orguser.findDeptUserList' : 'orguser.findMyDeptUserList',
                    method: 'GET',
                    data: params,
                })
                    .then((res) => {
                        this.userList = res;
                    })
                    .catch(() => {
                        this.userList.rows = [];
                        this.userList.total = 0;
                    });
            }
        },

        handleUserSizeChange(val) {
            this.userListForm.rows = val;
            this.getUserList();
        },
        handleUserCurrentChange(val) {
            this.userListForm.page = val;
            this.getUserList();
        },
        /*编辑、查看用户*/
        editUser(row, type) {
            this.$router.push({
                path: '/webkit/orgManageAddUser',
                query: {
                    pid: this.clickedRow.pid,
                    deptId: this.clickedRow.id,
                    deptName: this.clickedRow.name,
                    userId: row.userId,
                    deptUserId: row.id,
                    optType: type,
                    pageType: this.pageType,
                    isAddUser: true,
                    addType: 'add',
                },
            });
        },
        /*删除用户*/
        deleteUser(row) {
            const _this = this;
            this.$AudaqueToast.warn({
                template: `确认删除？`,
                methods: {
                    okEvent() {
                        /*删除用户*/
                        _this.delUser(row);

                        /*/!*检测是否有待办任务*!/
                        _this
                            ._AJAX({
                                url: 'sys.message.user.todo',
                                method: 'GET',
                                data: {
                                    uid: row.userId,
                                    type: 3,
                                    handlerStatus: 0,
                                },
                            })
                            .then((res) => {
                                if (res.code === 0) {
                                    if (res.result > 0) {
                                        _this.$AudaqueToast.warn({
                                            template: `该用户下还有 <span style="color: red;cursor: pointer;font-size: 15px" @click.stop="jump">${res.result}</span> 条待办任务，建议先处理完待办任务再移除用户！是否要强制移除用户？`,
                                            methods: {
                                                okEvent() {
                                                    /!*删除用户*!/
                                                    _this.delUser(row);
                                                },
                                                jump() {
                                                    // this.hideDialog();
                                                    // _this.$router.push({
                                                    //     path: '/news/userAnnouncement',
                                                    //     query: {},
                                                    // });
                                                },
                                            },
                                        });
                                        /!*发送消息通知用户*!/
                                        _this
                                            ._AJAX({
                                                url: 'orguser.insertMsg',
                                                method: 'POST',
                                                data: {
                                                    appKey: '',
                                                    appName: '',
                                                    title: '提示',
                                                    content:
                                                        '您将从【' +
                                                        _this.clickedRow.name +
                                                        '】部门调出，请尽快处理您的代办任务',
                                                    attachment: '',
                                                    type: 2,
                                                    level: 3,
                                                    receiveType: 2,
                                                    receiveCode: row.userId,
                                                },
                                            })
                                            .then((item) => {});
                                    } else {
                                        _this.delUser(row);
                                    }
                                }
                            })
                            .catch((err) => {});*/
                    },
                },
            });
        },
        delUser(row) {
            const _this = this;
            _this
                ._AJAX({
                    url: _this.pageType === 'system' ? 'orguser.deleteDeptUser' : 'orguser.deleteMyDeptUser',
                    method: 'POST',
                    data: {
                        deptId: row.deptId,
                        userIds: [row.userId],
                    },
                })
                .then((res) => {
                    if (res.code === 0) {
                        _this.$AudaqueToast.tip({
                            template: `删除成功`,
                            methods: {
                                okEvent() {
                                    _this.getUserList();
                                },
                            },
                        });
                    }
                });
        },
        /*数据权限*/
        dataAuthority(row) {
            this.$router.push({
                path: '/webkit/orgManageAuthority',
                query: {
                    deptId: row.deptId,
                    deptUserId: row.id,
                    pageType: this.pageType,
                },
            });
        },
        /*导出模板*/
        exportTemplate(api) {
            this.publics.exportFile(this, api, {});
        },
        /*导出组织、用户*/
        exportFun(api) {
            this.publics.exportFile(this, api, {
                id: this.clickedRow.id ? this.clickedRow.id : null,
                deptId: this.clickedRow.deptId ? this.clickedRow.deptId : null,
            });
        },

        /*
         * 导入组织
         * */
        uploadFile(event) {
            this.formData = new FormData();
            let pid = this.clickedRow.id || null;
            this.formData.append('upFile', event.target.files[0]);
            this.formData.append('pid', pid);
            this.loading = true;
            this._AJAX({
                url: 'org.orgListImport',
                data: this.formData,
                method: 'POST',
            })
                .then((res) => {
                    this.loading = false;
                    if (res.code === 0) {
                        this.updateTreeNode(
                            this.clickedRow,
                            'edit',
                            this.clickedRow.level === 1 ? 'setNodeAdmin' : null
                        ); //更新节点数据
                        //上传成功
                        this.$message({ message: res.msg ? res.msg : '导入成功', type: 'success' });
                    } else {
                        this.$AudaqueToast.error({
                            template: `${res.msg}`,
                            methods: {
                                okEvent() {},
                            },
                        });
                    }
                    //删除formData对象
                    this.delFormData();
                })
                .catch(() => {
                    this.loading = false;
                    this.delFormData();
                });
        },

        /*
         * 导入组织用户关联关系
         * */
        uploadFile_1(event) {
            this.formData = new FormData();
            let deptId = this.clickedRow.id || null;
            this.formData.append('upFile', event.target.files[0]);
            this.formData.append('deptId', deptId);
            this.loading = true;
            this._AJAX({
                url: 'orguser.orgUserListImport',
                data: this.formData,
                method: 'POST',
            })
                .then((res) => {
                    this.loading = false;
                    if (res.code === 0) {
                        this.updateTreeNode(
                            this.clickedRow,
                            'edit',
                            this.clickedRow.level === 1 ? 'setNodeAdmin' : null
                        ); //更新节点数据
                        //上传成功
                        this.$message({ message: res.msg ? res.msg : '导入成功', type: 'success' });
                    } else {
                        this.$AudaqueToast.error({
                            template: `${res.msg}`,
                            methods: {
                                okEvent() {},
                            },
                        });
                    }
                    this.delFormData();
                })
                .catch(() => {
                    this.loading = false;
                    this.delFormData();
                });
        },
        /*删除formData对象*/
        delFormData() {
            this.$refs.upload.value = null;
            this.$refs.upload1.value = null;
            if (this.formData) {
                for (var key of this.formData.keys()) {
                    this.formData.delete(key);
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.node-info-list {
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 50px;
    margin-bottom: 50px;
    li {
        display: inline-block;
        width: 33.33%;
        line-height: 40px;
        white-space: nowrap;
        .title {
            display: inline-block;
            font-weight: bold;
            min-width: 90px;
            text-align: right;
            color: #666;
            padding-right: 15px;
            .node-info {
            }
        }
    }
}

/deep/ .tree-dashed,
/deep/ .pane-comp {
    overflow: auto;
}

/deep/ .el-table {
    overflow: inherit;
}

/deep/ .el-table__body-wrapper.is-scrolling-none {
    height: auto;
}
/deep/ .operate-zoom .iconfont {
    margin-right: 6px;
    cursor: pointer;
}
/deep/.el-tree-node .el-tree-node__children {
    overflow: visible !important;
}
/deep/.audaque-resize-split__left-layout .tree-dashed {
    height: calc(100% - 45px);
}
.import-template {
    position: relative;
}
.inputFile {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: none;
}
.el-dropdown-menu--medium .el-dropdown-menu__item {
    padding: 0;
    margin-top: 0;
    &:before {
        display: none;
    }
}
.option-btn {
    padding: 5px 15px;
}
.audaque-tree-title {
    white-space: nowrap;
}
</style>
<style lang="scss">
.set-administrator-form .el-form-item__error {
    position: relative;
}
</style>
