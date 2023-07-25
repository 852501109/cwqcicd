<template>
    <audaque-detail-form-page @submit-click="submitForm" :title="formTitle" :opt-type="isOptType">
        <node-config-public
            ref="nodeConfigPublic"
            :procDefId="procDefId"
            :opt-type="$route.query.optType"
            @get-opt-type="getOptType"
        ></node-config-public>
    </audaque-detail-form-page>
</template>
<script>
import { mapActions } from 'vuex';
import nodeConfigPublic from './nodeConfigPublic';

export default {
    components: { nodeConfigPublic },
    data() {
        return {
            formTitle: '流程节点配置',
            procDefId: this.$route.query.procDefId,
            isOptType: this.$route.query.optType,
        };
    },
    created() {},
    methods: {
        ...mapActions(['_AJAX']),
        submitForm() {
            this.$refs.nodeConfigPublic.submitForm();
        },
        getOptType(val) {
            this.isOptType = val;
        },
    },
};
</script>
