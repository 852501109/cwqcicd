import { mapState, mapMutations } from 'vuex';
export default {
    data() {
        return {
            adqSearchListMixin: {}, //要存储的参数
            adqIsQuote: true, //初始化渲染的标记
            adqIsStoreMixin: true, // 是否存储参数对象  默认为true
            adqPathMixin: this.$route.path, //当前页面路由
        };
    },

    computed: {
        ...mapState(['storeSearch']),
    },

    created() {},

    methods: {
        ...mapMutations(['SET_STORE_SEARCH']),
        /*
         * 参数回显
         * */
        parameterEchoMixin() {
            if (this.adqIsStoreMixin && this.adqIsQuote && this.storeSearch[this.adqPathMixin]) {
                for (let key in this.storeSearch[this.adqPathMixin]) {
                    let item = this.storeSearch[this.adqPathMixin][key];
                    this[key] = item;
                }
                this.adqIsQuote = false;
            }
        },
    },

    beforeDestroy() {
        this.SET_STORE_SEARCH({ key: this.adqPathMixin, value: this.adqSearchListMixin }); //将参数存入store
        this.adqIsQuote = false;
    },
};
