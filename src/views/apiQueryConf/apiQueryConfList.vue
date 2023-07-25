<!--
* @description 接口查询配置表列表
* @author liyaxin
* @date 2023-06-15 15:16:37
!-->
<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="接口查询配置表管理">
                <i
                    class="iconfont iconxinzeng2 audaque-rect-icon"
                    v-if="permitList.addApiQueryConf"
                    @click="$router.push('/apiQueryConf/apiQueryConfEdit?optType=add')"
                    >新增</i
                >
                <em class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </em>
            </audaque-table-title>
        </template>
        <template>
            <el-dialog title="" :visible.sync="dialogVisible" width="80%">
                <orgManagePublic page-type="system" @getRows="getRows" :authRows="authRows"></orgManagePublic>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="authSure">确 定</el-button>
                </span>
            </el-dialog>
        </template>
        <template slot="search">
            <audaque-table-search
                @close="isSearch = false"
                v-show="isSearch"
                @search="QUERYLIST_PARAMS(0)"
                @reset="QUERYLIST_PARAMS(1)"
            >
                <!-- <audaque-table-search-item title="id">
                    <el-input class="autoSize f14" v-model.trim="param.id" placeholder="请输入id" maxlength="50" clearable ></el-input>
                </audaque-table-search-item> -->
                <!-- <audaque-table-search-item title="报表名称">
                    <el-input class="autoSize f14" v-model.trim="param.queryName" placeholder="请输入报表名称" maxlength="50" clearable ></el-input>
                </audaque-table-search-item> -->
                <audaque-table-search-item title="查询类别">
                    <el-select
                        v-model.trim="param.apiQueryCategoryId"
                        clearable
                        maxlength="100"
                        placeholder="请选择报表类别"
                    >
                        <el-option v-for="item in queryCategoryAll" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="查询接口">
                    <el-select v-model.trim="param.apiConfId" clearable maxlength="100" placeholder="请选择报表类别">
                        <el-option v-for="item in queryApiAll" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </audaque-table-search-item>

                <audaque-table-search-item title="状态">
                    <el-select v-model.trim="param.state" clearable maxlength="100" placeholder="请选择报表类别">
                        <el-option label="启用" :value="1"> </el-option>
                        <el-option label="禁用" :value="0"> </el-option>
                    </el-select>
                </audaque-table-search-item>
            </audaque-table-search>
        </template>
        <template>
            <el-table
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="apiQueryConfList.rows"
                v-loading="$store.state.isSHowButtonLoading"
                element-loading-text="加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.6)"
                border
            >
                <el-table-column
                    show-overflow-tooltip
                    type="index"
                    label="序号"
                    :index="
                        (index) => {
                            return $utils._indexMethod(index, param.page, param.rows);
                        }
                    "
                    align="center"
                    width="80"
                >
                </el-table-column>
                <!-- <el-table-column show-overflow-tooltip align="center" prop="id" label="id" ></el-table-column> -->
                <!-- <el-table-column show-overflow-tooltip align="center" prop="apiConfId" label="接口id" ></el-table-column> -->
                <!-- <el-table-column show-overflow-tooltip align="center" prop="drillTitle" label="下钻页面标题" ></el-table-column> -->
                <!-- <el-table-column show-overflow-tooltip align="center" prop="drillColumn" label="下钻关联字段" ></el-table-column> -->
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="queryName"
                    label="查询名称"
                ></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="categoryName" label="查询类别">
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="createUserName"
                    label="创建人"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="createTime"
                    label="创建时间"
                ></el-table-column>
                <el-table-column show-overflow-tooltip prop="dataState" label="状态">
                    <template slot-scope="scope">
                        {{ scope.row.state == 1 ? '启用' : '禁用' }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="sortNum" label="排序号"></el-table-column>
                <!-- 状态（1：启用，0：禁用） -->
                <!-- <el-table-column show-overflow-tooltip align="center" prop="updateUser" label="更新人" ></el-table-column> -->
                <!-- <el-table-column show-overflow-tooltip align="center" prop="updateTime" label="更新时间" ></el-table-column> -->
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <div class="operate">
                            <span
                                title="查看"
                                class="iconfont iconchakan11 operate"
                                @click="goView(scope.row.id)"
                                v-if="permitList.apiQueryConfList"
                            ></span>
                            <span>
                                <a
                                    title="编辑"
                                    v-if="permitList.updateApiQueryConf && scope.row.state === 0"
                                    @click="goEdit(scope.row.id)"
                                    ><i class="iconfont iconFill"></i
                                ></a>
                            </span>
                            <span
                                title="禁用"
                                class="iconfont iconjinyong1 operate"
                                @click="changeState(scope.row.id, 0)"
                                v-if="scope.row.state && permitList.chageStateApiQueryConf"
                            >
                            </span>
                            <span
                                title="启用"
                                class="iconfont iconqiyong2 operate"
                                @click="changeState(scope.row.id, 1)"
                                v-if="!scope.row.state && permitList.chageStateApiQueryConf"
                            >
                            </span>
                            <span
                                title="授权"
                                class="iconfont icon-shouquan operate"
                                @click="auth(scope.row.id)"
                                v-if="permitList.authorizationApiQueryConf"
                            ></span>
                            <span>
                                <a
                                    title="删除"
                                    v-if="permitList.deleteApiQueryConf && scope.row.state === 0"
                                    @click="delRow(scope.row.id)"
                                    ><i class="iconfont shanchu iconShape1"></i
                                ></a>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <template slot="empty">
                    <audaque-table-empty
                        @fetch="LOGLIST(param)"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </template>
            </el-table>
            <adq-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="param.page"
                :total="apiQueryConfList.total"
                :page-size="param.rows"
            ></adq-pagination>
        </template>
    </audaque-table-list-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import orgManagePublic from './orgManagePublic';
export default {
    data() {
        return {
            isSearch: false,
            getHeight: false,
            dialogVisible: false,
            total: 1,
            originRows: [],
            authRows: [],
            currentId: '',
            param: {
                includeRole: true,
                page: 1,
                rows: 10,
                id: '',
                queryName: '',
                apiQueryCategoryId: '',
                apiConfId: '',
                sortNum: '',
                drillTitle: '',
                drillColumn: '',
                state: '',
                createUser: '',
                createTime: '',
                updateUser: '',
                updateTime: '',
            },
            search_dataRange: '',
        };
    },
    components: {
        orgManagePublic,
    },
    computed: {
        ...mapState('apiQueryConf', ['apiQueryConfList', 'queryApiAll', 'queryCategoryAll']),
    },
    methods: {
        ...mapActions('apiQueryConf', [
            'APIQUERYCONFLIST',
            'DELETEAPIQUERYCONF',
            'CHANGE_REPORT_CONFIG_STATE',
            'AUTHORIZATION',
            'QUERYBYCONFID',
            'QUERYCATEGORYLIST',
            'QUERYCONFIGLIST',
        ]),
        ...mapActions(['_AJAX']),
        initData() {
            let params = this.param;
            this.APIQUERYCONFLIST(params);
        },
        getRows(isAdd, row) {
            if (isAdd) this.authRows.push(row);
            else
                this.authRows.splice(
                    this.authRows.findIndex((item) => row.userId === item.userId),
                    1
                );
        },
        authSure() {
            const authRowsUserIds = this.authRows.map((item) => item.userId);
            const originRowsUserIds = this.originRows.map((item) => item.userId);
            // 判断原始列表和提交列表是否完全相等，如果完全相等则没有做任何修改
            if (
                !authRowsUserIds.find((id) => !originRowsUserIds.includes(id)) &&
                !originRowsUserIds.find((id) => !authRowsUserIds.includes(id))
            ) {
                this.$AudaqueToast.error({
                    template: '未做任何修改',
                });
                return;
            }
            this.dialogVisible = false;
            const insertList = this.authRows
                .filter((item) => !this.originRows.includes(item.userId))
                .map((item) => {
                    return {
                        confId: this.currentId,
                        userId: item.userId,
                        type: 1,
                    };
                });
            const deleteList = this.originRows
                .filter((item) => !this.authRows.includes(item.userId))
                .map((item) => {
                    return {
                        id: item.id,
                    };
                });

            this.AUTHORIZATION({ insertList: insertList, deleteList: deleteList }).then((res) => {
                if (res === 1) {
                    this.$AudaqueToast.tip({
                        template: '授权成功',
                    });
                }
            });
        },
        auth(id) {
            this.currentId = id;
            this.QUERYBYCONFID({ id: id, type: 1 }).then((res) => {
                this.dialogVisible = true;
                this.originRows = JSON.parse(JSON.stringify(res));
                this.authRows = JSON.parse(JSON.stringify(res));
            });
        },
        changeState(id, state) {
            let _this = this;
            let params = { id: id, state: state };
            this.CHANGE_REPORT_CONFIG_STATE(params)
                .then(() => {
                    let template = '启用成功';
                    if (state == 1) {
                        template = '启用成功';
                    } else {
                        template = '禁用成功';
                    }
                    this.$AudaqueToast.tip({
                        template: template,
                        methods: {
                            okEvent() {
                                _this.initData();
                            },
                        },
                    });
                })
                .catch(() => (this.loading = false));
        },
        handleSizeChange(rows) {
            this.param.page = 1;
            this.param.rows = rows;
            this.initData();
        },
        handleCurrentChange(page) {
            this.param.page = page;
            this.initData();
        },
        QUERYLIST_PARAMS(num) {
            this.param.page = 1;
            if (num > 0) {
                this.publics.resetFun(this.param, () => {
                    this.param.rows = 10;
                    this.search_dataRange = null;
                });
            }
            this.initData();
        },
        delRow(id) {
            let _this = this;
            this.$AudaqueToast.warn({
                template: `确认删除？`,
                methods: {
                    okEvent() {
                        _this.$store.commit('SHOW_LOADING', true);
                        _this.DELETEAPIQUERYCONF({ id: id }).then((res) => {
                            if (res.code == 0) {
                                _this.$AudaqueToast.tip({
                                    template: `删除成功`,
                                    methods: {
                                        okEvent() {
                                            _this.initData();
                                        },
                                    },
                                });
                            }
                        });
                    },
                },
            });
        },
        /*编辑*/
        goEdit(id) {
            this.$router.push('/apiQueryConf/apiQueryConfEdit?optType=edit&id=' + id);
        },
        goView(id) {
            this.$router.push('/apiQueryConf/apiQueryConfEdit?optType=view&id=' + id);
        },
    },
    created() {
        this.initData();
        this.QUERYCATEGORYLIST();
        this.QUERYCONFIGLIST();
    },
};
</script>
<style lang="scss" scoped>
@import '../../styles/audaquefont/iconfont.css';
.search-date {
    width: 100% !important;
}
</style>
