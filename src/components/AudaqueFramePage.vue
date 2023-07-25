<!-- 主框架布局 -->
<template>
    <div class="audaque-frame-page">
        <div v-if="isShowMenu && showNav && isAdmin">
            <!-- 菜单栏 -->
            <audaque-menu
                v-if="layoutTheme === 1"
                :show-more="showMore"
                :project-list="projectList"
                :default-active="currentIndex"
                :data="menuList"
                @menu-click="onMeunItemClick"
                :props="props"
                @product-click="onProductClick"
            ></audaque-menu>

            <!-- 新布局所有菜单 -->
            <audaque-nav-menu
                v-else-if="layoutTheme === 2"
                @item-click="(item) => onItemClick(item, 1)"
                :data="data"
                :path="path"
            ></audaque-nav-menu>

            <!-- idata菜单 -->
            <audaque-idata-menu
                v-else-if="layoutTheme === 5"
                :title="applicationName"
                @item-click="(item) => onItemClick(item, 2)"
                :url-key="urlKey"
                :data="data"
                :path="path"
            ></audaque-idata-menu>
        </div>
        <div
            class="main-layout"
            :class="[
                isAdmin ? '' : 'custom-operator',
                !isAdmin && $route.path !== '/main' ? 'custom-operator-body' : '',
            ]"
        >
            <!-- 导航栏 -->
            <slot v-if="showHeader" name="toolbar"></slot>
            <div class="middle-layout">
                <!-- 二级菜单 -->
                <!-- <div v-if="isShowSubMenu && showMenu"> -->
                <div v-if="isAdmin">
                    <audaque-submenu
                        ref="submenu"
                        :url-key="urlKey"
                        :data="submenuList"
                        :title="title"
                        :path="decodeURI(this.$route.fullPath)"
                        @submenu-click="(item) => onItemClick(item, 3)"
                    ></audaque-submenu>
                </div>

                <!-- 主内容区域 -->
                <div class="content-layout">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AudaqueNavMenu from '@/components/AudaqueNavMenu';
import AudaqueIdataMenu from '@/components/idata/AudaqueIdataMenu';

export default {
    name: 'AudaqueFramePage',
    mixins: [],

    data() {
        return {
            currentIndex: 0, //一级菜单选中位置
            spreadTreeNodes: [], //展开的菜单树 格式为{order:[],path},order为树的下标路径，path为最后的路径
            menuList: [], //一级菜单列表
            banners: {}, //所有二级菜单列表
            submenuList: [], //对应二级菜单列表
            title: '', // 二级菜单标题
            isSwitchProduct: false, //是否切换应用
        };
    },

    props: {
        // 主页面布局 1(现有布局) 2(左侧菜单栏，右侧导航栏加主布局) 3(菜单栏和导航栏在上，主布局在下)
        // 4(导航栏在上，下面菜单栏和主布局) 5(idata菜单)
        layoutTheme: {
            type: Number,
            default: 1,
        },
        applicationName: {
            type: String,
        },
        //默认icon-class
        menuIconClass: {
            type: String,
            default: '',
        },

        // 导航栏
        showHeader: {
            type: Boolean,
            default: true,
        },
        // 一级菜单栏
        showNav: {
            type: Boolean,
            default: true,
        },
        // 二级菜单栏
        showMenu: {
            type: Boolean,
            default: true,
        },
        //菜单内容
        data: {
            type: Array,
            required: true,
            default() {
                return [];
            },
        },

        //项目列表数据
        projectList: {
            type: Array,
            required: true,
            default() {
                return [];
            },
        },
        //显示更多项目菜单
        showMore: {
            type: Boolean,
            default: true,
        },
        // url对应的key,后台的数据格式不一致，前端做的处理
        urlKey: {
            type: String,
            default: 'url',
        },
        //属性兼容老平台项目和微服务
        props: {
            type: Object,
            default: () => {
                return { name: 'name', children: 'systems', id: 'mainUrl' };
            },
        },
        //当前url路径 ==>/monitor/target/applicationServerManagement
        path: {
            type: String,
        },
    },

    components: {
        AudaqueIdataMenu,
        AudaqueNavMenu,
    },

    watch: {
        //监听数据的变化
        data: {
            handler(val) {
                if (this.layoutTheme === 1) {
                    //重置菜单数据
                    this.handleMenuData(val);
                }
                // 还原权限
                this.restorePermission();
                //微服务才有通过id切换应用
                if (this.isSwitchProduct && this.urlKey === 'route') {
                    const menuItem = { index: 0, item: this.menuList[0] };
                    this.onMeunItemClick(menuItem);
                    this.isSwitchProduct = false;
                }
            },
        },
    },

    computed: {
        //是否显示左侧菜单
        isShowMenu() {
            return [1, 2, 5].includes(this.layoutTheme);
        },
        //是否显示二级菜单
        isShowSubMenu() {
            return [1, 4].includes(this.layoutTheme) || this.showSubmenu;
        },
        isAdmin() {
            return window.currentUserRole === 'bdAdmin' || window.currentUserRole === 'orgAdmin';
        },
    },

    created() {},

    mounted() {},

    methods: {
        handleMenuPositon(path) {
            if (this.menuList.length > 0) {
                let menuListedLastPath = sessionStorage.getItem('menuListedLastPath');
                let moduleFindByCache = this.findModuleByPath(menuListedLastPath), //根据sessionStorage 存值进行查找
                    moduleFindByRoute = this.findModuleByPath(path); //根据route path 进行查找
                //设置默认值-1,解决首页不在菜单中的bug
                let findModule = moduleFindByRoute || moduleFindByCache || { order: [0], path: '' };
                //一级菜单显示的位置
                this.currentIndex = findModule.order[0];
                //二级菜单数据
                if (this.currentIndex < 0) {
                    this.submenuList = [];
                } else {
                    this.submenuList = this.banners[this.menuList[this.currentIndex].id];
                    this.title = this.menuList[this.currentIndex].name;
                }
            }
        },
        /**
         * 菜单点击事件
         */
        onItemClick(item, type) {
            this.$emit('item-click', item, type);
        },

        /**
         * 产品点击事件
         */
        onProductClick(item) {
            this.isSwitchProduct = true;
            this.$emit('product-click', item);
        },

        /**
         * 一级菜单点击事件 layoutTheme 为1的点击事件
         * 点击同一个菜单，二级菜单收起来
         * @param meunInfo 菜单信息
         */
        onMeunItemClick(meunInfo) {
            // TODO 优化此代码逻辑
            const item = meunInfo.item;
            //页面路由
            const path = item[this.urlKey];
            this.title = meunInfo.item.name;
            if (path) {
                //没有二级菜单，直接加载出页面
                this.$refs.submenu.close();
                //this.goto(path);
                this.submenuList = [];
                this.$emit('item-click', item);
            } else {
                //点击的是同一个菜单
                if (this.currentIndex === meunInfo.index && !this.isSwitchProduct) {
                    this.$refs.submenu.toggleSubmenu();
                } else {
                    //获取一级菜单的二级子菜单
                    this.submenuList = this.banners[item.id];
                    if (this.submenuList && this.submenuList.length > 0) {
                        this.$refs.submenu.open();
                        //只有二级菜单
                        const submenu = this.submenuList[0];
                        const thrSubmenu = submenu.children;
                        if (submenu[this.urlKey]) {
                            //this.goto(submenu.route);
                            //设置页面权限
                            //this.handlePermission(submenu);
                            this.$emit('item-click', submenu);
                            this.$emit('page-permission', submenu);
                        } else if (thrSubmenu[0][this.urlKey]) {
                            this.$emit('item-click', thrSubmenu[0]);
                            this.$emit('page-permission', thrSubmenu[0]);
                        } else {
                            //三级菜单的第一个模块
                            const firstModule = this.submenuList[0].children[0];
                            //this.goto(firstModule.route);
                            this.$emit('item-click', firstModule);
                            //设置页面权限
                            this.$emit('page-permission', firstModule);
                            //this.handlePermission(firstModule);
                        }
                    } else {
                        this.$refs.submenu.close();
                    }
                }
            }

            this.currentIndex = meunInfo.index;
        },

        /**
         * 初始化菜单
         * @data {Array} 菜单数据
         */
        handleMenuData(data) {
            //得到系统下所有的菜单一维数组
            this.spreadTree(data);

            //设置一级导航栏数据
            this.menuList = (data || []).map((item) => {
                this.banners[item.id] = item.children || [];
                return {
                    name: item.name,
                    id: item.id,
                    simpleName: item.simpleName || item.name,
                    iconClass: item.icon ? item.icon : this.menuIconClass,
                    url: item[this.urlKey],
                    [this.urlKey]: item[this.urlKey],
                };
            });
            //点击菜单就存点击的路由值，防止编辑等其它页面，不在返回菜单中无法找到问题
            let menuListedLastPath = sessionStorage.getItem('menuListedLastPath');
            let moduleFindByCache = this.findModuleByPath(menuListedLastPath), //根据sessionStorage 存值进行查找
                moduleFindByRoute = this.findModuleByPath(this.$route.path); //根据route path 进行查找
            let findModule = moduleFindByRoute || moduleFindByCache || { order: [0], path: '' };

            this.currentIndex = findModule.order[0];
            //二级菜单菜单数据
            if (this.currentIndex < 0) {
                //二级菜单
                this.submenuList = [];
            } else {
                //二级菜单
                this.submenuList = this.banners[this.menuList[this.currentIndex].id];
                this.title = (data || [])[this.currentIndex].name;
            }
        },

        switchProduct() {},

        /**
         * 还原权限
         */
        restorePermission() {
            this.$emit('restore-permission', this.path);
        },

        //通过当前路由找到当前路由所属的模块
        findModuleByPath(path) {
            //找到路由的链信息
            let module = this.spreadTreeNodes.find((item) => item.path === path);
            return module;
        },

        /**
         * 菜单的路由和对应的位置信息
         */
        spreadTree(tree = [], order = []) {
            for (let i = 0; i < tree.length; i++) {
                if (tree[i].children && tree[i].children.length > 0) {
                    this.spreadTree(tree[i].children, [...order, i]);
                } else {
                    this.spreadTreeNodes.push({ order: [...order, i], path: tree[i][this.urlKey] });
                }
            }
        },

        /**
         * 处理按钮权限 存放到store中
         * @param permissions 权限列表
         */
        handlePermission(item) {
            const permissions = item.permissions;
            this.SET_PERMISSION(permissions);
        },
    },

    beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
::v-deep .audaque-table-list-page {
    height: calc(100% - 36px) !important;
}
.audaque-frame-page {
    display: flex;
    flex-direction: row;
    height: 100%;
    .main-layout {
        flex: 1;
        display: flex;
        flex-direction: column;

        .middle-layout {
            flex: 1;
            display: flex;
            height: 0;

            .content-layout {
                flex: 1;
                background-color: $audaque-color-background;
                width: 0;
                .audaque-table-list-page {
                    height: calc(100% - 36px) !important;
                }
            }
        }
    }
}
.custom-operator {
    ::v-deep .audaque-tool-bar {
        padding-top: 2vh;
        display: flex;
        align-items: flex-start;
        width: 100%;
        height: 25vh;
        background-image: url('~@/assets/images/main-bg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center center;
    }
}
// .custom-operator-body {
//     ::v-deep .middle-layout {
//         position: absolute;
//         width: 90%;
//         height: 76%;
//         left: 50%;
//         top: 14vh;
//         transform: translate(-50%);
//         z-index: 99;
//     }
//     ::v-deep .audaque-table-title {
//         padding: 10px;
//     }
// }
</style>
