<!-- 类别编辑-->
<template>
    <audaque-detail-form-page @submit-click="submit" :title="operateName" :opt-type="optType" class="user-edit">
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
                    <el-col :span="12">
                        <el-form-item label="查询名称" prop="queryName">
                            <el-input v-model.trim="form.queryName" :maxlength="50" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="查询类别" prop="apiQueryCategoryId">
                            <el-select
                                v-model.trim="form.apiQueryCategoryId"
                                maxlength="100"
                                placeholder="请选择报表类别"
                            >
                                <el-option
                                    v-for="item in this.queryCategoryAll"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="查询接口" prop="apiConfId">
                            <el-select
                                v-model.trim="form.apiConfId"
                                @change="checkTable"
                                maxlength="100"
                                placeholder="请选择报表类别"
                            >
                                <el-option
                                    v-for="item in this.queryApiAll"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排序号" prop="sortNum">
                            <el-input v-model.trim="form.sortNum" maxlength="5" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="查询条件">
                            <el-table
                                :data="form.queryColumnList"
                                height="300"
                                style="width: 100%; border: 1px solid #f0f8ff"
                                element-loading-text="加载中"
                                element-loading-spinner="el-icon-loading"
                                element-loading-background="rgba(255, 255, 255, 0.6)"
                            >
                                <el-table-column prop="paramName" label="列名称"> </el-table-column>
                                <el-table-column prop="dataType" label="数据类型"> </el-table-column>
                                <el-table-column prop="paramDesc" label="列描述"> </el-table-column>
                                <el-table-column prop="displayColName" label="条件名称" width="170">
                                    <template slot-scope="scope">
                                        <el-form-item>
                                            <el-input
                                                v-model.trim="scope.row.displayColName"
                                                :maxlength="50"
                                                placeholder="空时显示列描述"
                                                show-word-limit
                                            ></el-input>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column label="查询模式" width="100">
                                    <template slot-scope="scope">
                                        <el-form-item
                                            :prop="'queryColumnList.' + scope.$index + '.pattern'"
                                            :rules="[{ required: true, message: '请选择查询模式' }]"
                                        >
                                            <!-- <el-input
                                                    v-model.trim="scope.row.pattern"
                                                    :maxlength="userMaxLength"
                                                    show-word-limit
                                                ></el-input> -->
                                            <el-select v-model="scope.row.pattern" placeholder="请选择">
                                                <el-option
                                                    v-for="item in patternList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                                    :disabled="
                                                        !scope.row.dataType === 'String' && item.value === 'like'
                                                    "
                                                >
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column width="120">
                                    <template slot="header" slot-scope="scope">
                                        <el-button
                                            type="primary"
                                            icon="el-icon-plus"
                                            @click="openTableDialog('where')"
                                            size="mini"
                                            circle
                                        ></el-button>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            icon="el-icon-top"
                                            circle
                                            @click="moveUp('where', scope.row, scope.$index)"
                                        >
                                        </el-button>
                                        <el-button
                                            size="mini"
                                            icon="el-icon-bottom"
                                            circle
                                            @click="moveDown('where', scope.row, scope.$index)"
                                        >
                                        </el-button>
                                        <el-button
                                            size="mini"
                                            icon="el-icon-delete"
                                            circle
                                            @click="handleDelete('where', scope.$index)"
                                        >
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="列表页面">
                            <el-table
                                :data="form.displayColumnList"
                                element-loading-text="加载中"
                                element-loading-spinner="el-icon-loading"
                                element-loading-background="rgba(255, 255, 255, 0.6)"
                                height="500"
                                style="width: 100%; border: 1px solid #f0f8ff; text-align: center; align: center"
                            >
                                <el-table-column prop="paramName" label="列名称"> </el-table-column>
                                <el-table-column prop="dataType" label="数据类型"> </el-table-column>
                                <el-table-column prop="paramCnName" label="列描述"> </el-table-column>
                                <el-table-column prop="displayColName" label="展示列名" width="170">
                                    <template slot-scope="scope">
                                        <el-form-item>
                                            <el-input
                                                v-model.trim="scope.row.displayColName"
                                                :maxlength="50"
                                                placeholder="空时显示列描述"
                                                show-word-limit
                                            ></el-input>
                                        </el-form-item>
                                        <!-- <el-form-item
                                            v-else
                                            :prop="'displayColumnList.' + scope.$index + '.displayColName'"
                                            :rules="[{ required: true, message: '请完善信息' }]"
                                        >
                                            <el-input
                                                v-model.trim="scope.row.displayColName"
                                                :maxlength="userMaxLength"
                                                show-word-limit
                                            ></el-input>
                                        </el-form-item> -->
                                    </template>
                                </el-table-column>
                                <el-table-column prop="columnClicked" label="详细列" width="80">
                                    <template slot-scope="scope">
                                        <el-form-item>
                                            <el-checkbox
                                                v-model="scope.row.columnClicked"
                                                style="margin-left: 25px"
                                                :true-label="1"
                                                :false-label="0"
                                            ></el-checkbox>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column prop="columnDrill" label="下钻列" width="80">
                                    <template slot-scope="scope">
                                        <el-form-item>
                                            <el-checkbox
                                                v-model="scope.row.columnDrilled"
                                                style="margin-left: 25px"
                                                :true-label="1"
                                                :false-label="0"
                                            ></el-checkbox>
                                        </el-form-item>
                                    </template>
                                </el-table-column> -->
                                <el-table-column width="120">
                                    <template slot="header" align="center" slot-scope="scope">
                                        <el-button
                                            type="primary"
                                            icon="el-icon-plus"
                                            @click="openTableDialog('display')"
                                            size="mini"
                                            circle
                                        ></el-button>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            icon="el-icon-top"
                                            circle
                                            @click="moveUp('display', scope.row, scope.$index)"
                                        >
                                        </el-button>
                                        <el-button
                                            size="mini"
                                            icon="el-icon-bottom"
                                            circle
                                            @click="moveDown('display', scope.row, scope.$index)"
                                        >
                                        </el-button>
                                        <el-button
                                            size="mini"
                                            icon="el-icon-delete"
                                            circle
                                            @click="handleDelete('display', scope.$index)"
                                        >
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="详细页面">
                            <el-table
                                :data="form.detailColumnList"
                                height="500"
                                element-loading-text="加载中"
                                element-loading-spinner="el-icon-loading"
                                element-loading-background="rgba(255, 255, 255, 0.6)"
                                style="width: 100%; border: 1px solid #f0f8ff; text-align: center; align: center"
                            >
                                <el-table-column prop="paramName" label="列名称"> </el-table-column>
                                <el-table-column prop="dataType" label="数据类型"> </el-table-column>
                                <el-table-column prop="paramCnName" label="列描述"> </el-table-column>
                                <el-table-column prop="displayColName" label="展示列名" width="170">
                                    <template slot-scope="scope">
                                        <el-form-item>
                                            <el-input
                                                v-model.trim="scope.row.displayColName"
                                                :maxlength="50"
                                                placeholder="空时显示列描述"
                                                show-word-limit
                                            ></el-input>
                                        </el-form-item>
                                        <!-- <el-form-item
                                            v-else
                                            :prop="'detailColumnList.' + scope.$index + '.displayColName'"
                                            :rules="[{ required: true, message: '请完善信息' }]"
                                        >
                                            <el-input
                                                v-model.trim="scope.row.displayColName"
                                                :maxlength="userMaxLength"
                                                show-word-limit
                                            ></el-input>
                                        </el-form-item> -->
                                    </template>
                                </el-table-column>
                                <el-table-column width="120">
                                    <template slot="header" align="center" slot-scope="scope">
                                        <el-button
                                            type="primary"
                                            icon="el-icon-plus"
                                            @click="openTableDialog('detail')"
                                            size="mini"
                                            circle
                                        ></el-button>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            icon="el-icon-top"
                                            circle
                                            @click="moveUp('detail', scope.row, scope.$index)"
                                        >
                                        </el-button>
                                        <el-button
                                            size="mini"
                                            icon="el-icon-bottom"
                                            circle
                                            @click="moveDown('detail', scope.row, scope.$index)"
                                        >
                                        </el-button>
                                        <el-button
                                            size="mini"
                                            icon="el-icon-delete"
                                            circle
                                            @click="handleDelete('detail', scope.$index)"
                                        >
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row>
                    <el-col :span="12">
                        <el-form-item label="下钻页面标题">
                            <el-input v-model.trim="form.drillTitle" maxlength="50" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="下钻关联字段">
                            <el-select v-model.trim="form.drillColumn" maxlength="100" clearable placeholder="">
                                <el-option
                                    v-for="item in this.queryColumnList"
                                    :key="item.paramName"
                                    :label="item.paramName"
                                    :value="item.paramName"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-row v-if="optType === 'view'">
                    <el-col :span="24">
                        <el-form-item label="创建人" prop="name">
                            <el-input v-model.trim="form.createUserName" maxlength="100" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="optType === 'view'">
                    <el-col :span="24">
                        <el-form-item label="创建时间" prop="name">
                            <el-input v-model.trim="form.createTime" maxlength="100" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="optType === 'view'">
                    <el-col :span="23">
                        <el-form-item label="更新人" prop="updateUser">
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
            <el-dialog title="接口返回值信息" :visible.sync="dialogTableVisible">
                <el-table
                    ref="multipleTable"
                    :data="filterList(queryColumnList)"
                    @row-click="checkRow"
                    tooltip-effect="dark"
                    element-loading-text="加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(255, 255, 255, 0.6)"
                    style="width: 100%"
                    height="6rem"
                >
                    <el-table-column type="selection" width="55"> </el-table-column>
                    <el-table-column label="序号" type="index" width="100">
                        <template slot-scope="scope">
                            <span>{{ scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="paramName" label="参数名英文"> </el-table-column>
                    <el-table-column prop="dataType" label="数据类型" show-overflow-tooltip> </el-table-column>
                    <el-table-column
                        prop="paramDesc"
                        label="字段描述"
                        show-overflow-tooltip
                        v-if="currentType === 'where'"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="paramCnName"
                        label="接口参数名"
                        show-overflow-tooltip
                        v-if="currentType !== 'where'"
                    >
                    </el-table-column>
                </el-table>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogTableVisible = false">取 消</el-button>
                    <el-button type="primary" @click="toggleSelection">确 定</el-button>
                </div>
            </el-dialog>
        </template>
    </audaque-detail-form-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'apiqueryconfedit',
    data() {
        return {
            form: {
                id: '',
                queryName: '',
                apiQueryCategoryId: '',
                apiConfId: '',
                sortNum: null,
                drillColumn: '',
                drillTitle: '',
                displayColumnList: [],
                detailColumnList: [],
                queryColumnList: [],
                createUser: '',
                createUserName: '',
                updateUserName: '',
                createTime: '',
                updateTime: '',
                updateUser: '',
            },
            rules: {
                queryName: [{ required: true, message: '名称不能为空' }],
                apiConfId: [{ required: true, message: '查询接口不能为空' }],
                apiQueryCategoryId: [{ required: true, message: '查询类别不能为空' }],
                sortNum: [
                    {
                        pattern: /^[0-9]*$/,
                        message: '排序号必须是数字',
                        trigger: 'blur',
                    },
                ],
            },
            operateName: '',
            publicKey: '',
            optId: this.$route.query.id,
            optType: this.$route.query.optType,
            userMaxLength: window.accountMaxLength,
            isCluster: window.isCluster, //是否是集群环境
            dialogTableVisible: false,
            currentType: '',
            search: '',
            tableDialogType: '',
            queryTableListTemp: [],
            patternList: [
                {
                    value: 'like',
                    label: '模糊',
                },
                {
                    value: 'eq',
                    label: '等于',
                },
                {
                    value: 'upload',
                    label: '查询模版',
                },
            ],
        };
    },
    watch: {},
    computed: {
        ...mapState('apiQueryConf', ['queryApiAll', 'queryCategoryAll', 'queryColumnList']),
    },
    created() {
        this.QUERYCATEGORYLIST();
        this.QUERYCONFIGLIST();
        if ((this.isCluster && !this.optType) || (this.isCluster && this.optType === 'add')) this.optType = 'view'; //集群环境没有新增功能

        if (this.optType === 'view') {
            this.operateName = '查看配置';
        }
        if (this.optType === 'edit') {
            this.operateName = '编辑配置';
        }
        if (this.optType === 'add') {
            this.operateName = '新增配置';
        }
        // this.queryqueryCategoryAll();
        // this.queryqueryTableList();
        if (this.optType !== 'add') {
            this.queryDetail();
        }
    },
    beforeDestroy() {
        this.$store.commit('apiQueryConf/QUERY_COLUMN_LIST', []);
    },
    methods: {
        ...mapActions('apiQueryConf', [
            'GOEDITAPIQUERYCONF',
            'MODIFYAPIQUERYCONF',
            // 'QUERY_query_CATEGORY_All',
            'ADDAPIQUERYCONF',
            'QUERY_query_COLUMN_LIST',
            'QUERYCATEGORYLIST',
            'QUERYCONFIGLIST',
        ]),
        async queryDetail() {
            let params = { id: this.optId };
            await this.GOEDITAPIQUERYCONF(params).then((res) => {
                if (this.optType !== 'add') {
                    this.form.id = res.id;
                    this.form.queryName = res.queryName;
                    this.form.apiQueryCategoryId = res.apiQueryCategoryId;
                    this.form.apiConfId = res.apiConfId;
                    this.form.sortNum = res.sortNum;
                    this.form.drillColumn = res.drillColumn;
                    this.form.drillTitle = res.drillTitle;
                    this.form.displayColumnList = res.apiQueryPropertyList
                        .filter((item) => item.type === 1)
                        .map((item) => {
                            return {
                                paramName: item.columnName,
                                dataType: item.dataType,
                                paramCnName: item.columnComment,
                                displayColName: item.displayColName,
                                columnClicked: item.columnClicked,
                                pattern: item.pattern,
                            };
                        });
                    this.form.queryColumnList = res.apiQueryPropertyList
                        .filter((item) => item.type === 2)
                        .map((item) => {
                            return {
                                paramName: item.columnName,
                                dataType: item.dataType,
                                paramDesc: item.columnComment,
                                displayColName: item.displayColName,
                                pattern: item.pattern,
                            };
                        });
                    this.form.detailColumnList = res.apiQueryPropertyList
                        .filter((item) => item.type === 3)
                        .map((item) => {
                            return {
                                paramName: item.columnName,
                                dataType: item.dataType,
                                paramCnName: item.columnComment,
                                displayColName: item.displayColName,
                                pattern: item.pattern,
                            };
                        });
                    this.form.createUser = res.createUser;
                    this.form.createUserName = res.createUserName;
                    this.form.createTime = res.createTime;
                    this.form.updateUser = res.updateUser;
                    this.form.updateUserName = res.updateUserName;
                    this.form.updateTime = res.updateTime;
                    this.queryqueryColumnList(this.form.apiConfId);
                }
            });
        },
        async queryqueryCategoryAll() {
            await this.QUERY_query_CATEGORY_All();
        },
        async queryqueryTableList() {
            let tableParams = {
                tableType: 'BASE TABLE',
            };
            let tableList = await this.QUERY_query_TABLE_LIST(tableParams);
            let viewParams = {
                tableType: 'VIEW',
            };
            let viewList = await this.QUERY_query_TABLE_LIST(viewParams);
            this.queryTableListTemp = [
                {
                    label: '表',
                    options: tableList,
                },
                {
                    label: '视图',
                    options: viewList,
                },
            ];
        },
        filterList(list) {
            if (this.currentType === 'where') return list.filter((item) => item.type === 3);
            else return list.filter((item) => item.type === 4);
        },
        queryqueryColumnList(val) {
            let params = { id: val };
            this.QUERY_query_COLUMN_LIST(params);
        },
        checkTable(val) {
            this.form.queryColumnList = [];
            this.form.displayColumnList = [];
            this.form.detailColumnList = [];
            this.queryqueryColumnList(val);
        },
        toggleSelection() {
            if (this.tableDialogType === 'where') {
                this.form.queryColumnList = [];
                this.$refs.multipleTable.selection.forEach((item) => {
                    this.form.queryColumnList.push(Object.assign({}, item));
                });
            } else if (this.tableDialogType === 'display') {
                this.form.displayColumnList = [];
                this.$refs.multipleTable.selection.forEach((item) => {
                    const obj = item;
                    obj.columnClicked = 0;
                    this.form.displayColumnList.push(Object.assign({}, obj));
                });
            } else if (this.tableDialogType === 'detail') {
                this.form.detailColumnList = [];
                this.$refs.multipleTable.selection.forEach((item) => {
                    const obj = item;
                    obj.columnClicked = 0;
                    this.form.detailColumnList.push(Object.assign({}, item));
                });
            }
            this.dialogTableVisible = false;
        },
        openTableDialog(type) {
            this.currentType = type;
            this.dialogTableVisible = true;
            this.$nextTick(() => {
                this.$refs.multipleTable.clearSelection();
                if (type === 'display') {
                    (this.queryColumnList.filter((item) => item.type === 4) || []).forEach((queryColumn, index) => {
                        (this.form.displayColumnList || []).forEach((displayColumn) => {
                            if (queryColumn.paramName === displayColumn.paramName) {
                                this.$refs.multipleTable.toggleRowSelection(
                                    this.queryColumnList.filter((item) => item.type === 4)[index],
                                    true
                                );
                            }
                        });
                    });
                } else if (type === 'where') {
                    (this.queryColumnList.filter((item) => item.type === 3) || []).forEach((queryColumn, index) => {
                        (this.form.queryColumnList || []).forEach((displayColumn) => {
                            if (queryColumn.paramName === displayColumn.paramName) {
                                this.$refs.multipleTable.toggleRowSelection(
                                    this.queryColumnList.filter((item) => item.type === 3)[index],
                                    true
                                );
                            }
                        });
                    });
                } else if (type === 'detail') {
                    (this.queryColumnList.filter((item) => item.type === 4) || []).forEach((queryColumn, index) => {
                        (this.form.detailColumnList || []).forEach((displayColumn) => {
                            if (queryColumn.paramName === displayColumn.paramName) {
                                this.$refs.multipleTable.toggleRowSelection(
                                    this.queryColumnList.filter((item) => item.type === 4)[index],
                                    true
                                );
                            }
                        });
                    });
                }
            });
            this.tableDialogType = type;
        },
        handleDelete(type, index) {
            if (type === 'display') {
                this.form.displayColumnList.splice(index, 1);
            } else if (type === 'where') {
                this.form.queryColumnList.splice(index, 1);
            } else if (type === 'detail') {
                this.form.detailColumnList.splice(index, 1);
            }
        },
        checkRow(row) {
            this.$refs.multipleTable.toggleRowSelection(row);
        },
        moveUp(type, item, index) {
            if (index === 0) {
                return;
            }
            if (type === 'display') {
                this.form.displayColumnList.splice(index - 1, 0, item);
                this.form.displayColumnList.splice(index + 1, 1);
            } else if (type === 'where') {
                this.form.queryColumnList.splice(index - 1, 0, item);
                this.form.queryColumnList.splice(index + 1, 1);
            } else if (type === 'detail') {
                this.form.detailColumnList.splice(index - 1, 0, item);
                this.form.detailColumnList.splice(index + 1, 1);
            }
        },
        moveDown(type, item, index) {
            if (type === 'display') {
                if (index + 1 === this.form.displayColumnList.length) {
                    return;
                }
                this.form.displayColumnList.splice(index + 2, 0, item);
                this.form.displayColumnList.splice(index, 1);
            } else if (type === 'where') {
                if (index + 1 === this.form.queryColumnList.length) {
                    return;
                }
                this.form.queryColumnList.splice(index + 2, 0, item);
                this.form.queryColumnList.splice(index, 1);
            } else if (type === 'detail') {
                if (index + 1 === this.form.detailColumnList.length) {
                    return;
                }
                this.form.detailColumnList.splice(index + 2, 0, item);
                this.form.detailColumnList.splice(index, 1);
            }
        },
        submit() {
            this.form.displayColumnList.forEach((item) => {
                item.type = 1;
            });
            this.form.queryColumnList.forEach((item) => {
                item.type = 2;
            });
            this.form.detailColumnList.forEach((item) => {
                item.type = 3;
            });
            const apiQueryPropertyList = JSON.parse(
                JSON.stringify(
                    [].concat(this.form.displayColumnList, this.form.queryColumnList, this.form.detailColumnList)
                )
            );
            apiQueryPropertyList.forEach((item) => {
                item.columnName = item.paramName;
                if (item.type === 2) {
                    item.columnComment = item.paramDesc;
                    if (!item.displayColName) item.displayColName = item.paramDesc;
                } else {
                    item.columnComment = item.paramCnName;
                    if (!item.displayColName) item.displayColName = item.paramCnName;
                }
            });
            let data = {
                id: this.form.id,
                queryName: this.form.queryName,
                apiQueryCategoryId: this.form.apiQueryCategoryId,
                apiConfId: this.form.apiConfId,
                sortNum: this.form.sortNum,
                drillColumn: this.form.drillColumn,
                drillTitle: this.form.drillTitle,
                apiQueryPropertyList: apiQueryPropertyList,
            };
            this.$refs.ruleform.validate((valid) => {
                if (valid) {
                    if (this.form.displayColumnList.length === 0) {
                        this.$message({
                            showClose: true,
                            message: '请编辑列表页面信息',
                            type: 'warning',
                            center: true,
                        });
                        return;
                    }
                    var displayArr = this.form.displayColumnList;
                    var flag = false;
                    if (displayArr.length != 0) {
                        for (var i = 0; i < displayArr.length; i++) {
                            if (displayArr[i].columnClicked) {
                                flag = true;
                                break;
                            }
                        }
                        if (this.form.detailColumnList.length === 0 && flag) {
                            this.$message({
                                showClose: true,
                                message: '请编辑详细页面信息',
                                type: 'warning',
                                center: true,
                            });
                            return;
                        }

                        flag = false;
                        for (var i = 0; i < displayArr.length; i++) {
                            if (displayArr[i].columnDrilled) {
                                flag = true;
                                break;
                            }
                        }
                        // if (!this.form.drillColumn && this.form.drillColumn.trim() === '' && flag) {
                        //     this.$message({
                        //         showClose: true,
                        //         message: '请选择下钻关联字段',
                        //         type: 'warning',
                        //         center: true,
                        //     });
                        //     return;
                        // }
                        // if (!this.form.drillTitle && flag) {
                        //     this.$message({
                        //         showClose: true,
                        //         message: '请选择下钻页面标题',
                        //         type: 'warning',
                        //         center: true,
                        //     });
                        //     return;
                        // }
                    }
                    let _this = this;
                    _this.$store.commit('SHOW_LOADING', true);
                    if (this.optType === 'edit') {
                        data.id = this.optId;
                        this.MODIFYAPIQUERYCONF(data)
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
                            .catch((err) => {
                                console.log(err);
                                _this.$store.commit('SHOW_LOADING', false);
                                _this.$AudaqueToast.error({
                                    template: err.msg,
                                });
                            });
                    } else {
                        //add
                        this.ADDAPIQUERYCONF(data)
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
                            .catch((err) => {
                                console.log(err);
                                _this.$store.commit('SHOW_LOADING', false);
                                _this.$AudaqueToast.error({
                                    template: err.msg,
                                });
                            });
                    }
                } else {
                    return false;
                }
            });
        },
        handleSql(sql) {
            return sql
                .replace('select', '*S*')
                .replace('where', '*W*')
                .replace('from', '*F*')
                .replace('and', '*A*')
                .replace('limit', '*L*');
        },
    },
};
</script>

<style lang="scss" scoped>
.user-edit {
    /deep/ .resource {
        border: 1px solid #e1dfdc;
        height: 5rem;
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
    .div-margin {
        line-height: 22px;
    }
    /deep/.form-item {
        width: 99%;
        padding-right: 0;
    }
}
</style>
