import audaquePagination from './pagination.vue';
import tableComponent from '@/components/tableComponents';
import adqUploadImg from '@/components/uploadImg';
import adqHtmlPanel from '@/components/htmlPanel';
import formParser from '~/components/parser/Parser'; //
import adqTabs from '@/components/adqTabs';
import tinymce from '@/components/tinymce';
import adqUserListComponent from "./adqUserListComponent";

const pagination = {
    install: function (Vue) {
        Vue.component('tableComponent', tableComponent);
        Vue.component('adqPagination', audaquePagination);
        Vue.component('adqUploadImg', adqUploadImg);
        Vue.component('adqHtmlPanel', adqHtmlPanel);
        Vue.component('formParser', formParser); //表单设计模块的预览
        Vue.component('adqTabs', adqTabs); //
        Vue.component('tinymce', tinymce); //富文本
        Vue.component('adqUserListComponent', adqUserListComponent); //用户下拉列表
    },
};

// 导出组件
export default pagination;
