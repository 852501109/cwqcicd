import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';

/**
 * @param  ele          要生成 pdf 的DOM元素（容器）
 * @param  padfName     PDF文件生成后的文件名字
 * */

function downloadPDF(ele, pdfName) {
    let eleW = ele.offsetWidth; // 获得该容器的宽
    let eleH = ele.offsetHeight; // 获得该容器的高
    let eleOffsetTop = ele.offsetTop; // 获得该容器到文档顶部的距离
    let eleOffsetLeft = ele.offsetLeft; // 获得该容器到文档最左的距离

    var canvas = document.createElement('canvas');
    var abs = 0;

    let win_in = document.documentElement.clientWidth || document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
    let win_out = window.innerWidth; // 获得当前窗口的宽度（包含滚动条）

    if (win_out > win_in) {
        // abs = (win_o - win_i)/2;    // 获得滚动条长度的一半
        abs = (win_out - win_in) / 2; // 获得滚动条宽度的一半
        // console.log(a, '新abs');
    }
    canvas.width = eleW * 2; // 将画布宽&&高放大两倍
    canvas.height = eleH * 2;

    var context = canvas.getContext('2d');
    context.scale(2, 2);
    context.translate(-eleOffsetLeft - abs, -eleOffsetTop);
    // 这里默认横向没有滚动条的情况，因为offset.left(),有无滚动条的时候存在差值，因此
    // translate的时候，要把这个差值去掉

    // html2canvas(element).then( (canvas)=>{ //报错
    // html2canvas(element[0]).then( (canvas)=>{
    html2canvas(ele, {
        background: 'transparent',
        dpi: window.devicePixelRatio * 2,
        scale: 2,
        // allowTaint: true,  //允许 canvas 污染， allowTaint参数要去掉，否则是无法通过toDataURL导出canvas数据的
        useCORS: true, //允许canvas画布内 可以跨域请求外部链接图片, 允许跨域请求。
    }).then((canvas) => {
        var contentWidth = canvas.width;
        var contentHeight = canvas.height;
        //一页pdf显示html页面生成的canvas高度;
        var pageHeight = (contentWidth / 592.28) * 841.89;
        //未生成pdf的html页面高度
        var leftHeight = contentHeight;
        //页面偏移
        var position = 0;
        //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        var imgWidth = 565.28;
        var imgHeight = (595.28 / contentWidth) * contentHeight;
        var pageData = canvas.toDataURL('image/jpeg', 1.0);
        var pdf = new JsPDF('', 'pt', 'a4');
        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
            //在pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置在pdf中显示；
            pdf.addImage(pageData, 'JPEG', 10, 10, imgWidth, imgHeight);
            // pdf.addImage(pageData, 'JPEG', 20, 40, imgWidth, imgHeight);
        } else {
            // 分页
            while (leftHeight > 0) {
                pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                leftHeight -= pageHeight;
                position -= 841.89;
                //避免添加空白页
                if (leftHeight > 0) {
                    pdf.addPage();
                }
            }
        }
        //可动态生成
        pdf.save(pdfName);
    });
}
/*多行文本和编辑框在导出时为空白。需要特殊转换。将内容用div包裹替换*/
function loadNode(ele, pdfName, title) {
    document.getElementById('copyFormNode').innerHTML = ''; //清空节点
    /*替换编辑器组件*/
    let originalNode = ele; //原始的节点
    let orginalIframe = originalNode.getElementsByClassName('tox-edit-area__iframe'); //
    document.getElementById('copyFormNode').appendChild(originalNode.cloneNode(true)); //复制一个节点
    let copyNode = document.querySelector('#copyFormNode'); //复制出来的节点
    // var titleNode = document.createElement('div'); //新增标题的节点
    // titleNode.className = 'download-title'; //导出标题的class
    // var first = document.getElementById('copyFormNode').firstChild; //查找下面的第一个节点
    // titleNode.innerHTML = title ? title : ''; //标题
    // copyNode.insertBefore(titleNode, first);
    for (var i = 0; i < orginalIframe.length; i++) {
        copyNode.getElementsByClassName('tinymce-editor')[i].innerHTML = orginalIframe[
            i
        ].contentWindow.document.querySelector('html').innerHTML;
    }
    /*替换多行文本组件*/
    let textareaNode = copyNode.getElementsByClassName('el-textarea');
    for (let j = 0; j < textareaNode.length; j++) {
        let value = document.getElementsByClassName('el-textarea__inner')[j].value;
        value = value.replace(/[(^*\n*)|(^*\r*)]/g, '<br />');
        copyNode.getElementsByClassName('el-textarea')[j].innerHTML = value;
    }
    downloadPDF(copyNode, pdfName);
}
export default {
    downloadPDF,
    loadNode,
};
