var Toast = {};
//避免重复install，设立flag
Toast.installed = false;
let times = 1000;
Toast.install = function (Vue, options) {
  if (Toast.installed) return;

  let dialog = (option, title) => {
    if (!option.methods) option.methods = {};
    let keys = Object.keys(option);
    if (!keys.includes('showFooter')) option.showFooter = true;
    // 如果页面有toast则不继续执行
    if (document.querySelector('body>.div.vue-toast')) return;
    // 1、创建构造器，定义好提示信息的模板
    times++;
    let cleanClass = `clean-${times}`;
    let tpl,
      dialogOpt = {
        template: `
                    <el-dialog
                        class="vue-toast my-dialog ${option.className || ''} ${cleanClass}"
                        title="${title}"
                        ${option.align || 'center'}
                        @close="cancelEvent_a_d_q('close')"
                        :visible.sync="dialogVisible_a_d_q"
                        :close-on-click-modal="false"
                        :show-close="false"
                        width="${option.width || '400px'}"
                        :before-close="handleBeforeClose_a_d_q"
                    >
                        <div :style="{'overflow-y':'visible'}" class="scroll-bar dialog-content" >
                          <div class="dialog-content-item">${option.template}</div>
                        </div>
                        <div slot="footer" class="dialog-footer" v-if="showFooter">
                            <el-button v-if="!hideCancel_a_d_q" @click.stop="cancelEvent_a_d_q">取 消</el-button>
                            <el-button type="primary"  class="confirm"  @click.stop="okEvent_a_d_q" ><i class="el-icon-loading"></i>{{hideCancel_a_d_q?(okBtnName?okBtnName:'关 闭'):'确 定'}}</el-button>
                        </div>
                    </el-dialog>

                `, //没有取消按钮 就读取确认按钮的名字 负责就是关闭文字
        data() {
          return {
            dialogVisible_a_d_q: true,
            okBtnName: '',
            ...option.data,
            showFooter: option.showFooter
          };
        },
        mounted() {
          this.$nextTick(() => {
            if (option.mounted) {
              option.mounted.bind(this)();
            }
          });
        },
        computed: {
          ...(option.computed || {})
        },
        components: option.components,
        methods: {
          handleBeforeClose_a_d_q() {
            this.hideDialog();
          },
          ...option.methods,
          //点击确认 移除dom 也会触发@close事件x
          cancelEvent_a_d_q(type) {
            if (option.data.rejectCloseEvent && type === 'close') return;
            if (option.methods.cancelEvent) {
              let open = this.cancelEvent(this.$data, ...arguments);
              if (open) {
                this.dialogVisible_a_d_q = true;
              } else {
                this.hideDialog();
              }
            } else {
              this.hideDialog();
            }
          },
          okEvent_a_d_q(e) {
            let confirm = document.querySelector('.vue-toast .confirm');
            confirm.classList.add('is-loading');
            if (option.methods.okEvent) {
              let open = this.okEvent(this.$data, ...arguments);
              if (Object.prototype.toString.apply(open) === '[object Promise]') {
                open.then(res => {
                  this.hideDialog();
                }).catch(err => {
                  this.dialogVisible_a_d_q = true;
                  confirm.classList.remove('is-loading');
                });
              } else {
                if (open) {
                  this.dialogVisible_a_d_q = true;
                  confirm.classList.remove('is-loading');
                } else {
                  this.hideDialog();
                }
              }
            } else {
              this.hideDialog();
            }
          },
          hideDialog() {
            this.dialogVisible_a_d_q = false;
            let confirm = document.querySelector('.vue-toast .confirm');
            if (confirm) {
              confirm.classList.remove('is-loading');
            }
            document.querySelector('.' + cleanClass).classList.remove();
          }
        }
      };

    let toastTip = Vue.extend(dialogOpt);
    // 2、创建实例，挂载到文档以后的地方
    tpl = new toastTip().$mount().$el;
    // 3、把创建的实例添加到body中
    document.body.appendChild(tpl);
    Toast.installed = true;
  };
  Vue.prototype.$toast = {
    warn(option) {
      option.className = option.className + ' dialog-warn';
      option.data = Object.assign({}, option.data, {hideCancel_a_d_q: false});
      dialog(option, '警告');
    },
    error(option) {
      option.className = option.className + ' dialog-error';
      option.data = Object.assign({}, option.data, {hideCancel_a_d_q: true});
      dialog(option, '异常');
    },
    dialog(option) {
      option.className = option.className + ' dialog-info';
      option.data = Object.assign(
        {},
        {hideCancel_a_d_q: false},
        typeof option.data === 'function' ? option.data() : option.data
      );
      dialog(option, option.title || '提示');
    },
    tip(option) {
      option.className = option.className + ' dialog-tip';
      option.data = Object.assign({}, option.data, {hideCancel_a_d_q: true});
      option.align = 'center';

      dialog(option, '提示');
    }
  };
};

export default Toast;
