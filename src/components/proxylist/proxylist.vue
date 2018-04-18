<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>代理管理</el-breadcrumb-item>
        <el-breadcrumb-item>代理列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <div class="filter-container">
        <el-input clearable @keyup.enter.native="handleFilter" v-model="search.name" style="width: 200px;"
                  class="filter-item"
                  placeholder="公司名称">
        </el-input>
        <el-input clearable @keyup.enter.native="handleFilter" v-model="search.mobile" style="width: 200px;"
                  class="filter-item"
                  placeholder="联系电话">
        </el-input>
        <el-input clearable @keyup.enter.native="handleFilter" v-model="search.inviteCode" style="width: 200px;"
                  class="filter-item"
                  placeholder="代理邀请码">
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
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <!--<el-button type="primary" icon="el-icon-plus" v-waves @click="showAddDialog">添加代理-->
        <!--</el-button>-->
      </div>
      <!--列表-->
      <!--<div class="number-a">-->
      <!--<el-date-picker-->
      <!--v-model="timeQuantum1"-->
      <!--type="datetimerange"-->
      <!--:picker-options="pickerOptions3"-->
      <!--range-separator="至"-->
      <!--start-placeholder="开始日期"-->
      <!--end-placeholder="结束日期"-->
      <!--align="right">-->
      <!--</el-date-picker>-->
      <!--<el-button style="margin-left: 15px;" class="filter-item" type="primary" v-waves @click="handleFilter1">统计总数-->
      <!--</el-button>-->
      <!--<p>推广总数：<span>{{amount}}</span>人</p>-->
      <!--</div>-->
      <el-table :data="merchantList" highlight-current-row
                border
                element-loading-text="拼命加载中" v-loading="listLoading"
                @selection-change="selsChange"
                style="width: 100%;">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <el-table-column prop="proxyId" label="代理编号" width="80"></el-table-column>
        <el-table-column prop="inviteCode" label="代理邀请码" width="100"></el-table-column>
        <el-table-column prop="proxyMobile" label="代理账户" width="115"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170"></el-table-column>
        <el-table-column prop="proxyName" label="公司名称" min-width="150"></el-table-column>
        <el-table-column prop="proxyInfo.negotiationName" width="100" label="渠道经理"></el-table-column>
        <el-table-column prop="proxyInfo.price" width="120" label="渠道合作价格">
          <template slot-scope="scope">
            {{scope.row.proxyInfo.price?parseFloat(scope.row.proxyInfo.price).toFixed(2):''}}
          </template>
        </el-table-column>
        <el-table-column prop="proxyMobile" width="115" label="联系电话"></el-table-column>
        <el-table-column prop="promotioncusNum" label="推广用户数" width="100">
          <template slot-scope="scope">
            {{scope.row.promotioncusNum?parseFloat(scope.row.promotioncusNum):'0'}}
          </template>
        </el-table-column>
        <el-table-column prop="successCusNum" width="80" label="通过人数">
          <template slot-scope="scope">
            {{scope.row.successCusNum?parseFloat(scope.row.successCusNum):'0'}}
          </template>
        </el-table-column>
        <!--<el-table-column prop="status" label="状态">-->
        <!--<template slot-scope="scope">-->
        <!--<el-tag-->
        <!--:type="returnTagType(scope.row.userStatus)"-->
        <!--close-transition>{{returnTagValue(scope.row.userStatus)}}-->
        <!--</el-tag>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="操作" fixed="right" width="250">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="_getGeneralProxyList(scope.$index,scope.row)">统计</el-button>
            <el-button type="primary" size="mini" @click="thelinkUrl(scope.$index,scope.row)">生成链接</el-button>
            <!--<el-button type="primary" size="small" plain @click="_updStatus(scope.$index,scope.row)">-->
            <!--{{scope.row.userStatus==1?'冻结':'恢复'}}-->
            <!--</el-button>-->
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
    <el-dialog
      title="推广链接"
      :visible.sync="dialogVisible"
      width="50%">
      <span>
        <el-input v-model="linkurl" id="biao1" placeholder="请输入内容"></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="complexsystem">复 制</el-button>
      </span>
    </el-dialog>

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
        dialogVisible: false,
        amount: '0',
        search: {
          name: '',
          mobile: '',
          inviteCode: ''
        },
        sysuerlist: [],
        merchantList: [],
        linkurl: '',
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
        pickerOptions3: {
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
        timeQuantum1: "", //时间段
        startTime1: "",
        endTime1: "",
      };
    },
    watch: {
      editFormVisible: "querydata"
    },
    mounted() {
      this.businessist();
    },
    methods: {
      thelinkUrl(index, row) {
        this.dialogVisible = true;
        this.linkurl = `http://www.jdyservice.com/#/proxyreg?shopId=${row.shopId}&inviteCode=${row.inviteCode}`
      },
      complexsystem() {
        var Url2 = document.getElementById("biao1");
        Url2.select(); // 选择对象
        document.execCommand("Copy")
        this.dialogVisible = false;
      },
      querydata() {
        if (this.editFormVisible) {
          // console.log("hhh", this.editFormVisible);
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
      _updStatus(index, row) {
        this.$confirm(row.userStatus == 1 ? "确认冻结吗?" : "确认恢复吗？", "提示", {
          type: "warning"
        }).then(() => {
          let para = {
            status: row.userStatus == 1 ? 0 : 1,
            userId: row.userId
          };
          Api.testApi.updStatus(para).then(res => {
            if (res.code === '0000') {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.businessist();
            }
          })
        }).catch(() => {
        });
      },
      handleFilter1() {
        if (this.timeQuantum1) {
          this.startTime = util.formatDate.format(
            new Date(this.timeQuantum1[0]),
            "yyyy-MM-dd hh:mm:ss"
          );
          this.endTime = util.formatDate.format(
            new Date(this.timeQuantum1[1]),
            "yyyy-MM-dd hh:mm:ss"
          );
        }
        let para = {
          staTime: this.startTime,
          endTime: this.endTime

        }
        if (para.staTime && para.endTime) {
          Api.testApi.findRegCount(para).then(res => {
            if (res.code === '0000') {
              this.amount = res.data
            }
          })
        } else {
          this.$message({
            message: "请选择起始时间!",
            type: "error"
          });
        }
      },
      //刷新
      on_refresh() {
        this.timeQuantum = null;
        this.search.name = '';
        this.search.mobile = '';
        this.search.inviteCode = ''
        this.businessist()
      },
      //获取商户列表
      businessist() {
        if (this.timeQuantum) {
          this.startTime = util.formatDate.format(
            new Date(this.timeQuantum[0]),
            "yyyy-MM-dd hh:mm:ss"
          );
          this.endTime = util.formatDate.format(
            new Date(this.timeQuantum[1]),
            "yyyy-MM-dd hh:mm:ss"
          );
        }
        let para = {
          limit: this.listQuery.page,
          page: this.listQuery.limit,
          proxyName: this.search.name,
          proxyMobile: this.search.mobile,
          inviteCode: this.search.inviteCode,
          startTime: this.startTime || "",
          endTime: this.endTime || ""
        };
        this.listLoading = true;
        Api.testApi.proxylist(util.checkBe(para)).then(res => {
          if (res.code == "0000") {
            if (res.data.proxyEvList) {
              this.total = res.data.total;
              for (let i in res.data.proxyEvList) {
                res.data.proxyEvList[i].proxyInfo = JSON.parse(res.data.proxyEvList[i].proxyInfo);
                res.data.proxyEvList[i].createTime = util.formatDate.format(
                  new Date(res.data.proxyEvList[i].createTime),
                  "yyyy-MM-dd hh:mm:ss"
                );
              }
              this.merchantList = res.data.proxyEvList;
              this.listLoading = false;
            } else {
              this.total = 0
              this.merchantList = []
              this.listLoading = false;
            }
          }
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //返回表格内标签的类型
      _getGeneralProxyList(index, row) {
        sessionStorage.$setSessionStorageByName('shopUserId', row.shopUserId)
        this.$router.push({path: '/generalProxyList'})
      },
      returnTagType(status) {
        switch (status) {
          case 1:
            return "primary";
          case 0:
            return "info";
        }
      },
      returnTagValue(status) {
        switch (status) {
          case 0:
            return "冻结";
          case 1:
            return "正常";
          case 2:
            return "删除"
        }
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
    line-height: 50px;
  }

  /*图片上传*/
  .el-upload--picture-card img {
    width: 100%;
    height: 100%;
  }

  .number-a {
    border: 1px solid #e5e5e5;
    padding: 10px;
    display: flex;
    p {
      padding-left: 50px;
      span {
        background-color: #409EFF;
        padding: 6px;
        display: inline-block;
        width: 80px;
        text-align: center;
        color: #ffffff;
        border-radius: 5px;
        font-size: 17px;
        margin-right: 10px;
      }
    }
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
