import { mapState } from 'vuex';
export default {
    computed: {
        ...mapState(['permitList', 'isSHowButtonLoading']),
    },
    methods: {},
};
