import CryptoJS from 'crypto-js';

export default {
    // 时间戳转换日期
    timeToDate(time, isContainTime) {
        /*
         * isContainTime  是否包含时间  默认为包含
         * */
        if (!time) {
            return null;
        }
        let date = new Date(time); //获取一个时间对象
        let y = date.getFullYear(); // 获取完整的年份(4位,1970)
        let m = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1; // 获取月份(0-11,0代表1月,用的时候记得加上1)
        let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); // 获取日(1-31)
        let HH = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(); // 获取小时数(0-23)
        let MM = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(); // 获取分钟数(0-59)
        let SS = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(); // 获取秒数(0-59)
        if (!isContainTime) {
            return time == null || !time || time == '' ? '-' : y + '-' + m + '-' + d;
        } else {
            return time == null || !time || time == '' ? '-' : y + '-' + m + '-' + d + ' ' + HH + ':' + MM + ':' + SS;
        }
    },
    getHMS(time) {
        let date = new Date(time); //获取一个时间对象
        let HH = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(); // 获取小时数(0-23)
        let MM = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(); // 获取分钟数(0-59)
        let SS = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(); // 获取秒数(0-59)
        return time == null || !time || time == '' ? '' : HH + ':' + MM + ':' + SS;
    },
    // 字符串转化变量
    strToVar(str) {
        let json = new Function('return ' + str)();
        return json;
    },
    isIE() {
        //ie?
        if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            return true;
        } else {
            return false;
        }
    },
    isDelRule(callback) {},
    cronToNum(num) {
        return isNaN(num) ? num : num - 0 + '';
    },
    getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    pageShowSize(total) {
        let arr = [10, 20, 30, 40, 50, 100];
        // if(total <= 10){
        //     arr = ['10']
        // }else if(total <= 20) {
        //     arr = ['10', '20']
        // }else if(total <= 50){
        //     arr = ['10', '20', '50']
        // }else if(total <= 100){
        //     arr = ['10', '20', '50', '100']
        // }else{
        //     arr = ['10', '20', '50', '100', '200']
        // }
        return arr;
    },
    encrypt(word, keyStr, ivStr) {
        keyStr = keyStr ? keyStr : 'absoietlj32fai12';
        ivStr = ivStr ? ivStr : 'absoietlj32fai12';
        let key = CryptoJS.enc.Utf8.parse(keyStr);
        let iv = CryptoJS.enc.Utf8.parse(ivStr);
        let srcs = CryptoJS.enc.Utf8.parse(word);

        let encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding,
        });
        return encrypted.toString();
    },
    // 解密
    decrypt(word, keyStr, ivStr) {
        keyStr = keyStr ? keyStr : 'absoietlj32fai12';
        ivStr = ivStr ? ivStr : 'absoietlj32fai12';
        var key = CryptoJS.enc.Utf8.parse(keyStr);
        let iv = CryptoJS.enc.Utf8.parse(ivStr);

        var decrypt = CryptoJS.AES.decrypt(word, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding,
        });
        return decrypt.toString(CryptoJS.enc.Utf8);
    },
    /*
     * 分页序号连续
     * index ---当前的序号
     * page ---当前页
     * rows ---一页多少条
     * */
    _indexMethod(index, page, rows) {
        return (page - 1) * rows + index + 1;
    },
};
