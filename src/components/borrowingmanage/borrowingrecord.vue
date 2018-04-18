<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>借款管理</el-breadcrumb-item>
        <el-breadcrumb-item>借款记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <div class="filter-container">
        <el-input clearable @keyup.enter.native="handleFilter" v-model="search.moble" style="width: 200px;"
                  class="filter-item"
                  placeholder="手机号">
        </el-input>
        <!--<el-input clearable @keyup.enter.native="handleFilter" v-model="search.name" style="width: 200px;"-->
        <!--class="filter-item"-->
        <!--placeholder="姓名">-->
        <!--</el-input>-->

        <el-date-picker
          v-model="timeQuantum"
          type="datetimerange"
          :picker-options="pickerOptions2"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
        <el-button @click.stop="on_refresh" class="filter-item" size="small" style="font-size: 16px;" plain v-waves
                   icon="el-icon-refresh"></el-button>
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
      <div class="sumAmount">
        <span class="span1">总金额：</span><span class="span2">{{sumAmount?parseFloat(sumAmount).toFixed(2):'0.00'}}</span>
      </div>
      <!--列表-->
      <el-table :data="borrowing" border highlight-current-row element-loading-text="拼命加载中" v-loading="listLoading"
                style="width: 100%;">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <!--<el-table-column type="index" width="60"></el-table-column>-->
        <el-table-column width="155" prop="loanId" label="借款编号"></el-table-column>
        <el-table-column width="115" prop="cusMobile" label="手机号"></el-table-column>
        <el-table-column width="65" prop="cusName" label="姓名"></el-table-column>
        <el-table-column width="80" prop="loanCapital" label="打款金额"></el-table-column>
        <!--<el-table-column prop="hahaha" label="利息"></el-table-column>-->
        <!--<el-table-column prop="hahaha" label="账号管理费"></el-table-column>-->
        <!--<el-table-column prop="hahaha" label="快速信审费"></el-table-column>-->
        <el-table-column prop="addTime" label="打款时间" width="170"></el-table-column>
        <el-table-column prop="orderFlowId" min-width="155" label="流水号"></el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar pad-a">
        <!--分页-->
        <div v-show="!listLoading" style="float: right" class="pagination-container">
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
  import waves from "@/common/waves/index.js"; // 水波纹指令
  import Api from "@/api";

  export default {
    directives: {
      waves
    },
    data() {
      return {
        search: {moble: "", name: ""},
        pickerOptions2: {
          shortcuts: [
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        timeQuantum: "", //时间段
        borrowing: [],
        sumAmount: '',
        total: 0,
        listQuery: {
          page: 7,
          limit: 1,
          type: undefined,
          shopId: "",
          productName: "",
          startTime: "",
          endTime: ""
        },
        listLoading: false
      };
    },

    methods: {
      //分页
      handleCurrentChange(val) {
        this.listQuery.limit = val;
        this.loanRecordList();
      },
      handleFilter() {
        this.loanRecordList();
      },
      on_refresh() {
        this.search.moble = '';
        this.timeQuantum = null;
        this.loanRecordList();
      },
      //获取借款记录列表
      loanRecordList() {
        this.sumAmount = '';
        let startTime = null;
        let endTime = null;
        if (this.timeQuantum) {
          startTime = util.formatDate.format(
            new Date(this.timeQuantum[0]),
            "yyyy-MM-dd hh:mm:ss"
          );
          endTime = util.formatDate.format(
            new Date(this.timeQuantum[1]),
            "yyyy-MM-dd hh:mm:ss"
          );
        }
        let para = {
          pSize: this.listQuery.page,
          pNum: this.listQuery.limit,
          cusMobile: this.search.moble,
          startTime: startTime || "",
          endTime: endTime || ""
        };
        //        console.log('para', para)
        this.listLoading = true;
        Api.testApi.loanRecordList(util.checkBe(para)).then(res => {
          if (res.code == "0000") {
            if (res.data) {
              if (res.data.logOrderCusLoanEvs) {
                for (let i = 0; i < res.data.logOrderCusLoanEvs.length; i++) {
                  res.data.logOrderCusLoanEvs[i].addTime = util.formatDate.format(
                    new Date(res.data.logOrderCusLoanEvs[i].addTime),
                    "yyyy-MM-dd hh:mm:ss"
                  );
                }
                this.total = res.data.total;
                this.sumAmount = res.data.sumAmount
                this.borrowing = res.data.logOrderCusLoanEvs;
                this.listLoading = false
              }
            } else {
              this.listLoading = false
              this.borrowing = [];
              this.total = 0
            }
          }
        });
      },
    },
    mounted() {
      this.loanRecordList();
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
    line-height: 50px;
  }

  .el-date-editor .el-range-separator {
    width: 7% !important;
  }

  .sumAmount {
    display: flex;
    align-items: center;
    border: 1px solid #ebeef5;
    margin-bottom: 10px;
    padding: 15px 10px;
    .span1 {
      font-size: 18px;
    }
    .span2 {
      display: inline-block;
      width: 200px;
      background-color: #00C1DE;
      color: #000000;
      padding: 6px 20px;
      font-size: 16px;
      border-radius: 15px;
    }
  }
</style>
