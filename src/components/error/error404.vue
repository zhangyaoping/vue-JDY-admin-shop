<template>
  <div class="errPage-container">
    <el-row>
      <el-col :span="24">
        <img class="img404" :src="errGif1" alt="">
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import errGif from '@/assets/images/401.gif'
  import errGif1 from '@/assets/images/404.gif'

  export default {
    data() {
      return {
        errGif1: errGif1 + '?' + +new Date(),
        ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
        dialogVisible: false
      }
    },
    methods: {}
  }
</script>

<style type="text/scss" lang="scss">
  .errPage-container {
    width: 800px;
    margin: 100px auto;

    .img404 {
      width: 100%;
      height: auto;
    }
  }
</style>
