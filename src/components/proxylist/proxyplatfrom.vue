<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>代理管理</el-breadcrumb-item>
        <el-breadcrumb-item>代理平台</el-breadcrumb-item>
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
        <el-button type="primary" icon="el-icon-plus" v-waves @click="showAddDialog">添加代理
        </el-button>
      </div>

      <!--列表-->
      <el-table :data="merchantList" @row-dblclick="showEditDialog" highlight-current-row
                element-loading-text="拼命加载中" v-loading="listLoading"
                @selection-change="selsChange"
                border
                style="width: 100%;">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <el-table-column prop="proxyId" width="90" label="代理编号"></el-table-column>
        <el-table-column prop="shopSuperiorName" width="90" label="运营人员"></el-table-column>
        <el-table-column prop="proxyName" width="150" label="公司全称"></el-table-column>
        <el-table-column prop="proxyInfo.platformName" width="90" label="公司平台"></el-table-column>
        <el-table-column prop="platformType" width="110" label="平台类型">
          <template slot-scope="scope">{{returnVal1(scope.row.platformType)}}</template>
        </el-table-column>
        <el-table-column prop="proxyInfo.negotiationName" width="110" label="洽谈人姓名"></el-table-column>
        <el-table-column prop="proxyMobile" label="联系电话" width="115"></el-table-column>
        <!--<el-table-column prop="shopInfo.contact_mobile" label="QQ"></el-table-column>-->
        <!--<el-table-column prop="shopInfo.contact_mobile" label="微信"></el-table-column>-->
        <el-table-column prop="proxyInfo.cooperationModel" label="意向合作模式" width="110">
          <template slot-scope="scope">{{returnVal2(Number(scope.row.proxyInfo.cooperationModel))}}</template>
        </el-table-column>
        <el-table-column prop="cooperativeState" label="合作状况" width="100">
          <template slot-scope="scope">{{returnVal3(scope.row.cooperativeState)}}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期" width="170"></el-table-column>
        <el-table-column prop="proxyInfo.remark" min-width="100" label="备注"></el-table-column>

        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showEditDialog(scope.$index,scope.row)">编辑资料</el-button>
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
      <!--新增编辑界面-->
      <el-dialog
        :title="FormTtile"
        :visible.sync="editFormVisible">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="公司全称" prop="proxyName">
                <el-input v-model="editForm.proxyName" placeholder="请输入公司全称" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="运营人员" prop="superiorId">
                <template>
                  <el-select v-model="editForm.shopSuperiorId" placeholder="请选择">
                    <template v-for="item in sysuerlist">
                      <el-option :label=item.userName :value=item.userId></el-option>
                    </template>
                  </el-select>
                </template>
              </el-form-item>
              <el-form-item label="合作状况" prop="cooperativeState">
                <template>
                  <el-select v-model="editForm.cooperativeState" placeholder="请选择">
                    <el-option label="初步沟通" :value="0"></el-option>
                    <el-option label="合作进行" :value="1"></el-option>
                    <el-option label="合作商户" :value="2"></el-option>
                  </el-select>
                </template>
              </el-form-item>
              <!--<el-form-item label="QQ号码" prop="qq">-->
              <!--<el-input v-model="editForm.qq" auto-complete="off"></el-input>-->
              <!--</el-form-item>-->
              <el-form-item label="意向合作模式" prop="cooperationModel">
                <template>
                  <el-select v-model.number="editForm.cooperationModel" placeholder="请选择">
                    <el-option label="CPS" :value="1"></el-option>
                    <el-option label="其他" :value="0"></el-option>
                    <el-option label="CPA" :value="2"></el-option>
                  </el-select>
                </template>
              </el-form-item>
              <!--<el-form-item label="注册权值(%)" prop="registerRatio">-->
              <!--<el-input v-model="editForm.registerRatio" auto-complete="off"></el-input>-->
              <!--</el-form-item>-->
              <el-form-item label="佣金比例(%)" prop="extensionScale">
                <el-input v-model="editForm.extensionScale" auto-complete="off"></el-input>
              </el-form-item>

            </el-col>
            <el-col :span="12">
              <el-form-item label="公司平台" prop="platformName">
                <el-input v-model="editForm.platformName" placeholder="请输入平台名称" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="洽谈人姓名" prop="negotiationName">
                <el-input v-model="editForm.negotiationName" placeholder="请输入洽谈人姓名" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="平台类型" prop="platformType">
                <template>
                  <el-select v-model="editForm.platformType" placeholder="请选择">
                    <el-option label="微信公众号" :value="1"></el-option>
                    <el-option label="APP" :value="0"></el-option>
                  </el-select>
                </template>
              </el-form-item>
              <el-form-item label="联系电话" prop="proxyMobile">
                <el-input v-model="editForm.proxyMobile" placeholder="请输入联系电话" auto-complete="off"></el-input>
              </el-form-item>
              <!--<el-form-item label="通过权值(%)" prop="passRatio">-->
              <!--<el-input v-model="editForm.passRatio" auto-complete="off"></el-input>-->
              <!--</el-form-item>-->
              <el-form-item label="渠道合作价格" prop="price">
                <el-input v-model="editForm.price" placeholder="请输入渠道合作价格" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="身份证号码" prop="idCard">
                <el-input placeholder="请填写身份证号码" v-model="editForm.idCard" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" placeholder="请填写备注" v-model="editForm.remark" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取 消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">
            {{btnEditText}}
          </el-button>
        </div>
      </el-dialog>
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
        proxyweight: '',
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
        //新增编辑数据
        editForm: {
          proxyId: null,
          proxyName: '', //公司名称
          shopSuperiorId: '', //运营人员
          cooperativeState: '',//合作状况
          cooperationModel: '',//意向合作模式
          registerRatio: '',//注册权值
          extensionScale: '',//佣金比例
          platformName: '',//公司平台
          negotiationName: '',//洽谈人姓名
          platformType: '',//平台类型
          proxyMobile: '',//联系电话
          price: '', //渠道合作价格
          passRatio: '',//通过权值
          idCard: '',
          remark: '',//备注
        }
      };
    },
    mounted() {
      this._getoperactiondata()
      this.businessist();
    },
    created() {
      Api.testApi.getsysProxyInfo().then(res => {
        if (res.code === '0000') {
          this.proxyweight = JSON.parse(res.data)
        }
      })
    },
    methods: {
      _getoperactiondata() {
        Api.testApi.getoperactionInfo().then(res => {
          if (res.code === '0000') {
            this.sysuerlist = res.data
          }
        })
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
      //获取代理平台列表
      businessist() {
        let para = {
          pSize: this.listQuery.page,
          pNum: this.listQuery.limit,
        };
        this.listLoading = true;
        Api.testApi.proxyplatfrom(util.checkBe(para)).then(res => {
          if (res.code == "0000") {
            // console.log('res', res)
            if (res.data.proxyEvList) {
              for (let i in res.data.proxyEvList) {
                res.data.proxyEvList[i].proxyInfo = JSON.parse(res.data.proxyEvList[i].proxyInfo);
                res.data.proxyEvList[i].createTime = util.formatDate.format(
                  new Date(res.data.proxyEvList[i].createTime),
                  "yyyy-MM-dd hh:mm:ss"
                );
              }
              // this.merchantList.push(Object.assign({}, list[0], JSON.parse(list[0].proxyInfo)))
              this.total = res.data.total;
              this.merchantList = res.data.proxyEvList;
              this.listLoading = false;
            } else {
              this.total = 0
              this.merchantList = []
              this.listLoading = false;
            }
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      parameterConfect(row) {
        sessionStorage.$removeSessionStorageByName("shopId", row.shopId);
        sessionStorage.$setSessionStorageByName("shopId", row.shopId);
        this.$router.push({path: "/parameterConfect"});
      },
      selsChange: function (sels) {
        this.sels = sels;
      },

      //显示新增界面
      showAddDialog: function () {
        this.editFormVisible = true;
        this.FormTtile = "添加代理";
        this.btnEditText = "提交";
        this.editForm = {
          proxyName: '', //公司名称
          shopSuperiorId: '', //运营人员
          cooperativeState: '',//合作状况
          cooperationModel: '',//意向合作模式
          registerRatio: this.proxyweight.register,//注册权值
          extensionScale: this.proxyweight.extensionScale,//佣金比例
          platformName: '',//公司平台
          negotiationName: '',//洽谈人姓名
          platformType: '',//平台类型
          proxyMobile: '',//联系电话
          price: '', //渠道合作价格
          passRatio: this.proxyweight.pass,//通过权值
          idCard: '',
          remark: '',//备注
        };
      },
      //显示编辑界面
      showEditDialog: function (index, row) {
        this.editFormVisible = true;
        this.FormTtile = "编辑资料";
        this.btnEditText = "保存";
        //        this.editForm = Object.assign({}, row);
        // console.log(row);
        this.editForm = {
          proxyId: row.proxyId,
          proxyName: row.proxyName, //公司名称
          shopSuperiorId: row.shopSuperiorId, //运营人员
          cooperativeState: row.cooperativeState,//合作状况
          cooperationModel: Number(row.proxyInfo.cooperationModel),//意向合作模式
          registerRatio: row.proxyInfo.registerRatio,//注册权值
          extensionScale: row.proxyInfo.extensionScale,//佣金比例
          platformName: row.proxyInfo.platformName,//公司平台
          negotiationName: row.proxyInfo.negotiationName,//洽谈人姓名
          platformType: row.platformType,//平台类型
          proxyMobile: row.proxyMobile,//联系电话
          price: row.proxyInfo.price, //渠道合作价格
          passRatio: row.proxyInfo.passRatio,//通过权值
          idCard: row.proxyInfo.idCard,
          remark: row.proxyInfo.remark,//备注
        };
      },
      //编辑or新增
      editSubmit: function () {
        var _this = this;
        _this.$refs.editForm.validate(valid => {
          if (valid) {
            _this.$confirm("确认提交吗？", "提示", {}).then(() => {
              if (!_this.editForm.proxyId) {
                //新增
                let para = Object.assign({}, _this.editForm);

                Api.testApi.addProxyUser(para).then(res => {
                  if (res.code == "0000") {
                    this.$message({
                      message: "提交成功",
                      type: "success"
                    });
                    this.businessist();
                    this.editFormVisible = false;
                    this.$refs["editForm"].resetFields();
                  } else {
                    this.$message.error(res.msg);
                  }
                });
              } else {
                //编辑
                let para = Object.assign({}, this.editForm);
                // returnVal2
                Api.testApi.updateProxy(para).then(res => {
                  if (res.code == "0000") {
                    this.$message({
                      message: "保存成功",
                      type: "success"
                    });
                    this.$refs["editForm"].resetFields();
                    this.businessist();
                    this.editFormVisible = false;
                  } else {
                    this.$message.error(res.msg);
                  }
                });
              }
            });
          }
        });
      },
      //返回表格内标签的类型
      returnVal1(status) {
        switch (status) {
          case 0:
            return "APP";
          case 1:
            return "微信公众号";
        }
      },
      returnVal2(status) {
        switch (status) {
          case 0:
            return "其他";
          case 1:
            return "CPS";
          case 2:
            return 'CPA'
        }
      },
      returnVal3(status) {
        switch (status) {
          case 0:
            return "初步沟通";
          case 1:
            return "合作进行";
          case 2:
            return '合作商户'
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
