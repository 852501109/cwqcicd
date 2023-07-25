<template>
    <div class="audaque-nav-menu">
        <el-menu
            :default-active="path"
            style="width: 200px"
            background-color="#1E2936"
            text-color="#94A6BF"
            active-text-color="#fff"
        >
            <template v-for="(item, index) in data">
                <el-submenu v-if="item.children && item.children.length > 0" :index="index + ''" :key="index">
                    <template slot="title">
                        <i class="iconfont" :class="item.icon || 'main-biaoqian1'" style="color: #94a6bf"></i>
                        <span style="padding-left: 8px">{{ item.name }}</span>
                    </template>

                    <template v-for="(innerItem, innerIndex) in item.children">
                        <el-submenu
                            v-if="innerItem.children && innerItem.children.length > 0"
                            :index="index + '-' + innerIndex"
                            :key="innerIndex"
                        >
                            <template slot="title">{{ innerItem.name }}</template>
                            <el-menu-item
                                v-for="(thridItem, thridIndex) in innerItem.children"
                                :index="thridItem.route"
                                @click="submenuItemClick(thridItem)"
                                :key="thridIndex"
                            >
                                {{ thridItem.name }}
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item
                            v-else
                            :index="innerItem.route"
                            :key="innerIndex"
                            @click="submenuItemClick(innerItem)"
                        >
                            {{ innerItem.name }}
                        </el-menu-item>
                    </template>
                </el-submenu>
                <el-menu-item v-else @click="submenuItemClick(item)" :index="item.route" :key="index">
                    {{ item.name }}
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script>
export default {
    name: 'AudaqueNavMenu',
    mixins: [],

    data() {
        return {};
    },

    props: {
        data: {
            type: Array,
            default: () => {
                return [];
            },
        },

        //显示的路由
        path: {
            type: String,
        },
    },

    components: {},

    watch: {},

    computed: {},

    created() {},

    mounted() {},

    methods: {
        /**
         * 点击事件
         */
        submenuItemClick(item) {
            this.$emit('item-click', item);
        },
    },

    beforeDestroy() {},
};
</script>
<style lang="scss">
.audaque-nav-menu {
    height: 100%;
    overflow: auto;
}
//右边箭头
.el-icon-arrow-down:before {
    color: #94a6bf;
}
</style>
<style lang="scss" scoped>
::v-deep .el-menu {
    //高度
    height: 100%;
    .el-submenu__title,
    .el-menu-item {
        height: 50px;
        line-height: 50px;
    }
    .el-menu-item:hover {
        background-color: #395370 !important;
    }
    // 选中样式
    .el-menu-item.is-active {
        background-color: #395370 !important;
        position: relative;
    }
    .el-menu-item.is-active::before {
        border-left-color: #008aff;
        border-left-width: 3px;
        border-left-style: solid;
        display: block;
        content: '';
        height: 100%;
        left: 0;
        position: absolute;
    }
}
</style>
