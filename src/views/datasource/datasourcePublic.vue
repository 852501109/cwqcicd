<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="数据源列表">
                <i
                    class="iconfont iconxinzeng2 audaque-rect-icon"
                    @click="add"
                    v-if="permitFun(permitList.addSource, permitList.addMySource) && isShowAddBtn"
                >
                    新增</i
                >
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="searchBarVisible = !searchBarVisible"
                    >筛选查询
                </i>
            </audaque-table-title>
        </template>

        <template slot="search">
            <audaque-table-search
                @close="searchBarVisible = false"
                v-show="searchBarVisible"
                @search="filterClick"
                @reset="resetClick"
            >
                <audaque-table-search-item title="数据源名称">
                    <el-input v-model.trim="form.name" placeholder="请输入数据源名称" clearable></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="数据源分类名">
                    <el-select clearable v-model="form.key" placeholder="请选择">
                        <el-option v-for="(item, index) in category" :key="index" :label="item.name" :value="item.key">
                        </el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="用户名">
                    <el-input clearable v-model.trim="form.username" placeholder="请输入用户名"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="IP">
                    <el-input clearable v-model.trim="form.host" placeholder="请输入IP"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="端口">
                    <el-input clearable v-model.trim="form.port" placeholder="请输入端口"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="授权">
                    <el-select clearable v-model="form.appKey" placeholder="请选择">
                        <el-option
                            v-for="(app, index) in appList"
                            :key="index"
                            :label="app.appName"
                            :value="app.appKey"
                        >
                        </el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="状态">
                    <el-select clearable v-model="form.isEnabled" placeholder="请选择">
                        <el-option label="启用" :value="true"></el-option>
                        <el-option label="禁用" :value="false"></el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="所属部门">
                    <el-input clearable v-model.trim="form.deptName" placeholder="请输入所属部门"></el-input>
                </audaque-table-search-item>
            </audaque-table-search>
        </template>

        <template>
            <el-table
                :data="datasourcelist.rows"
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                border
            >
                <el-table-column
                    type="index"
                    label="序号"
                    :index="
                        (index) => {
                            return $utils._indexMethod(index, form.page, form.rows);
                        }
                    "
                    width="50"
                >
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="name" label="数据源名称"> </el-table-column>
                <el-table-column show-overflow-tooltip prop="keyName" label="数据源分类名称"> </el-table-column>
                <el-table-column show-overflow-tooltip prop="username" label="用户名"> </el-table-column>
                <el-table-column show-overflow-tooltip prop="host" label="IP"> </el-table-column>
                <el-table-column show-overflow-tooltip prop="port" label="端口"> </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    prop="appNames"
                    label="授权"
                    :formatter="
                        (row) => {
                            return row.appNames ? row.appNames.join('/') : '-';
                        }
                    "
                >
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    prop="appNames"
                    label="可见范围"
                    :formatter="
                        (row) => {
                            return permissionLevelObj[row.permissionLevel];
                        }
                    "
                >
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="deptName" label="所属部门"> </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    prop="sceneType"
                    :formatter="
                        (row) => {
                            return sceneTypeObj[row.sceneType];
                        }
                    "
                    label="应用场景"
                >
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    prop="enabled"
                    label="状态"
                    :formatter="
                        (row) => {
                            return row.enabled ? '启用' : '禁用';
                        }
                    "
                >
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="remark" label="备注"> </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <div class="operate">
                            <template v-if="permitFun(permitList.testSource, permitList.testMySource)">
                                <a
                                    v-if="scope.row.hasOperation || scope.row.hasReadOnly"
                                    title="连接"
                                    @click="testSouce(scope.row.id)"
                                >
                                    <i class="iconfont iconlianjie"></i>
                                </a>
                            </template>
                            <span v-if="scope.row.hasOperation">
                                <a
                                    v-if="
                                        permitFun(permitList.disableSource, permitList.disableMySource) &&
                                        scope.row.enabled
                                    "
                                    title="禁用"
                                    @click="disableSource(scope.row.id)"
                                    ><i class="iconfont iconjinyong1"></i
                                ></a>
                                <a
                                    v-if="
                                        permitFun(permitList.enableSource, permitList.enableMySource) &&
                                        !scope.row.enabled
                                    "
                                    title="启用"
                                    @click="enableSource(scope.row.id)"
                                    ><i class="iconfont iconqiyong2"></i
                                ></a>
                                <router-link
                                    v-if="permitFun(permitList.modifySource, permitList.mySourceDetail)"
                                    title="编辑"
                                    :to="'/config/datasourceEdit?id=' + scope.row.id + '&pageType=' + pageType"
                                    ><i class="iconfont iconFill"></i>
                                </router-link>
                                <a
                                    v-if="permitFun(permitList.deleteSource, permitList.deleteMySource)"
                                    title="删除"
                                    @click="delSouce(scope.row.id)"
                                    ><i class="iconfont shanchu iconShape1"></i
                                ></a>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <template slot="empty">
                    <audaque-table-empty
                        @fetch="loadData()"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </template>
            </el-table>
            <adq-pagination
                @size-change="sizeChange"
                @current-change="currentChange"
                :total="datasourcelist.total"
                :page-size="form.rows"
                :current-page="form.page"
            ></adq-pagination>
        </template>
    </audaque-table-list-page>
</template>

<script>
import adqSearchMixin from '@/mixins/adqSearchMixin';
import { mapActions, mapState } from 'vuex';
export default {
    name: 'datasourcePublic',
    data() {
        return {
            form: {
                page: 1,
                rows: 10,
                name: null,
                key: null,
                username: null,
                host: null,
                port: null,
                appKey: null,
                isEnabled: null,
                deptName: null,
                decryptEnabled: false, //数据源是否要解密
            },
            searchBarVisible: false,
            permissionLevelObj: {
                1: '私有',
                2: '公开',
                3: '自定义',
            },
            datasourcelist: {
                rows: [],
                total: 0,
            },
            isShowAddBtn: true,
            sceneTypeObj: {
                1: '生产环境',
                2: '前置机',
                3: '归集库',
                4: '其他',
                null: '-',
            },
        };
    },
    props: {
        pageType: {
            type: String,
            default: '', //system 系统组织  dept 部门组织
        },
    },
    computed: {
        ...mapState('datasource', ['appList', 'category']),
    },
    mixins: [adqSearchMixin],
    created() {
        this.loadData();
        this.ALL_CATEGORY();
        this.ALL_APP();
    },
    methods: {
        ...mapActions('datasource', ['ALL_CATEGORY', 'ALL_APP']),
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
        loadData() {
            this.parameterEchoMixin(); //根据store中的参数回显
            //要存储在store中的对象，key存的是什么，回显的时候显示的就是什么(注意key的命名)
            this.adqSearchListMixin = {
                form: this.form,
            };
            this._AJAX({
                url: this.pageType === 'system' ? 'datasource.sourceList' : 'datasource.mySourceList',
                method: 'POST',
                data: this.form,
            }).then((res) => {
                if (res.code == 0) {
                    this.datasourcelist = res.result;
                }
            });
            /*在我的数据源页面下请求  查看是否有新增按钮的权限*/
            if (this.pageType === 'dept') {
                this._AJAX({
                    url: 'datasource.getManager',
                    method: 'GET',
                    data: {},
                }).then((res) => {
                    if (res.code == 0) {
                        this.isShowAddBtn = !res.result;
                    }
                });
            }
        },

        add() {
            this.$router.push({
                path: '/config/datasourceEdit',
                query: {
                    pageType: this.pageType,
                },
            });
        },
        enableSource(id) {
            let _this = this;
            this.$store.commit('SHOW_LOADING', true);
            this._AJAX({
                url: this.pageType === 'dept' ? 'datasource.enableMySource' : 'datasource.enableSource',
                method: 'POST',
                data: { sourceId: id },
            }).then((res) => {
                if (res.code == 0) {
                    this.$AudaqueToast.tip({
                        template: `启用成功`,
                        methods: {
                            okEvent() {
                                _this.loadData();
                            },
                        },
                    });
                }
            });
        },
        testSouce(id) {
            this.$store.commit('SHOW_LOADING', true);
            this._AJAX({
                url: this.pageType === 'dept' ? 'datasource.testMySource' : 'datasource.testSource',
                method: 'POST',
                data: { id: id },
            }).then((res) => {
                if (res.code == 0) {
                    this.$AudaqueToast.tip({
                        template: `测试连接成功`,
                        methods: {
                            okEvent() {},
                        },
                    });
                }
            });
        },
        disableSource(id) {
            let _this = this;
            this.$store.commit('SHOW_LOADING', true);
            this._AJAX({
                url: _this.pageType === 'dept' ? 'datasource.disableMySource' : 'datasource.disableSource',
                method: 'POST',
                data: { sourceId: id },
            }).then((res) => {
                if (res.code == 0) {
                    _this.$AudaqueToast.tip({
                        template: `禁用成功`,
                        methods: {
                            okEvent() {
                                _this.loadData();
                            },
                        },
                    });
                }
            });
        },
        delSouce(id) {
            let _this = this;
            this.$AudaqueToast.warn({
                template: `确认删除？`,
                methods: {
                    okEvent() {
                        _this.$store.commit('SHOW_LOADING', true);
                        _this
                            ._AJAX({
                                url:
                                    _this.pageType === 'dept' ? 'datasource.deleteMySource' : 'datasource.deleteSource',
                                method: 'POST',
                                data: { sourceId: id },
                            })
                            .then((res) => {
                                if (res.code == 0) {
                                    _this.$AudaqueToast.tip({
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
                },
            });
        },
        prevClick(val) {
            this.form.page = val;
            this.loadData();
        },
        nextClick(val) {
            this.form.page = val;
            this.loadData();
        },
        currentChange(val) {
            this.form.page = val;
            this.loadData();
        },
        sizeChange(rows) {
            this.form.rows = rows;
            this.form.page = 1;
            this.loadData();
        },
        searchClick() {
            this.$refs['search'].isSearch = true;
        },
        resetClick() {
            // Object.assign(this.$data, this.$options.data());
            this.form.page = 1;
            this.publics.resetFun(this.form, () => {
                this.form.rows = 10;
            });
            this.loadData();
        },
        filterClick() {
            this.form.page = 1;
            this.loadData();
        },
    },
};
</script>
