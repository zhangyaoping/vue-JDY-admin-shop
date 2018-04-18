<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>借款管理</el-breadcrumb-item>
        <el-breadcrumb-item>借款列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <div class="filter-container">
        <el-input clearable @keyup.enter.native="handleFilter" v-model="search.loanId" style="width: 200px;"
                  class="filter-item"
                  placeholder="借款编号">
        </el-input>
        <el-input clearable @keyup.enter.native="handleFilter" v-model="search.cusMobile" style="width: 200px;"
                  class="filter-item"
                  placeholder="手机号">
        </el-input>

        <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="借款状态">
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
      <el-table :data="borrowinglist" border highlight-current-row element-loading-text="拼命加载中" v-loading="listLoading"
                style="width: 100%;">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <el-table-column prop="loanId" width="155" label="借款编号"></el-table-column>
        <el-table-column prop="cusName" width="65" label="姓名"></el-table-column>
        <el-table-column prop="cusMobile" width="115" label="手机号"></el-table-column>
        <el-table-column prop="cusAge" width="50" label="年龄"></el-table-column>
        <el-table-column prop="loanCapital" width="120" label="借款金额（元）"></el-table-column>
        <el-table-column prop="finalScore" width="80" label="综合得分"></el-table-column>
        <el-table-column prop="dueTime" width="120" label="借款期限(天)"></el-table-column>
        <el-table-column prop="tradeInfo.bankAccount" width="125" label="打款账户/银行卡"></el-table-column>
        <el-table-column prop="tradeInfo.alipayCount" width="125" label="打款账户/支付宝"></el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="170"></el-table-column>
        <el-table-column prop="tradeInfo.remark" min-width="150" label="备注"></el-table-column>
        <el-table-column prop="loanStatus" label="借款状态" width="100">
          <template slot-scope="scope">
            <el-tag
              size="small"
              :type="returnTagType(scope.row.loanStatus)"
              close-transition>{{returnTagValue(scope.row.loanStatus)}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="340">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain
                       @click="userinfo(scope.row)">查看档案
            </el-button>
            <el-button :disabled="isBtnTg(scope.row)" size="mini" type="primary" @click="getThrough(scope.row)">打款
            </el-button>
            <el-button :disabled="isBtnTg(scope.row)" size="mini" type="danger" @click="reject(scope.row)">拒绝
            </el-button>
            <el-button size="mini" type="primary" @click="_receipt(scope.row)">借条
            </el-button>
          </template>
        </el-table-column>
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
    <el-dialog
      title="借条"
      :visible.sync="dialogVisible"
      width="30%">
      <div class="bills-box" v-if="receiptdata.tradeInfo">
        <p class="bills">借条单据</p>
        <div class="wp-box">
          <div class="wp borderB-1px">
            <p><span class="span-a">借款人</span><span class="span-b">{{receiptdata.tradeInfo.cusName}}</span></p>
            <p><span class="span-a">联系方式</span><span>{{receiptdata.tradeInfo.cusMobile}}</span></p>
          </div>
          <p class="wp-p"><span class="span-a">身份证号</span><span>{{receiptdata.tradeInfo.cusIdcard}}</span></p>
        </div>
        <div style="height: 0.15rem;background-color: #F3F3F3"></div>
        <div class="wp-box">
          <div class="wp borderB-1px">
            <p><span class="span-a">出借人</span><span class="span-b">{{receiptdata.tradeInfo.userName}}</span></p>
            <p><span class="span-a">联系方式</span><span>{{receiptdata.tradeInfo.userMobile}}</span></p>
          </div>
          <p class="wp-p"><span class="span-a">身份证号</span><span>{{receiptdata.tradeInfo.userIdcard}}</span></p>
        </div>
        <div class="bj-divs"></div>
        <div class="wp-box">
          <div class="wp borderB-1px">
            <p><span class="span-a">借款金额</span><span
              class="span-b">￥{{parseInt(receiptdata.loanCapital).toFixed(2)}}</span>
            </p>
            <p><span class="span-a">{{convertCurrency(receiptdata.loanCapital)}}</span></p>
          </div>
          <p class="wp-p borderB-1px"><span class="span-a">借款利率</span><span>{{this.lnterest}}%</span></p>
          <div class="wp borderB-1px">
            <p><span class="span-a">借款期限</span><span class="span-b">{{receiptdata.dueTime}}天</span></p>
            <p><span>{{current_time}}至{{end_time}}</span></p>
          </div>
          <p class="wp-p"><span
            class="span-a">还款方式</span><span>借款期限到期日一次性偿还本金和利息</span></p>
        </div>
        <div class="bj-divs"></div>
        <div class="wp-boxs">
          <p class="wp-ps"><span class="span-a">甲方</span><span>{{receiptdata.tradeInfo.userName}}</span></p>
          <p class="wp-ps"><span class="span-a">乙方</span><span>{{receiptdata.tradeInfo.cusName}}</span></p>
          <!--<p class="wp-ps"><span class="span-a">丙方</span><span>杭州鼎高网络科科技有限公司</span></p>-->
        </div>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
  import util from "../../common/util";
  import waves from "@/common/waves/index.js"; // 水波纹指令
  import Api from "@/api";
  import sessionStorage from '@/storage/sessionStorage'
  import proConfig from '../../config';

  const platformName = [
    {key: "0", status: "待打款"},
    {key: "1", status: "打款成功"},
    {key: "5", status: "取消订单"}
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
        dialogVisible: false,
        search: {
          loanId: "",
          cusMobile: ""
        },
        borrowinglist: [],
        receiptdata: [],
        current_time: '',
        end_time: '',
        lnterest: '',
        platformName,
        total: 0,
        listQuery: {
          page: 15,
          limit: 1,
          type: undefined,
          startTime: "",
          endTime: ""
        },
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
      };
    },
    filters: {
      typeFilter(type) {
        return platformNameKeyValue[type];
      }
    },
    created() {
      this.loanList();
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
        this.search.loanId = '';
        this.search.cusMobile = '';
        this.listQuery.type = '';
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
          loanId: this.search.loanId,
          cusMobile: this.search.cusMobile,
          loanStatus: this.listQuery.type,
          startTime: startTime,
          endTime: endTime
        };
        this.listLoading = true;
        Api.testApi.loanList(util.checkBe(para)).then(res => {
          if (res.code == '0000') {
            if (res.data) {
              if (res.data.orderCusLoanEvs) {
                for (let i = 0; i < res.data.orderCusLoanEvs.length; i++) {
                  res.data.orderCusLoanEvs[i].tradeInfo = JSON.parse(res.data.orderCusLoanEvs[i].tradeInfo);
                  res.data.orderCusLoanEvs[i].createTime = util.formatDate.format(
                    new Date(res.data.orderCusLoanEvs[i].createTime),
                    "yyyy-MM-dd hh:mm:ss"
                  );
                }
                this.total = res.data.total;
                this.borrowinglist = res.data.orderCusLoanEvs;
                // console.log('res',this.borrowinglist)
                this.listLoading = false
              }
            } else {
              this.listLoading = false;
              this.borrowinglist = [];
              this.total = 0
            }
          }
        });
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
      },

      //打款
      getThrough(row) {
        // console.log(row)
        this.$confirm('此操作将审核打款成功?', '提示', {type: 'warning'}).then(() => {
          let para = {
            loanId: row.loanId,   //       借款编号
            status: 1,//（-1：不通过1：通过）
            cusId: row.cusId,//用户编号
            orderFlowId: row.loanId//否 流水号
          };
          Api.testApi.auditUserPay(para).then(res => {
            if (res.code == "0000") {
              this.$message({
                message: "操作成功!",
                type: "success"
              });
              this.loanList();
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
          cancelButtonText: "取消"
        }).then(({value}) => {
          if (value == null) {
            this.$message({
              message: "请说明原因!",
              type: "warning"
            });
          } else {
            let para = {
              loanId: row.loanId,   //       借款编号
              status: -1,//（-1：不通过1：通过）
              remark: value,//     备注信息
              cusId: row.cusId,//用户编号
              orderFlowId: row.cusId//否 流水号
            };

            Api.testApi.auditUserPay(para).then(res => {
              if (res.code == "0000") {
                this.$message({
                  message: "操作成功!",
                  type: "success"
                });
                this.loanList();
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
      },
      //操作按钮是否可以点击
      isBtnTg(row) {
        return row.loanStatus == 0 ? false : true;
      },
      //跳档案
      userinfo(row) {
        sessionStorage.$setSessionStorageByName("cusId", row.cusId);
        sessionStorage.$removeSessionStorageByName("auditStatus", row.auditStatus);
        window.open(window.location.origin + proConfig.openurl)
      },
      //借条
      _receipt(row) {
        this.dialogVisible = true
        let para = {
          loanId: row.loanId
        }
        Api.testApi.loanInfo(para).then(res => {
          if (res.code === '0000') {
            // console.log('res+++++++',res)
            let resdata = res.data
            this.receiptdata = resdata
            this.receiptdata.tradeInfo = JSON.parse(this.receiptdata.tradeInfo)
            this.lnterest = (this.receiptdata.tradeInfo.audit_rate + this.receiptdata.tradeInfo.interest_rate + this.receiptdata.tradeInfo.manage_rate) * 100
            let curDate = new Date(this.receiptdata.createTime);
            this.current_time = util.formatDate.format(
              new Date(this.receiptdata.createTime),
              "yyyy-MM-dd"
            );
            let newDate = new Date(curDate.setDate(curDate.getDate() + Number(this.receiptdata.dueTime))).getTime();
            this.end_time = util.formatDate.format(
              new Date(newDate),
              "yyyy-MM-dd"
            );
          }

        })

      },
      convertCurrency(money) {
        //汉字的数字
        var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
        //基本单位
        var cnIntRadice = new Array('', '拾', '佰', '仟');
        //对应整数部分扩展单位
        var cnIntUnits = new Array('', '万', '亿', '兆');
        //对应小数部分单位
        var cnDecUnits = new Array('角', '分', '毫', '厘');
        //整数金额时后面跟的字符
        var cnInteger = '整';
        //整型完以后的单位
        var cnIntLast = '元';
        //最大处理的数字
        var maxNum = 999999999999999.9999;
        //金额整数部分
        var integerNum;
        //金额小数部分
        var decimalNum;
        //输出的中文金额字符串
        var chineseStr = '';
        //分离金额后用的数组，预定义
        var parts;
        if (money == '') {
          return '';
        }
        money = parseFloat(money);
        if (money >= maxNum) {
          //超出最大处理数字
          return '';
        }
        if (money == 0) {
          chineseStr = cnNums[0] + cnIntLast + cnInteger;
          return chineseStr;
        }
        //转换为字符串
        money = money.toString();
        if (money.indexOf('.') == -1) {
          integerNum = money;
          decimalNum = '';
        } else {
          parts = money.split('.');
          integerNum = parts[0];
          decimalNum = parts[1].substr(0, 4);
        }
        //获取整型部分转换
        if (parseInt(integerNum, 10) > 0) {
          var zeroCount = 0;
          var IntLen = integerNum.length;
          for (var i = 0; i < IntLen; i++) {
            var n = integerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == '0') {
              zeroCount++;
            } else {
              if (zeroCount > 0) {
                chineseStr += cnNums[0];
              }
              //归零
              zeroCount = 0;
              chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
              chineseStr += cnIntUnits[q];
            }
          }
          chineseStr += cnIntLast;
        }
        //小数部分
        if (decimalNum != '') {
          var decLen = decimalNum.length;
          for (var i = 0; i < decLen; i++) {
            var n = decimalNum.substr(i, 1);
            if (n != '0') {
              chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
          }
        }
        if (chineseStr == '') {
          chineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (decimalNum == '') {
          chineseStr += cnInteger;
        }
        return chineseStr;
      }
    },
    components: {}
  };
</script>

<style type="text/scss" lang="scss" scoped>
  .bills-box {
    height: 100%;
    padding: 0.3rem;
    .bills {
      height: 40px;
      line-height: 40px;
      background-color: #e5e5e5;
      border-radius: 10px 10px 0 0;
      color: #666666;
      font-size: 16px;
      padding-left: 25px;
      text-align: center;
    }
    .wp-box {
      padding: 0 25px;
      background-color: #ffffff;
      .wp {
        display: flex;
        justify-content: space-between;
        height: 40px;
        line-height: 40px;
        p {
          font-size: 16px;
          .span-a {
            color: #999999;
            margin-right: 10px;
          }
        }
      }
      .wp-p {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        .span-a {
          color: #999999;
          margin-right: 10px;
        }
      }
    }
    .wp-boxs {
      padding: 40px 25px;
      /*background: url("./img/jt-bg1.png") center no-repeat;*/
      background-size: 100%;
      .wp-ps {
        height: 50px;
        line-height: 0.5rem;
        font-size: 16px;
        .span-a {
          color: #999999;
          margin-right: 10px;
        }
      }
    }
    .bj-divs {
      height: 30px;
      background: url("./img/jt-bg2.png") center no-repeat;
      background-size: 100%;
    }
  }

  .demo-table-expand label {
    font-weight: bold;
  }

  .filter-container {
    padding: 20px 0;
    line-height: 50px;
  }

</style>
