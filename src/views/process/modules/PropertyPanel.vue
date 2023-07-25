<template>
    <div class="property-panel" ref="propertyPanel">
        <el-form :inline="true" :model="form" label-width="100px" size="small" label-position="left">
            <el-form-item label="节点ID">
                <el-input v-model.trim="form.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="节点名称">
                <el-input v-model.trim="form.name" type="textarea" autosize @input="nameChange"></el-input>
            </el-form-item>
            <el-form-item v-if="sequenceFlow" label="分支条件">
                <el-input v-model.trim="form.sequenceFlow" type="textarea" @input="updateSequenceFlow"></el-input>
            </el-form-item>
            <!--            <el-form-item label="节点颜色">-->
            <!--                <el-color-picker v-model="form.color" @active-change="colorChange"></el-color-picker>-->
            <!--            </el-form-item>-->
            <!-- 任务节点允许选择人员 -->
            <!--            <el-form-item label="节点人员" v-if="userTask">-->
            <!--                <el-select v-model="form.userType" placeholder="请选择" @change="typeChange">-->
            <!--                    <el-option value="assignee" label="指定人员"></el-option>-->
            <!--                    <el-option value="candidateUsers" label="候选人员"></el-option>-->
            <!--                    <el-option value="candidateGroups" label="角色/岗位"></el-option>-->
            <!--                </el-select>-->
            <!--            </el-form-item>-->
            <!-- 指定人员 -->
            <!--            <el-form-item label="指定人员" v-if="userTask && form.userType === 'assignee'">-->
            <!--                <el-select-->
            <!--                    v-model="form.assignee"-->
            <!--                    placeholder="请选择"-->
            <!--                    key="1"-->
            <!--                    @change="(value) => addUser({ assignee: value })"-->
            <!--                >-->
            <!--                    <el-option-->
            <!--                        v-for="item in users"-->
            <!--                        :key="item.value"-->
            <!--                        :label="item.label"-->
            <!--                        :value="item.value"-->
            <!--                    ></el-option>-->
            <!--                </el-select>-->
            <!--            </el-form-item>-->
            <!-- 候选人员 -->
            <!--            <el-form-item label="候选人员" v-else-if="userTask && form.userType === 'candidateUsers'">-->
            <!--                <el-select-->
            <!--                    v-model="form.candidateUsers"-->
            <!--                    placeholder="请选择"-->
            <!--                    key="2"-->
            <!--                    multiple-->
            <!--                    @change="(value) => addUser({ candidateUsers: value.join(',') || value })"-->
            <!--                >-->
            <!--                    <el-option-->
            <!--                        v-for="item in users"-->
            <!--                        :key="item.value"-->
            <!--                        :label="item.label"-->
            <!--                        :value="item.value"-->
            <!--                    ></el-option>-->
            <!--                </el-select>-->
            <!--            </el-form-item>-->
            <!-- 角色/岗位 -->
            <!--            <el-form-item label="角色/岗位" v-else-if="userTask && form.userType === 'candidateGroups'">-->
            <!--                <el-select-->
            <!--                    v-model="form.candidateGroups"-->
            <!--                    placeholder="请选择"-->
            <!--                    @change="(value) => addUser({ candidateGroups: value })"-->
            <!--                >-->
            <!--                    <el-option-->
            <!--                        v-for="item in roles"-->
            <!--                        :key="item.value"-->
            <!--                        :label="item.label"-->
            <!--                        :value="item.value"-->
            <!--                    ></el-option>-->
            <!--                </el-select>-->
            <!--            </el-form-item>-->
            <!--sequenceFlow-->
            <!-- 分支允许添加条件 -->
            <!--            <el-form-item label="分支条件" v-if="sequenceFlow">-->
            <!--                <el-select v-model="form.user" placeholder="请选择">-->
            <!--                    <el-option-->
            <!--                        v-for="item in users"-->
            <!--                        :key="item.value"-->
            <!--                        :label="item.label"-->
            <!--                        :value="item.value"-->
            <!--                    ></el-option>-->
            <!--                </el-select>-->
            <!--            </el-form-item>-->
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'PropertyPanel',
    props: {
        modeler: {
            type: Object,
            required: true,
        },
    },
    computed: {
        userTask() {
            if (!this.element) {
                return;
            }
            return this.element.type === 'bpmn:UserTask';
        },
        sequenceFlow() {
            if (!this.element) {
                return;
            }
            return (
                this.element.type === 'bpmn:SequenceFlow' ||
                (this.element.id && this.element.id.indexOf('SequenceFlow') != -1)
            );
        },
    },
    data() {
        return {
            form: {
                id: '',
                name: '',
                color: null,
                sequenceFlow: null,
            },
            element: {},
            users: [
                {
                    value: 'zhangsan',
                    label: '张三',
                },
                {
                    value: 'lisi',
                    label: '李四',
                },
                {
                    value: 'wangwu',
                    label: '王五',
                },
            ],
            roles: [
                {
                    value: 'manager',
                    label: '经理',
                },
                {
                    value: 'personnel',
                    label: '人事',
                },
                {
                    value: 'charge',
                    label: '主管',
                },
            ],
        };
    },
    mounted() {
        this.handleModeler();
    },
    methods: {
        handleModeler() {
            // 监听节点选择变化
            this.modeler.on('selection.changed', (e) => {
                const element = e.newSelection[0];
                this.element = element;
                if (!element) return;
                this.form = {
                    ...element.businessObject,
                    ...element.businessObject.$attrs,
                };
                if (this.form.userType === 'candidateUsers') {
                    this.form['candidateUsers'] = this.form['candidateUsers'].split(',') || [];
                }
                //点击线条
                if (element.type === 'bpmn:SequenceFlow' && element.businessObject.conditionExpression) {
                    //分支条件回显
                    this.$set(this.form, 'sequenceFlow', element.businessObject.conditionExpression.body);
                }
                //点击线条上面的文字
                if (
                    element.businessObject.conditionExpression &&
                    element.id &&
                    element.id.indexOf('SequenceFlow') != -1
                ) {
                    //分支条件回显
                    this.$set(this.form, 'sequenceFlow', element.businessObject.conditionExpression.body);
                }
            });

            //  监听节点属性变化
            this.modeler.on('element.changed', (e) => {
                const { element } = e;
                if (!element) return;
                let businessObject = element.businessObject;
                //  新增节点需要更新回属性面板
                if (element.id === this.form.id) {
                    this.form.name = element.businessObject.name;
                    this.form.sequenceFlow = businessObject.conditionExpression
                        ? businessObject.conditionExpression.body
                        : ''; //表达式
                    this.form = { ...this.form };
                }
            });
        },
        // 属性面板名称，更新回流程节点
        nameChange(name) {
            const modeling = this.modeler.get('modeling');
            modeling.updateLabel(this.element, name);
        },
        // 属性面板颜色，更新回流程节点
        colorChange(color) {
            const modeling = this.modeler.get('modeling');
            modeling.setColor(this.element, {
                fill: null,
                stroke: color,
            });
            modeling.updateProperties(this.element, { color: color });
        },
        // 任务节点配置人员
        addUser(properties) {
            this.updateProperties(
                Object.assign(properties, {
                    userType: Object.keys(properties)[0],
                })
            );
        },
        // 切换人员类型
        typeChange() {
            const types = ['assignee', 'candidateUsers', 'candidateGroups'];
            types.forEach((type) => {
                delete this.element.businessObject.$attrs[type];
                delete this.form[type];
            });
        },
        // 在这里我们封装一个通用的更新节点属性的方法
        updateProperties(properties) {
            const modeling = this.modeler.get('modeling');
            modeling.updateProperties(this.element, properties);
        },
        updateSequenceFlow(val) {
            let newCondition = this.modeler.get('moddle').create('bpmn:FormalExpression', {
                body: val,
            });
            this.updateProperties({ conditionExpression: newCondition });
        },
    },
};
</script>

<style lang="scss" scoped>
.property-panel {
    position: absolute;
    right: 0px;
    top: 0px;
    border-left: 1px solid #cccccc;
    padding: 20px;
    width: 220px;
    height: 100%;
    /deep/.el-textarea__inner {
        min-height: 60px !important;
    }
}
</style>
