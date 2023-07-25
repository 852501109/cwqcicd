import { deepClone } from '~/utils/index';
import Axios from 'axios';
import { loadTableData } from '@/components/form/formPublic';
const componentChild = {};
/**
 * 将./slots中的文件挂载到对象componentChild上
 * 文件名为key，对应JSON配置中的__config__.tag
 * 文件内容为value，解析JSON配置中的__slot__
 */
const slotsFiles = require.context('./slots', false, /\.js$/);
const keys = slotsFiles.keys() || [];
keys.forEach((key) => {
    const tag = key.replace(/^\.\/(.*)\.\w+$/, '$1');
    const value = slotsFiles(key).default;
    componentChild[tag] = value;
});

function vModel(dataObject, defaultValue) {
    dataObject.props.value = defaultValue;

    dataObject.on.input = (val) => {
        this.$emit('input', val);
    };
}

function mountSlotFiles(h, confClone, children) {
    const childObjs = componentChild[confClone.__config__.tag];
    if (childObjs) {
        Object.keys(childObjs).forEach((key) => {
            const childFunc = childObjs[key];
            if (
                (confClone.__slot__ && confClone.__slot__[key]) ||
                (confClone.options && confClone.options.length > 0)
            ) {
                children.push(childFunc(h, confClone, key));
            }
        });
    }
}

function emitEvents(confClone) {
    ['on', 'nativeOn'].forEach((attr) => {
        const eventKeyList = Object.keys(confClone[attr] || {});
        eventKeyList.forEach((key) => {
            const val = confClone[attr][key];
            if (typeof val === 'string') {
                // confClone[attr][key] = (event) => this.$emit(val, event);
                confClone[attr][key] = this[val].bind(null, confClone);
            }
        });
    });
}

/*绑定上传组件的回调函数做相关的业务处理*/
function uploadCb(confClone) {
    let eventList = ['on-success', 'on-error', 'on-remove', 'on-preview', 'before-upload'];
    eventList.forEach((key) => {
        confClone[key] = this[confClone[key]].bind(null, confClone);
    });
    // confClone['on-success'] = this[confClone['on-success']].bind(null, confClone);
}
//将json表单配置转化为vue render可以识别的 “数据对象（dataObject）”
function buildDataObject(confClone, dataObject) {
    Object.keys(confClone).forEach((key) => {
        const val = confClone[key];
        if (key === '__vModel__') {
            vModel.call(this, dataObject, confClone.__config__.defaultValue);
        } else if (dataObject[key] !== undefined) {
            if (
                dataObject[key] === null ||
                dataObject[key] instanceof RegExp ||
                ['boolean', 'string', 'number', 'function'].includes(typeof dataObject[key])
            ) {
                dataObject[key] = val;
            } else if (Array.isArray(dataObject[key])) {
                dataObject[key] = [...dataObject[key], ...val];
            } else {
                dataObject[key] = { ...dataObject[key], ...val };
            }
        } else {
            dataObject.attrs[key] = val;
        }
    });

    // 清理属性
    clearAttrs(dataObject);
}
// 清理属性
function clearAttrs(dataObject) {
    if (dataObject.attrs.__config__.tag != 'table-component') {
        delete dataObject.attrs.__config__;
    }
    delete dataObject.attrs.__slot__;
    delete dataObject.attrs.__methods__;
}

function makeDataObject() {
    // 深入数据对象：
    // https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1
    return {
        class: {},
        attrs: {},
        props: {},
        domProps: {},
        nativeOn: {},
        on: {},
        style: {},
        directives: [],
        scopedSlots: {},
        slot: null,
        key: null,
        ref: null,
        refInFor: true,
    };
}

export default {
    data() {
        return {
            selectOrg: {
                orgsid: [],
            },
        };
    },
    props: {
        conf: {
            type: Object,
            required: true,
        },
    },
    watch: {
        conf: {
            handler(val) {},
            deep: true,
        },
    },
    methods: {
        /*删除tabs页*/
        removeTab(confClone, targetName) {
            let options = this.currentItem.__slot__.options;
            options = options.filter((tab) => tab.name !== targetName);
            this.$set(this.currentItem.__slot__, 'options', options);
        },
        /*树  节点被点击时的回调*/
        treeNodeClick(confClone, data, node, item) {
            // console.log(data);
        },
        /*树  节点选中状态发生变化时的回调*/
        treeCheckClick(confClone, data, checked, indeterminate) {
            if (confClone.__config__.isSingleChoice) {
                /*单选*/
                // 获取当前选择的id在数组中的索引
                let checkedKeys = this.$refs[confClone.ref][0].getCheckedKeys();
                checkedKeys.splice(
                    checkedKeys.findIndex((item) => item === data[confClone.props.props.value]),
                    1
                );
                this.selectOrg.orgsid = checkedKeys;
                const indexs = this.selectOrg.orgsid.indexOf(data[confClone.props.props.value]);
                // 如果不存在数组中，并且数组中已经有一个id并且checked为true的时候，代表不能再次选择。
                if (indexs < 0 && this.selectOrg.orgsid.length >= 1 && checked) {
                    this.$message({
                        message: '只能选择一个选项！',
                        type: 'error',
                        showClose: true,
                    });
                    // 设置已选择的节点为false 很重要
                    this.$refs[confClone.ref][0].setChecked(data, false);
                } else if (this.selectOrg.orgsid.length === 0 && checked) {
                    // 发现数组为空 并且是已选择
                    // 防止数组有值，首先清空，再push
                    this.selectOrg.orgsid = [];
                    this.selectOrg.orgsid.push(data[confClone.props.props.value]);
                } else if (indexs >= 0 && this.selectOrg.orgsid.length === 1 && !checked) {
                    // 再次直接进行赋值为空操作
                    this.selectOrg.orgsid = [];
                }
            }
        },
        /*上传   成功后的回调*/
        uploadSuccess(confClone, response, file, fileList) {
            let _this = this;
            if (response.code === 0) {
                this.$AudaqueToast.tip({
                    template: `文件上传成功`,
                    methods: {
                        okEvent() {
                            _this.loadFileList(fileList);
                        },
                    },
                });
            } else {
                this.$AudaqueToast.error({
                    template: response.msg,
                    methods: {
                        okEvent() {
                            fileList = fileList.splice(fileList.length - 1, 1);
                        },
                    },
                });
            }
        },

        /*上传   失败后的回调*/
        uploadError(confClone, err, file, fileList) {
            this.$AudaqueToast.error({
                template: err ? JSON.parse(err.message).msg : `文件上传失败，请检查文件类型或大小是否合规`,
                methods: {
                    okEvent() {},
                },
            });
        },
        /*上传  删除的钩子*/
        uploadRemove(confClone, file, fileList) {
            this.loadFileList(fileList);
        },
        /*上传  点击已上传的文件链接时的钩子*/
        uploadpreview(confClone, file) {
            /*点击文件下载*/
            let url = this.publics.createURL(window.urlConfig + '/form/data/file/download', {
                uuid: file.uuid || file.response.result.uuid,
                fileName: file.fileName || file.response.result.fileName,
                formCode: confClone.data && confClone.data.formCode,
            });
            const _this = this;
            Axios({
                headers: _this.publics.ajaxHeaders(),
                url: url,
                method: 'get',
                responseType: 'blob',
            })
                .then((res) => {
                    if (res.headers['content-disposition' || 'Content-Disposition']) {
                        const url = window.URL.createObjectURL(new Blob([res.data]));
                        let filename = res.headers['content-disposition' || 'Content-Disposition'].split(
                            'filename='
                        )[1]; //文件名
                        filename = decodeURI(filename);
                        if (_this.$utils.IEVersion() != -1) {
                            //ie浏览器
                            let blob = new Blob([res.data], {
                                type: 'application/json;charset=utf-8',
                            });
                            window.navigator.msSaveBlob(blob, filename);
                        } else {
                            //非ie
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', filename);
                            document.body.appendChild(link);
                            link.click();
                        }
                    } else {
                        /*将blob的数据转化为json格式*/
                        _this.varietyJson(res.data, (data) => {
                            if (data.success == false) {
                                _this.$AudaqueToast.tip({
                                    template: data.msg,
                                    methods: {
                                        okEvent() {},
                                    },
                                });
                            }
                        });
                    }
                })
                .catch((err) => {
                    if (err.response) {
                        _this.varietyJson(err.response.data, (err) => {
                            _this.$AudaqueToast.error({
                                template: err.msg,
                                methods: {
                                    okEvent() {},
                                },
                            });
                        });
                    }
                });
        },

        /*将blob的数据转化为json格式*/
        varietyJson(data, cb) {
            let reader = new FileReader();
            reader.readAsText(data, 'utf-8');
            reader.onload = function () {
                if (reader.result != null) {
                    data = JSON.parse(reader.result);
                    if (cb) {
                        cb(data);
                    }
                }
            };
        },

        /*上传  上传文件之前的钩子  在该函数作校验*/
        uploadBeforeAvatar(confClone, file) {
            const units = {
                KB: file.size / 1024,
                MB: file.size / 1024 / 1024,
                GB: file.size / 1024 / 1024 / 1024,
            };
            const config = confClone.__config__;
            const unitNum = units[config.sizeUnit];
            if (config.fileSize) {
                let isRightSize = unitNum < config.fileSize;
                if (!isRightSize) {
                    this.$message.error(`文件大小超过 ${config.fileSize}${config.sizeUnit}`);
                    return false;
                }
            }
            if (confClone.accept) {
                let isAccept = new RegExp(confClone.accept).test(file.type);
                if (!isAccept) {
                    this.$message.error(`应该选择${confClone.accept}类型的文件`);
                    return false;
                }
            }
            return true;
        },

        /*上传文件组装的字段详情*/
        loadFileList(fileList) {
            let arr = [];
            fileList.forEach((item) => {
                if (!item.isLoad) {
                    let obj = {};
                    obj.name = item.name;
                    obj.fileName = item.name;
                    obj.uuid = item.response.result.uuid;
                    obj.isLoad = true;
                    arr.push(obj);
                } else {
                    arr.push(item);
                }
            });
            this.conf['fileLists'] = arr; //将值放入  fileLists字段 方便提交时用
        },

        /*表格分页切换  一页多少条*/
        tableSizeChange(confClone, rows) {
            //改变confClone字段不会热更新数据必须得改变this.conf字段才行
            this.conf.__config__.parameter[1].value = rows;
            loadTableData.call(this, this.conf);
        },
        /*表格分页切换  跳转到那页*/
        tableCurrentChange(confClone, page) {
            //改变confClone字段不会热更新数据必须得改变this.conf字段才行
            this.conf.__config__.parameter[0].value = page;
            loadTableData.call(this, this.conf);
        },
    },
    render(h) {
        const dataObject = makeDataObject();
        let confClone = null;
        /*树组件做热更新会有问题 */
        if (this.conf.__config__.tag === 'el-tree' || this.conf.__config__.tag === 'el-upload') {
            confClone = Object.assign({}, this.conf);
        } else {
            confClone = deepClone(this.conf);
        }
        // const confClone = deepClone(this.conf);
        const children = this.$slots.default || [];

        // 如果slots文件夹存在与当前tag同名的文件，则执行文件中的代码
        mountSlotFiles.call(this, h, confClone, children);

        // 将字符串类型的事件，发送为消息
        emitEvents.call(this, confClone);
        //处理上传类型的各类回调函数
        if (confClone.__config__.tag === 'el-upload') {
            uploadCb.call(this, confClone);
        }

        // 将json表单配置转化为vue render可以识别的 “数据对象（dataObject）”
        buildDataObject.call(this, confClone, dataObject);
        return h(this.conf.__config__.tag, dataObject, children);
    },
};
