<template>
  <el-row class="warp">
     {{roleName}}! 欢迎登录。
  </el-row>
</template>
<script>
  import util from "../../common/util";
  import waves from "@/common/waves/index" // 水波纹指令
  import Api from "@/api"
  import sessionStorage from '@/storage/sessionStorage'

  export default {
    name: 'home',
    data() {
      return {
        roleName: '',
      };
    },
    directives: {
      waves
    },
    components: {

    },
    created() {
      this.roleName = decodeURI(sessionStorage.$getSessionStorageByName('roleName'))
    },
    mounted() {
    },
    methods: {
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .warp {
    position: relative;

    .operator {
      position: absolute;
      top: 0;
      left: 20px;
    }
  }

  .warp-main {
    margin-top: 60px;
    .tit {
      font-size: 18px;
      font-weight: bolder;
      text-align: center;
      margin-bottom: 20px;
      position: relative;
      .totalMoney {
        position: absolute;
        right: 0;
        font-size: 16px;
      }
    }
  }
</style>
