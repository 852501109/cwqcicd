<template>
    <div class="adq-tabs">
        <el-tabs
            v-model="editableTabsValue"
            :type="type"
            :tab-position="tabPosition"
            :editable="editable"
            :closable="closable"
            @tab-click="handleClick"
            @edit="handleTabsEdit"
        >
            <el-tab-pane
                v-for="(item, index) in options"
                :key="index"
                :label="item.label"
                :name="item.name"
                style="height: 100px"
            >
                <draggable class="drawing-board" v-model="item.content" :animation="340" group="componentsGroup">
                    <draggable-item
                        v-for="(item1, i) in item.content"
                        :key="item1.renderKey"
                        :drawing-list="item.content"
                        :current-item="item1"
                        :index="i"
                        :active-id="activeId"
                        :form-conf="formConf"
                        @activeItem="activeFormItem"
                        @copyItem="drawingItemCopy"
                        @deleteItem="drawingItemDelete"
                    />
                </draggable>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import draggable from 'vuedraggable';
import { deepClone } from '~/utils/index';
import DraggableItem from '~/views/index/DraggableItem';

export default {
    name: 'adqTabs',
    components: {
        draggable,
        DraggableItem,
    },
    data() {
        return {
            editableTabsValue: '1',
            tabIndex: 4,
            activeId: null,
            formConf: {},
            contents: {
                0: [],
                1: [],
                2: [],
            },
            drawingList: [],
            dataList: [],
        };
    },
    watch: {
        options: {
            handler(val) {},
            deep: true,
        },
    },
    props: {
        options: {
            /*tabs页列表*/ type: Array,
            default: function () {
                return [];
            },
        },
        type: {
            //选项卡样式
            type: String,
            default: '-',
        },
        tabPosition: {
            //位置
            type: String,
            default: 'top',
        },
        editable: {
            /*标签是否同时可增加和关闭*/ type: Boolean,
            default: false,
        },
        closable: {
            type: Boolean,
            default: false,
        },
    },
    computed: {},
    created() {},
    mounted() {
        this.dataList = this.options;
    },
    methods: {
        ...mapActions(['_AJAX']),
        handleClick(tab, event) {
            console.log(tab, event);
        },
        handleTabsEdit(targetName, action) {
            if (action === 'add') {
                let newTabName = ++this.tabIndex + '';
                this.options.push({
                    title: 'New Tab',
                    name: newTabName,
                });
                this.editableTabsValue = newTabName;
            }
            if (action === 'remove') {
                let tabs = this.options;
                let activeName = this.editableTabsValue;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }

                this.editableTabsValue = activeName;
                this.options = tabs.filter((tab) => tab.name !== targetName);
            }
        },
        activeFormItem(currentItem) {
            this.activeData = currentItem;
            this.activeId = currentItem.__config__.formId;
        },
        drawingItemCopy(item, list) {
            let clone = deepClone(item);
            clone = this.createIdAndKey(clone);
            list.push(clone);
            this.activeFormItem(clone);
        },
        drawingItemDelete(index, list) {
            list.splice(index, 1);
            this.$nextTick(() => {
                const len = this.drawingList.length;
                if (len) {
                    this.activeFormItem(this.drawingList[len - 1]);
                }
            });
        },
        createIdAndKey(item) {
            const config = item.__config__;
            config.formId = ++this.idGlobal;
            config.renderKey = `${config.formId}${+new Date()}`; // 改变renderKey后可以实现强制更新组件
            if (config.layout === 'colFormItem') {
                item.__vModel__ = `field${this.idGlobal}`;
            } else if (config.layout === 'rowFormItem') {
                config.componentName = `row${this.idGlobal}`;
                !Array.isArray(config.children) && (config.children = []);
                delete config.label; // rowFormItem无需配置label属性
            }
            if (Array.isArray(config.children)) {
                config.children = config.children.map((childItem) => this.createIdAndKey(childItem));
            }
            return item;
        },
    }
};
</script>
<style lang="scss" scoped></style>
