<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>催收管理</el-breadcrumb-item>
        <el-breadcrumb-item>催收列表</el-breadcrumb-item>
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
      <div class="overDue">
        <el-badge :value="total" class="item">
          <el-button size="small" @click="on_refresh">全部</el-button>
        </el-badge>
        <el-badge :value="overDue1" class="item">
          <el-button size="small" @click="loanList(1)">今日逾期</el-button>
        </el-badge>
        <el-badge :value="overDue2" class="item">
          <el-button size="small" @click="loanList(2)">昨日逾期</el-button>
        </el-badge>
        <el-badge :value="overDue3" class="item">
          <el-button size="small" @click="loanList(3)">逾期3天</el-button>
        </el-badge>
        <el-badge :value="overDue4" class="item">
          <el-button size="small" @click="loanList(4)">逾期0-7天</el-button>
        </el-badge>
        <el-badge :value="overDue7" class="item">
          <el-button size="small" @click="loanList(7)">逾期8-30天</el-button>
        </el-badge>
        <el-badge :value="overDue5" class="item">
          <el-button size="small" @click="loanList(5)">逾期31-60天</el-button>
        </el-badge>
        <el-badge :value="overDue6" class="item">
          <el-button size="small" @click="loanList(6)">逾期60天以上</el-button>
        </el-badge>
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
        <el-table-column prop="orderCusLoanEv.dueTime" label="借款期限(天)" width="110"></el-table-column>
        <el-table-column prop="renewalDay" label="续期天数" width="120"></el-table-column>
        <el-table-column prop="renewalAmount" label="续期金额(元)" width="115"></el-table-column>
        <el-table-column prop="repayEndtime" label="还款截止时间" width="170"></el-table-column>
        <el-table-column prop="remarks" label="备注" min-width=120></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain
                       @click="handleClick(scope.row)">催收
            </el-button>
            <el-button size="mini" type="primary" plain @click="userinfo(scope.row)">查看档案
            </el-button>
            <el-button size="mini" type="primary" plain @click="_getLoanCollects(scope.row)">查看日志
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
    <el-dialog
      title="日志"
      :visible.sync="centerDialogVisible"
      width="40%"
      center>
      <el-table :data="getLoanList" border>
        <el-table-column property="shopUserName" label="备注操作人" width="150"></el-table-column>
        <el-table-column property="addTime" label="备注时间" width="200"></el-table-column>
        <el-table-column property="remark" label="内容"></el-table-column>
      </el-table>
    </el-dialog>
  </el-row>
</template>
<script>
  import util from "../../common/util";
  import waves from "@/common/waves/index.js"; // 水波纹指令
  import Api from "@/api";
  import sessionStorage from '@/storage/sessionStorage'
  import proConfig from '../../config';

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
        listQuery: {
          page: 15,
          limit: 1,
          type: undefined,
          startTime: "",
          endTime: ""
        },
        centerDialogVisible: false,
        remindList: [{
          orderCusLoanEv: {
            tradeInfo: ''
          }
        }],
        overDue1: '',
        overDue2: '',
        overDue3: '',
        overDue4: '',
        overDue5: '',
        overDue6: '',
        overDue7: '',
        types: null,
        total: 0,
        getLoanList: [],
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
        labelPosition: 'top',
        form: {}
      };
    },
    created() {
      this.loanList();
    },
    methods: {
      //分页
      handleCurrentChange(val) {
        this.listQuery.limit = val;
        this.loanList(this.types);
      },
      handleFilter() {
        this.loanList();
      },
      on_refresh() {
        this.search.cusName = '';
        this.search.cusMobile = '';
        this.listQuery.type = '';
        this.timeQuantum = null;
        this.loanList()
      },

      //获取参数列表-
      loanList(type) {
        this.types = type;
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
          type: type
        };
        this.listLoading = true;
        var self = this;
        Api.testApi.loanCollectList(util.checkBe(para)).then(res => {
          if (res.code == '0000') {
            if (res.data) {
              if (res.data.orderCusLoanDetailEvs) {
                this.overDue1 = res.data.overDue1
                this.overDue2 = res.data.overDue2
                this.overDue3 = res.data.overDue3
                this.overDue4 = res.data.overDue4
                this.overDue5 = res.data.overDue5
                this.overDue6 = res.data.overDue6
                this.overDue7 = res.data.overDue7
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
      //点击推送催收
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
              cusId: s.cusId,
              remark: value
            };
            Api.testApi.updateLoanDetailRemarks(util.checkBe(para)).then(res => {
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
      //日志
      _getLoanCollects(row) {
        this.getLoanList = [];
        this.centerDialogVisible = true
        let para = {
          detailId: row.detailId
        }
        Api.testApi.getLoanCollects(para).then(res => {
          if (res.code === '0000') {
            if (res.data) {
              for (let v of res.data) {
                v.addTime = util.formatDate.format(new Date(v.addTime), "yyyy-MM-dd hh:mm:ss")
              }
              this.getLoanList = res.data
            }
          }
        })
      },
      userinfo(row) {
        sessionStorage.$setSessionStorageByName("cusId", row.cusId);
        window.open(window.location.origin + proConfig.openurl)
      },
      //返回表格内标签的类型
      returnTagType(status) {
        switch (status) {
          case 0:
            return "primary";
          case 1:
            return "success";
          case 5:
            return "info";
        }
      },
      //返回表格内标签的内容
      returnTagValue(status) {
        switch (status) {
          case 0:
            return "待打款";
          case 1:
            return "打款成功";
          case 5:
            return "取消订单";
        }
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

  .overDue {
    margin-bottom: 15px;
    .item {
      margin-right: 20px;
    }
  }

</style>
