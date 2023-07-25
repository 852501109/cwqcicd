export default {
    changeArray(data) {
        let uInt8Array = new Uint8Array(data);
        let i = uInt8Array.length;
        let binaryString = new Array(i);
        while (i--) {
            binaryString[i] = String.fromCharCode(uInt8Array[i]);
        }
        let datas = binaryString.join('');
        return `data:${data};base64,${datas}`
    },
    /**
     * @param {arrary}  要执行逻辑的队列
     * @param {callback} 执行后的回调函数
     **/
    async syncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    },
    createDownloadFile(url, fileName = '元数据导入模板') {
        let link = document.createElement('a');
        let Suffix = url.substr(url.lastIndexOf("."), url.length)
        link.setAttribute("href", url);
        link.setAttribute("download", fileName + Suffix);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    getChildren(obj, fun, getArr) {
        let that = this
        if (fun === undefined || fun === null) {
            let Newfun = (obj) => {
                obj.forEach((newitem) => {
                    if (newitem.chils) {
                        that.getChildren(newitem.childs, Newfun(newitem.childs), getArr)
                    } else {
                        getArr.push(newitem)
                    }
                })
            }
            that.getChildren(obj, Newfun, getArr)
        } else {
            fun(obj)
        }
        getArr = Array.from(new Set(getArr))
        return getArr
    }
}
