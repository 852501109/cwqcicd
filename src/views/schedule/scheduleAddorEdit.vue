<template>
    <audaque-detail-form-page @submit-click="submitClick" :title="`${$route.query.optType == 'add'? '新增': '编辑'}策略`"
                              :opt-type="$route.query.optType">
        <el-form
                :model="form"
                :rules="rules"
                label-width="100px"
                ref="form"
        >
            <el-form-item
                    label="策略名称"
                    prop="name"
            >
                <el-input v-model.trim="form.name"></el-input>
            </el-form-item>
            <el-form-item label="cron表达式">
                <div style="position:relative;">
                    <cron v-model="form.cronExpression"></cron>
                </div>
            </el-form-item>
            <el-form-item
                    label="策略说明"
                    prop="remark"
            >
                <el-input
                        type="textarea"
                        v-model.trim="form.remark"
                ></el-input>
            </el-form-item>
        </el-form>
    </audaque-detail-form-page>
</template>

<script>
    import {mapActions} from 'vuex'
    import cron from '@/components/cron'

    export default {
        data() {
            return {
                form: {
                    name: '',
                    cronExpression: '',
                    remark: '',
                    type: 3
                },
                rules: {
                    name: [
                        {required: true, message: '请输入策略名称', trigger: 'blur'},
                        {min: 3, message: '长度在3个字符以上', trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: '请填写策略说明', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            if (this.$route.query.optType == 'edit') {
                let data = JSON.parse(this.$route.query.data)
                this.form.name = data.name
                this.form.cronExpression = data.cronExpression ? data.cronExpression : ''
                this.form.remark = data.remark
                this.form.id = data.id
            }
        },
        components: {cron},
        methods: {
            ...mapActions('schedule', ['addStrategy', 'modifyStrategy']),
            submitClick() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        if (this.$route.query.optType == 'add') {
                            this.addStrategy(this.form).then(re => {
                                if (re.success) {
                                    let _this = this;
                                    this.$AudaqueToast.tip({
                                        template: `新增策略成功`,
                                        methods: {
                                            okEvent() {
                                                _this.$router.go(-1)
                                            }
                                        }
                                    });
                                }
                            })
                        }
                        else {
                            this.modifyStrategy(this.form).then(re => {
                                if (re.success) {
                                    let _this = this;
                                    this.$AudaqueToast.tip({
                                        template: `修改策略成功`,
                                        methods: {
                                            okEvent() {
                                                _this.$router.go(-1)
                                            }
                                        }
                                    });
                                }
                            })
                        }
                    }
                })

            }
        }
    }
</script>

<style lang="scss" scoped>
    .main {
        padding: 20px;
    }
</style>
