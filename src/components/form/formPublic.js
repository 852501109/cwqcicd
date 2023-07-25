import request from '@/api/ajax';
import { isNumberStr } from '~/utils/index';
import { isArray } from 'util';

/*保存前删除远端请求的数据*/
export function delDynamicData(data) {
    data.forEach((item) => {
        if (item.__config__.children) {
            delDynamicData(item.__config__.children);
        } else {
            if (item.__config__.dataType === 'dynamic') {
                if (Object.prototype.toString.call(data[item]).slice(8, -1) === 'Array') {
                    item[item.__config__.dataConsumer] = []; //清除掉远端数据
                } else {
                    item[item.__config__.dataConsumer] = {}; //清除掉远端数据
                }
            }
        }
    });
    return data;
}

export function fetchDynamicData(param) {
    return request(param);
}
/*
 * 表单提交数据的特殊处理
 * */
/*针对特殊模块获取提交数据的处理（上传、树形结构、时间范围）*/
let fileKeys = []; //上传文件uuid的集合
export function loadItemFormVal(fields, data, init = false) {
    let _this = this;
    if (init) {
        fileKeys = [];
    }
    fields.forEach((item) => {
        if (item.__config__.children) {
            /*针对不同结构的数据*/
            loadItemFormVal.call(this, item.__config__.children, data);
        } else {
            /*树形*/
            if (item.__config__.tag === 'el-tree') {
                /*注意ref的使用*/
                if (_this.$refs['render_' + item.ref].$refs[item.ref]) {
                    let value = _this.$refs['render_' + item.ref].$refs[item.ref][0].getCheckedKeys();
                    data[item.__vModel__] = value && value.length > 0 ? value.join(',') : '';
                }
                /*上传*/
            } else if (item.__config__.tag === 'el-upload') {
                data[item.__vModel__] = JSON.stringify(item['fileLists']);

                item['fileLists'] &&
                    item['fileLists'].forEach((m) => {
                        fileKeys.push(m.uuid);
                    });
                data['fileKeys'] = fileKeys.join(','); //文件提交的特殊要求多加一个字段fileKeys，后台要求
            } else if (item.__config__.tag === 'el-cascader') {
                //级联组件 (级联组件有可能是个二维数据。故提交的是否转化为字符串数组在回显时再翻译回来)
                data[item.__vModel__] = JSON.stringify(data[item.__vModel__]);
            }
            /*时间范围组件分为两个字段提交 __vModel__ 、 __vModel_1__  特殊处理*/
            if (item.__config__.isRange && data[item.__vModel__] && data[item.__vModel__].length > 0) {
                let startTime = data[item.__vModel__][0];
                let endTime = data[item.__vModel__][1];
                if (startTime === '') {
                    data[item.__vModel__] = null; //开始时间
                    data[item.__vModel_1__] = null; //结束时间
                } else {
                    data[item.__vModel__] = startTime; //开始时间
                    data[item.__vModel_1__] = endTime; //结束时间
                }
            }

            //提交的数据是个数组  将数组切割成字符串的形式，在回显时再重新转换为数组
            if (
                Object.prototype.toString.call(data[item.__vModel__]).slice(8, -1) === 'Array' &&
                item.__config__.tag != 'el-cascader'
            ) {
                data[item.__vModel__] = data[item.__vModel__].join(',');
            }
        }
    });
}

/*
 * 请求表格(table)数据
 * */
export function loadTableData(conf) {
    if (conf.__config__.dataType === 'dynamic') {
        fetchDynamicData({
            method: conf.__config__.method,
            url: conf.__config__.url,
            params: assemblyTableParams(conf),
        }).then((resp) => {
            //改变confClone字段不会热更新数据必须得改变this.conf字段才行
            this.$set(conf, 'data', resp);
        });
    }
}
/*组装表格请求参数*/
function assemblyTableParams(conf) {
    if (conf.__config__.parameter && conf.__config__.parameter.length > 0) {
        let params = {};
        conf.__config__.parameter.forEach((item) => {
            params[item.label] = item.value;
        });
        return params;
    } else {
        return null;
    }
}

/*
 * 表单回显数据的特殊处理
 * */

export function fillFormData(fields, data, config = {}) {
    if (!config._fileDeleteKeys) {
        config._fileDeleteKeys = [];
    }
    if (data && fields) {
        for (let i = 0; i < fields.length; i++) {
            let item = fields[i];
            if (item.__config__.children) {
                fillFormData.call(this, item.__config__.children, data, config);
            } else {
                let val = null;
                /*时间组件*/
                if (item.__config__.tag === 'el-date-picker' || item.__config__.tag === 'el-time-picker') {
                    //针对时间的处理
                    //时间范围
                    if (item.__config__.isRange) {
                        val = [];
                        if (item.__config__.tag === 'el-time-picker') {
                            val[0] = data[item.__vModel__];
                            val[1] = data[item.__vModel_1__];
                        } else {
                            val[0] = this.$utils.timeToDate(data[item.__vModel__], false) || '';
                            val[1] = this.$utils.timeToDate(data[item.__vModel_1__], false) || '';
                        }
                    } else {
                        if (item.__config__.tag === 'el-time-picker') {
                            val = data[item.__vModel__];
                        } else {
                            val = this.$utils.timeToDate(data[item.__vModel__], false);
                        }
                    }
                    /*树形组件*/
                } else if (item.__config__.tag === 'el-tree' && data[item.__vModel__]) {
                    //树形结构的回显
                    if (item.__config__.isSingleChoice) {
                        //单选
                        this.$set(item, 'default-checked-keys', [data[item.__vModel__]]);
                    } else {
                        //多选
                        if (/[，,]/g.test(data[item.__vModel__])) {
                            this.$set(item, 'default-checked-keys', data[item.__vModel__].split(','));
                        } else {
                            this.$set(item, 'default-checked-keys', [data[item.__vModel__]]);
                        }
                    }
                    /*上传组件*/
                } else if (item.__config__.tag === 'el-upload') {
                    if (data[item.__vModel__] != null) {
                        if (data[item.__vModel__] && typeof data[item.__vModel__] == 'string') {
                            val = JSON.parse(data[item.__vModel__]); //表单数据上传提交是一字符串的形式提交。回显时需转换   接口数据直接是个json不需转换
                        } else {
                            val = data[item.__vModel__];
                        }
                        // this.$set(val[0], 'formCode', formConf.formCode); //放入formCode字段，文件上传下载的时候要传给后台
                        val = val || [];
                        this.$set(item, 'file-list', val); //el-upload组件回显用
                        this.$set(item, 'fileLists', val); //方便提交时取值
                        //存储初始化时的所有文件key 用于比对提交时哪些删除了
                        config._fileDeleteKeys = config._fileDeleteKeys.concat(val && val.map((afile) => afile.uuid));
                    }
                    continue;
                } else if (
                    /*数组类型*/
                    (item.__config__.tag === 'el-select' && item.multiple) ||
                    item.__config__.tag === 'el-checkbox-group'
                ) {
                    if (data[item.__vModel__] && data[item.__vModel__].length > 0) {
                        val = data[item.__vModel__].split(',');
                        val = val.map((item) => {
                            return isNumberStr(item) ? +item : item;
                        });
                    }
                } else if (item.__config__.tag === 'el-cascader') {
                    //级联组件(将字符串变为数组)
                    // val = new Function('return( ' + data[item.__vModel__] + ' );')();
                    val = JSON.parse(data[item.__vModel__]) || [];
                } else if (item.__config__.tag === 'table-component') {
                    //表格
                    val = { rows: data[item.__vModel__] };
                } else {
                    val = data[item.__vModel__];
                }

                if (val) {
                    if (isArray(val)) {
                        // 数组
                        this.$set(
                            item.__config__,
                            'defaultValue',
                            val
                            // val.split(',').map((val) => (isNumberStr(val) ? +val : val))
                        );
                    } else if (['true', 'false'].indexOf(val) > -1) {
                        // 布尔
                        this.$set(item.__config__, 'defaultValue', JSON.parse(val));
                    } else {
                        // 字符串和数字
                        if (item.__config__.tag === 'el-input') {
                            //在组件输入正则校验时如果后端传过来是数字类型校验会有问题。需要转化为字符串类型
                            this.$set(item.__config__, 'defaultValue', val + '');
                        } else if (item.__config__.tag === 'table-component') {
                            //表格
                            this.$set(item, 'data', val);
                        } else {
                            this.$set(item.__config__, 'defaultValue', isNumberStr(val) ? +val : val);
                        }
                    }
                }
            }
        }
    }
}

/*
 * 清空表单
 *
 * */
export function resetForm(fields) {
    for (let i = 0; i < fields.length; i++) {
        let item = fields[i];
        if (item.__config__.children) {
            fillFormData.call(this, item.__config__.children);
        } else {
            if (item.__config__.tag === 'el-tree') {
                //树形结构的回显
                if (item.__config__.isSingleChoice) {
                    //单选
                    this.$set(item, 'default-checked-keys', null);
                } else {
                    //多选
                    this.$set(item, 'default-checked-keys', []);
                }
            } else if (item.__config__.tag === 'el-upload') {
                this.$set(item, 'file-list', []);
            } else {
                if (isArray(item.__config__.defaultValue)) {
                    this.$set(item.__config__, 'defaultValue', []);
                } else if (['true', 'false'].indexOf(item.__config__.defaultValue) > -1) {
                    // 布尔
                    this.$set(item.__config__, 'defaultValue', false);
                } else {
                    this.$set(item.__config__, 'defaultValue', null);
                }
            }
        }
    }
}
