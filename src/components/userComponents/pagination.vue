<template>
    <div class="myPagination">
        <el-pagination
            v-if="isPaging"
            background
            :page-sizes="pageSizes ? pageSizes : $utils.pageShowSize(total)"
            :page-size="pageSize"
            :current-page="currentPage"
            @size-change="sizeChange"
            @current-change="currentChange"
            @prev-click="prevClick"
            @next-click="nextClick"
            :total="total"
            layout="total, sizes, prev, pager, next"
        ></el-pagination>
        <span class="table-size-layout" v-else style="font-size: 14px">共计{{ total }}条记录</span>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    props: {
        total: {
            type: Number,
        },
        pageSize: {
            type: Number,
        },
        currentPage: {
            type: Number,
        },
        pageSizes: {
            type: Number,
        },

        isPaging: {
            type: Boolean,
            default: true,
        },
    },
    methods: {
        sizeChange(val) {
            this.$emit('size-change', val);
        },
        currentChange(val) {
            this.$emit('current-change', val);
        },
        prevClick(val) {
            this.$emit('prev-click', val);
        },
        nextClick(val) {
            this.$emit('next-click', val);
        },
    },
};
</script>

<style lang="scss" scoped>
.myPagination {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #f2f2f2;
    padding: 7px 20px;

    .table-size-layout {
        padding: 8px;
    }
    /deep/.el-pagination {
        padding: 0 !important;
        border-top: none !important;
        /deep/.el-pager {
            border-top: none;
            border-bottom: none;
        }
    }
}
</style>
