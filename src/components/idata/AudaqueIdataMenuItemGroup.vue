<template>
    <div class="audaque-idata-menu-item-group">
        <div
            class="audaque-idata-menu-item-group__content"
            :class="{ 'audaque-idata-menu-item-group__content--is-active': active }"
        >
            <!-- 二级可点击的标题 -->
            <div
                v-if="isGroup"
                class="click-title-layout"
                :class="{ 'click-title-layout--is-active': active }"
                @click="handleClick"
            >
                <slot name="clickTitle">
                    <span>{{ name }}</span>
                </slot>
            </div>

            <div v-else class="title-layout" @click="expandAll = !expandAll">
                <div class="title-content">
                    <slot name="title">
                        <span>{{ name }}</span>
                    </slot>
                </div>
                <i :class="['iconfront', expandAll ? 'el-icon-caret-bottom' : 'el-icon-caret-right']" />
            </div>
        </div>

        <div v-show="expandAll">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import emitter from '@/mixins/emitter';
export default {
    mixins: [emitter],

    name: 'AudaqueIdataMenuItemGroup',

    componentName: 'AudaqueIdataMenuItemGroup',

    data() {
        return {
            //是否展开所有子项
            expandAll: false,
        };
    },

    watch: {
        // active: {
        //     immediate: true,
        //     handler(val) {
        //         if (val) {
        //             this.expandAll = true;
        //         }
        //     }
        // }
    },

    props: {
        //唯一标识
        index: {
            default: null,
            validator: (val) => typeof val === 'string' || val === null,
        },

        //标题
        title: {
            type: String,
        },

        //是否是选中的菜单
        active: {
            type: Boolean,
            default: false,
        },

        //是否为分组
        isGroup: {
            type: Boolean,
        },

        //名称
        name: {
            type: String,
        },

        //是否显示子菜单
        // showList:{
        //     type: Boolean,
        //     default: true,
        // },
    },

    mounted() {
        this.dispatch('AudaqueIdataMenu', 'audaque.submenu.addgroup', [this]);
    },

    methods: {
        expandAllSubmenu() {
            this.expandAll = true;
        },

        /**
         * 可点击的二级菜单
         */
        handleClick() {
            this.$emit('menu-group-click');
        },
    },
};
</script>

<style lang="scss" scoped>
.audaque-idata-menu-item-group {
    width: 100%;
    .audaque-idata-menu-item-group__content {
        color: #c2c7d3;
        font-weight: bold;
        height: 40px;
        display: flex;
        font-size: 14px;
        align-items: center;

        .title-layout {
            width: 100%;
            color: #6c7280;
            font-size: 14px;
            //padding-left: 20px;
            //padding-right: 10px;
            font-weight: normal;
            display: flex;

            .title-content {
                flex: 1;
            }

            .el-icon-arrow-right::before,
            .el-icon-arrow-down::before {
                padding-right: 1px;
            }
        }

        .click-title-layout {
            width: 100%;
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            color: #282b33;
            font-size: 14px;
            font-weight: bold;
            //padding: 0 5px;
            &:hover {
                box-shadow: 1px 0 14px 0 rgba(213, 219, 236, 0.5);
            }
        }

        .click-title-layout--is-active {
            color: $audaque-color-main;
        }
    }

    .audaque-idata-menu-item-group--is-active {
        color: $audaque-color-main;
        background-color: #ecf3fe;
        border-left-color: $audaque-color-main;
    }
}
</style>
