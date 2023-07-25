import { MessageBox } from 'element-ui';
import Axios from 'axios';
export default {
    /*网络请求头*/
    ajaxHeaders: function () {
        return {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': sessionStorage.getItem('token'),
        };
    },
    /**
     * 不为空判断
     */
    isNotNull: function (obj) {
        if (obj === undefined || obj === null || obj == 'null' || obj === '' || obj == 'undefined') {
            return false;
        } else {
            return true;
        }
    },
    /*置空*/
    resetFun(data, cb) {
        for (let item in data) {
            if (typeof data[item] == 'string') {
                //字符串
                data[item] = null;
            }
            if (typeof data[item] == 'number') {
                //数字
                if (item != 'page' && item != 'rows') {
                    data[item] = null;
                }
            }
            if (Object.prototype.toString.call(data[item]).slice(8, -1) === 'Array') {
                //数组
                data[item] = [];
            }
            if (Object.prototype.toString.call(data[item]).slice(8, -1) === 'Object') {
                //对象
                data[item] = {};
            }
            if (Object.prototype.toString.call(data[item]).slice(8, -1) === 'Boolean') {
                //是否boolean
                data[item] = '';
            }
        }
        if (cb) {
            cb();
        }
    },
    /*时间戳转化为日期格式*/
    /**
     * 时间戳转化为年 月 日 时 分 秒
     * number: 传入时间戳
     * format：返回格式，支持自定义，但参数必须与formateArr里保持一致  例如  Y-M-D h:m:s
     */
    formatTime(number, format) {
        // if (number.toString().indexOf('-') != -1) {//针对会多次调用导致显示 NaN-NaN-NaN 的处理
        //     return number;
        // }
        if (!number) {
            return '-';
        }
        let formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
        let returnArr = [];
        let date = new Date(number);
        returnArr.push(date.getFullYear());
        returnArr.push(this.formatNumber(date.getMonth() + 1));
        returnArr.push(this.formatNumber(date.getDate()));
        returnArr.push(this.formatNumber(date.getHours()));
        returnArr.push(this.formatNumber(date.getMinutes()));
        returnArr.push(this.formatNumber(date.getSeconds()));
        for (let i in returnArr) {
            format = format.replace(formateArr[i], returnArr[i]);
        }
        return format;
    },
    //数据转化MessageBox
    formatNumber(n) {
        n = n.toString();
        return n[1] ? n : '0' + n;
    },
    /*组装url*/
    createURL(url, param) {
        /*param  ------传递的参数*/
        /*url  ------url路径*/
        let link = '';
        for (let key in param) {
            link += '&' + key + '=' + param[key];
        }
        link = url + '?' + link.substr(1);
        return link.replace(' ', '');
    },
    /*增加行*/
    addLine: function (tableData, isReset, cb) {
        /*
         * tableData:表格存放数据的字段
         * isReset:是否清除复制表格的数据
         * cb:成功后的回调
         * */
        let list = {};
        let index = tableData.length;
        let maxIndex = 0;
        if (index == 0) {
            list['index'] = 0;
        }
        if (index > 0) {
            tableData.forEach((item, index) => {
                if (item.index > maxIndex) {
                    maxIndex = item.index;
                }
            });
            if (isReset) {
                for (let item in tableData[0]) {
                    if (tableData[0][item]) {
                        if (typeof tableData[0][item] == 'object' && tableData[0][item].constructor == Array) {
                            //数组
                            list[item] = [];
                        } else if (typeof tableData[0][item] == 'object' && tableData[0][item].constructor == Object) {
                            //对象
                            list[item] = {};
                        } else {
                            list[item] = '';
                        }
                    } else {
                        list[item] = '';
                    }
                }
            } else {
            }
            list['index'] = ++maxIndex;
        }
        tableData.push(list);
        if (cb) {
            cb();
        }
    },
    /*删除行*/
    removeLine: function (tableData, selectData, cb) {
        /*
         * selectData  选中行的数据
         *tableData   所有table的数据
         * */
        if (selectData.length == 0) {
            MessageBox.alert('请至少选择一条数据!', '', {});
            return;
        }
        selectData.forEach((val, index) => {
            tableData.forEach((item, i) => {
                if (val.id != undefined && val.id === item.id) {
                    // i 为选中的索引
                    tableData.splice(i, 1);
                }
                if (val.index != undefined && val.index === item.index) {
                    tableData.splice(i, 1);
                }
                if (val.zdId != undefined && val.zdId === item.zdId) {
                    tableData.splice(i, 1);
                }
            });
        });
        if (cb) {
            cb(selectData);
        }
    },

    exportFile(_this, api, data, atob) {
        /*点击文件下载*/
        let url = createURL(window.urlConfig + api, data);
        let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器
        Axios({
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': sessionStorage.getItem('token'),
            },
            url: url,
            method: 'get',
            responseType: 'blob',
        })
            .then((res) => {
                if (res.headers['content-disposition' || 'Content-Disposition']) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    let filename = res.headers['content-disposition' || 'Content-Disposition'].split('filename=')[1]; //文件名
                    if (atob) {
                        filename = decodeURIComponent(escape(window.atob(filename)));
                    } else {
                        filename = decodeURI(filename);
                    }
                    if (isIE) {
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
                        document.body.removeChild(link); //下载完成移除元素
                        window.URL.revokeObjectURL(url); //释放掉blob对象
                    }
                } else {
                    /*将blob的数据转化为json格式*/
                    varietyJson(res.data, (data) => {
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
                    varietyJson(err.response.data, (err) => {
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
};

export function createURL(url, param) {
    /*param  ------传递的参数*/
    /*url  ------url路径*/
    let link = '';
    for (let key in param) {
        link += '&' + key + '=' + param[key];
    }
    link = url + '?' + link.substr(1);
    return link;
    // return link.replace(' ', '');
}

export function varietyJson(data, cb) {
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
}
