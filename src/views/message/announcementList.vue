<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title :title="$route.meta.pageName">
                <i class="iconfont iconfanhui1 audaque-rect-icon" @click="$router.push('/index')"> 返回</i>
            </audaque-table-title>
        </template>
        <template>
            <el-table
                :data="announcementList.rows"
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                border
                :row-class-name="tableRowClassName"
                @row-click="clickTableRow"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    :index="
                        (index) => {
                            return $utils._indexMethod(index, searchList.page, searchList.rows);
                        }
                    "
                    align="center"
                    width="60"
                ></el-table-column>
                <el-table-column prop="title" label="公告标题"></el-table-column>
                <el-table-column prop="publishTime" align="center" label="公告时间">
                    <template slot-scope="scope">
                        {{ publics.formatTime(scope.row.publishTime, 'Y-M-D h:m:s') }}
                    </template>
                </el-table-column>
                <template slot="empty">
                    <audaque-table-empty
                        @fetch="initData()"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </template>
            </el-table>
            <adq-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchList.page"
                :page-size="searchList.rows"
                :total="announcementList.total"
            ></adq-pagination>
        </template>
    </audaque-table-list-page>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            searchList: {
                page: 1,
                rows: 10,
                type: 1, //公告类型
                sendStatus: 1, //已发布
            },
            announcementList: [],
        };
    },
    created() {
        this.initData();
    },
    mounted() {},
    methods: {
        ...mapActions(['_AJAX']),
        initData() {
            this._AJAX({
                url: 'sys.message.userNotice.list',
                method: 'GET',
                data: this.searchList,
            }).then((res) => {
                if (res.code == 0) {
                    this.announcementList = res.result;
                }
            });
        },
        tableRowClassName({ row, rowIndex }) {
            if (row.readFlag === 1) {
                return 'have-read-row'; //已读行的class
            }
        },

        clickTableRow(row) {
            this.$router.push({
                path: '/index/announcementEdit',
                query: { id: row.id, uuidCode: row.uuidCode },
            });
        },
        handleSizeChange(val) {
            this.searchList.page = 1;
            this.searchList.rows = val;
            this.initData();
        },
        handleCurrentChange(val) {
            this.searchList.page = val;
            this.initData();
        },
    },
};
</script>
<style lang="scss" scoped>
/deep/.have-read-row {
    td {
        /*background: #f2f6fc !important;*/
    }
    .cell {
        color: #c0c4cc;
    }
}
</style>
