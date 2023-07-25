
//注意不要重名
let urlConfig=window.urlConfig
const rc= require.context('./modules',false, /\.js$/)
const apiUrls={},
    //PROJECT_NAME= '/vue-test';//配置当前项目基路径
    PROJECT_NAME= urlConfig


rc.keys().forEach(name=>{
    Object.assign(apiUrls,rc(name).default)
})
for(let i in apiUrls){
    if(apiUrls[i].indexOf('eolinker_os')==-1 ) apiUrls[i]= PROJECT_NAME+apiUrls[i]
}
export default apiUrls
