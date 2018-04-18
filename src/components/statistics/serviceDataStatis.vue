<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>客服统计</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <div class="filter-container">
        <!--<el-input clearable @keyup.enter.native="handleFilter" v-model="search.cusName" style="width: 200px;"-->
                  <!--class="filter-item"-->
                  <!--placeholder="客服姓名">-->
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

      <!--列表-->
      <el-table :data="statisList" highlight-current-row
                element-loading-text="拼命加载中" v-loading="listLoading"
                @selection-change="selsChange"
                border
                style="width: 100%;">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <!--<el-table-column type="index" width="60"></el-table-column>-->
        <el-table-column prop="userName" label="客服姓名"></el-table-column>
        <el-table-column prop="serviceStatisInfo.count" label="分配量"></el-table-column>
        <el-table-column prop="serviceStatisInfo.dialCount" label="已拔打"></el-table-column>
        <el-table-column prop="serviceStatisInfo.undialCount" label="待拔打"></el-table-column>
        <el-table-column prop="certifiedNum" label="到达审核人数">
          <template slot-scope="scope">
            {{scope.row.serviceStatisInfo.authCount}}
          </template>
        </el-table-column>
        <el-table-column prop="certifiedNum" label="到达终审人数">
          <template slot-scope="scope">
            {{scope.row.serviceStatisInfo.finalAuthCount}}
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar pad-a">
        <!--<el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>-->

        <!--分页-->
        <div v-show="statisList.length" style="float: right" class="pagination-container">
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
  import waves from "@/common/waves/index"; // 水波纹指令
  import sessionStorage from "@/storage/sessionStorage";
  import Api from "@/api";

  export default {
    directives: {
      waves
    },
    data() {
      return {
        statisList: [],
        total: 0,
        listQuery: {
          page: 15,
          limit: 1,
          statTime: "",
          endTime: "",
        },
        search: {
          cusName: ''
        },
        listLoading: false,
        sels: [], //列表选中列
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
        timeQuantum: '', //时间段
      };
    },
    mounted() {
      this._serviceDataStatis();
    },
    created() {
      // this.timeQuantum[0]=new Date()
      // this.timeQuantum[1]=new Date()
    },
    methods: {
      handleCurrentChange(val) {
        this.listQuery.limit = val;
        this._serviceDataStatis();
      },
      handleFilter() {
        this._serviceDataStatis();
      },
      //刷新
      on_refresh() {
        this.timeQuantum = null;
        this.search.cusName = '';
        this._serviceDataStatis()
      },
      //获取商户列表
      _serviceDataStatis() {
        let statTime = null;
        let endTime = null;
        if (this.timeQuantum) {
          statTime = util.formatDate.format(
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
          statTime: statTime,
          endTime: endTime,
          cusName: this.search.cusName
        }
        Api.testApi.getServiceStatisList(util.checkBe(para)).then(res => {
          if (res.code === '0000') {
            if (res.data.sysUserEvs) {
              let resData = res.data.sysUserEvs
              for (let v of resData) {
                v.serviceStatisInfo = JSON.parse(v.serviceStatisInfo)
              }
              this.statisList = resData
              this.total = res.data.total
            } else {
              this.total = 0
              this.statisList = []
            }
          }
        })
      },
      selsChange: function (sels) {
        this.sels = sels;
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
