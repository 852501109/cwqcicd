<template>
  <div class="already_back">
    <van-field>
      <template #label>归还人姓名</template>
      <template #input>
        {{ form.slot1 }}
      </template>
    </van-field>
    <van-field>
      <template #label> 联系电话</template>
      <template #input>
        {{ form.slot2 }}
      </template>
    </van-field>
    <van-field>
      <template #label> 捡到地址</template>
      <template #input>
        {{ form.slot3 }}
      </template>
    </van-field>
    <van-field>
      <template #label>归还地址</template>
      <template #input>
        {{ form.slot4 }}
      </template>
    </van-field>
    <van-field
      name="uploader"
      :rules="[{ validator: validatorPhoto, message: '请上传号牌照片', trigger: 'onBlur' }]"
    >
      <template #label> 车牌照片</template>
      <template #input>
        <van-uploader v-model="form.slot6" />
      </template>
    </van-field>
    <div style="margin: 16px">
      <van-button round block type="primary">已领取</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  const form = ref({
    slot1: '张三',
    slot2: '15210622405',
    slot3: '青岛市xxxx',
    slot4: '青岛市xxxx',
    slot6: [],
  });
  const show = ref(false);
  const sufix = ref('鲁B');
  const actions = ref([{ name: '鲁B' }, { name: '鲁U' }]);

  const chinaPhoneNumberRegex =
    /^((0\d{2,3}\s?-?\s?\d{7,8})|(1[34578]\d{9})|(400\d{7})|(800\d{7}))$/;

  const validatorTel = (val: string) => chinaPhoneNumberRegex.test(val);

  const validatorPhoto = () => {
    return form.value.slot6.length > 0;
  };
  const onSubmit = () => {
    console.log('提交');
  };

  const onSelect = (item: any) => {
    show.value = false;
    sufix.value = item.name;
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
    margin: 25px 0;
    padding-left: 15px;
    width: 100%;
    text-align: left;
    font-size: 15px;
  }
  .flex-container() {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .sufix {
    position: relative;
    z-index: 1;
    width: 55px;
    height: 30px;
    line-height: 30px;
    border-radius: 5px;
    background: #457cc9;
    color: #fff;
    text-align: center;
    margin-top: -3.5px;
  }
  .already_back {
    margin-top: 10px;
    :deep(.customlabel) {
      width: 110px;
    }
    :deep(.customlable) {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      width: 155px !important;
    }
    :deep(.select_and_input) {
      & .van-field__body {
        position: relative !important;
        left: 70px !important;
        width: 111px !important;
      }
      & .van-field__error-message {
        padding-left: 75px !important;
      }
    }
  }
</style>
