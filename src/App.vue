<template>
    <div id="app">
        <!-- <keep-alive :exclude="keep"> -->
        <router-view></router-view>
        <!-- </keep-alive> -->
        <!--<router-view v-if="!$route.meta.keepAlive"></router-view>-->
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
    data() {
        return {
            loading: null,
            isRouterAlive: true,
        };
    },
    name: 'App',
    provide() {
        return {
            reload: this.reload,
        };
    },
    computed: {
        ...mapState(['isFetching']),
    },
    watch: {
        isFetching(val) {
            if (val) {
                // this.loading = this.$loading({lock: true})
            } else {
                this.$nextTick(() => {
                    // this.loading && this.loading.close()
                });
            }
        },
    },
    methods: {
        reload() {
            this.isRouterAlive = false;
            this.$nextTick(function () {
                this.isRouterAlive = true;
            });
        },
    },
};
</script>
