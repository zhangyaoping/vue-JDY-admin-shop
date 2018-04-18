<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>终审列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <div class="filter-container">
        <!--<el-input clearable @keyup.enter.native="handleFilter" v-model="search.loanId" style="width: 200px;"
                  class="filter-item"
                  placeholder="借款编号">
        </el-input>-->
        <el-input clearable @keyup.enter.native="handleFilter" v-model="search.cusMobile" style="width: 200px;"
                  class="filter-item"
                  placeholder="手机号">
        </el-input>

        <!--<el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="借款状态">-->
        <!--<el-option v-for="item in platformName" :key="item.key" :label="item.status"-->
        <!--:value="item.key">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--<el-date-picker-->
        <!--v-model="timeQuantum"-->
        <!--type="datetimerange"-->
        <!--:picker-options="pickerOptions2"-->
        <!--range-separator="至"-->
        <!--start-placeholder="开始日期"-->
        <!--end-placeholder="结束日期"-->
        <!--align="right">-->
        <!--</el-date-picker>-->
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
        <el-table-column width="65" prop="cusName" label="姓名"></el-table-column>
        <el-table-column width="115" prop="cusMobile" label="手机号"></el-table-column>
        <el-table-column width="50" prop="cusAge" label="年龄"></el-table-column>
        <el-table-column width="50" prop="cusSex" label="性别"></el-table-column>
        <!--<el-table-column prop="loanCapital" label="借款金额（元）"></el-table-column>-->
        <el-table-column prop="createTime" label="申请时间" min-width="170"></el-table-column>
        <!--<el-table-column prop="loanStatus" label="借款状态">-->
        <!--<template slot-scope="scope">-->
        <!--<el-tag-->
        <!--:type="returnTagType(scope.row.loanStatus)"-->
        <!--close-transition>{{returnTagValue(scope.row.loanStatus)}}-->
        <!--</el-tag>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain
                       @click="userinfo(scope.row)">查看档案
            </el-button>
            <!--:disabled="isBtnTg(scope.row)"-->
            <el-button size="mini" type="primary" @click="remittance(scope.row)">打款
            </el-button>
            <el-button size="mini" type="danger" @click="_receipt(scope.row)">拒绝
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
      title="提交信息"
      :visible.sync="dialogVisible"
      width="40%">
      <div class="bills-box" v-if="receiptdata.userInfo">
        <p class="bills">单据</p>
        <div class="wp-box">
          <div class="wp borderB-1px">
            <p><span class="span-a">借款人</span><span class="span-b">{{receiptdata.userInfo.cusName}}</span></p>
            <p><span class="span-a">联系方式</span><span>{{receiptdata.userInfo.cusMobile}}</span></p>
          </div>
          <p class="wp-p"><span class="span-a">身份证号</span><span>{{receiptdata.userInfo.cusIdCrad}}</span></p>
        </div>
        <div style="height: 0.15rem;background-color: #F3F3F3"></div>
        <div class="wp-box">
          <div class="wp borderB-1px">
            <p><span class="span-a">出借人</span><span class="span-b">{{receiptdata.userInfo.userName}}</span></p>
            <p><span class="span-a">联系方式</span><span>{{receiptdata.userInfo.userMobile}}</span></p>
          </div>
          <p class="wp-p"><span class="span-a">身份证号</span><span>{{receiptdata.userInfo.userIdCard}}</span></p>
        </div>
        <div class="bj-divs"></div>
        <div class="wp-box">
          <div class="wp borderB-1px">
            <p style="display: flex;">
              <span class="span-a" style="width: 150px;">借款金额(元)</span>
              <el-input v-model="receiptdata.loanCapital" placeholder="请输入借款金额"></el-input>
            </p>
            <p><span class=" span-a">{{convertCurrency(receiptdata.loanCapital)}}</span></p>
          </div>
          <div class="wp borderB-1px" style="margin-top:15px;">
            <p style="display: flex;">
              <span class="span-a" style="width: 102px;">借款时间</span>
              <el-date-picker
                v-model="value1"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </p>
          </div>
          <div class="wp borderB-1px" style="margin-top:15px;">
            <p style="display: flex;">
              <span class="span-a" style="width: 150px;">借款期限(天)</span>
              <input type="text" class="inputss" v-model="receiptdata.dueTime" @keyup="_endtime" placeholder="请输入借款期限">
            </p>
          </div>
          <div class="wp borderB-1px" style="margin-top:15px;">
            <p style="display: flex;">
              <span class="span-a" style="width: 100px;">还款时间</span>
              <span>{{end_time}}</span>
            </p>
          </div>
          <div class="borderB-1px" style="margin-top:15px;">
            <p style="display: flex;">
              <span class="span-a" style="width: 135px;">备注</span>
              <el-input type="textarea" v-model="receiptdata.remark" placeholder="请填写备注"></el-input>
            </p>
          </div>
        </div>
        <div class="bj-divs"></div>
        <div class="wp-boxs">
          <p class="wp-ps"><span class="span-a">甲方</span><span>{{receiptdata.userInfo.userName}}</span></p>
          <p class="wp-ps"><span class="span-a">乙方</span><span>{{receiptdata.userInfo.cusName}}</span></p>
          <!--<p class="wp-ps"><span class="span-a">丙方</span><span>杭州鼎高网络科科技有限公司</span></p>-->
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
    <el-button size="mini" type="primary" @click="_artificiapay">确 定</el-button>
  </span>
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
        value1: '',
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
      this._finalAuditlist();
    },
    methods: {
      //分页
      handleCurrentChange(val) {
        this.listQuery.limit = val;
        this._finalAuditlist();
      },
      handleFilter() {
        this._finalAuditlist();
      },
      on_refresh() {
        this.search.loanId = '';
        this.search.cusMobile = '';
        this.listQuery.type = '';
        this.timeQuantum = null;
        this._finalAuditlist()
      },
      //获取参数列表-
      _finalAuditlist() {
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
        Api.testApi.finalAuditlist(util.checkBe(para)).then(res => {
          if (res.code == '0000') {
            if (res.data) {
              if (res.data.creditEvs) {
                for (let i = 0; i < res.data.creditEvs.length; i++) {
                  res.data.creditEvs[i].userInfo = JSON.parse(res.data.creditEvs[i].userInfo);
                  res.data.creditEvs[i].createTime = util.formatDate.format(
                    new Date(res.data.creditEvs[i].createTime),
                    "yyyy-MM-dd hh:mm:ss"
                  );
                }
                this.total = res.data.total;
                this.borrowinglist = res.data.creditEvs;
                this.listLoading = false
              }
            } else {
              this.total = 0
              this.listLoading = false
              this.borrowinglist = [];
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

      //通过
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
              this._finalAuditlist();
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
      //拒绝
      _receipt(row) {
        this.$confirm('确认拒绝吗?', '提示', {type: 'warning'}).then(() => {
          let para = {
            cusId: row.cusId
          }
          Api.testApi.refuseFinalAudit(para).then(res => {
            if (res.code === '0000') {
              this.$message({
                message: "操作成功!",
                type: "success"
              });
              this._finalAuditlist()
            }
          })
        })
      },
      //借条
      remittance(row) {
        this.dialogVisible = true
        this.receiptdata = row
      },
      _endtime() {
        let curDate = new Date();
        this.current_time = util.formatDate.format(
          new Date(this.receiptdata.createTime),
          "yyyy-MM-dd"
        );
        if (this.receiptdata.dueTime) {
          let newDate = new Date(curDate.setDate(curDate.getDate() + Number(this.receiptdata.dueTime))).getTime();
          this.end_time = util.formatDate.format(
            new Date(newDate),
            "yyyy-MM-dd"
          );
        }
      },
      _artificiapay() {
        this.value1 = new Date(this.value1);
        this.format(this.value1, 'yyyy-MM-dd HH:mm:ss')


        let para = {
          cusId: this.receiptdata.cusId,
          shopId: this.receiptdata.shopId,
          loanCapital: this.receiptdata.loanCapital,
          dueTime: this.receiptdata.dueTime,
          tradeTime: this.format(this.value1, 'yyyy-MM-dd HH:mm:ss'),
          remark: this.receiptdata.remark
        }
        Api.testApi.artificiapay(para).then(res => {
          if (res.code === '0000') {
            this.$message({
              message: "操作成功!",
              type: "success"
            });
            this.dialogVisible = false
            this.$router.push('/borrowinglist')
          }
        })
      },
      format(time, format) {
        var t = new Date(time);
        var tf = function (i) {
          return (i < 10 ? '0' : '') + i
        };
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
          switch (a) {
            case 'yyyy':
              return tf(t.getFullYear());
              break;
            case 'MM':
              return tf(t.getMonth() + 1);
              break;
            case 'mm':
              return tf(t.getMinutes());
              break;
            case 'dd':
              return tf(t.getDate());
              break;
            case 'HH':
              return tf(t.getHours());
              break;
            case 'ss':
              return tf(t.getSeconds());
              break;
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
  .inputss {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    font-size: 14px;
    line-height: 1;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 100%;
  }

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
      /*background: url("../borrowingmanage/img/jt-bg1.png") center no-repeat;*/
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
      background: url("../borrowingmanage/img/jt-bg2.png") center no-repeat;
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
