<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>代理管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/proxylist' }">代理列表</el-breadcrumb-item>
        <el-breadcrumb-item>统计</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <div class="filter-container">
        <el-input clearable @keyup.enter.native="handleFilter" v-model="search.shopId" style="width: 200px;"
                  class="filter-item"
                  placeholder="代理编号">
        </el-input>
        <!--<el-input clearable @keyup.enter.native="handleFilter" v-model="search.shopName" style="width: 200px;"-->
        <!--class="filter-item"-->
        <!--placeholder="商家名称">-->
        <!--</el-input>-->
        <el-button @click.stop="on_refresh" class="filter-item" size="small" style="font-size: 16px;" plain v-waves
                   icon="el-icon-refresh"></el-button>
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <!--<el-button type="primary" icon="el-icon-plus" v-waves @click="showAddDialog">添加代理-->
        <!--</el-button>-->
      </div>

      <!--列表-->
      <el-table :data="merchantList" highlight-current-row
                element-loading-text="拼命加载中" v-loading="listLoading"
                @selection-change="selsChange"
                style="width: 100%;">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="dateTime" label="统计日期"></el-table-column>
        <el-table-column prop="proxyInfo.inviteCode" label="代理邀请码"></el-table-column>
        <el-table-column prop="proxyInfo.proxyMobile" label="代理账户"></el-table-column>
        <el-table-column prop="proxyInfo.proxyName" label="公司名称"></el-table-column>
        <el-table-column prop="registerNum" label="推广用户数" width="150">
          <template slot-scope="scope">
            {{scope.row.registerNum?parseFloat(scope.row.registerNum):'0'}}
          </template>
        </el-table-column>
        <el-table-column prop="certifiedNum" label="通过人数">
          <template slot-scope="scope">
            {{scope.row.certifiedNum?parseFloat(scope.row.certifiedNum):'0'}}
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar pad-a">
        <!--<el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>-->

        <!--分页-->
        <div v-show="merchantList.length" style="float: right" class="pagination-container">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.limit"
            :page-size="listQuery.page"
            layout="prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-col>
    </el-col>

  </el-row>
</template>
<script>
  import util from "../../common/util";
  import waves from "@/common/waves/index"; // 水波纹指令
  import sessionStorage from "@/storage/sessionStorage";
  import Api from "@/api";

  export default {
    directives: {
      waves
    },
    data() {
      return {
        search: {
          shopId: "",
          shopName: ""
        },
        sysuerlist: [],
        merchantList: [],
        total: 0,
        listQuery: {
          page: 15,
          limit: 1,
          shopId: "",
          startTime: "",
          endTime: "",
          type: undefined
        },
        listLoading: false,
        sels: [], //列表选中列
        //编辑相关数据
        FormTtile: "", //新增编辑title
        editFormVisible: false, //新增编辑界面是否显示
        btnEditText: "提 交",
        editLoading: false,
        editFormRules: {
          //          name: [
          //            {required: true, message: '1', trigger: 'blur'}
          //          ],
        },
      };
    },
    watch: {
      editFormVisible: "querydata"
    },
    mounted() {
      this.businessist();
    },

    methods: {
      querydata() {
        if (this.editFormVisible) {
          console.log("hhh", this.editFormVisible);
        } else {
          this.clearUploadedImage();
        }
      },
      handleCurrentChange(val) {
        this.listQuery.limit = val;
        this.businessist();
      },
      handleFilter() {
        this.businessist();
      },
      //刷新
      on_refresh() {
        this.search.shopId = '';
        this.search.shopName = '';
        this.businessist()
      },
      //获取商户列表
      businessist() {
        let shopUserId = sessionStorage.$getSessionStorageByName('shopUserId')
        let para = {
          shopUserId: shopUserId,
          pSize: this.listQuery.page,
          pNum: this.listQuery.limit,
        }
        Api.testApi.proxyStatisticslist(para).then(res => {
          if (res.code === '0000') {
            if (res.data.proxyStatisticsList) {
              let resData = res.data.proxyStatisticsList
              for (let i = 0; i < resData.length; i++) {
                resData[i].dateTime = util.formatDate.format(new Date(resData[i].dateTime), 'yyyy-MM-dd')
                resData[i].proxyInfo = JSON.parse(resData[i].proxyInfo)
              }
              this.merchantList = resData
              this.total = res.data.total
            } else {
              this.total = 0
              this.merchantList = []
            }
          }
        })
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
    },

    components: {}
  };
</script>

<style type="text/scss" lang="scss" scoped>
  .demo-table-expand label {
    font-weight: bold;
  }

  .filter-container {
    padding: 20px 0;
  }

  /*图片上传*/
  .el-upload--picture-card img {
    width: 100%;
    height: 100%;
  }

  .disabled {
    width: 148px;
    height: 148px;
    overflow: hidden;
  }

  .uploadingImg {
    display: flex;
  }
</style>
