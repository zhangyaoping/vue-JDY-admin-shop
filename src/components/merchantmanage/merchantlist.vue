<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商户管理</el-breadcrumb-item>
        <el-breadcrumb-item>我的商户</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
      <div class="content-header">
        <!--<div class="sjlogo"><img src="./../../assets/logo.png" alt=""></div>-->
        <div class="money-box">
          <header>商户编号：<span>{{baseInfo.shopInfo.shopId}}</span></header>
          <p>托管账户：<span>{{baseInfo.shopInfo.accountAmount}}</span> 元</p>
          <p>可用余额：<span>{{baseInfo.shopInfo.availableBalance}}</span> 元</p>
          <p>冻结金额：<span>{{baseInfo.shopInfo.freezeAmount}}</span> 元</p>
          <div class="btn-box">
            <el-button class="cz-btn" @click="rechargeModel=true" size="small" type="success">我要充值</el-button>
            <!--<el-button class="tx-btn" @click="withdrawModel=true" size="small" type="success">我要提现</el-button>-->
          </div>
        </div>
        <div class="merchant-box">
          <header>商户信息</header>
          <p>商户名称：<span>{{baseInfo.shopInfo.shopName}}</span></p>
          <p>产品名称：<span>{{baseInfo.shopInfo.productName}}</span></p>
          <p>商户银行账户：<span>{{baseInfo.shopInfo.bankAccount}}</span></p>
          <p>联系人：<span>{{baseInfo.shopInfo.contactName}}</span></p>
          <p>联系人手机：<span>{{baseInfo.shopInfo.contactMobile}}</span></p>
        </div>
      </div>
      <div class="amount-box">
        <div class="money-due">
          <div class="due-box">
            <div class="due due-bj">
              <p>全部待收金额</p>
              <p><span>{{baseInfo.taskInfo.nTotalMoney}}</span> 元</p>
            </div>
            <div class="due due-bj1">
              <p>待收本金</p>
              <p><span>{{baseInfo.taskInfo.nRepayCapital}}</span> 元</p>
            </div>
            <div class="due due-bj2">
              <p>待收服务费用</p>
              <p><span>{{baseInfo.taskInfo.nRepayServiceFee}}</span> 元</p>
            </div>
            <div class="due due-bj3">
              <p>待收逾期本金</p>
              <p><span>{{baseInfo.taskInfo.nRepayCapitalLate}}</span> 元</p>
            </div>
            <div class="due due-bj4">
              <p>待收逾期服务费</p>
              <p><span>{{baseInfo.taskInfo.nRepayServiceFeeLate}}</span> 元</p>
            </div>
            <div class="due due-bj5">
              <p>待收逾期罚金</p>
              <p><span>{{baseInfo.taskInfo.nRepayLateFeeLate}}</span> 元</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mission-box">
        <div class="missio-title"><p>任务栏</p></div>
        <div class="missio">
          <div class="missio-left">
            <p>生成商户推广链接：</p>
            <el-button class="handle-btn" @click="thelinkUrl" size="small" type="primary" plain>立即生成</el-button>
          </div>
        </div>
        <div class="missio">
          <div class="missio-left">
            <p>开关推量：</p>
            <el-switch
              @change="allotSwitchs"
              v-model="allotSwitch"
              active-text="开启推量"
              inactive-text="关闭推量">
            </el-switch>
          </div>
        </div>
        <div class="missio">
          <div class="missio-left">
            <p>等待人工审核的客户：
              <span>{{baseInfo.taskInfo.nAuditCount}} 人</span>
            </p>
            <el-button class="handle-btn" @click="goAditlist" size="small" type="success" plain>立即处理</el-button>
          </div>
          <div class="missio-right">
            <p>等待放款的客户：
              <span>{{baseInfo.taskInfo.nLoanCount}} 人</span>
            </p>
            <el-button class="handle-btn" @click="goBorrowinglist" size="small" type="success" plain>立即处理</el-button>
          </div>
        </div>
        <div class="missio-curve">
          <p>今日应还人数：<span>{{baseInfo.taskInfo.nRepayTodayCount}}</span>人</p>
          <p>今日应还金额：<span>{{baseInfo.taskInfo.nRepayTodayCount}}</span>元</p>
          <p>当前逾期未还总人数：<span>{{baseInfo.taskInfo.nRepayCount}}</span>人</p>
          <p>当前逾期未还总金额：<span>{{baseInfo.taskInfo.nTotalLateFee}}</span>元</p>
        </div>
      </div>
      <div class="mission-box">
        <div class="missio-title">
          <p>参数配置</p>
          <div class="submit-box">
            <el-button v-if="!isdisabled1" class="saveBtn" type="primary" @click.native="canceladit1">取消</el-button>
            <el-button class="saveBtn" type="primary" @click.native="editDisabled1('baseInfo.loanConfig')">
              {{btnEditText1}}
            </el-button>
          </div>
        </div>
        <div class="parameter-curve">
          <el-form :label-position="labelPosition" :model="baseInfo.loanConfig" :rules="foodrules"
                   ref="baseInfo.loanConfig"
                   label-width="140px"
                   class="form food_form">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="利息费(%)" prop="interest_rate">
                  <el-input :disabled="isdisabled1" v-model.number="baseInfo.loanConfig.interest_rate"></el-input>
                </el-form-item>
                <el-form-item label="快速信审费(%)" prop="audit_rate">
                  <el-input :disabled="isdisabled1" v-model.number="baseInfo.loanConfig.audit_rate"></el-input>
                </el-form-item>
                <el-form-item label="账户管理费(%)" prop="manage_rate">
                  <el-input :disabled="isdisabled1" v-model.number="baseInfo.loanConfig.manage_rate"></el-input>
                </el-form-item>
                <el-form-item label="逾期费用(%)" prop="latefee_rate">
                  <el-input :disabled="isdisabled1" v-model.number="baseInfo.loanConfig.latefee_rate"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="初始信用额度(元)" prop="primary_amount">
                  <el-input :disabled="isdisabled1" v-model.number="baseInfo.loanConfig.primary_amount"></el-input>
                </el-form-item>
                <el-form-item label="最高信用额度(元)" prop="top_amount">
                  <el-input :disabled="isdisabled1" v-model.number="baseInfo.loanConfig.top_amount"></el-input>
                </el-form-item>
                <el-form-item label="提额条件(逾期天数)(天)" prop="improve_limit">
                  <el-input :disabled="isdisabled1" v-model.number="baseInfo.loanConfig.improve_limit"></el-input>
                </el-form-item>
                <el-form-item label="额度梯度(元)" prop="improve_amount">
                  <el-input :disabled="isdisabled1" v-model.number="baseInfo.loanConfig.improve_amount"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="借款期限">
              <el-radio :disabled="isdisabled1" border class="radio" v-model="baseInfo.loanConfig.due_time" label="7">
                7天
              </el-radio>
              <el-radio :disabled="isdisabled1" border class="radio" v-model="baseInfo.loanConfig.due_time" label="15">
                15天
              </el-radio>
              <el-radio :disabled="isdisabled1" border class="radio" v-model="baseInfo.loanConfig.due_time" label="21">
                21天
              </el-radio>
              <el-radio :disabled="isdisabled1" border class="radio" v-model="baseInfo.loanConfig.due_time" label="30">
                30天
              </el-radio>
              <el-radio :disabled="isdisabled1" border class="radio" v-model="baseInfo.loanConfig.due_time" label="60">
                60天
              </el-radio>
            </el-form-item>

            <el-form-item label="最低借款(元)" prop="loan_amount_limit">
              <el-input :disabled="isdisabled1" v-model.number="baseInfo.loanConfig.loan_amount_limit"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="mission-box">
        <div class="missio-title">
          <p>还款配置</p>
          <div class="submit-box">
            <el-button v-if="!isdisabled" class="saveBtn" type="primary" @click.native="canceladit">取消</el-button>
            <el-button class="saveBtn" type="primary" @click.native="editDisabled('baseInfo.repayConfig')">
              {{btnEditText}}
            </el-button>
          </div>
        </div>
        <el-form :label-position="labelPosition" :model="baseInfo.repayConfig" :rules="foodrules" ref="repayConfig"
                 label-width="140px"
                 class="form food_form">
          <div class="uploading-a">
            <el-form-item label="上传支付宝收款二维码">
              <el-upload
                ref="alipay"
                class="uploading"
                :action="apiUrl"
                list-type="picture-card"
                :headers="myHeaders"
                :on-success="SuccessAlipay"
                :on-preview="handleAlipay"
                :limit="limitsImg"
                :before-upload="beforeAvatarUpload"
                :on-remove="RemoveAlipay">
                <img v-if="baseInfo.repayConfig.alipay_url" :src="baseInfo.repayConfig.alipay_url" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible1">
                <img width="100%" :src="baseInfo.repayConfig.alipay_url" alt="">
              </el-dialog>
            </el-form-item>

            <el-form-item label="上传微信收款二维码">
              <el-upload
                ref="weChat"
                class="uploading"
                :action="apiUrl"
                list-type="picture-card"
                :headers="myHeaders"
                :on-success="SuccessWeChat"
                :on-preview="handleWeChat"
                :limit="limitsImg"
                :before-upload="beforeAvatarUpload"
                :on-remove="RemoveWeChat">
                <img v-if="baseInfo.repayConfig.weChat_url" :src="baseInfo.repayConfig.weChat_url" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible2">
                <img width="100%" :src="baseInfo.repayConfig.weChat_url" alt="">
              </el-dialog>
            </el-form-item>
            <el-form-item label="上传银行卡照片">
              <el-upload
                ref="bankCard"
                class="uploading"
                :action="apiUrl"
                list-type="picture-card"
                :headers="myHeaders"
                :on-success="SuccessBankcard"
                :on-preview="handleBankcard"
                :limit="limitsImg"
                :before-upload="beforeAvatarUpload"
                :on-remove="RemoveBankcard">
                <img v-if="baseInfo.repayConfig.bankCard_url" :src="baseInfo.repayConfig.bankCard_url" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible3">
                <img width="100%" :src="baseInfo.repayConfig.bankCard_url" alt="">
              </el-dialog>
            </el-form-item>
          </div>
          <el-row :gutter="24" style="margin-top: 15px">
            <el-col :span="12">
              <el-form-item label="开户人姓名" prop="bank_card_name">
                <el-input :disabled="isdisabled" v-model="baseInfo.repayConfig.bank_card_name"></el-input>
              </el-form-item>
              <el-form-item label="银行卡号" prop="bank_card">
                <el-input :disabled="isdisabled" v-model="baseInfo.repayConfig.bank_card"></el-input>
              </el-form-item>
              <el-form-item label="开户行" prop="bank_name">
                <el-input :disabled="isdisabled" v-model="baseInfo.repayConfig.bank_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="支付宝收款账户姓名" prop="alipay_account_name">
                <el-input :disabled="isdisabled" v-model="baseInfo.repayConfig.alipay_account_name"></el-input>
              </el-form-item>
              <el-form-item label="支付宝账号" prop="alipay_account">
                <el-input :disabled="isdisabled" v-model="baseInfo.repayConfig.alipay_account"></el-input>
              </el-form-item>

              <el-form-item label="微信账户收款姓名" prop="weChat_account_name">
                <el-input :disabled="isdisabled" v-model="baseInfo.repayConfig.weChat_account_name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!--充值model-->
      <el-dialog
        title='我要充值'
        :visible.sync="rechargeModel"
        width="40%"
        center>
        <el-form :label-position="labelPosition" label-width="80px" :model="rechargedata">
          <el-form-item label="充值金额(元)">
            <el-input clearable placeholder="请输入充值金额" v-model="rechargedata.credit"></el-input>
          </el-form-item>
          <el-form-item label="交易方式">
            <template>
              <el-select v-model="rechargedata.mode" placeholder="请选择">
                <el-option label="支付宝" :value="1"></el-option>
                <el-option label="微信支付" :value="2"></el-option>
                <el-option label="银行转账" :value="3"></el-option>
                <el-option label="线下支付" :value="4"></el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="充值订单号">
            <el-input clearable placeholder="请输入订单号" v-model="rechargedata.serialnumber"></el-input>
          </el-form-item>
          <p class="rek-text">* 充值订单号即为转账时候的订单号</p>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="rechargeModel = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="recharge">立即冲值</el-button>
        </span>
      </el-dialog>
      <!--提现model-->
      <el-dialog
        title='我要提现'
        :visible.sync="withdrawModel"
        width="30%"
        center>
        <el-form label-width="80px" :model="withdrawdata">
          <el-form-item label="提现金额">
            <el-input clearable placeholder="请输入提现金额" v-model="withdrawdata.amount"></el-input>
          </el-form-item>
          <el-form-item label="验证码">
            <el-input clearable placeholder="请输入验证码" v-model="withdrawdata.code"></el-input>
            <count-down></count-down>
          </el-form-item>
          <el-form-item label="交易方式">
            <template>
              <el-select v-model="withdrawdata.mode" placeholder="请选择">
                <!--<el-option label="支付宝" :value="1"></el-option>-->
                <!--<el-option label="微信支付" :value="2"></el-option>-->
                <el-option label="银行转账" :value="3"></el-option>
                <!--<el-option label="线下支付" :value="4"></el-option>-->
              </el-select>
            </template>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="withdrawModel = false">取 消</el-button>
          <el-button type="primary" @click="withdraw">立即提现</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="复制链接"
        :visible.sync="dialogVisible4"
        width="50%">
        <div class="links_url">
          <span>商户H5推广链接</span>
          <el-input v-model="linkurl" id="biao1" placeholder="请输入内容"></el-input>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="complexsystem">复 制</el-button>
          </div>
        </div>
        <div class="links_url">
          <span>商户H5登录链接</span>
          <el-input v-model="linkurl_1" id="biao2" placeholder="请输入内容"></el-input>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="complexsystem1">复 制</el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        title="温馨提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <span>{{msg_arreas}}</span>
        <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="goRecharge">去充值</el-button>
      </span>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
  import countDown from "./../common/countDownshop.vue";
  import waves from '@/common/waves/index.js' // 水波纹指令
  import sessionStorage from "@/storage/sessionStorage";
  import Api from "@/api";
  import proConfig from '@/config';

  export default {
    directives: {
      waves
    },
    data() {
      return {
        allotSwitch:false,
        myHeaders: {
          tokenId: sessionStorage.$getSessionStorageByName("tokenId")
        }, // 要保证取到
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3: false,
        dialogVisible4: false,
        linkurl: '',
        linkurl_1: '',
        limitsImg: 1,
        apiUrl: proConfig.apiUrl + '/sys/shop/uploadImg',
        labelPosition: "top",
        btnEditText: "编辑",
        btnEditText1: "编辑",
        rechargeModel: false,//充值
        withdrawModel: false,//提现
        rechargedata: {
          credit: '',
          serialnumber: '',
          mode: ''
        },
        withdrawdata: {
          amount: '',
          mode: '',
          code: ''
        },
        baseInfo: {
          //商家信息
          shopInfo: {},
          //钱--任务栏
          taskInfo: {},
          //参数配制
          loanConfig: {},
          //还款配制
          repayConfig: {}
        },
        isdisabled: true,
        isdisabled1: true,
        listLoading: false,
        foodrules: {},
        msg_arreas: '',
        centerDialogVisible: false,
      }
    },

    created() {
      this.queryCostDetail();
    },
    methods: {
      //开启关闭
      allotSwitchs(val){
        let para={
          allotSwitch:val?1:0
        }
        Api.testApi.shopAllotSwitchCloseOrOpen(para).then(res=>{
          if(res.code==='0000') {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }
        })
      },
      //充值
      recharge() {
        if (this.rechargedata.credit && this.rechargedata.serialnumber && this.rechargedata.mode) {
          this.$confirm(`确认提交${this.rechargedata.credit}元的充值申请？, 是否继续?`, '充值确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let para = {
              orderId: this.rechargedata.serialnumber,
              tradeAmount: this.rechargedata.credit,
              shopId: this.baseInfo.shopInfo.shopId,
              type: 2,
              mode: this.rechargedata.mode,
            }

            // console.log('para', para)
            Api.testApi.rechargeProduct(para).then(res => {
              if (res.code == '0000') {
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                });
                this.rechargeModel = false
                this.queryCostDetail()
                sessionStorage.$removeSessionStorageByName('msg_arreas')
              } else {
                this.rechargeModel = false
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交'
            });
            this.rechargeModel = false
          });
        } else {
          this.$message({
            type: 'info',
            message: '请填写充值金额、流水号和选择交易方式！'
          });
        }
      },
      //提现
      withdraw() {
        // console.log('withdrawdata', this.withdrawdata)
        if (this.withdrawdata.amount && this.withdrawdata.mode && this.withdrawdata.code) {
          this.$confirm('点确定将申请提现成功, 是否继续?', '提现确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let para = {
              tradeAmount: this.withdrawdata.amount,
              shopId: this.baseInfo.shopInfo.shopId,
              type: 3,
              messageCode: this.withdrawdata.code,
              mode: this.withdrawdata.mode,
            }
            Api.testApi.cashOutProduct(para).then(res => {
              if (res.code == '0000') {
                this.$message({
                  type: 'success',
                  message: `恭喜您申请提现 ${this.withdrawdata.amount} 元成功，请等待审核！ `
                });
                this.withdrawModel = false
              } else {
                this.withdrawModel = false
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交'
            });
            this.withdrawModel = false
          });
        } else {
          this.$message({
            type: 'info',
            message: '请填写提现金额、验证码和选择交易方式'
          });
          this.withdrawModel = false
        }
      },
      //      上传支付宝二维码图片
      RemoveAlipay(file, fileList) {
        this.baseInfo.repayConfig.alipay_url = "";
        // console.log("1-------");
      },
      handleAlipay(file) {
        this.baseInfo.repayConfig.alipay_url = file.url;
        this.dialogVisible1 = true;
      },
      async SuccessAlipay(response) {
        this.baseInfo.repayConfig.alipay_url = await response.data;
      },
      //上传微信二维码图片
      RemoveWeChat(file, fileList) {
        this.baseInfo.repayConfig.weChat_url = "";
        // console.log("2-------");
      },
      handleWeChat(file) {
        this.baseInfo.repayConfig.weChat_url = file.url;
        this.dialogVisible2 = true;
      },
      async SuccessWeChat(response) {
        this.baseInfo.repayConfig.weChat_url = await response.data;
      },
      //上传银行卡二维码图片
      RemoveBankcard(file, fileList) {
        this.baseInfo.repayConfig.bankCard_url = "";
        // console.log("3-------");
      },
      handleBankcard(file) {
        this.baseInfo.repayConfig.bankCard_url = file.url;
        this.dialogVisible3 = true;
      },
      async SuccessBankcard(response) {
        this.baseInfo.repayConfig.bankCard_url = await response.data;
      },
      beforeAvatarUpload(file) {
        const isRightType = file.type === "image/jpeg" || file.type === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isRightType) {
          this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isRightType && isLt2M;
      },
      //刷新
      on_refresh() {
        this.get_table_data()
      },
      //获取商户信息
      queryCostDetail() {
        let para = {};

        this.listLoading = true;
        Api.testApi.getBaseInfo(para).then(res => {
          if (res.code == '0000') {
            // console.log(res.data)
            this.baseInfo.shopInfo = res.data.shopInfo;
            this.allotSwitch=this.baseInfo.shopInfo.allotSwitch===1?true:false
            this.baseInfo.taskInfo = res.data.taskInfo;
            this.baseInfo.loanConfig = res.data.loanConfig;
            this.baseInfo.loanConfig.due_time = JSON.stringify(this.baseInfo.loanConfig.due_time)
            this.baseInfo.repayConfig = res.data.repayConfig;
            this.listLoading = false;

            if(this.baseInfo.shopInfo.availableBalance<=0) {
              this.msg_arreas ="商户已欠费，请及时冲值！"
              this.centerDialogVisible = true
            }else {
              this.centerDialogVisible = false
            }
          }
        })
      },
      //取消
      canceladit1() {
        this.btnEditText1 = '编辑'
        this.isdisabled1 = true;
      },
      //编辑
      editDisabled1() {
        if (this.btnEditText1 == '编辑') {
          this.btnEditText1 = '提交'
          this.isdisabled1 = false;
        } else if (this.btnEditText1 == '提交') {
          this._updateShopConfig();//提交保存
        }
      },
      _updateShopConfig() {
        var _this = this;
        _this.$refs.repayConfig.validate((valid) => {
          if (valid) {
            _this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              let para = Object.assign({}, this.baseInfo.loanConfig);
              para.due_time = Number(para.due_time)
              Api.testApi.updateShopConfig(para).then(res => {
                if (res.code == '0000') {
                  this.editLoading = false;
                  // console.log('res-----------------------', res)
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.queryCostDetail()
                  this.editFormVisible = false;
                  this.btnEditText1 = '编辑'
                  this.isdisabled1 = true;
                }
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交'
              });
              this.btnEditText = '编辑'
              this.isdisabled = true;
            });
          }
        });
      },
      //取消
      canceladit() {
        this.btnEditText = '编辑'
        this.isdisabled = true;
      },
      //编辑
      editDisabled() {
        if (this.btnEditText == '编辑') {
          this.btnEditText = '提交'
          this.isdisabled = false;
        } else if (this.btnEditText == '提交') {
          this._changeRepayConfig();//提交保存
        }
      },
      _changeRepayConfig() {
        var _this = this;
        _this.$refs.repayConfig.validate((valid) => {
          if (valid) {
            _this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              let para = Object.assign({}, _this.baseInfo.repayConfig);
              para.shopId = this.baseInfo.shopInfo.shopId

              Api.testApi.changeRepayConfig(para).then(res => {
                if (res.code == '0000') {
                  this.editLoading = false;
                  // console.log('res-----------------------', res)
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.queryCostDetail()
                  this.editFormVisible = false;
                  this.isdisabled = true;
                }
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交'
              });
              this.btnEditText = '编辑'
              this.isdisabled = true;
            });
          }
        });
      },
      thelinkUrl() {
        this.dialogVisible4 = true;
        this.linkurl = proConfig.expandUrl
        this.linkurl = this.linkurl.split('=');
        this.linkurl = this.linkurl[0];
        this.linkurl = this.linkurl + `=${this.baseInfo.shopInfo.shopId}`
        this.linkurl_1 = proConfig.loginUrl
        this.linkurl_1 = this.linkurl_1.split('=');
        this.linkurl_1 = this.linkurl_1[0];
        this.linkurl_1 = this.linkurl_1 + `=${this.baseInfo.shopInfo.shopId}`
        // console.log('linkurl', this.linkurl)
      },
      complexsystem() {
        var Url2 = document.getElementById("biao1");
        Url2.select(); // 选择对象
        document.execCommand("Copy")
        this.dialogVisible4 = false;
        this.$message({
          message: '复制成功',
          type: 'success'
        });
      },
      complexsystem1() {
        var Url2 = document.getElementById("biao2");
        Url2.select(); // 选择对象
        document.execCommand("Copy")
        this.dialogVisible4 = false;
        this.$message({
          message: '复制成功',
          type: 'success'
        });
      },
      goAditlist() {
        this.$router.push('/useraudit')
      },
      goBorrowinglist() {
        this.$router.push('/borrowinglist')
      },
      goRecharge(){
        this.rechargeModel=true
        this.centerDialogVisible=false
      }
    },
    components: {
      countDown
    },
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .rek-text {
    color: #e4393c;
  }

  .warp {
    .content-header {
      display: flex;
      border: 1px solid #e5e5e5;
      border-radius: 5px;
      padding: 20px 40px;
      margin-bottom: 15px;
      .sjlogo {
        display: flex;
        img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
        }
      }
      .money-box {
        padding-right: 40px;
        border-right: 1px solid #e5e5e5;
        header {
          font-size: 18px;
          font-weight: bold;
          padding-bottom: 15px;
          border-bottom: 1px solid #e5e5e5;
          span {
            color: #feb319;
          }
        }
        p {
          padding: 8px 0;
          font-size: 15px;
          border-bottom: 1px solid #e5e5e5;
          span {
            color: #feb319;
            font-size: 15px;
            font-weight: bold;
          }
        }
        .btn-box {
          padding-top: 30px;
          .tx-btn {
            background-color: #ff8b00 !important;
            border-color: #ff8b00 !important;
          }
          .tx-btn:active {
            background-color: #d8903a !important;
            border-color: #d8903a !important;
          }
          .tx-btn:hover {
            background-color: #d8903a !important;
            border-color: #d8903a !important;
          }
        }
      }
      .merchant-box {
        padding-left: 40px;
        flex: 1;
        header {
          font-size: 18px;
          font-weight: bold;
          padding-bottom: 15px;
          border-bottom: 1px solid #e5e5e5;
        }
        p {
          padding: 8px 0;
          font-size: 15px;
          border-bottom: 1px solid #e5e5e5;
          span {
            font-size: 15px;
            background-color: #e5e5e5;
            padding: 5px 30px;
            border-radius: 4px;
          }
        }
      }
    }
    .amount-box {
      margin-bottom: 15px;
      .money-due {
        border: 1px solid #e5e5e5;
        border-radius: 5px;
        padding: 20px 40px;
        .due-box {
          display: flex;
          /*justify-content: center;*/
          .due-bj {
            /*background-color: #0692dd;*/
            margin: 0;
          }
          /*.due-bj {*/
          /*background-color: #e75c61;*/
          /*}*/
          /*.due-bj1 {*/
          /*background-color: #12a902;*/
          /*}*/
          /*.due-bj2 {*/
          /*background-color: #8272bb;*/
          /*}*/
          /*.due-bj3 {*/
          /*background-color: #dd467d;*/
          /*}*/
          /*.due-bj4 {*/
          /*background-color: #f38001;*/
          /*}*/
          /*.due-bj5 {*/
          /*background-color: #e54e19;*/
          /*}*/
          .due:hover {
            background-color: #8272aa;
          }
          .due {
            margin-left: 15px;
            width: 200px;
            padding: 15px 0;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            background-color: #8272bb;
            p {
              font-size: 15px;
            }
            p:nth-child(1) {
              padding-bottom: 15px;
            }
          }
          .due:nth-child(1) {
            margin: 0;
          }
        }
      }
    }
    .mission-box {
      display: flex;
      flex-direction: column;
      border: 1px solid #e5e5e5;
      border-radius: 5px;
      padding: 20px 40px;
      margin-bottom: 15px;
      .missio-title {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e5e5e5;
        p {
          height: 50px;
          line-height: 50px;
          font-size: 18px;
          font-weight: bold;
        }
      }
      .missio {
        height: 60px;
        display: flex;
        border-bottom: 1px solid #e5e5e5;
        .missio-left {
          display: flex;
          align-items: center;
          p {
            span {
              background-color: #e54e17;
              color: #fff;
              padding: 5px 20px;
              border-radius: 14px;
            }
          }
          .handle-btn {
            margin-left: 30px;
          }

        }
        .missio-right {
          display: flex;
          align-items: center;
          margin-left: 50px;
          P {
            span {
              background-color: #e54e17;
              color: #fff;
              padding: 5px 20px;
              border-radius: 14px;
            }
          }
          .handle-btn {
            margin-left: 30px;
          }
        }
      }
      .missio-curve {
        p {
          border-bottom: 1px solid #e5e5e5;
          height: 40px;
          line-height: 40px;
          span {
            color: #feb319;
          }
        }
      }
      .parameter-curve {
        display: flex;
        flex-direction: column;
        padding-top: 15px;
        .parameter {
          display: flex;
          border-bottom: 1px solid #e5e5e5;
          p {
            width: 300px;
            height: 40px;
            line-height: 40px;
            span {
              color: #feb319;
            }
          }
        }
      }
    }
  }

  .uploading-a {
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid #e5e5e5;
    text-align: center;
    padding: 20px;
  }

  .content-box {
    border: 1px solid #e5e5e5;
    padding: 15px 0;
  }

  .form_header {
    text-align: center;
    margin-bottom: 10px;
    font-size: 16px;
  }

  .el-table .info-row {
    background: #c9e5f5;
  }

  .el-form--label-top .el-form-item__label {
    padding: 0;
  }

  .el-upload--picture-card img {
    width: 100%;
    height: 100%;
  }

  .uploading {
    width: 148px;
    height: 148px;
    overflow: hidden;
  }

  .el-table .positive-row {
    background: #e2f0e4;
  }

  .submit-box {
    text-align: right;
  }

  .links_url {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    span {
      width: 155px;
    }
    .dialog-footer {
      margin-left: 10px;
    }
  }
</style>

