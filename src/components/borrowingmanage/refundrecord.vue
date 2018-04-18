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
        <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="交易类型">
          <el-option v-for="item in platformName" :key="item.key" :label="item.status"
                     :value="item.key">
          </el-option>
        </el-select>
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
        <el-table-column prop="loanId" label="借款编号" width="155"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
        <el-table-column prop="amount" label="交易金额" width="80"></el-table-column>
        <el-table-column prop="cusMobile" label="手机号" width="120"></el-table-column>
        <el-table-column prop="cusName" label="姓名" width="65"></el-table-column>
        <el-table-column prop="type" label="交易类型" width="80"></el-table-column>
        <el-table-column prop="tradeTime" label="借款日期" width="160"></el-table-column>
        <el-table-column prop="repayEndTime" label="还款时间" width="160"></el-table-column>
        <el-table-column prop="remark" min-width="160" label="备注"></el-table-column>
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

  const platformName = [
    {key: "1", status: "还款"},
    {key: "2", status: "续期"},
  ];

  // arr to obj
  const platformNameKeyValue = platformName.reduce((acc, cur) => {
    acc[cur.key] = cur.status;
    return acc;
  }, {});
  export default {
    directives: {
      waves
    },
    data() {
      return {
        platformName,
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
          page: 15,
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
    filters: {
      typeFilter(type) {
        return platformNameKeyValue[type];
      }
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
        let startTime = null;
        let endTime = null;
        this.sumAmount = '';
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
          endTime: endTime || "",
          type: this.listQuery.type
        };
        //        console.log('para', para)
        this.listLoading = true;
        Api.testApi.logOrderCusRepayRenewalList(util.checkBe(para)).then(res => {
          if (res.code == "0000") {
            if (res.data) {
              if (res.data.repayRenewalList) {
                for (let i = 0; i < res.data.repayRenewalList.length; i++) {
                  res.data.repayRenewalList[i].tradeTime = util.formatDate.format(
                    new Date(res.data.repayRenewalList[i].tradeTime),
                    "yyyy-MM-dd hh:mm:ss"
                  );
                  res.data.repayRenewalList[i].repayEndTime = util.formatDate.format(
                    new Date(res.data.repayRenewalList[i].repayEndTime),
                    "yyyy-MM-dd hh:mm:ss"
                  );
                  res.data.repayRenewalList[i].createTime = util.formatDate.format(
                    new Date(res.data.repayRenewalList[i].createTime),
                    "yyyy-MM-dd hh:mm:ss"
                  );
                  res.data.repayRenewalList[i].type = this.returnTypeValue(
                    res.data.repayRenewalList[i].type
                  );
                }
                this.total = res.data.total;
                this.sumAmount = res.data.sumAmount
                this.borrowing = res.data.repayRenewalList;
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
      returnTypeValue(status) {
        switch (status) {
          case 1:
            return "还款";
          case 2:
            return "续期";
        }
      }
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
