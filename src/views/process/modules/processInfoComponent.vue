<template>
    <div>
        <div style="text-align: center">
            <img :src="imgUrl" style="min-height: 250px; margin-bottom: 20px; max-width: 100%" />
        </div>
        <el-table
            :data="tableData.rows"
            style="width: 100%"
            border
            row-key="id"
            :tree-props="{ children: 'audits', hasChildren: 'hasChildren' }"
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
            <el-table-column prop="name" label="活动流程"> </el-table-column>
            <el-table-column prop="startTime" label="接收时间"> </el-table-column>
            <el-table-column prop="endTime" label="完成时间"> </el-table-column>
            <el-table-column prop="assignee" show-overflow-tooltip label="参与者">
                <template #default="scope">
                    <span v-html="$audaquePreventXss(markRed(scope.row.assignee), $xssWhitelist)"></span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="comment" label="审核意见"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="deleteReason" label="审核"> </el-table-column>
        </el-table>
        <adq-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :total="tableData.total"
            :page-size="form.rows"
            :current-page="form.page"
        ></adq-pagination>
    </div>
</template>

<script>
import API from '@/api/index';
import { mapActions } from 'vuex';
export default {
    name: 'processInfoComponent',
    data() {
        return {
            tableData: [],
            imgUrl: null,
            form: {
                page: 1,
                rows: 10,
                procInstId: null,
            },
        };
    },
    props: ['procInstId', 'procDefId'],
    watch: {
        procInstId: {
            handler(val) {},
            deep: true,
        },
    },
    created() {
        if (this.procInstId) {
            this.getImg({ procInstId: this.procInstId });
            // this.imgUrl = API['activiti.models.img'] + '?procInstId=' + this.procInstId + '&t=' + Date.now();
            this.loadTableData();
        } else {
            this.getImg({ procDefId: this.procDefId });
            // this.imgUrl = API['activiti.models.img'] + '?procDefId=' + this.procDefId + '&t=' + Date.now();
        }
    },
    methods: {
        ...mapActions(['_AJAX']),
        loadTableData() {
            let params = this.form;
            params.procInstId = this.procInstId;
            this._AJAX({
                url: 'activiti.task.historic',
                method: 'GET',
                data: params,
            }).then((res) => {
                this.tableData = res.result;
            });
        },
        getImg(params) {
            this._AJAX({
                url: 'activiti.models.img',
                method: 'GET',
                responseType: 'blob',
                data: params,
            }).then((data) => {
                let blob = new Blob([data]); // 返回的文件流数据
                let url = window.URL.createObjectURL(blob); // 将他转化为路径
                this.imgUrl = url;
            });
        },
        markRed(str) {
            if (!str) {
                return '-';
            }
            let strArr = str.split(',');
            for (let i = 0; i < strArr.length; i++) {
                let item = strArr[i];
                if (/_\*$/.test(item)) {
                    let real = item.replace('_*', '');
                    strArr[i] = '<span style="color:red;">' + real + '</span>';
                }
            }
            return strArr.join(',');
        },
        sizeChange(rows) {
            this.form.page = 1;
            this.form.rows = rows;
            this.loadTableData();
        },
        currentChange(val) {
            this.form.page = val;
            this.loadTableData();
        },
    },
};
</script>

<style lang="scss" scoped>
/deep/.el-table {
    .el-table__body-wrapper {
        /*overflow: auto;*/
    }
}
</style>
