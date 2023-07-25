<template>
    <div class="createData">
        <el-row
            type="flex"
            class="createData-title"
            justify="space-between"
            :style="!params.showTable ? { marginBottom: '20px' } : ''"
        >
            <el-col :span="20">{{
                params.type == 2 && !params.showTable
                    ? '导入建表'
                    : params.type == 1 && !params.showTable
                    ? '手动建表'
                    : '元数据创建'
            }}</el-col>
            <el-col class="createData-goback" :span="4" @click.native="$router.go(-1)">
                <i class="iconfont icon-arrow-right"></i> 返回
            </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px; border-bottom: solid 1px #ddd" v-show="params.showTable">
            <el-menu mode="horizontal" @select="layerClick" :default-active="tableType" style="border-right: 0px">
                <el-menu-item class="nopad menuStyle" index="1">
                    <!-- <i class="iconfont icon-history"></i> -->
                    <span slot="title">手动建表</span>
                </el-menu-item>
                <el-menu-item class="nopad menuStyle" index="2">
                    <!-- <i class="iconfont icon-history"></i> -->
                    <span slot="title">导入建表</span>
                </el-menu-item>
            </el-menu>
        </el-row>
        <div v-if="tableType == '1'" :style="{ height: params.showTable ? 'calc(100% - 151px)' : 'calc(100% - 90px)' }">
            <el-form :model="params.handler" :rules="formRule" ref="formCreateData" label-width="80px">
                <el-row v-if="params.showTable">
                    <el-col :span="12">
                        <el-form-item
                            prop="departMent"
                            :label="
                                params.layer == 0 || params.layer == ''
                                    ? '部门'
                                    : params.layer == 3 || params.layer == 4
                                    ? '基础库'
                                    : params.layer == 5
                                    ? '主题库'
                                    : params.layer == 6
                                    ? '应用库'
                                    : '部门'
                            "
                        >
                            <el-input disabled v-model="params.handler.departMent"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            prop="sysName"
                            :label="
                                params.layer == 0 || params.layer == ''
                                    ? '系统'
                                    : params.layer == 3 || params.layer == 4
                                    ? '模块'
                                    : params.layer == 5
                                    ? '专题'
                                    : params.layer == 6
                                    ? '应用服务'
                                    : '系统'
                            "
                        >
                            <el-input disabled v-model="params.handler.sysName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-else>
                    <el-col :span="12">
                        <el-form-item
                            prop="departMent"
                            :label="
                                params.layer == 0 || params.layer == ''
                                    ? '部门'
                                    : params.layer == 3 || params.layer == 4
                                    ? '基础库'
                                    : params.layer == 5
                                    ? '主题库'
                                    : params.layer == 6
                                    ? '应用库'
                                    : '部门'
                            "
                        >
                            <el-select
                                clearable
                                @change="departChange"
                                v-model="params.handler.departMent"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="(item, idx) in topicDbAndModuleList"
                                    :key="idx + item.topicDbId"
                                    :label="item.topicDbName"
                                    :value="item.topicDbId"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            prop="sysName"
                            :label="
                                params.layer == 0 || params.layer == ''
                                    ? '系统'
                                    : params.layer == 3 || params.layer == 4
                                    ? '模块'
                                    : params.layer == 5
                                    ? '专题'
                                    : params.layer == 6
                                    ? '应用服务'
                                    : '系统'
                            "
                        >
                            <el-select clearable v-model="params.handler.sysName" style="width: 100%">
                                <el-option
                                    v-for="(item, indx) in topicModuleListandType"
                                    :key="item.topicDbMoudleId + indx"
                                    :label="item.topicDbMoudleName"
                                    :value="item.topicDbMoudleId"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="tableName" label="表名">
                            <el-select
                                v-if="isHBaseSource"
                                v-model="params.handler.tableName"
                                filterable
                                placeholder="请选择HBASE表"
                            >
                                <el-option
                                    v-for="(item, index) in HbaseTables"
                                    :key="index"
                                    :label="item"
                                    :value="item"
                                ></el-option>
                            </el-select>
                            <el-input
                                v-else
                                v-model="params.handler.tableName"
                                placeholder="请输入表名"
                                maxlength="50"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="annotation" label="表注释">
                            <el-input v-model="params.handler.annotation" maxlength="2000"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col
                        :span="24"
                        style="display: flex; justify-content: flex-end; padding-right: 10px; padding-bottom: 20px"
                    >
                        <el-button @click="addHandlerRows"> <i class="iconfont icon-jia"></i>&nbsp;增加行 </el-button>
                    </el-col>
                </el-row>
            </el-form>
            <el-row style="height: calc(100% - 174px)">
                <el-table
                    tooltip-effect="light"
                    highlight-current-row
                    :data="handlerTable"
                    v-loading="$store.state.isSHowButtonLoading"
                    element-loading-text="加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(255, 255, 255, 0.6)"
                    border
                    stripe
                    style="width: 100%; height: 100%; overflow-y: auto"
                >
                    <el-table-column
                        show-overflow-tooltip
                        type="index"
                        label="序号"
                        align="center"
                        width="50"
                    ></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" label="列名">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.colName" size="mini" maxlength="15"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" label="列中文名">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.colDesc" maxlength="250" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" label="类型">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.colType" filterable clearable size="mini">
                                <el-option
                                    v-for="(obj, idx) in colTypeData"
                                    :key="idx"
                                    :label="obj"
                                    :value="obj"
                                ></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" label="可为空">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.nullAble" size="mini">
                                <el-option key="1" label="Y" value="1"></el-option>
                                <el-option key="0" label="N" value="0"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="keyFlag" align="center" label="主键">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.keyFlag" size="mini">
                                <el-option key="1" label="是" value="1"></el-option>
                                <el-option key="0" label="否" value="0"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" label="长度">
                        <template slot-scope="scope">
                            <el-input type="number" v-model="scope.row.colLength" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" label="精度">
                        <template slot-scope="scope">
                            <el-input type="number" v-model="scope.row.precision" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip width="60" align="center" label="操作">
                        <template slot-scope="scope">
                            <a class="iconfont icon-shanchu tableList" @click="delColClick(scope.$index)"></a>
                            <!--删除-->
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </div>
        <div
            v-else-if="tableType == '2'"
            :style="{ height: params.showTable ? 'calc(100% - 151px)' : 'calc(100% - 90px)' }"
        >
            <el-form :model="importData" ref="importData" label-width="80px">
                <el-row>
                    <el-col :span="6" v-if="params.showTable">
                        <el-form-item
                            prop="departMent"
                            :label="
                                params.layer == 0 || params.layer == ''
                                    ? '部门'
                                    : params.layer == 3 || params.layer == 4
                                    ? '基础库'
                                    : params.layer == 5
                                    ? '主题库'
                                    : params.layer == 6
                                    ? '应用库'
                                    : '部门'
                            "
                        >
                            <el-input disabled v-model="importData.departMent"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-else>
                        <el-form-item
                            prop="departMent"
                            :label="
                                params.layer == 0 || params.layer == ''
                                    ? '部门'
                                    : params.layer == 3 || params.layer == 4
                                    ? '基础库'
                                    : params.layer == 5
                                    ? '主题库'
                                    : params.layer == 6
                                    ? '应用库'
                                    : '部门'
                            "
                        >
                            <el-select clearable @change="departMentChange" v-model="importData.departMent">
                                <el-option
                                    v-for="(item, idx) in topicDbAndModuleList"
                                    :key="idx + item.topicDbId"
                                    :label="item.topicDbName"
                                    :value="item.topicDbId"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="params.showTable">
                        <el-form-item
                            prop="sysName"
                            :label="
                                params.layer == 0 || params.layer == ''
                                    ? '系统'
                                    : params.layer == 3 || params.layer == 4
                                    ? '模块'
                                    : params.layer == 5
                                    ? '专题'
                                    : params.layer == 6
                                    ? '应用服务'
                                    : '系统'
                            "
                        >
                            <el-input disabled v-model="importData.sysName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-else>
                        <el-form-item
                            prop="sysName"
                            :label="
                                params.layer == 0 || params.layer == ''
                                    ? '系统'
                                    : params.layer == 3 || params.layer == 4
                                    ? '模块'
                                    : params.layer == 5
                                    ? '专题'
                                    : params.layer == 6
                                    ? '应用服务'
                                    : '系统'
                            "
                        >
                            <el-select clearable v-model="importData.sysName">
                                <el-option
                                    v-for="(item, indx) in topicModuleListandType"
                                    :key="item.topicDbMoudleId + indx"
                                    :label="item.topicDbMoudleName"
                                    :value="item.topicDbMoudleId"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class="flexEnd">
                        <el-button @click="downloadFiles">
                            <i class="iconfont icon-standard"></i> 下载导入模板
                        </el-button>
                        <el-button @click="uploadFileClick">
                            <i class="iconfont icon-tongyong-daorutubiao"></i> 导入模板
                        </el-button>
                        <input type="file" ref="upload" style="display: none" @change="uploadFile($event)" />
                    </el-col>
                </el-row>
                <el-row>
                    <el-tabs v-model="importDataValue" type="card" closable @tab-remove="removeTab">
                        <el-tab-pane
                            v-for="(item, index) in readMetaTableFileData"
                            :key="index + Date.now() + ''"
                            :name="item.tabName"
                        >
                            <span slot="label" :title="item.tabDesc">{{ item.tabName }}</span>
                            <el-table
                                v-loading="$store.state.isSHowButtonLoading"
                                element-loading-text="加载中"
                                element-loading-spinner="el-icon-loading"
                                element-loading-background="rgba(255, 255, 255, 0.6)"
                                tooltip-effect="light"
                                highlight-current-row
                                :data="item.paramForManualAddCloumnList"
                                border
                                stripe
                                :style="{
                                    width: '100%',
                                    height: params.showTable ? 'calc(100vh - 407px)' : 'calc(100vh - 350px)',
                                    'overflow-y': 'auto',
                                }"
                            >
                                <el-table-column
                                    show-overflow-tooltip
                                    type="index"
                                    label="序号"
                                    align="center"
                                    width="50"
                                ></el-table-column>
                                <el-table-column show-overflow-tooltip align="center" label="列名">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.colName" size="mini" maxlength="15"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip align="center" label="列中文名">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.colDesc" size="mini" maxlength="250"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip align="center" label="类型">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.colType" size="mini">
                                            <el-option
                                                v-for="(obj, idx) in colTypeData"
                                                :key="idx"
                                                :label="obj"
                                                :value="obj"
                                            ></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip align="center" label="可为空">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.nullAble" size="mini">
                                            <el-option key="1" label="Y" value="1"></el-option>
                                            <el-option key="0" label="N" value="0"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="keyFlag" align="center" label="主键">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.keyFlag" size="mini">
                                            <el-option key="1" label="是" value="1"></el-option>
                                            <el-option key="0" label="否" value="0"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip align="center" label="长度">
                                    <template slot-scope="scope">
                                        <el-input type="number" v-model="scope.row.colLength" size="mini"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip align="center" label="精度">
                                    <template slot-scope="scope">
                                        <el-input type="number" v-model="scope.row.precision" size="mini"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip align="center" label="操作">
                                    <template slot-scope="scope">
                                        <a
                                            class="iconfont icon-shanchu tableList"
                                            @click="delItemClick(index, scope.$index)"
                                        ></a>
                                        <!--删除-->
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </el-form>
        </div>
        <el-row type="flex" justify="center" style="margin: 10px 0 0">
            <el-button @click="getSave">保存</el-button>
        </el-row>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
export default {
    data() {
        return {
            formRule: {
                tableName: [{ required: true, message: '表不能为空', trigger: 'blur' }],
                annotation: [{ required: true, message: '表不能为空', trigger: 'blur' }],
            },
            tableType: '1',
            params: {
                dataSourceId: '',
                handler: {},
                layer: '',
            },
            handlerTable: [],
            importData: {
                departMent: '',
                sysName: '',
            },
            importTable: [],
            importDataValue: '',
            topicModuleListandType: [],
        };
    },
    computed: {
        ...mapState('bussines', ['isHBaseSource']),
        ...mapState('bussinesCopy', ['HbaseTables', 'colTypeData', 'createDataFile', 'topicDbAndModuleList']),
        ...mapState('metaData', ['readMetaTableFileData']),
        ...mapState('bussinesCopy', ['paramsId', 'TreeData', 'expandedKeys', 'depDownloadFile']),
    },
    methods: {
        ...mapMutations('metaData', ['minusTable']),
        ...mapActions('metaData', ['readMetaTableFile', 'batchImportAddTable', 'manual_AddBussines_SourceTable']),
        ...mapActions('bussinesCopy', ['getHbaseTables', 'getDBColumnType', 'getTopicDbAndModuleList']),
        ...mapActions('bussines', ['getIsHBaseSource', 'manualAddBussinesSourceTable']),
        departChange(val) {
            if (val) {
                let arr = this.topicDbAndModuleList.filter((item) => {
                    return item.topicDbId == val;
                });
                if (arr.length > 0) {
                    this.topicModuleListandType = arr[0].moduleList;
                    this.params.handler.sysName =
                        this.topicModuleListandType.length > 0 ? this.topicModuleListandType[0].topicDbMoudleId : '';
                } else {
                    this.params.handler.sysName = '';
                    this.topicModuleListandType = [];
                }
            } else {
                this.params.handler.sysName = '';
                this.topicModuleListandType = [];
            }
        },
        departMentChange(val) {
            if (val) {
                let arr = this.topicDbAndModuleList.filter((item) => {
                    return item.topicDbId == val;
                });
                if (arr.length > 0) {
                    this.topicModuleListandType = arr[0].moduleList;
                    this.importData.sysName =
                        this.topicModuleListandType.length > 0 ? this.topicModuleListandType[0].topicDbMoudleId : '';
                } else {
                    this.importData.sysName = '';
                    this.topicModuleListandType = [];
                }
            } else {
                this.importData.sysName = '';
                this.topicModuleListandType = [];
            }
        },
        downloadFiles() {
            window.location = this.createDataFile;
            //此种写法内容有乱码，需要优化再使用暂时先注释掉
            //this.$utils.createDownloadFile(this.createDataFile)
        },
        removeTab(targetName) {
            let tabs = this.readMetaTableFileData;
            let activeName = this.importDataValue;
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.tabName === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.tabName;
                        }
                    }
                });
            }
            this.importDataValue = activeName;
            this.minusTable(tabs.filter((tab) => tab.tabName !== targetName));
        },
        uploadFileClick() {
            this.$refs.upload.click();
        },
        layerClick(type) {
            this.tableType = type;
        },
        addHandlerRows() {
            this.handlerTable.push({
                colName: '', //列名
                colDesc: '', //列中文名
                colLength: '', //长度
                colType: this.colTypeData[0], //类型
                keyFlag: '0', //是否主键：0-否，1-是
                nullAble: '1', //是否为空：0-否，1-是
                precision: '', //精度
                seq: '', //序号
            });
        },
        delItemClick(index, idx) {
            this.readMetaTableFileData[index].paramForManualAddCloumnList.splice(idx, 1);
        },
        delColClick(idx) {
            this.handlerTable.splice(idx, 1);
        },
        getSave() {
            //  this.tableType为1时是手工建表,2是导入建表,若手工建表在导入建表中,则往对应的导入建表加入列表
            if (Number(this.tableType) == 1) {
                this.getHandlerPostdata();
            } else if (Number(this.tableType) == 2) {
                if (this.readMetaTableFileData.length < 1) return;
                let CheckTableName = this.params.handler.tableName;
                let getIndex = this.readMetaTableFileData.findIndex((item) => {
                    return item.tableName == CheckTableName;
                });
                if (getIndex !== -1) {
                    this.readMetaTableFileData[getIndex].paramForManualAddCloumnList.concat(this.handlerTable);
                }
                let postData = this.getimportPostdata();
                this.batchImportAddTable(postData).then(() => {
                    this.$message({ type: 'success', message: '批量导入建表成功!', showClose: true });
                    this.$router.go(-1);
                });
            }
        },
        getHandlerPostdata() {
            let postData = {};
            this.$refs['formCreateData'].validate((valid) => {
                if (valid) {
                    let tempVar = false;
                    this.handlerTable.forEach((ele, index) => {
                        // ele.keyFlag.trim() == '是' ? ele.keyFlag = 'Y' : ele.keyFlag = 'N'
                        if (ele.colName.trim() == '' || ele.colDesc.trim() == '') {
                            tempVar = true;
                        }
                        ele.seq = index;
                    });
                    if (tempVar) {
                        this.$message({
                            type: 'warning',
                            message: '表中的列名与列中文名不可为空!',
                            showClose: true,
                        });
                        return false;
                    } else {
                        postData = this.getmanualData();
                        this.manual_AddBussines_SourceTable(postData).then(() => {
                            this.$message({ type: 'success', message: '手工建表成功!', showClose: true });
                            this.$router.go(-1);
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        getmanualData() {
            let data = {};
            this.params.layer != 0 ? (data.layerId = this.params.layer.toString()) : '';
            if (this.params.layer < 3) {
                if (this.params.type > 1) {
                    data.dataSourceId = this.importData.departMent;
                    data.deptId = this.importData.sysName;
                    if (this.params.layer == 0) {
                        data.dataSourceId = this.params.dataSourceId;
                        data.deptId = this.params.deptId;
                    }
                } else {
                    data.dataSourceId = this.params.handler.departMent;
                    data.deptId = this.params.handler.sysName;
                    if (this.params.layer == 0) {
                        data.dataSourceId = this.params.dataSourceId;
                        data.deptId = this.params.deptId;
                    }
                }
            } else {
                data.topicDbId = this.params.handler.departMent;
                data.topicDbMoudleId = this.params.handler.sysName;
            }
            data.paramForManualAddCloumnList = this.handlerTable.map((item) => {
                item.seq = item.seq + 1;
                return item;
            });
            data.tabDesc = this.params.handler.annotation;
            data.tabName = this.params.handler.tableName;
            return data;
        },
        getimportPostdata() {
            let data = {};
            if (this.params.layer > 0) {
                if (this.params.type > 0) {
                    data.topicDbId = this.importData.departMent;
                    data.topicDbMoudleId = this.importData.sysName;
                } else {
                    data.dataSourceId = this.params.dataSouceObj.id;
                    data.deptId = this.params.dataSouceObj.parent.id;
                }
            } else {
                data.dataSourceId = this.params.dataSouceObj.id;
                data.deptId = this.params.dataSouceObj.parent.id;
            }
            data.layerId = this.params.layer.toString();
            data.tables = [];
            this.readMetaTableFileData.map((item) => {
                let NewArr = item.paramForManualAddCloumnList.map((item, index) => {
                    let OBJ = Object.assign({}, item);
                    OBJ.seq = index + 1;
                    OBJ.precision ? (OBJ.precision = OBJ.precision) : (OBJ.precision = '');
                    OBJ.colLength ? (OBJ.colLength = OBJ.colLength) : (OBJ.colLength = '');
                    return OBJ;
                });
                return data.tables.push({
                    tabName: item.tabName,
                    tabDesc: item.tabDesc,
                    paramForManualAddCloumnList: NewArr,
                });
            });
            return data;
        },
        uploadFile(event) {
            let formData = new FormData();
            let files = event.target.files[0];
            if (files.name.indexOf('xls') == -1)
                return this.$message({ type: 'warning', message: '请选择excel格式的文件上传！', showClose: true });
            formData.append('file', files);
            event.target.value = '';
            this.$confirm(`导入后会清空已存在的映射关系，并替换为上传文件中的映射关系。确定上传？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.readMetaTableFile(formData).then(() => {
                        //formData
                        if (this.readMetaTableFileData.length > 0) {
                            this.$message({ type: 'success', message: '导入成功！', showClose: true });
                            this.importDataValue = this.readMetaTableFileData[0].tabName;
                        }
                    });
                })
                .catch(() => {});
        },
    },
    created() {
        if (!this.$route.params.hasOwnProperty('type'))
            return this.$message({ message: '请求参数异常,请点击返回重新进入', type: 'warning', showClose: true });
        this.minusTable([]);
        this.params = Object.assign({}, this.$route.params);
        this.tableType = this.params.type.toString();
        this.importData.departMent = this.params.handler.departMent;
        this.importData.sysName = this.params.handler.sysName;
        if (this.params.dataSourceId) {
            this.getIsHBaseSource({ dataSourceId: this.params.dataSourceId }).then((re) => {
                if (re) {
                    //获取hbase表
                    this.getHbaseTables();
                }
            });
        }
        this.getDBColumnType({ type: this.params.layer == 0 ? '1' : '2' });
        if (!this.params.showTable) {
            if (this.params.layer > 0 && this.params.layer < 5) {
                this.getTopicDbAndModuleList(1).then(() => {
                    if (this.topicDbAndModuleList.length > 0) {
                        this.params.handler.departMent = this.topicDbAndModuleList[0].topicDbId;
                        this.importData.departMent = this.topicDbAndModuleList[0].topicDbId;
                        this.topicModuleListandType = this.topicDbAndModuleList[0].moduleList;
                        this.params.handler.sysName =
                            this.topicModuleListandType.length > 0
                                ? this.topicModuleListandType[0].topicDbMoudleId
                                : '';
                        this.importData.sysName =
                            this.topicModuleListandType.length > 0
                                ? this.topicModuleListandType[0].topicDbMoudleId
                                : '';
                    } else {
                        this.params.handler.departMent = '';
                        this.importData.departMent = '';
                        this.params.handler.sysName = '';
                        this.importData.sysName = '';
                    }
                });
            } else if (this.params.layer > 4) {
                this.getTopicDbAndModuleList(2).then(() => {
                    if (this.topicDbAndModuleList.length > 0) {
                        this.params.handler.departMent = this.topicDbAndModuleList[0].topicDbId;
                        this.importData.departMent = this.topicDbAndModuleList[0].topicDbId;
                        this.topicModuleListandType = this.topicDbAndModuleList[0].moduleList;
                        this.params.handler.sysName =
                            this.topicModuleListandType.length > 0
                                ? this.topicModuleListandType[0].topicDbMoudleId
                                : '';
                        this.importData.sysName =
                            this.topicModuleListandType.length > 0
                                ? this.topicModuleListandType[0].topicDbMoudleId
                                : '';
                    } else {
                        this.params.handler.departMent = '';
                        this.importData.departMent = '';
                        this.params.handler.sysName = '';
                        this.importData.sysName = '';
                    }
                });
            }
        }
    },
};
</script>

<style lang="scss" scoped>
.createData {
    &-title {
        font-size: 16px;
        border-bottom: solid 1px #ddd;
        padding: 0 0 15px 25px;
    }
    &-goback {
        text-align: right;
        padding-right: 10px;
        color: #409eff;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .menuStyle {
        padding: 0;
        margin: 0 25px;
    }
    .controlTable {
        height: 100%;
        overflow: hidden;
    }
    .flexEnd {
        display: flex;
        justify-content: flex-end;
        padding-right: 10px;
    }
}
.tableList {
    color: #409eff;
    &:hover {
        color: #66b1ff;
    }
}
</style>
