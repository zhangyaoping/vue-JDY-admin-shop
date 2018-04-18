<template>
  <!-- 倒计时组件 -->
  <div class="count-down-wraper">
    <input type="button" v-if="!disable" v-model="btnName" class="get-code get-code-off" v-on:click="getCode();"/>
    <input type="button" v-if="disable" v-model="btnName" class="get-code get-code-on" disabled/>
  </div>
</template>

<script>
  import Api from '@/api'

  export default {
    data() {
      return {
        btnName: '获取验证码',
        disable: false
      }
    },
    methods: {
      getCode() {
        let num = 60;
        this.disable = true;
        let timer = setInterval(() => {
          num -= 1;
          this.btnName = num + 's后重试';
          if (num < 1) {
            this.disable = false;
            this.btnName = '获取验证码';
            clearInterval(timer);
            timer = null;
          }
        }, 1000);
        Api.testApi.sendMessage().then(res => {
          if (res.code === '0000') {

          }
        })
      }
    }
  }
</script>

<style scoped lang="scss" rel="text/scss">
  .get-code {
    position: absolute;
    right: 10px;
    top: 5px;
    width: 90px;
    height: 30px;
    background-color: #fff;
    font-size: 13px;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    outline: none;
  }

  .get-code-on {
    color: #b4b4b4;
  }

  .get-code-off {
    color: #2577e3;
  }
</style>
