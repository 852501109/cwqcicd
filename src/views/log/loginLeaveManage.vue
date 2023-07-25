<!-- 日志管理 -->
<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="日志管理列表">
                <i class="iconfont icondaochu1 audaque-rect-icon" title="全部导出" @click="exportFun">全部导出 </i>
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search
                @close="isSearch = false"
                v-show="isSearch"
                @search="queryListFn(0)"
                @reset="queryListFn(1)"
            >
                <audaque-table-search-item title="级别">
                    <el-select v-model="searchList.level" size="mini" clearable>
                        <el-option
                            v-for="item in loginLevelArr"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="时间">
                    <el-date-picker
                        class="search-date"
                        v-model="search_dataRange"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        align="right"
                        unlink-panels
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </audaque-table-search-item>
            </audaque-table-search>
        </template>
        <template>
            <el-table
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="logList"
                border
                @selection-change="handleSelectionChange"
                v-loading="$store.state.isSHowButtonLoading"
                element-loading-text="加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.6)"
            >
                <el-table-column
                    show-overflow-tooltip
                    type="index"
                    :index="
                        (index) => {
                            return $utils._indexMethod(index, searchList.page, searchList.rows);
                        }
                    "
                    align="center"
                    width="60"
                    label="序号"
                >
                </el-table-column>
                <el-table-column show-overflow-tooltip label="时间" align="center" sortable prop="createTime">
                    <template slot-scope="scope">{{ publics.formatTime(scope.row.printTime, 'Y-M-D h:m:s') }}</template>
                </el-table-column>

                <el-table-column show-overflow-tooltip label="级别" align="center" sortable prop="level">
                    <template slot-scope="scope">{{ matchLeval(scope.row.level) }}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="日志" align="center" prop="content">
                    <template slot-scope="scope">{{ scope.row.content }}</template>
                </el-table-column>
                <template slot="empty">
                    <audaque-table-empty
                        @fetch="getUserList"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </template>
            </el-table>
            <adq-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="logListPages"
                :current-page="searchList.page"
                :page-size="searchList.rows"
            ></adq-pagination>
        </template>
    </audaque-table-list-page>
</template>

<script>
import { mapActions } from 'vuex';
import Axios from 'axios';
import API from '@/api/modules';

export default {
    data() {
        return {
            isSearch: false,
            search_dataRange: '',
            searchList: {
                page: 1,
                rows: 10,
            },
            logListPages: 0,
            logList: [],
            loginLevelArr: [
                { id: 2, label: 'Error' },
                { id: 3, label: 'Warning' },
                { id: 4, label: 'info' },
                { id: 5, label: 'Debug' },
                { id: '', label: '所有级别' },
            ],
        };
    },

    computed: {
        // ...mapState('webkit', ['GET_LOG_DATA'])
    },

    created() {
        this.getUserList();
    },

    methods: {
        ...mapActions('webkit', ['GET_LOG_DATA']),
        //查询客户列表
        getUserList() {
            this.GET_LOG_DATA(this.searchList)
                .then((res) => {
                    if (res.success) {
                        this.logList = res.result.rows;
                        this.logListPages = res.result.total;
                    }
                })
                .catch((err) => (this.loading = false));
        },
        queryListFn(type) {
            this.searchList.page = 1;
            if (type === 1) {
                //重置
                this.searchList.rows = 10;
                this.searchList.level = '';
                this.searchList.printTimeBegin = '';
                this.searchList.printTimeEnd = '';
                this.search_dataRange = '';
                this.getUserList();
                this.isSearch = false;
            } else {
                this.searchList.printTimeBegin = this.search_dataRange ? this.search_dataRange[0] : '';
                this.searchList.printTimeEnd = this.search_dataRange ? this.search_dataRange[1] : '';
                this.getUserList();
                this.isSearch = false;
            }
        },
        handleSelectionChange(val) {},
        handleSizeChange(val) {
            this.searchList.rows = val;
            this.getUserList();
        },
        handleCurrentChange(val) {
            this.searchList.page = val;
            this.getUserList();
        },
        /*导出*/
        exportFun() {
            let url = this.publics.createURL(window.urlConfig + '/hwlog/down.do', this.searchList);
            const _this = this;
            Axios({
                headers: _this.publics.ajaxHeaders(),
                url: url,
                method: 'get',
                responseType: 'blob',
            })
                .then((res) => {
                    if (res.headers['content-disposition' || 'Content-Disposition']) {
                        const url = window.URL.createObjectURL(new Blob([res.data]));
                        let filename = res.headers['content-disposition' || 'Content-Disposition'].split(
                            'filename='
                        )[1]; //文件名
                        if (_this.$utils.IEVersion() != -1) {
                            //ie浏览器
                            let blob = new Blob([res.data], {
                                type: 'application/json;charset=utf-8',
                            });
                            window.navigator.msSaveBlob(blob, filename);
                        } else {
                            //非ie
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', filename);
                            document.body.appendChild(link);
                            link.click();
                        }
                    } else {
                        /*将blob的数据转化为json格式*/
                        _this.varietyJson(res.data, (data) => {
                            if (data.success == false) {
                                _this.$AudaqueToast.tip({
                                    template: data.msg,
                                    methods: {
                                        okEvent() {},
                                    },
                                });
                            }
                        });
                    }
                })
                .catch((err) => {
                    if (err.response) {
                        _this.varietyJson(err.response.data, (err) => {
                            _this.$AudaqueToast.error({
                                template: err.msg,
                                methods: {
                                    okEvent() {},
                                },
                            });
                        });
                    }
                });
        },
        /*将blob的数据转化为json格式*/
        varietyJson(data, cb) {
            let reader = new FileReader();
            reader.readAsText(data, 'utf-8');
            reader.onload = function () {
                data = JSON.parse(reader.result);
                if (cb) {
                    cb(data);
                }
            };
        },
        matchLeval(type) {
            let parm = '';
            this.loginLevelArr.forEach((item) => {
                if (item.id == type) {
                    parm = item.label;
                }
            });
            return parm;
        },
    },
};
</script>
<style lang="scss" scoped>
.search-date {
    width: 100% !important;
}
</style>
