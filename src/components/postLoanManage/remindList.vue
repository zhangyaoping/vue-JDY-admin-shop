<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>借款管理</el-breadcrumb-item>
        <el-breadcrumb-item>提醒列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <div class="filter-container">
        <el-input clearable @keyup.enter.native="handleFilter" v-model="search.cusName" style="width: 200px;"
                  class="filter-item"
                  placeholder="姓名">
        </el-input>
        <el-input clearable @keyup.enter.native="handleFilter" v-model="search.cusMobile" style="width: 200px;"
                  class="filter-item"
                  placeholder="手机号">
        </el-input>
        <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="状态">
          <el-option v-for="item in platformName" :key="item.key" :label="item.status"
                     :value="item.key">
          </el-option>
        </el-select>
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
        <el-button class="filter-item" style="width: 90px;" type="primary" v-waves icon="el-icon-search"
                   @click="handleFilter">
          搜索
        </el-button>
      </div>

      <!-- 列表 -->
      <el-table :data="remindList" border highlight-current-row element-loading-text="拼命加载中" v-loading="listLoading"
                style="width: 100%;">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="loanId" label="借款编号" width="155"></el-table-column>
        <el-table-column prop="orderCusLoanEv.cusMobile" width="115" label="手机号"></el-table-column>
        <el-table-column prop="orderCusLoanEv.cusName" width="65" label="姓名"></el-table-column>
        <el-table-column prop="orderCusLoanEv.idCard" width="170" label="身份证"></el-table-column>
        <el-table-column prop="currentStage" label="分期数" width="65"></el-table-column>
        <el-table-column prop="loanCapital" label="借款金额(元)" width="115"></el-table-column>
        <el-table-column prop="renewalAmount" label="续期金额(元)" width="115"></el-table-column>
        <el-table-column prop="loanLateFee" label="滞纳金(元)" width="100"></el-table-column>
        <el-table-column prop="repayEndtime" label="还款时间" width="170"></el-table-column>
        <el-table-column prop="overdueDay" width="110" label="还款到期天数">
          <template slot-scope="scope">
            <span>{{scope.row.overdueDay<0?JSON.stringify(scope.row.overdueDay).replace('-',''):'0'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDay" label="逾期天数" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.overdueDay>0?scope.row.overdueDay:'0'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDay" label="借款状态" width="100">
          <template slot-scope="scope">
            <el-tag
              size="small"
              :type="returnTagType(scope.row.pushStatus)"
              close-transition>{{returnTagValue(scope.row.pushStatus)}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="primary"
                       @click="handleClick(scope.row)">提交催收
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 工具条 -->
      <el-col :span="24" class="toolbar pad-a">
        <!--分页 -->
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
  import sessionStorage from '@/storage/sessionStorage'
  import proConfig from '../../config';

  const platformName = [
    {key: '3', status: '全部'},
    {key: '1', status: '已催收'},
    {key: '2', status: '未催收'},
  ]

  // arr to obj
  const platformNameKeyValue = platformName.reduce((acc, cur) => {
    acc[cur.key] = cur.status
    return acc
  }, {})
  export default {
    directives: {
      waves
    },
    data() {
      return {
        //分页
        search: {
          cusName: "",
          cusMobile: ""
        },
        platformName,
        listQuery: {
          page: 15,
          limit: 1,
          type: '2',
          startTime: "",
          endTime: ""
        },
        remindList: [{
          orderCusLoanEv: {
            tradeInfo: ''
          }
        }],
        total: 0,

        listLoading: false,
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
        //弹出框
        labelPosition: 'top',
        form: {}
      };
    },
    created() {
      this.loanList();
    },
    filters: {
      typeFilter(type) {
        return platformNameKeyValue[type]
      }
    },
    methods: {
      //分页
      handleCurrentChange(val) {
        this.listQuery.limit = val;
        this.loanList();
      },
      handleFilter() {
        this.loanList();
      },
      on_refresh() {
        this.search.cusName = '';
        this.search.cusMobile = '';
        this.listQuery.type = '2';
        this.timeQuantum = null;
        this.loanList()
      },

      //获取参数列表-
      loanList() {
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
          cusName: this.search.cusName,
          cusMobile: this.search.cusMobile,
          startTime: startTime,
          endTime: endTime,
          type: this.listQuery.type
        };
        this.listLoading = true;
        var self = this;
        Api.testApi.loanCollectDayBeforeList(util.checkBe(para)).then(res => {
          if (res.code == '0000') {
            if (res.data) {
              if (res.data.orderCusLoanDetailEvs) {
                let datas = res.data.orderCusLoanDetailEvs;
                for (let v of datas) {
                  if (v.orderCusLoanEv) {
                    v.orderCusLoanEv.tradeInfo = JSON.parse(v.orderCusLoanEv.tradeInfo)
                  }
                  v.repayEndtime = util.formatDate.format(
                    new Date(v.repayEndtime),
                    "yyyy-MM-dd hh:mm:ss"
                  );
                }
                this.total = res.data.total;
                this.remindList = datas;
                this.listLoading = false
              }
            } else {
              this.listLoading = false;
              this.remindList = [];
              this.total = 0
            }
            // console.log(this.remindList)
          }
        });
      },
      //点击推送
      handleClick(s) {
        this.$prompt("备注", "催收", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputType: "textarea"
        }).then(({value}) => {
          if (value == null) {
            this.$message({
              message: "请填写备注!",
              type: "warning"
            });
          } else {
            let para = {
              detailId: s.detailId,
              remarks: value
            };
            Api.testApi.UpdateloanCollect(util.checkBe(para)).then(res => {
              if (res.code == "0000") {
                this.$message({
                  message: "操作成功!",
                  type: "success"
                });
                this.loanList();
              }
            });
          }
        })
      },
      //返回表格内标签的类型
      returnTagType(status) {
        switch (status) {
          case 1:
            return 'danger';
          case 1:
            return '';
        }
        // if (status > 0) {
        //   return status = 'danger'
        // }
        // if (status < 0) {
        //   return status = ''
        // }
      },
      //返回表格内标签的内容
      returnTagValue(status) {
        console.log('res', status)
        switch (status) {
          case 1:
            return "已催收";
          case 0:
            return "未催收";
        }
        // if (status > 0) {
        //   return status = '已逾期'
        // }
        // if (status <= 0) {
        //   return status = '借款中'
        // }
      }
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

</style>
