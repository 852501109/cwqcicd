<template>
    <div class="process-item">
        <div class="process-top-item">
            <span class="return-btn" @click="$router.go(-1)">X</span>
        </div>
        <div class="process-conetnt">
            <div class="canvas" ref="canvas" />
            <panel v-if="bpmnModeler" :modeler="bpmnModeler" />
            <div class="toolbar">
                <el-button-group>
                    <el-button icon="el-icon-circle-plus" @click="reset" title="创建新流程图"></el-button>
                    <el-button icon="el-icon-refresh-left" @click="undo" title="撤销"></el-button>
                    <el-button
                        icon="el-icon-refresh-right"
                        :class="!canRedo ? 'default-undo' : ''"
                        @click="redo"
                        title="恢复"
                    ></el-button>
                    <el-button icon="el-icon-zoom-in" @click="zoom(0.05)" title="放大"></el-button>
                    <el-button icon="el-icon-zoom-out" @click="zoom(-0.05)" title="缩小"></el-button>
                    <el-button type="primary" @click="save">保存</el-button>
                </el-button-group>
                <!--                <a title="download">下载</a>-->
                <!--                <a ref="saveDiagram" href="javascript:" title="download BPMN diagram" @click="save">导出为BPMN</a>-->
                <!--                <a ref="saveSvg" href="javascript:" title="download as SVG image">SVG</a>-->
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import BpmnModeler from 'jeeplus-bpmn/lib/Modeler'; // bpmn-js 设计器
import panel from '../modules/PropertyPanel'; // 属性面板
import BpmData from '../modules/BpmData';
import customTranslate from '../modules/customTranslate';
import API from '@/api/index';
export default {
    data() {
        return {
            bpmnModeler: null,
            element: null,
            bpmData: new BpmData(),
            bpmnXmlStr: null,
            modelId: this.$route.query.modelId,
            modelKey: this.$route.query.modelKey,
            defaultXml: `<?xml version="1.0" encoding="UTF-8"?>↵<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">↵  <bpmn2:process id="${this.$route.query.modelKey}" name="流程1567044459787">↵    <bpmn2:documentation>描述</bpmn2:documentation>↵    <bpmn2:startEvent id="StartEvent_092wgsr" />↵  </bpmn2:process>↵  <bpmndi:BPMNDiagram id="BPMNDiagram_1">↵    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="process1567044459787">↵      <bpmndi:BPMNShape id="StartEvent_092wgsr_di" bpmnElement="StartEvent_092wgsr">↵        <dc:Bounds x="462" y="132" width="36" height="36" />↵      </bpmndi:BPMNShape>↵    </bpmndi:BPMNPlane>↵  </bpmndi:BPMNDiagram>↵</bpmn2:definitions>`,
            canRedo: false,
            scale: 1.0,
        };
    },
    components: {
        panel,
    },
    mounted() {
        const canvas = this.$refs.canvas;
        //汉化
        const customTranslateModule = {
            translate: ['value', customTranslate],
        };
        // 生成实例
        this.bpmnModeler = new BpmnModeler({
            container: canvas,
            additionalModules: [customTranslateModule], //汉化
        });

        // 监听流程图改变事件
        // const _this = this;
        // this.bpmnModeler.on('commandStack.changed', function () {
        // _this.saveSVG(function (err, svg) {
        //     _this.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
        // });
        // _this.saveDiagram(function (err, xml) {
        //     _this.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
        // });
        // });

        this.createNewDiagram();
    },
    methods: {
        ...mapActions(['_AJAX']),
        /*初始化数据回显流程图*/
        createNewDiagram() {
            let parm = this.modelId ? this.modelId : this.modelKey;
            this._AJAX({
                url: API['activiti.model.json'] + parm,
                method: 'GET',
                data: {},
            }).then((res) => {
                if (res.code == 0) {
                    this.bpmnXmlStr = res.result ? res.result.model : null;
                    if (this.bpmnXmlStr === null || this.bpmnXmlStr === '' || this.bpmnXmlStr === undefined) {
                        this.initDiagram(this.defaultXml); //默认给一个开始图像
                    } else {
                        this.initDiagram(res.result.model);
                    }
                } else {
                    this.$AudaqueToast.error({
                        template: res.msg,
                        methods: {
                            okEvent() {},
                        },
                    });
                }
            });

            this.adjustPalette();
            // this.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto');
        },
        // 将字符串转换成图显示出来
        initDiagram(xml) {
            this.bpmnModeler.importXML(xml, (err) => {
                if (err) {
                    this.$AudaqueToast.error({
                        template: '画图初始化错误',
                        methods: {
                            okEvent() {},
                        },
                    });
                }
            });
        },
        // 调整左侧工具栏排版
        adjustPalette() {
            try {
                // 获取 bpmn 设计器实例
                const canvas = this.$refs.canvas;
                const djsPalette = canvas.children[0].children[0].children[4];
                const djsPalStyle = {
                    width: '140px',
                    padding: '5px',
                    background: 'white',
                    left: '0',
                    borderRadius: 0,
                    height: '100%',
                    overflow: 'auto',
                };
                for (var key in djsPalStyle) {
                    djsPalette.style[key] = djsPalStyle[key];
                }
                const palette = djsPalette.children[0];
                const allGroups = palette.children;
                allGroups[0].style['display'] = 'none';
                // 修改控件样式
                for (var gKey in allGroups) {
                    const group = allGroups[gKey];
                    for (var cKey in group.children) {
                        const control = group.children[cKey];
                        const controlStyle = {
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            width: '100%',
                            padding: '5px',
                        };
                        if (control.className && control.dataset && control.className.indexOf('entry') !== -1) {
                            const controlProps = this.bpmData.getControl(control.dataset.action);
                            control.innerHTML = `<div style='font-size: 14px;font-weight:500;margin-left:15px;'>${controlProps['title']}</div>`;
                            for (var csKey in controlStyle) {
                                control.style[csKey] = controlStyle[csKey];
                            }
                            //隐藏左侧操作台的节点（根据BpmData.js文件中的isShow字段来展示）
                            if (controlProps.isShow != undefined && !controlProps.isShow) {
                                control.style.display = 'none';
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 下载为SVG格式,done是个函数，调用的时候传入的
        saveSVG(done) {
            // 把传入的done再传给bpmn原型的saveSVG函数调用
            this.bpmnModeler.saveSVG(done);
        },
        // 下载为bpmn格式,done是个函数，调用的时候传入的
        saveDiagram(done) {
            // 把传入的done再传给bpmn原型的saveXML函数调用
            this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
                done(err, xml);
            });
        },
        // 当图发生改变的时候会调用这个函数，这个data就是图的xml
        setEncoded(link, name, data) {
            // 把xml转换为URI，下载要用到的
            const encodedData = encodeURIComponent(data);
            // 获取到图的xml，保存就是把这个xml提交给后台
            this.bpmnXmlStr = data;
            // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
            if (data) {
                link.className = 'active';
                link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData;
                link.download = name;
                link.click();
            }
        },
        /*保存*/
        save() {
            let params = {},
                _this = this;
            params.modelId = this.modelId;
            params.modelKey = this.modelKey;
            let isUserTask = false; //判断是否包含任务节点 没有的话不允许提交
            let isUserTaskType = true; //判断是否是用户任务类型 不是的话不允许提交（目前只支持用户任务类型）
            this.bpmnModeler.get('elementRegistry').forEach((element, gfx) => {
                //有任务节点
                if (element.type.toLowerCase().indexOf('task') > -1) {
                    //用户任务
                    if (element.type.toLowerCase() === 'bpmn:UserTask'.toLowerCase()) {
                        isUserTask = true;
                    } else {
                        //非用户任务类型
                        isUserTaskType = false;
                    }
                }
            });
            if (!isUserTask) {
                return this.$AudaqueToast.error({
                    template: '请至少选择一个用户任务节点',
                    methods: {
                        okEvent() {},
                    },
                });
            }
            if (!isUserTaskType) {
                return this.$AudaqueToast.error({
                    template: `只支持 "用户任务" 类型，请修改或删除非用户任务`,
                    methods: {
                        okEvent() {},
                    },
                });
            }
            this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
                params.json_xml = xml;
            });
            this.saveSVG(function (err, svg) {
                params.svg_xml = svg;
            });
            this.$store.commit('SHOW_LOADING', true);
            this._AJAX({
                url: 'activiti.model.save',
                method: 'POST',
                data: params,
            }).then((res) => {
                if (res.code == 0) {
                    this.$AudaqueToast.tip({
                        template: '保存成功',
                        methods: {
                            okEvent() {
                                _this.$router.go(-1);
                            },
                        },
                    });
                }
            });
        },
        /*撤销*/
        undo() {
            this.bpmnModeler.get('commandStack').undo();
            this.canRedo = this.bpmnModeler.get('commandStack').canRedo();
        },
        /*恢复*/
        redo() {
            if (!this.canRedo) {
                return;
            }
            this.bpmnModeler.get('commandStack').redo();
            this.canRedo = this.bpmnModeler.get('commandStack').canRedo();
        },
        /*放大缩小*/
        zoom(val) {
            let newScale = !val ? 1.0 : this.scale + val <= 0.2 ? 0.2 : this.scale + val;
            this.bpmnModeler.get('canvas').zoom(newScale);
            this.scale = newScale;
        },
        reset() {
            this.initDiagram(this.defaultXml);
        },
    },
};
</script>
<style lang="scss">
/*左边工具栏以及编辑节点的样式*/
@import '~bpmn-js/dist/assets/diagram-js.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
.djs-palette {
    top: 0;
}
.default-undo {
    color: #c0c4cc;
}
</style>
<style lang="scss" scoped>
.process-item {
    width: 100%;
    height: 100%;
    overflow: auto;
    .process-top-item {
        width: 100%;
        line-height: 30px;
        text-align: right;
        border-bottom: 1px solid #f0f0f0;
        .return-btn {
            cursor: pointer;
            font-size: 16px;
            padding: 15px;
        }
    }
    .process-conetnt {
        height: calc(100% - 32px);
        width: 100%;
        position: absolute;
        .canvas {
            width: calc(100% - 220px);
            height: 100%;
            background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')
                repeat !important;
        }
        .panel {
            position: absolute;
            right: 0;
            top: 50px;
            width: 300px;
        }
        .bjs-powered-by {
            display: none;
        }
        .toolbar {
            position: absolute;
            top: 2px;
            right: 222px;
            background: #fff;
            padding: 10px;
            a {
                text-decoration: none;
                margin: 5px;
                color: #409eff;
            }
        }
        /deep/.bjs-powered-by {
            //隐藏官方图标链接
            display: none;
        }
    }
}
</style>
