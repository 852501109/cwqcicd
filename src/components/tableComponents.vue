<template>
    <div class="table-component">
        <div class="table-main">
            <el-table
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                border
                :data="data.rows"
                v-loading="$store.state.isSHowButtonLoading"
                element-loading-text="加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.6)"
            >
                <el-table-column v-if="option.isSelection" type="selection" width="55"> </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    type="index"
                    label="序号"
                    :index="
                        (index) => {
                            return $utils._indexMethod(index, currentPage, pageSize);
                        }
                    "
                    :width="50"
                >
                </el-table-column>
                <el-table-column
                    v-for="(item, index) in headerList"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <template v-if="item.type === 'date'">
                            {{ publics.formatTime(scope.row[item.prop], 'Y-M-D h:m:s') }}
                        </template>
                        <template v-else>
                            {{ scope.row[item.prop] }}
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="myPagination" v-if="__config__.dataType === 'dynamic'">
            <adq-pagination
                @size-change="sizeChange"
                @current-change="currentChange"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="data.total"
            ></adq-pagination>
        </div>
    </div>
</template>
<style scoped lang="scss"></style>
<script>
export default {
    data() {
        return {};
    },
    mounted() {
        if (this.__config__.dataType === 'dynamic') {
            this.currentPage = this.__config__.parameter[0].value;
            this.pageSize = this.__config__.parameter[1].value;
        }
    },
    props: {
        __config__: {
            type: Object,
            default: () => {},
        },
        headerList: {
            type: Array,
            default: () => [],
        },
        data: {
            type: Object,
            default: () => {},
        },
        option: {
            type: Object,
            default: () => {},
        },
        total: {
            type: Number,
            default: 0,
        },
        pageSize: {
            type: Number,
            default: 10,
        },
        currentPage: {
            type: Number,
            default: 1,
        },
    },
    methods: {
        sizeChange(val) {
            this.$emit('size-change', val);
        },
        currentChange(val) {
            this.$emit('current-change', val);
        },
    },
};
</script>
<style lang="scss" scoped>
.table-component {
    .table-main {
        max-height: 450px;
        overflow: auto;
        /deep/.el-table__empty-block {
            width: 100% !important;
        }
    }
}
</style>
