<template>
    <audaque-detail-form-page @submit-click="submitForm" :title="formTitle" :opt-type="$route.query.optType">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" :disabled="isView">
            <el-form-item label="渠道名称" prop="channelName">
                <span style="color: #909399">{{ ruleForm.channelName }}</span>
                <el-radio-group v-model="ruleForm.channelName">
                    <el-radio v-for="item in nameList" :key="item.label" :label="item.value">{{item.label}}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="消息类型" prop="msgType">
                <el-select v-model="ruleForm.msgType" placeholder="请选择" multiple clearable>
                    <el-option :label="item.label" :value="item.value" v-for="item in newsList" :key="item.label">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </audaque-detail-form-page>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            formTitle:
                this.$route.query.optType === 'edit'
                    ? '编辑消息渠道'
                    : this.$route.query.optType === 'view'
                    ? '查看消息渠道'
                    : '新增消息渠道',
            preview: '',
            ruleForm: {
                msgType: '',
                channelName: '',
            },
            rules: {
                // msgType: [{ required: true, message: '请选择消息类型', trigger: 'change' }],
                // channelName: [{ required: true, message: '请选择渠道名称', trigger: 'change' }],
            },
            isView: false,
            newsList: [
                { label: '公告', value: '1' },
                { label: '消息', value: '2' },
                { label: '任务', value: '3' },
                { label: '告警', value: '4' },
                { label: '其他', value: '0' },
            ],
            nameList: [
                { label: '系统', value: '系统' },
                { label: '邮件', value: '邮件' },
                { label: '短信', value: '短信' },
            ],
        };
    },
    created() {
        if (this.$route.query.id) {
            this.loadData();
        }
        if (this.$route.query.optType === 'view') {
            this.isView = true;
        }
    },
    methods: {
        ...mapActions(['_AJAX']),
        loadData() {
            this._AJAX({
                url: 'news.sys.msg.channel.id',
                method: 'GET',
                data: {
                    id: this.$route.query.id,
                },
            }).then((res) => {
                if (res.code == 0) {
                    let result = res.result;
                    if (result.msgType) {
                        result.msgType = result.msgType.split(',');
                    } else {
                        result.msgType = [];
                    }
                    this.ruleForm = result;
                }
            });
        },

        submitForm() {
            this.$refs['ruleForm'].validate((valid) => {
                let _this = this;
                if (valid) {
                    let params = Object.assign({}, this.ruleForm);
                    params.msgType = params.msgType.join(',');
                    this.$store.commit('SHOW_LOADING', true);
                    if (this.$route.query.id) {
                        this._AJAX({
                            url: 'news.sys.channel.edit',
                            method: 'POST',
                            data: params,
                        }).then((res) => {
                            this.$AudaqueToast.tip({
                                template: `修改成功`,
                                methods: {
                                    okEvent() {
                                        _this.$router.go(-1);
                                    },
                                },
                            });
                        });
                    } else {
                        this._AJAX({
                            url: 'news.sys.channel.new',
                            method: 'POST',
                            data: params,
                        }).then((res) => {
                            this.$AudaqueToast.tip({
                                template: `新增成功`,
                                methods: {
                                    okEvent() {
                                        _this.$router.go(-1);
                                    },
                                },
                            });
                        });
                    }
                } else {
                    return false;
                }
            });
        },
    },
};
</script>
