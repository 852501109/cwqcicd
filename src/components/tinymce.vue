<template>
    <div class="home">
        <div :ref="hId" class="text"></div>
    </div>
</template>
<script>
// 引入 wangEditor
import WangEditor from 'wangeditor';
import { Message } from 'element-ui';
import API from '@/api/index';
// import xss from 'xss';
export default {
    props: {
        value: {
            type: String,
            required: false,
        },
        /*输入字符限制*/
        stringSize: {
            type: Number,
            default: 65535,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        value(newValue) {
            this.$emit('input', newValue);
            if (newValue !== this.editor.txt.html()) {
                this.editor.txt.html(this.preventXss(this.value));
            }
            // this.editor.txt.html(this.value);
        },
    },
    data() {
        return {
            editor: null,
            wangEditor: null,
            editorData: '',
            uploadLink: API['form.data.file.upload'], //文件上传地址
            hId: this.genID(4), //生成一个随机的Id方便在页面插入多个编辑器
        };
    },

    mounted() {
        const editor = new WangEditor(this.$refs[this.hId]);
        let config = editor.customConfig ? editor.customConfig : editor.config;

        // 自定义检查插入的链接
        config.linkCheck = this.customCheckLinkFn;

        //配置菜单栏，设置不需要的菜单
        config.excludeMenus = ['video'];
        // 关闭粘贴样式的过滤
        config.pasteFilterStyle = false;
        // 忽略粘贴内容中的图片
        config.pasteIgnoreImg = false;
        config.showLinkImg = false; //关闭网络路径图片方式
        config.uploadImgShowBase64 = true; // base 64 存储图片   不能和config.uploadImgServer同时使用
        // config.uploadImgServer = this.uploadLink; // 填写配置服务器端地址
        config.uploadImgHeaders = {}; // 自定义 header
        config.uploadFileName = 'files'; // 后端接受上传文件的参数名
        config.uploadImgParams = {
            // 如果版本 <=v3.1.0 ，属性值会自动进行 encode ，此处无需 encode
            // 如果版本 >=v3.1.1 ，属性值不会自动 encode ，如有需要自己手动 encode
            file_type: 'img',
        };
        config.uploadImgMaxSize = 10 * 1024 * 1024; // 将图片大小限制为 10M
        config.uploadImgMaxLength = 1; // 限制一次最多上传 6 张图片
        config.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间
        config.uploadImgHooks = {
            fail: (result) => {
                // 插入图片失败回调
                console.log(result, 'fail');
            },
            success: (result) => {
                // 图片上传成功回调
                console.log(result, 'success');
            },
            timeout: () => {
                // 网络超时的回调
            },
            error: () => {
                // 图片上传错误的回调
            },
            customInsert: (insertImgFn, data) => {
                let img = this.getFileAccessHttpUrl(data.result.uuid);
                insertImgFn(img);
            },
        };
        // 配置 onchange 回调函数，将数据同步到 vue 中
        config.onchange = (newHtml) => {
            this.editorData = newHtml;
            let valueNum = newHtml.length;
            if (valueNum > this.stringSize) {
                this.$message.error('输入的内容超出限制，请整理后重新输入');
            }
            this.$emit('input', this.editorData);
            // this.$emit('change', { val: this.editorData });
        };
        config.showLinkImg = true;
        // config.uploadImgServer = config.uploadFileName = 'file';
        config.zIndex = 8;
        //自定义上传参数
        config.uploadImgParams = {
            // from: 'editor',
        };
        // 创建编辑器
        editor.create();
        //禁用编辑器
        if (this.disabled) {
            editor.disable();
        }

        //如果默认传递content值则渲染默认内容
        if (this.value) {
            editor.txt.html(this.preventXss(this.value));
        }
        this.editor = editor;
    },
    methods: {
        // 自定义校验链接
        customCheckLinkFn(text, url) {
            if (!url) {
                return;
            }
            if (!text) {
                return;
            }

            if (!/^[\u4e00-\u9fa5\s0-9a-zA-Z-_]+$/.test(text)) {
                Message({ type: 'error', message: '链接文字只能够包含汉字、字母、数字、-、_、空格' });
                return;
            }

            if (url.indexOf('http') !== 0) {
                Message({ type: 'error', message: '链接必须以 http/https 开头' });
                return;
            }
            return true;

            // 返回值有三种选择：
            // 1. 返回 true ，说明检查通过，编辑器将正常插入链接
            // 2. 返回一个字符串，说明检查未通过，编辑器会阻止插入。会 alert 出错误信息（即返回的字符串）
            // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止插入。但不会提示任何信息
        },

        //防止xss攻击
        preventXss(html) {
            //可以自定义白名单
            // var options = {};
            // let myxss = new xss.FilterXSS(options);
            return this.$audaquePreventXss(html, this.$xssWhitelist);
            // return myxss.process(html);
        },
        getEditorData() {
            // 通过代码获取编辑器内容
            let data = this.editor.txt.html();
        },
        setEditorData(newHtml) {
            // 通过代码设置编辑器内容
            this.editorData = newHtml;
            this.editor.txt.html(newHtml);
        },
        getFileAccessHttpUrl(uuid) {
            return API['form.data.file.download'] + '?uuid=' + uuid + '&t=' + Date.now();
        },
        genID(length) {
            return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
        },
    },
    beforeDestroy() {
        // 调用销毁 API 对当前编辑器实例进行销毁
        this.editor.destroy();
        this.editor = null;
    },
};
</script>
<style>
.home {
    width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 999 !important;
}
.text {
    border: 1px solid #ccc;
}
</style>
