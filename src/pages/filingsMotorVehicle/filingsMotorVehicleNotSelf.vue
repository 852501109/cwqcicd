<template>
  <van-form @submit="onSubmit">
    <van-field
      v-model="form.slot1"
      name="号牌号码"
      placeholder="请输入号牌号码"
      class="select_and_input"
      :rules="[{ validator: validatorLicense, message: '请输入正确的号牌号码', trigger: 'onBlur' }]"
    >
      <template #label>
        <div class="customlabel_license">
          <div><span style="color: red">*&nbsp;</span><span>号牌号码</span></div>
          <div class="sufix" @click="showLicense = true"
            >{{ sufixLicense }}<van-icon name="arrow-down"
          /></div>
        </div>
      </template>
    </van-field>
    <van-field
      v-model="form.slot2"
      label-class="customlabel"
      placeholder="请输入发动机号后六位"
      :rules="[{ validator: validatorEngine, message: '请输入正确发动机后6位', trigger: 'onBlur' }]"
    >
      <template #label>
        <div class="customlabel_license">
          <div><span style="color: red">*&nbsp;</span><span>发动机号后六位</span></div>
        </div>
      </template>
    </van-field>
    <van-field
      v-model="form.slot3"
      readonly
      label-class="customlabel"
      placeholder="请选择与车主关系"
      @click="showAlax = true"
      :rules="[{ required: true, message: '请选择与车主关系' }]"
      is-link
    >
      <template #label
        ><div class="customlabel_license">
          <div><span style="color: red">*&nbsp;</span><span>与车主关系</span></div>
        </div></template
      >
    </van-field>
    <div class="tip"
      ><van-icon color="#fac60b" name="info-o" />&nbsp;请输入待备案机动车车主收到短信验证码</div
    >
    <van-field v-model="sms" center clearable label="验证码" placeholder="请输入短信验证码">
      <template #button>
        <div v-if="countDown > 0">{{ countDown }}s</div>
        <van-button v-else size="small" type="primary" @click="getCode">获取验证码</van-button>
      </template>
    </van-field>
    <van-button type="primary" size="large" class="btn" native-type="submit">提交</van-button>
  </van-form>
  <van-action-sheet
    description="从以下来源中选择"
    v-model:show="showLicense"
    :actions="actionsLicense"
    @select="onSelectLicense"
    cancel-text="取消"
    close-on-click-action
  />
  <van-action-sheet
    v-model:show="showAlax"
    :actions="actionsAlax"
    @select="onSelectAlax"
    cancel-text="取消"
    close-on-click-action
  />
</template>

<script setup lang="ts">
  import licenseApi from '@/api/license';
  import { Dialog } from 'vant';
  onMounted(() => {
    licenseApi.getRelationshipWithOwner().then((res: any) => {
      actionsAlax.value = res.data;
      // eslint-disable-next-line
      // 在代码中使用类型断言
      console.log((window as any).urldomaincreatesign);
    });
  });
  const showLicense = ref(false);
  const sufixLicense = ref('鲁B');
  const actionsLicense = ref([{ name: '鲁B' }, { name: '鲁U' }]);
  const showAlax = ref(false);
  const actionsAlax = ref([
    { name: '父母' },
    { name: '配偶' },
    { name: '子女' },
    { name: '亲戚' },
    { name: '朋友' },
    { name: '其他' },
  ]);

  const pattern = /^[A-Z0-9]{6}$/;
  const validatorLicense = (val: string) => pattern.test(val);
  const enginePattern = /^[A-Z0-9]{6}$/;
  const validatorEngine = (val: string) => enginePattern.test(val);
  const onSubmit = () => {
    console.log('tijiao');
  };
  const sms = ref('');
  const form = ref({
    slot1: '',
    slot2: '',
    slot3: '',
  });
  const countDown = ref(0);
  const startCountDown = () => {
    if (countDown.value === 0) {
      countDown.value = 30; // 设置倒计时秒数为30秒

      const countDownInterval = setInterval(() => {
        countDown.value--;
        if (countDown.value === 0) {
          clearInterval(countDownInterval);
        }
      }, 1000);
    }
  };
  const onSelectAlax = (item: any) => {
    showAlax.value = false;
    form.value.slot3 = item.name;
  };
  const onSelectLicense = (item: any) => {
    showLicense.value = false;
    sufixLicense.value = item.name;
  };

  const getCode = () => {
    if (!form.value.slot1 || !pattern.test(form.value.slot1)) {
      Dialog({
        message: '请先填写号牌号码',
      }).then(() => {
        // on close
      });
      return;
    }
    startCountDown();
  };
</script>
<style lang="less" scoped>
  .btn {
    margin-top: 25px;
  }
  .text-underline {
    border-bottom: 2px solid #457cc9;
  }
  .tip {
    margin: 50px 0;
    padding-left: 30px;
    width: 100%;
    text-align: left;
    font-size: 30px;
  }
  .flex-container() {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .sufix {
    position: relative;
    z-index: 1;
    width: 110px;
    height: 60px;
    line-height: 60px;
    border-radius: 10px;
    background: #457cc9;
    color: #fff;
    text-align: center;
    margin-top: -7px;
  }
  /deep/ .customlabel {
    width: 220px !important;
  }
  /deep/ .customlabel_license {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 280px !important;
  }
  .select_and_input {
    /deep/ .van-field__body {
      position: relative !important;
      left: 140px !important;
      width: 223px !important;
    }
    /deep/ .van-field__error-message {
      padding-left: 150px !important;
    }
  }
</style>
