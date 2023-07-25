<template>
    <div class="audaque-idata-menu">
        <div class="app-name-layout">{{ title }}</div>

        <div class="menu-layout">
            <audaque-idata-menu-item-group
                @menu-group-click="goPage(item)"
                v-for="(item, index) in data"
                :index="index.toString()"
                :key="item.id"
                :active="item[urlKey] === path"
                :isGroup="!!item[urlKey]"
                :name="item.name"
            >
                <!-- 只有二级菜单  -->
                <template v-for="(groupItem, groupIndex) in item.children">
                    <audaque-idata-menu-item
                        v-if="groupItem[urlKey]"
                        class="item-layout"
                        :index="index + '-' + groupIndex"
                        :key="groupItem.id"
                        :active="groupItem[urlKey] === path"
                        :name="groupItem.name"
                        @menu-item-click="goPage(groupItem)"
                        :path="groupItem[urlKey]"
                    ></audaque-idata-menu-item>

                    <!-- 三级菜单 -->
                    <audaque-idata-menu-item-group
                        v-else
                        class="submenu-group-layout"
                        :index="index + '-' + groupIndex"
                        :key="groupItem.id"
                        :active="groupItem[urlKey] === path"
                        :isGroup="!!groupItem[urlKey]"
                        :name="groupItem.name"
                        @menu-group-click="goPage(groupItem)"
                    >
                        <audaque-idata-menu-item
                            class="item-layout"
                            v-for="(innerItem, innerIndex) in groupItem.children"
                            :index="index + '-' + groupIndex + '-' + innerIndex"
                            :key="innerItem.id"
                            :active="innerItem[urlKey] === path"
                            :name="innerItem.name"
                            :path="innerItem[urlKey]"
                            @menu-item-click="goPage(innerItem)"
                        ></audaque-idata-menu-item>
                    </audaque-idata-menu-item-group>
                </template>
            </audaque-idata-menu-item-group>
        </div>
    </div>
</template>

<script>
import AudaqueIdataMenuItemGroup from './AudaqueIdataMenuItemGroup';
import AudaqueIdataMenuItem from './AudaqueIdataMenuItem';
export default {
    name: 'AudaqueIdataMenu',

    componentName: 'AudaqueIdataMenu',

    components: {
        AudaqueIdataMenuItemGroup,
        AudaqueIdataMenuItem,
    },

    computed: {},

    watch: {},

    props: {
        //项目名称
        title: {
            type: String,
            required: true,
        },

        //数据
        data: {
            type: Array,
            default: () => {
                [];
            },
        },

        // url对应的key,后台的数据格式不一致，前端做的处理
        urlKey: {
            type: String,
            default: 'url',
        },

        //当前url路径(或者是上一次点击菜单的路由) ==>/monitor/target/applicationServerManagement
        path: {
            type: String,
        },

        //当前激活菜单的
        defaultActive: {
            type: String,
        },
    },

    data() {
        return {
            groupList: [], //分组元素
            itemList: [], //可点击元素列表
        };
    },

    created() {
        this.$on('audaque.submenu.addgroup', (group) => {
            if (group) {
                this.groupList.push(group);
            }
        });
        this.$on('audaque.submenu.additem', (item) => {
            if (item) {
                this.itemList.push(item);
            }
        });
    },

    beforeUpdate() {
        //this.initOpenedMenu();
    },

    mounted() {
        setTimeout(() => {
            this.initOpenedMenu();
        }, 50);
    },

    methods: {
        /**
         * 跳转到对应的页面
         * @param item 当前菜单节点信息
         */
        goPage(item) {
            console.log(item);
            this.$emit('item-click', item);
        },

        /**
         * 初始化展开菜单
         */
        initOpenedMenu() {
            //找到对应的节点
            const choiceItem = this.itemList.find((item) => {
                return item.path === this.path;
            });
            if (choiceItem) {
                let parent = choiceItem.$parent || choiceItem.$root;
                let name = parent.$options.componentName;
                //递归所有父节点为AudaqueIdataMenuItemGroup组件，设置展开
                while (parent && (!name || name === 'AudaqueIdataMenuItemGroup')) {
                    //设置父菜单展开
                    parent.expandAll = true;
                    parent = parent.$parent;
                    if (parent) {
                        name = parent.$options.componentName;
                    }
                }
            }
        },
    },

    destroyed() {},
};
</script>

<style lang="scss" scoped>
.audaque-idata-menu {
    $left-distance: 14px;
    width: 250px;
    display: flex;
    flex-direction: column;
    background: white;
    height: 100%;
    overflow: auto;
    .app-name-layout {
        position: relative;
        font-weight: 700;
        color: #282b33;
        font-size: 20px;
        text-align: left;
        padding: 22px 36px 22px 22px;
        margin-bottom: 10px;
        //border-bottom: 1px dashed $audaque-color-halving-line;
        &::after {
            position: absolute;
            bottom: 0;
            content: '';
            border: dashed #dfe1e6;
            border-width: 0 0 1px;
            left: 20px;
            right: 36px;
        }
    }
    .menu-layout {
        padding-left: 20px;
        padding-right: 10px;
        .submenu-group-layout {
            padding-left: $left-distance;
        }
        .item-layout {
            margin-left: $left-distance;
        }
    }
}
</style>
