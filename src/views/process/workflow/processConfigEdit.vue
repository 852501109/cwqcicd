<template>
    <audaque-detail-form-page @submit-click="submitForm" :title="formTitle" :opt-type="optType">
        <process-config-public ref="processConfig" :opt-type="optType" :id="id"> </process-config-public>
    </audaque-detail-form-page>
</template>
<script>
import { mapActions } from 'vuex';
import processConfigPublic from './processConfigPublic';

export default {
    data() {
        return {
            formTitle:
                this.$route.query.optType === 'edit'
                    ? '编辑流程模型'
                    : this.$route.query.optType === 'view'
                    ? '查看流程模型'
                    : '新增流程模型',
            optType: this.$route.query.optType,
            id: this.$route.query.id,
        };
    },
    created() {},
    components: { processConfigPublic },
    methods: {
        ...mapActions(['_AJAX']),
        submitForm() {
            this.$refs.processConfig.submitForm();
        },
    },
};
</script>
