<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>借款管理</el-breadcrumb-item>
        <el-breadcrumb-item>还款列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <div class="filter-container">
        <el-input clearable @keyup.enter.native="handleFilter" v-model="search.cusMobile" style="width: 200px;"
                  class="filter-item"
                  placeholder="用户手机号">
        </el-input>
        <!--<el-input clearable @keyup.enter.native="handleFilter" v-model="search.cusName" style="width: 200px;"-->
        <!--class="filter-item"-->
        <!--placeholder="用户姓名">-->
        <!--</el-input>-->
        <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="审核状态">
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

      <!--列表-->
      <el-table :data="refundlist" border highlight-current-row element-loading-text="拼命加载中" v-loading="listLoading"
                style="width: 100%;">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <!--<el-table-column type="index" width="60"></el-table-column>-->
        <el-table-column prop="loanId" label="借款编号" width="155"></el-table-column>
        <el-table-column prop="cusMobile" label="手机号" width="115"></el-table-column>
        <el-table-column prop="cusName" label="姓名" width="65"></el-table-column>
        <el-table-column prop="idCard" width="170" label="身份证"></el-table-column>
        <el-table-column prop="currentStage" label="分期数" width="70"></el-table-column>
        <el-table-column prop="loanCapital" label="借条金额" width="80"></el-table-column>
        <el-table-column prop="createTime" label="借款时间" width="160"></el-table-column>
        <el-table-column prop="repayEndtime" label="还款截止时间" width="160"></el-table-column>
        <el-table-column prop="renewalDay" label="续期天数" width="120"></el-table-column>
        <el-table-column prop="renewalAmount" label="续期金额" width="120"></el-table-column>
        <el-table-column prop="detailStatus" label="还款状态" min-width="130">
          <template slot-scope="scope">
            <el-tag
              size="small"
              :type="returnTagType(scope.row.detailStatus)"
              close-transition>{{returnTagValue(scope.row.detailStatus)}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="420">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" :disabled="isBtnTg(scope.row)"
                       @click="getThrough(scope.row)">通过
            </el-button>
            <el-button size="mini" type="danger" :disabled="isBtnTg(scope.row)" @click="reject(scope.row)">拒绝
            </el-button>
            <el-button size="mini" type="primary" :disabled="isBtnTg1(scope.row)" @click="beenpayment(scope.row)">确认还款
            </el-button>
            <el-button size="mini" type="primary" :disabled="isBtnTg1(scope.row)" @click="_renewal(scope.row)">续期
            </el-button>
            <el-button size="mini" type="primary" plain :disabled="isBtnTg1(scope.row)" @click="handleClick(scope.row)">提交催收
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar pad-a">
        <!--分页-->
        <div v-show="refundlist.length" style="float: right" class="pagination-container">
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
      title='新增还款流水记录'
      :visible.sync="flowrecord"
      width="40%"
      center>
      <el-form :label-position="labelPosition" label-width="80px" :model="cusRepay">
        <el-form-item label="借款编号">
          <el-input disabled v-model="cusRepay.loanId"></el-input>
        </el-form-item>
        <el-form-item label="借款金额">
          <el-input disabled v-model="cusRepay.loanAmount"></el-input>
        </el-form-item>
        <el-form-item label="借款日期">
          <el-input disabled v-model="cusRepay.tradeTime1"></el-input>
        </el-form-item>
        <el-form-item label="应还款日期">
          <el-input disabled v-model="cusRepay.repayEndTime1"></el-input>
        </el-form-item>
        <el-form-item label="还款金额">
          <el-input v-model="cusRepay.repayAmount"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" placeholder="请填写备注信息！" v-model="cusRepay.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="flowrecord = false">取 消</el-button>
          <el-button type="primary" @click.stop="beenpaymentRefer">提交</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title='新增续期流水记录'
      :visible.sync="flowrecord1"
      width="40%"
      center>
      <el-form :label-position="labelPosition" label-width="80px" :model="renewal">
        <el-form-item label="借款编号">
          <el-input disabled v-model="renewal.loanId"></el-input>
        </el-form-item>
        <el-form-item label="应还金额">
          <el-input disabled v-model="loanAmount_1"></el-input>
        </el-form-item>
        <el-form-item label="续期天数(天)">
          <el-select @change="changesTime" v-model="renewal.renewalTime" placeholder="请选择续期天数">
            <el-option
              v-for="item in options"
              :key="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="续期金额">
          <el-input v-model="renewal.renewalAmount"></el-input>
        </el-form-item>
        <el-form-item label="借款日期">
          <el-input disabled v-model="renewal.tradeTime1"></el-input>
        </el-form-item>
        <el-form-item label="续期前应还款日期">
          <!--<el-input disabled v-model="repayEndTime_1"></el-input>-->
          <el-date-picker
            v-model="dueateTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :clearable="false"
            @change="changesTime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="续期后应还款日期">
          <el-input disabled v-model="renewal.repayEndTime1"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" placeholder="请填写备注信息！" v-model="renewal.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="flowrecord1 = false">取 消</el-button>
          <el-button type="primary" @click.stop="_renewalRefer">提交</el-button>
        </span>
    </el-dialog>
  </el-row>
</template>
<script>

  import util from "../../common/util";
  import waves from "@/common/waves/index.js"; // 水波纹指令
  import Api from "@/api";

  const platformName = [
    {key: "0", status: "审核中"},
    {key: "1", status: "待还款"},
    {key: "2", status: "还款中"},
    {key: "3", status: "已还款"},
//    {key: "4", status: "未通过"},
    {key: "5", status: "已取消"},
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
        search: {
          cusMobile: '',
          cusName: ''
        },
        refundlist: [],
        platformName,
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
        flowrecord: false,
        flowrecord1: false,
        listLoading: false,
        labelPosition: 'left',
        cusRepay: {
          cusId: '',  //      用户Id
          loanId: '',  //      打款编号
          loanDetailId: '',  //      打款分期编号
          loanAmount: '',  //      借款金额
          repayAmount: '',  //      还款金额
          type: '',  //      类型 默认为：1
          tradeTime1: '',  //  借款日期
          repayEndTime1: '',  //  应还日期
          remark: '',  //  :'描,述//
        },
        renewal: {
          cusId: '',       //  用户Id
          loanId: '',        //  打款编号
          loanDetailId: '',  // 打款分期编号
          renewalAmount: '',  // 续期金额
          renewalTime: '',                 //续期天数
          type: '',                    //类型 默认为：2
          tradeTime1: '', //借款日期
          repayEndTime1: '',         // 续期应还日期
          remark: ''              // 描述
        },
        repayEndTime_1: '',
        dueateTime: '',//应还日期
        loanAmount_1: '',  //      应还金额
        options: [{
          value: '1',
        }, {
          value: '2',
        }, {
          value: '3',
        }, {
          value: '4',
        }, {
          value: '5',
        }, {
          value: '6',
        }],
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
      };
    },
    filters: {
      typeFilter(type) {
        return platformNameKeyValue[type];
      }
    },
    created() {
      this.repayDetailList();
    },
    methods: {
      //分页
      handleCurrentChange(val) {
        this.listQuery.limit = val;
        this.repayDetailList();
      },
      handleFilter() {
        this.repayDetailList();
      },
      on_refresh() {
        this.listQuery.type = '';
        this.search.cusMobile = '';
        this.timeQuantum = null;
        this.repayDetailList()
      },
      //获取还款列表-
      repayDetailList() {
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
          detailStatus: this.listQuery.type || "",
          cusMobile: this.search.cusMobile,
          cusName: this.cusName,
          startTime: startTime || "",
          endTime: endTime || ""
        };
        this.listLoading = true;
        Api.testApi.repayDetailList(util.checkBe(para)).then(res => {
          if (res.code == '0000') {
            if (res.data) {
              if (res.data.customerEvs) {
                for (let i = 0; i < res.data.customerEvs.length; i++) {
                  res.data.customerEvs[i].type = this.returnTypeValue(res.data.customerEvs[i].type);
                  res.data.customerEvs[i].repayEndtime = util.formatDate.format(
                    new Date(res.data.customerEvs[i].repayEndtime),
                    "yyyy-MM-dd hh:mm:ss"
                  );
                  res.data.customerEvs[i].createTime = util.formatDate.format(
                    new Date(res.data.customerEvs[i].createTime),
                    "yyyy-MM-dd hh:mm:ss"
                  );
                }
                this.total = res.data.total;
                this.refundlist = res.data.customerEvs;
                this.listLoading = false;
              }
            } else {
              this.refundlist = [];
              this.listLoading = false;
              this.total = 0
            }
          }
        });
      },
      //已还款
      beenpayment(row) {
        this.flowrecord = true;
        // let repayCapital = row.loanCapital - parseInt(row.loanCapital * 0.3)
        let repayCapital = row.loanCapital
        row.createTime = util.formatDate.format(new Date(row.createTime), 'yyyy-MM-dd hh:mm:ss')
        // row.repayEndtime=util.formatDate.format(new Date(row.repayEndtime), 'yyyy-MM-dd hh:mm:ss')
        this.cusRepay = {
          cusId: row.cusId,  //      用户Id
          loanId: row.loanId,  //      打款编号
          loanDetailId: row.detailId,  //      打款分期编号
          loanAmount: row.loanCapital,  //      借款金额
          repayAmount: repayCapital,  //      还款金额
          type: 1,  //      类型 默认为：1
          tradeTime1: row.createTime,  //  借款日期
          repayEndTime1: row.repayEndtime,  //  应还日期
          remark: '',  //  :'描,述//
        }
      },
      //提交确认已还款
      beenpaymentRefer() {
        this.$confirm('点确定将操作成功！, 是否继续?', '确认操作', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let para = this.cusRepay
          Api.testApi.saveLogOrderCusRepay(para).then(res => {
            if (res.code === '0000') {
              this.$message({
                type: 'success',
                message: '操作成功！'
              });
              this.flowrecord = false;
              this.repayDetailList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交'
          });
          this.flowrecord = false;
        });
      },
      //续期
      _renewal(row) {
        this.loanAmount_1 = row.loanCapital;
        this.flowrecord1 = true;
        row.renewalTime = '3';
        this.dueateTime = new Date(row.repayEndtime);
        this.repayEndTime_1 = new Date(row.repayEndtime);
        let newDate = new Date(this.repayEndTime_1.setDate(this.repayEndTime_1.getDate() + Number(row.renewalTime))).getTime();
        this.repayEndTime_1 = util.formatDate.format(
          new Date(newDate),
          "yyyy-MM-dd hh:mm:ss"
        );
        row.createTime = util.formatDate.format(new Date(row.createTime), 'yyyy-MM-dd hh:mm:ss')
        this.renewal = {
          cusId: row.cusId,       //  用户Id
          loanId: row.loanId,        //  打款编号
          loanDetailId: row.detailId,  // 打款分期编号
          // renewalAmount: this.renewal.renewalAmount,  // 续期金额
          renewalTime: row.renewalTime,                 //续期天数
          type: 2,                    //类型 默认为：2
          tradeTime1: row.createTime, //借款日期
          repayEndTime1: this.repayEndTime_1,//续期后应还日期
          remark: ''              // 描述
        }
        this.renewal.renewalAmount = this.loanAmount_1 * Number(row.renewalTime) * 0.05
      },
      _renewalRefer() {
        if (!this.renewal.remark) {
          this.$message({
            type: 'warning',
            message: '请填写备注！'
          });
          return
        }
        this.$confirm('点确定将操作成功！, 是否继续?', '确认操作', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let para = this.renewal
          Api.testApi.saveLogOrderCusRenewal(para).then(res => {
            if (res.code === '0000') {
              this.$message({
                type: 'success',
                message: '操作成功！'
              });
              this.repayDetailList()
              this.flowrecord1 = false;
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交'
          });
          this.flowrecord1 = false;
        });
      },
      //催收
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
                this.repayDetailList()
              }
            });
          }
        })
      },
      changesTime() {
        // console.log()
        this.renewal.renewalAmount = this.loanAmount_1 * Number(this.renewal.renewalTime) * 0.05
        let curDate = new Date(this.dueateTime);
        let newDate = new Date(curDate.setDate(curDate.getDate() + Number(this.renewal.renewalTime))).getTime();
        this.renewal.repayEndTime1 = util.formatDate.format(
          new Date(newDate),
          "yyyy-MM-dd hh:mm:ss"
        );
      },
      //返回表格内标签的类型
      returnTagType(status) {
        switch (status) {
          case 0:
            return "primary";
          case 1:
            return "primary";
          case 2:
            return "primary";
          case 3:
            return "success";
          case 4:
            return "info";
          case 5:
            return "info";
        }
      },
      returnTagValue(status) {
        switch (status) {
          case 0 :
            return '借款审核中'
          case 1 :
            return '待还款'
          case 2 :
            return '还款中'
          case 3 :
            return '已还款'
          case 4 :
            return '未通过'
          case 5 :
            return '已取消'

        }
      },

      returnTypeValue(status) {
        switch (status) {
          case 1:
            return "银行";
          case 2:
            return "微信";
          case 3:
            return "支付宝";
          case 4:
            return "线下"
        }
      },
      //操作按钮是否可以点击
      isBtnTg(row) {
        return row.loanStatus == !0 && row.repayAmount > 0 ? false : true;
      },
      isBtnTg1(row) {
        return row.detailStatus == 1 ? false : true;
      },
      //通过
      getThrough(row) {
        this.$confirm('此操作将审核成功?', '提示', {type: 'success'}).then(() => {
          let para = {
            loanDetailId: row.detailId,//  还款编号
            status: 1,//  状态（-1：不通过 1：通过）
            cusId: row.cusId,//  用户编号
            type: 1,//  还款方式
            noOrder: row.noOrder,//  流水号
          };
          Api.testApi.auditUserRepay(para).then(res => {
            if (res.code == "0000") {
              this.$message({
                message: "操作成功!",
                type: "success"
              });
              this.repayDetailList();
            } else {
              this.$message({
                message: "操作失败!",
                type: "error"
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消审核"
          });
        });
      },
      //拒绝
      reject(row) {
        this.$prompt("驳回的原因", "审核失败", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputType: "textarea"
        }).then(({value}) => {
          if (value == null) {
            this.$message({
              message: "请说明原因!",
              type: "warning"
            });
          } else {
            let para = {
              loanDetailId: row.detailId,//  还款编号
              status: -1,//  状态（-1：不通过 1：通过）
              remark: value,//  备注信息
              cusId: row.cusId,//  用户编号
              type: 1,//  还款方式
              noOrder: row.noOrder,//  流水号
            };

            Api.testApi.auditUserRepay(para).then(res => {
              if (res.code == "0000") {
                this.$message({
                  message: "操作成功!",
                  type: "success"
                });
                this.repayDetailList();
              } else {
                this.$message({
                  message: "操作失败!",
                  type: "error"
                });
              }
            });
          }
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消审核"
          });
        });
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
