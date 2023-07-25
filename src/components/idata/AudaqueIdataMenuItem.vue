<template>
    <div
        class="audaque-idata-menu-item"
        :class="{ 'audaque-idata-menu-item__is-active': active }"
        @click="submenuItemClick"
    >
        <slot>
            <span>{{ name }}</span>
        </slot>
    </div>
</template>

<script>
import emitter from '@/mixins/emitter';
export default {
    mixins: [emitter],

    name: 'AudaqueIdataMenuItem',

    componentName: 'AudaqueIdataMenuItem',

    props: {
        //唯一标识
        index: {
            default: null,
            validator: (val) => typeof val === 'string' || val === null,
        },
        //是否是选中的菜单
        active: {
            type: Boolean,
            default: false,
        },
        //名称
        name: {
            type: String,
        },
        //路由
        path: {
            type: String,
            require: true,
        },
    },

    computed: {},

    mounted() {
        this.dispatch('AudaqueIdataMenu', 'audaque.submenu.additem', [this]);
    },

    methods: {
        submenuItemClick() {
            this.$emit('menu-item-click');
        },
    },
};
</script>

<style lang="scss" scoped>
.audaque-idata-menu-item {
    box-sizing: border-box;
    align-items: center;
    font-size: 14px;
    color: #6c7280;
    line-height: 40px;
    padding-left: 6px;
    //padding: 10px 10px 10px 10px;
    border-left: 2px solid #dfe1e6;
    cursor: pointer;
    white-space: normal;

    &:hover {
        box-shadow: 1px 0 14px 0 rgba(213, 219, 236, 0.5);
    }
}

.audaque-idata-menu-item__is-active {
    color: $audaque-color-main;
    //background-color: #ecf3fe;
    //border-left-color: $audaque-color-main;
}
</style>
