<template>
    <audaque-table-list-page class="initiation-process-item">
        <template slot="title">
            <audaque-table-title title="工单申请"></audaque-table-title>
        </template>
        <template>
            <el-row :gutter="20" style="height: 100%; overflow: auto">
                <template v-if="tableList && tableList.length > 0">
                    <div v-for="item in tableList" :key="item.id">
                        <el-col v-if="item.procCode" :span="6" class="process-item">
                            <el-card shadow="hover">
                                <div class="process-info-item">
                                    <div class="top-item">
                                        <div class="top-item-info">
                                            <div class="title">{{ item.formName }}</div>
                                            <div class="process-btn" v-if="permitList.bizNew">
                                                <el-button @click="launch(item)">发起流程</el-button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bottom-item">
                                        <div>
                                            <span>备注：</span>
                                            <span>{{ item.formDesc }}</span>
                                        </div>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                    </div>
                </template>
                <div v-else style="height: 100%; display: flex">
                    <audaque-table-empty
                        @fetch="loadData()"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </div>
            </el-row>
            <el-dialog
                :title="dialogTitle"
                :visible.sync="isVisibleDialog"
                width="500"
                @close="closeDialog"
                :close-on-click-modal="false"
                class="form-parser-dialog"
            >
                <div class="form-line-item">
                    <span class="form-title"><span style="color: red">*</span> 申请标题</span>
                    <el-input v-model.trim="formTitle" placeholder="请输入申请标题" clearable></el-input>
                </div>
                <form-parser
                    v-if="isVisibleDialog"
                    ref="formParser"
                    :key="key2"
                    :formConf="formConf"
                    :isShowTitle="true"
                    :isDisabled="false"
                    @submit="submitForm"
                    @reset="resetForm"
                ></form-parser>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="isVisibleDialog = !isVisibleDialog">取消</el-button>
                    <el-button @click="$refs.formParser.submitForm()" :loading="isSHowButtonLoading">提交</el-button>
                </span>
            </el-dialog>
        </template>
    </audaque-table-list-page>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            param: {
                page: 1,
                rows: 10,
                status: 1,
            },
            tableList: {},
            key2: +new Date(),
            isVisibleDialog: false,
            formConf: {},
            dialogTitle: '发起流程',
            activeData: null,
            formTitle: null,
        };
    },
    created() {
        this.loadData();
    },
    methods: {
        ...mapActions(['_AJAX']),
        /*初始化数据*/
        loadData() {
            this._AJAX({
                url: 'form.design.list.apply',
                method: 'GET',
                data: {
                    page: 1,
                    rows: 10000,
                    all: 0,
                },
            }).then((res) => {
                this.tableList = res.result.rows;
            });
        },
        /*点击发起流程---打开弹窗*/
        launch(item) {
            this.formConf = JSON.parse(item.formJson);
            this.isVisibleDialog = true;
            this.activeData = item;
        },
        submitForm(data) {
            if (!this.formTitle || this.formTitle == ' ') {
                return this.$AudaqueToast.error({
                    template: `请输入申请标题`,
                    methods: {
                        okEvent() {},
                    },
                });
            }
            let _this = this;
            this._AJAX({
                url: 'activiti.biz.new',
                method: 'POST',
                data: {
                    title: this.formTitle,
                    tableName: this.activeData.tableName,
                    dataMap: data, //表单数据
                    procCode: this.activeData.procCode,
                    formId: this.activeData.id,
                },
            }).then((res) => {
                this.$AudaqueToast.tip({
                    template: `操作成功`,
                    methods: {
                        okEvent() {
                            _this.isVisibleDialog = false;
                            _this.formTitle = null;
                            _this.loadData();
                        },
                    },
                });
            });
        },
        resetForm() {},
        closeDialog() {
            this.activeData = null;
            this.formTitle = null;
        },
    },
};
</script>
<style lang="scss" scoped>
.initiation-process-item {
    .process-item {
        margin-bottom: 20px;
        min-width: 245px;
        /deep/ .el-card__body {
            padding: 0;
            font-size: 14px;
            .process-info-item {
                .top-item {
                    height: 50px;
                    line-height: 50px;
                    border-bottom: 1px solid #e0e0e0;
                    .top-item-info {
                        display: flex;
                        justify-content: space-between;
                        padding: 0 15px;
                        .title {
                            font-weight: bold;
                            line-height: 20px;
                            display: flex;
                            align-items: center;
                        }
                        .process-btn {
                            .el-button {
                                height: 32px;
                                font-size: 12px;
                                margin-top: 9px;
                                padding: 0 15px;
                                > span {
                                    line-height: 18px;
                                }
                            }
                        }
                    }
                }
                .bottom-item {
                    display: flex;
                    align-items: center;
                    min-height: 90px;
                    padding: 15px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
        }
    }
    .form-line-item {
        margin-bottom: 22px;
        .form-title {
            display: inline-block;
            width: 90px;
            text-align: right;
            margin-right: 10px;
        }
        /deep/.el-input {
            width: calc(100% - 100px);
        }
    }
}
</style>
