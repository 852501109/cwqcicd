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
                            <el-input
                                v-model.trim="form.queryName"
                                :maxlength="userMaxLength"
                                show-word-limit
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="查询类别" prop="categoryId">
                            <el-select v-model.trim="form.categoryId" maxlength="100" placeholder="请选择报表类别">
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
                        <el-form-item label="查询接口" prop="mode">
                            <el-select v-model.trim="form.categoryId" maxlength="100" placeholder="请选择报表类别">
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
                    <el-col :span="12">
                        <el-form-item label="排序号" prop="sortNum">
                            <el-input v-model.trim="form.sortNum" maxlength="5" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="form.mode === '1'">
                    <el-col :span="24">
                        <el-form-item label="查询条件">
                            <el-table
                                :data="form.queryColumnList"
                                height="300"
                                style="width: 100%; border: 1px solid #f0f8ff"
                            >
                                <el-table-column prop="columnName" label="列名称"> </el-table-column>
                                <el-table-column prop="dataType" label="数据类型"> </el-table-column>
                                <el-table-column prop="columnComment" label="列注释"> </el-table-column>
                                <el-table-column prop="displayColName" label="条件名称" width="170">
                                    <template slot-scope="scope">
                                        <el-form-item v-if="scope.row.columnComment">
                                            <el-input
                                                v-model.trim="scope.row.displayColName"
                                                :maxlength="userMaxLength"
                                                placeholder="空时显示列注释"
                                                show-word-limit
                                            ></el-input>
                                        </el-form-item>
                                        <el-form-item
                                            v-else
                                            :prop="'queryColumnList.' + scope.$index + '.displayColName'"
                                            :rules="[{ required: true, message: '请完善信息' }]"
                                        >
                                            <el-input
                                                v-model.trim="scope.row.displayColName"
                                                :maxlength="userMaxLength"
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
                <el-row v-if="form.mode === '1'">
                    <el-col :span="24">
                        <el-form-item label="列表页面">
                            <el-table
                                :data="form.displayColumnList"
                                height="500"
                                style="width: 100%; border: 1px solid #f0f8ff; text-align: center; align: center"
                            >
                                <el-table-column prop="columnName" label="列名称"> </el-table-column>
                                <el-table-column prop="dataType" label="数据类型"> </el-table-column>
                                <el-table-column prop="columnComment" label="列注释"> </el-table-column>
                                <el-table-column prop="displayColName" label="展示列名" width="170">
                                    <template slot-scope="scope">
                                        <el-form-item v-if="scope.row.columnComment">
                                            <el-input
                                                v-model.trim="scope.row.displayColName"
                                                :maxlength="userMaxLength"
                                                placeholder="空时显示列注释"
                                                show-word-limit
                                            ></el-input>
                                        </el-form-item>
                                        <el-form-item
                                            v-else
                                            :prop="'displayColumnList.' + scope.$index + '.displayColName'"
                                            :rules="[{ required: true, message: '请完善信息' }]"
                                        >
                                            <el-input
                                                v-model.trim="scope.row.displayColName"
                                                :maxlength="userMaxLength"
                                                show-word-limit
                                            ></el-input>
                                        </el-form-item>
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
                                <el-table-column prop="columnDrill" label="下钻列" width="80">
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
                                </el-table-column>
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
                <el-row v-if="form.mode === '1'">
                    <el-col :span="24">
                        <el-form-item label="详细页面">
                            <el-table
                                :data="form.detailColumnList"
                                height="500"
                                style="width: 100%; border: 1px solid #f0f8ff; text-align: center; align: center"
                            >
                                <el-table-column prop="columnName" label="列名称"> </el-table-column>
                                <el-table-column prop="dataType" label="数据类型"> </el-table-column>
                                <el-table-column prop="columnComment" label="列注释"> </el-table-column>
                                <el-table-column prop="displayColName" label="展示列名" width="170">
                                    <template slot-scope="scope">
                                        <el-form-item v-if="scope.row.columnComment">
                                            <el-input
                                                v-model.trim="scope.row.displayColName"
                                                :maxlength="userMaxLength"
                                                placeholder="空时显示列注释"
                                                show-word-limit
                                            ></el-input>
                                        </el-form-item>
                                        <el-form-item
                                            v-else
                                            :prop="'detailColumnList.' + scope.$index + '.displayColName'"
                                            :rules="[{ required: true, message: '请完善信息' }]"
                                        >
                                            <el-input
                                                v-model.trim="scope.row.displayColName"
                                                :maxlength="userMaxLength"
                                                show-word-limit
                                            ></el-input>
                                        </el-form-item>
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
                <el-row v-if="form.mode === '1'">
                    <el-col :span="12">
                        <el-form-item label="下钻页面标题">
                            <el-input v-model.trim="form.drillTitle" maxlength="50" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="下钻关联字段">
                            <el-select
                                v-model.trim="form.drillColumn"
                                maxlength="100"
                                clearable
                                placeholder="下钻关联字段"
                            >
                                <el-option
                                    v-for="item in this.queryColumnList"
                                    :key="item.columnName"
                                    :label="item.columnName"
                                    :value="item.columnName"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="form.mode === '2'">
                    <el-col :span="24">
                        <el-form-item label="SQL语句" prop="sqlStatement">
                            <el-input
                                type="textarea"
                                v-model="form.sqlStatement"
                                maxlength="10000"
                                show-word-limit
                                :rows="15"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="form.mode === '2'">
                    <el-col :span="24">
                        <el-form-item label="说明">
                            <el-tooltip class="item" style="padding-left: 10px" effect="dark" placement="right">
                                <div slot="content">
                                    <div>SQL语句样例：</div>
                                    <div>&nbsp;</div>
                                    <div class="div-margin">&nbsp;&nbsp;&nbsp;&nbsp;select</div>
                                    <div class="div-margin">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app_key, # 代码-click
                                    </div>
                                    <div class="div-margin">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;log_group, # 分组-list
                                    </div>
                                    <div class="div-margin">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;log_type, # 类型-view
                                    </div>
                                    <div class="div-margin">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app_key, # 代码-view
                                    </div>
                                    <div class="div-margin">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;log_group # 分组-view
                                    </div>
                                    <div class="div-margin">&nbsp;&nbsp;&nbsp;&nbsp;from</div>
                                    <div class="div-margin">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;log_group
                                    </div>
                                    <div class="div-margin">&nbsp;&nbsp;&nbsp;&nbsp;where</div>
                                    <div class="div-margin">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app_key = ? #代码-like@varchar
                                    </div>
                                    <div class="div-margin">&nbsp;&nbsp;&nbsp;&nbsp;limit 200</div>
                                    <div>&nbsp;</div>
                                    <div>&nbsp;</div>
                                    <div>说明：</div>
                                    <div>&nbsp;</div>
                                    <div class="div-margin">
                                        &nbsp;&nbsp;&nbsp;&nbsp;1、select后字段 #后文字代表列表或者详细页面字段说明
                                    </div>
                                    <div class="div-margin">
                                        &nbsp;&nbsp;&nbsp;&nbsp;2、select后字段
                                        -后如果配置list该字段显示在列表上，如果配置click该字段显示在列表上并且可以点击，如果配置view则显示在详情页面上
                                    </div>
                                    <div class="div-margin">
                                        &nbsp;&nbsp;&nbsp;&nbsp;3、select后字段 @后配置列表上列宽，可以不配置
                                    </div>
                                    <div class="div-margin">
                                        &nbsp;&nbsp;&nbsp;&nbsp;4、where后字段 #后代表列表查询条件字段说明
                                    </div>
                                    <div class="div-margin">
                                        &nbsp;&nbsp;&nbsp;&nbsp;5、where后字段 -后代表查询方式可以是模糊like或者匹配eq
                                    </div>
                                    <div class="div-margin">
                                        &nbsp;&nbsp;&nbsp;&nbsp;6、where后字段 @后代表列表查询条件字段类型
                                    </div>
                                    <div class="div-margin">
                                        &nbsp;&nbsp;&nbsp;&nbsp;7、limit后代表列表查询默认数据条数，不配置查询所有数据
                                    </div>
                                </div>
                                <i class="content-view iconfont iconbangzhu operate"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-row>
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
            </el-form>
            <el-dialog title="库表信息" :visible.sync="dialogTableVisible">
                <el-table
                    ref="multipleTable"
                    :data="queryColumnList"
                    @row-click="checkRow"
                    tooltip-effect="dark"
                    style="width: 100%"
                    height="6rem"
                >
                    <el-table-column type="selection" width="55"> </el-table-column>
                    <el-table-column prop="columnName" label="列名"> </el-table-column>
                    <el-table-column prop="dataType" label="数据类型" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="columnComment" label="列注释" show-overflow-tooltip> </el-table-column>
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
    data() {
        var validatePattern = (rule, val, callback) => {
            let patternArr = ['like', 'eq'];
            if (!patternArr.includes(val)) {
                callback(new Error('错误的查询模式'));
            }
        };
        return {
            form: {
                queryName: '',
                categoryId: '',
                mode: '',
                sortNum: null,
                limitNum: null,
                tableName: '',
                drillColumn: '',
                drillTitle: '',
                displayColumnList: [],
                detailColumnList: [],
                queryColumnList: [],
                sqlStatement: '',
                createUserName: '',
                createTime: '',
            },
            rules: {
                queryName: [{ required: true, message: '报表名称不能为空' }],
                categoryId: [{ required: true, message: '报表类别不能为空' }],
                tableName: [{ required: true, message: '库表不能为空' }],
                sqlStatement: [{ required: true, message: 'SQL语句不能为空' }],
                sortNum: [
                    {
                        pattern: /^[0-9]*$/,
                        message: '排序号必须是数字',
                        trigger: 'blur',
                    },
                ],
                limitNum: [{ required: true, pattern: /^[0-9]*$/, message: '展示记录数必须是数字', trigger: 'blur' }],
            },
            operateName: '',
            publicKey: '',
            optId: this.$route.query.id,
            optType: this.$route.query.optType,
            userMaxLength: window.accountMaxLength,
            isCluster: window.isCluster, //是否是集群环境
            dialogTableVisible: false,
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
            ],
        };
    },
    watch: {},
    computed: {
        ...mapState('webkit', ['queryConfigDetail', 'queryCategoryAll', 'queryColumnList']),
    },
    created() {
        this.$store.commit('webkit/query_TABLE_LIST', []);
        this.$store.commit('webkit/query_COLUMN_LIST', []);
        if ((this.isCluster && !this.optType) || (this.isCluster && this.optType === 'add')) this.optType = 'view'; //集群环境没有新增功能

        if (this.optType === 'view') {
            this.operateName = '查看配置';
        } else if (this.optType === 'edit') {
            this.operateName = '编辑配置';
        } else {
            if (!this.isCluster) this.operateName = '新增配置';
            this.form.mode = '1';
        }
        this.queryqueryCategoryAll();
        this.queryqueryTableList();

        // if(this.optType !== 'add') {
        this.queryDetail();
        // }
    },

    methods: {
        ...mapActions('webkit', [
            'ADD_query_CONFIG',
            'UPDATE_query_CONFIG',
            'QUERY_query_CONFIG_DETAIL',
            'QUERY_query_CATEGORY_All',
            'QUERY_query_TABLE_LIST',
            'QUERY_query_COLUMN_LIST',
        ]),
        async queryDetail() {
            let params = { id: this.optId };
            await this.QUERY_query_CONFIG_DETAIL(params).then((res) => {
                if (this.optType !== 'add') {
                    this.form.queryName = this.queryConfigDetail.queryName;
                    this.form.categoryId = this.queryConfigDetail.categoryId;
                    this.form.tableName = this.queryConfigDetail.tableName;
                    this.form.mode = this.queryConfigDetail.mode;
                    this.form.sortNum = this.queryConfigDetail.sortNum;
                    this.form.limitNum = this.queryConfigDetail.limitNum;
                    this.form.drillColumn = this.queryConfigDetail.drillColumn;
                    this.form.drillTitle = this.queryConfigDetail.drillTitle;
                    this.form.displayColumnList = this.queryConfigDetail.displayColumnList;
                    this.form.queryColumnList = this.queryConfigDetail.queryColumnList;
                    this.form.detailColumnList = this.queryConfigDetail.detailColumnList;
                    this.form.mode = this.queryConfigDetail.mode;
                    this.form.sqlStatement = this.queryConfigDetail.sqlStatement;
                    this.form.createUserName = this.queryConfigDetail.createUserName;
                    this.form.createTime = this.queryConfigDetail.createTime;
                    this.queryqueryColumnList(this.form.tableName);
                } else {
                    this.form.limitNum = this.queryConfigDetail.limitNum;
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
        queryqueryColumnList(val) {
            let params = { table: val };
            this.QUERY_query_COLUMN_LIST(params);
        },
        checkTable(val) {
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
                    this.form.displayColumnList.push(Object.assign({}, item));
                });
            } else if (this.tableDialogType === 'detail') {
                this.form.detailColumnList = [];
                this.$refs.multipleTable.selection.forEach((item) => {
                    this.form.detailColumnList.push(Object.assign({}, item));
                });
            }
            this.dialogTableVisible = false;
        },
        openTableDialog(type) {
            this.dialogTableVisible = true;
            this.$nextTick(() => {
                this.$refs.multipleTable.clearSelection();
                if (type === 'display') {
                    (this.queryColumnList || []).forEach((queryColumn, index) => {
                        (this.form.displayColumnList || []).forEach((displayColumn) => {
                            if (queryColumn.columnName === displayColumn.columnName) {
                                this.$refs.multipleTable.toggleRowSelection(this.queryColumnList[index], true);
                            }
                        });
                    });
                } else if (type === 'where') {
                    (this.queryColumnList || []).forEach((queryColumn, index) => {
                        (this.form.queryColumnList || []).forEach((queryColumn) => {
                            if (queryColumn.columnName === queryColumn.columnName) {
                                this.$refs.multipleTable.toggleRowSelection(this.queryColumnList[index], true);
                            }
                        });
                    });
                } else if (type === 'detail') {
                    (this.queryColumnList || []).forEach((queryColumn, index) => {
                        (this.form.detailColumnList || []).forEach((queryColumn) => {
                            if (queryColumn.columnName === queryColumn.columnName) {
                                this.$refs.multipleTable.toggleRowSelection(this.queryColumnList[index], true);
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
            let data = {
                queryName: this.form.queryName,
                categoryId: this.form.categoryId,
                sortNum: this.form.sortNum,
                limitNum: this.form.limitNum,
                mode: this.form.mode,
                drillColumn: this.form.drillColumn,
                drillTitle: this.form.drillTitle,
                sqlStatement: this.handleSql(this.form.sqlStatement),
                tableName: this.form.tableName,
                displayColumnList: this.form.displayColumnList,
                queryColumnList: this.form.queryColumnList,
                detailColumnList: this.form.detailColumnList,
                state: 1,
            };
            this.$refs.ruleform.validate((valid) => {
                if (valid) {
                    if (this.form.mode === '1' && this.form.displayColumnList.length === 0) {
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
                        if (this.form.mode === '1' && this.form.detailColumnList.length === 0 && flag) {
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
                        if (
                            this.form.mode === '1' &&
                            !this.form.drillColumn &&
                            this.form.drillColumn.trim() === '' &&
                            flag
                        ) {
                            this.$message({
                                showClose: true,
                                message: '请选择下钻关联字段',
                                type: 'warning',
                                center: true,
                            });
                            return;
                        }
                        if (this.form.mode === '1' && !this.form.drillTitle && flag) {
                            this.$message({
                                showClose: true,
                                message: '请选择下钻页面标题',
                                type: 'warning',
                                center: true,
                            });
                            return;
                        }
                    }
                    let _this = this;
                    _this.$store.commit('SHOW_LOADING', true);
                    if (this.optType === 'edit') {
                        data.id = this.optId;
                        this.UPDATE_query_CONFIG(data)
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
                        this.ADD_query_CONFIG(data)
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
