export default {
    /**
     * 表情符号
     */
    emoji(val) {
        return /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g.test(val);
    },

    /**
     *  验证文档名称 支持空格 数字和横线
     * @param val 验证的数据
     * @returns {boolean} 是否通过验证
     */
    englishDocument(val) {
        return /^[a-zA-Z]([a-zA-Z0-9: :-]*)+$/.test(val);
    },

    /**
     * 中文
     */
    chinese(val) {
        return /[\u4E00-\u9FA5]/.test(val);
    },

    /**
     * ip
     */
    commonIp(val) {
        return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(
            val
        );
    },

    /*
     * 校验身份证
     * */
    idCardValidity(rule, value, callback, idCardNoSupport) {
        let city = {
            11: '北京',
            12: '天津',
            13: '河北',
            14: '山西',
            15: '内蒙古',
            21: '辽宁',
            22: '吉林',
            23: '黑龙江 ',
            31: '上海',
            32: '江苏',
            33: '浙江',
            34: '安徽',
            35: '福建',
            36: '江西',
            37: '山东',
            41: '河南',
            42: '湖北 ',
            43: '湖南',
            44: '广东',
            45: '广西',
            46: '海南',
            50: '重庆',
            51: '四川',
            52: '贵州',
            53: '云南',
            54: '西藏 ',
            61: '陕西',
            62: '甘肃',
            63: '青海',
            64: '宁夏',
            65: '新疆',
            71: '台湾',
            81: '香港',
            82: '澳门',
            91: '国外 ',
        };
        let tip = '';
        let pass = true;

        if (!value && idCardNoSupport) {
            tip = '身份证号码不能为空';
            pass = false;
        } else if (!value && !idCardNoSupport) {
            pass = true;
        } else if (
            !/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|[Xx])$/i.test(
                value
            )
        ) {
            tip = '身份证号格式错误';
            pass = false;
        } else if (!city[value.substr(0, 2)]) {
            tip = '地址编码错误';
            pass = false;
        } else {
            // 18位身份证需要验证最后一位校验位
            if (value.length === 18) {
                value = value.split('');
                // ∑(ai×Wi)(mod 11)
                // 加权因子
                let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                // 校验位
                let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                let sum = 0;
                let ai = 0;
                let wi = 0;
                for (var i = 0; i < 17; i++) {
                    ai = value[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                //忽略大小写
                if (String(parity[sum % 11]).toLowerCase() != String(value[17]).toLowerCase()) {
                    tip = '校验位错误';
                    pass = false;
                }
            }
        }
        if (!pass) {
            callback(new Error(tip));
        } else {
            callback();
        }
    },

    /*
     * 校验用户账号
     * */

    validityUserName(rule, value, callback) {
        if (value.length == 0) {
            callback(new Error('请输入用户名'));
        } else if (value.length < window.accountMixLength) {
            callback(new Error(`用户名不能少于${window.accountMixLength}位数`));
        } else if (value.length > window.accountMaxLength) {
            callback(new Error(`用户名不能大于${window.accountMaxLength}位数`));
        } else {
            callback();
        }
    },
};
