<template>
  <van-form @submit="onSubmit">
    <van-field
      v-model="licenseNumber"
      name="号牌号码"
      placeholder="请输入号牌号码"
      class="select_and_input"
      :rules="[{ validator, message: '请输入正确的号牌号码', trigger: 'onBlur' }]"
    >
      <template #label>
        <div class="customlable">
          <div><span style="color: red">*&nbsp;</span><span>号牌号码</span></div>
          <div @click="show = true" class="sufix">{{ sufix }}<van-icon name="arrow-down" /></div>
        </div>
      </template>
    </van-field>
    <van-button type="primary" size="large" native-type="submit" class="btn">备案</van-button>
  </van-form>
  <div class="tip"
    >若需要备案非本人机动车，<span
      class="text-underline"
      @click="$router.push('/filingsMotorVehicleNotSelf')"
      >请点击此处</span
    ></div
  >
  <van-action-sheet
    description="从以下来源中选择"
    v-model:show="show"
    :actions="actions"
    @select="onSelect"
    cancel-text="取消"
    close-on-click-action
  />
</template>

<script setup lang="ts">
  const show = ref(false);
  const sufix = ref('鲁B');
  const actions = ref([{ name: '鲁B' }, { name: '鲁U' }]);
  const onSelect = (item: any) => {
    show.value = false;
    sufix.value = item.name;
  };
  const pattern = /^[A-Z0-9]{6}$/;
  const validator = (val: string) => pattern.test(val);

  const onSubmit = () => {
    console.log('提交');
  };
  const licenseNumber = ref('');
</script>
<style lang="less" scoped>
  .btn {
    margin-top: 25px;
  }
  .text-underline {
    border-bottom: 2px solid #457cc9;
  }
  .tip {
    margin-top: 60px;
    width: 100%;
    text-align: center;
    font-size: 30px;
    color: #457cc9;
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
  /deep/ .customlable {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 310px !important;
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
