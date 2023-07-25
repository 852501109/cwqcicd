<template>
    <div class="adq-tree">
        <el-input
            class="filter-tree-input"
            placeholder="输入关键字进行过滤"
            @keyup.enter.native="clickInquireTreeData"
            clearable
            v-model="filterText"
        >
            <el-button slot="append" icon="el-icon-search" class="query-btn" @click="clickInquireTreeData"
                >搜索</el-button
            >
        </el-input>
        <!--        @input="filterNodeMethod"-->
        <div class="adq-tree-item" v-loading="loading" element-loading-spinner="el-icon-loading">
            <el-radio-group v-if="showCheckbox && isCheckBtn" v-model="isAllCheck" style="margin-left: 20px">
                <el-radio-button :label="true" @click.native="treeIsAllCheck(true)">全选</el-radio-button>
                <el-radio-button :label="false" @click.native="treeIsAllCheck(false)">全不选</el-radio-button>
            </el-radio-group>
            <el-tree
                class="tree-dashed"
                :props="defaultProps"
                :show-checkbox="showCheckbox"
                :expand-on-click-node="expandOnClickNode"
                :node-key="nodeKey"
                :default-checked-keys="defaultCheckedKeys"
                :default-expanded-keys="defaultExpandedKeys"
                :check-strictly="checkStrictly"
                :render-content="handleRenderContent"
                @node-click="handleNodeClick"
                @check-change="handleCheckChange"
                :filter-node-method="filterNode"
                ref="adqTree"
                :indent="20"
                :data="treeData"
            >
            </el-tree>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    name: 'adqTree',
    data() {
        return {
            filterText: '', //过滤的关键字
            isAllCheck: null, //是否全选
            allIds: [], //所有节点的id集合
            treeData: [], // 树形结构的数据
            loading: false, //是否显示加载图标
            isSearch: false,
        };
    },
    watch: {
        treeData: {
            handler(val) {},
            deep: true,
        },
        filterText(val) {
            if (val.length === 0) {
                this.isSearch = false;
                this.$refs.adqTree.filter(val);
            }
        },
    },
    props: {
        /*默认勾选的节点的 key 的数组*/
        defaultCheckedKeys: {
            type: Array,
            default: function () {
                return [];
            },
        },
        /*默认展开的节点的 key 的数组*/
        defaultExpandedKeys: {
            type: Array,
            default: function () {
                return [];
            },
        },
        /*在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，*/
        checkStrictly: {
            type: Boolean,
            default: false,
        },
        /*节点是否可被选择	*/
        showCheckbox: {
            type: Boolean,
            default: true,
        },
        isCheckBtn: {
            type: Boolean,
            default: true,
        },
        /*是否在点击节点的时候展开或者收缩节点*/
        expandOnClickNode: {
            type: Boolean,
            default: true,
        },
        /*节点的唯一标识*/
        nodeKey: {
            type: String,
            default: 'id',
        },
        /*配置选项*/
        defaultProps: {
            type: Object,
            default: function () {
                return {
                    label: 'name',
                    children: 'children',
                    isLeaf: 'isEnd',
                };
            },
        },
    },
    mounted() {
        this.loadInit();
    },
    methods: {
        ...mapActions(['_AJAX']),
        /*初始化请求数据*/
        loadInit() {
            this.loading = true;
            /*获取根节点的id */
            this._AJAX({
                url: 'org.findRootDept',
                method: 'GET',
                data: {},
            }).then((request) => {
                if (request.code === 0) {
                    /*根据跟节点id请求所有的节点数据*/
                    this._AJAX({
                        url: 'org.findRootDeptTree',
                        method: 'GET',
                        data: { deptId: request.result.id },
                    }).then((res) => {
                        this.treeData = [res.result];
                        this.loading = false;
                        this.defaultExpandedKeys.push(res.result.id); //默认展开一级节点
                        this.allIds = [];
                        this.loadIds([res.result]);
                    });
                }
            });
        },
        /*获得所有节点id的集合*/
        loadIds(data) {
            data.forEach((item) => {
                this.allIds.push(item.id);
                if (item.children && item.children.length > 0) {
                    this.loadIds(item.children);
                }
            });
        },
        /*是否全选*/
        treeIsAllCheck(val) {
            if (val) {
                //全选
                this.$refs.adqTree.setCheckedKeys(this.allIds);
            } else {
                //取消选中
                this.$refs.adqTree.setCheckedKeys([]);
            }
        },
        /*搜索查询*/
        clickInquireTreeData() {
            this.isSearch = true;
            this.loading = true;
            setTimeout(() => {
                this.$refs.adqTree.filter(this.filterText);
                this.$nextTick().then(() => {
                    setTimeout(() => {
                        this.loading = false;
                    }, 500);
                });
            }, 50);
        },
        parentSearch(value) {
            this.filterText = value;
            this.clickInquireTreeData();
        },
        /*树节点的过滤*/
        filterNode(value, data, Node) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        filterNodeMethod(value) {
            const _this = this;
            const traverse = function (node) {
                node.map((item) => {
                    const childNodes = item[_this.defaultProps.children];
                    // _this.$set(item, 'visible', _this.filterNode(value, item));
                    item.visible = _this.filterNode(value, item);
                    if (childNodes && childNodes.length > 0) {
                        traverse(childNodes);
                    }
                });
            };
            traverse(this.treeData);
        },
        /*点击节点*/
        handleNodeClick(data, Node) {
            this.$emit('node-click', data, Node);
            this.showChildrenNode(data, Node);
        },

        showChildrenNode(data, Node) {
            if (Node.level != 1 && !Node.isLeaf && this.isSearch) {
                Node.expanded = true; //收起节点
                Node.childNodes.forEach((item) => {
                    item.visible = true;
                });
            }
        },

        /*节点选中状态发生变化时的回调*/
        handleCheckChange(Node, isCheck) {
            this.$emit('check-change', Node, isCheck);
        },

        handleRenderContent(h, { node, data, store }) {
            let className = 'iconfont icondrxx95 group';

            if (data.isPosition) {
                if (data.leader) {
                    className = 'iconfont iconlingdao leader';
                } else {
                    className = 'iconfont iconyuangong people';
                }
            } else if (node.level === 1) {
                className = 'iconfont icondrxx95 root';
            }
            return (
                <span class={className} style="">
                    {' '}
                    {data.name}
                </span>
            );
        },
    },
};
</script>
<style lang="scss" scoped>
.adq-tree {
    border: 1px solid #dcdfe6;
    width: 100%;
    z-index: 99999;
    max-height: 300px;
    overflow: auto;
    .filter-tree-input {
        .query-btn {
            background: #409eff;
            color: #fff;
        }
    }
    .adq-tree-item {
        height: calc(300px - 40px);
        /deep/.el-loading-spinner i {
            font-size: 30px;
        }
    }
}
</style>
