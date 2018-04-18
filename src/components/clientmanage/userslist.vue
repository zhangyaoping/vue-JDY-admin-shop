<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>机审列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <div class="filter-container">
        <!--<el-input clearable @keyup.enter.native="handleFilter" v-model="search.cusId" style="width: 200px;"-->
        <!--class="filter-item"-->
        <!--placeholder="用户编号">-->
        <!--</el-input>-->
        <el-input clearable @keyup.enter.native="handleFilter" v-model="search.cusMobile" style="width: 200px;"
                  class="filter-item"
                  placeholder="用户手机号">
        </el-input>
        <el-input clearable @keyup.enter.native="handleFilter" v-model="search.cusName" style="width: 200px;"
                  class="filter-item"
                  placeholder="用户姓名">
        </el-input>

        <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="审核状态">
          <el-option v-for="item in platformName" :key="item.key" :label="item.status"
                     :value="item.key">
          </el-option>
        </el-select>
        <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.sourceVal" placeholder="类型">
          <el-option v-for="item in typeSource" :key="item.key" :label="item.source"
                     :value="item.key">
          </el-option>
        </el-select>
        <el-button @click.stop="on_refresh" class="filter-item" size="small" style="font-size: 16px;" plain v-waves
                   icon="el-icon-refresh"></el-button>
        <el-button class="filter-item" style="width: 90px;" type="primary" v-waves icon="el-icon-search"
                   @click="handleFilter">
          搜索
        </el-button>
      </div>
      <!--列表-->
      <el-table :data="userAuditlist" border highlight-current-row element-loading-text="拼命加载中" v-loading="listLoading"
                style="width: 100%;">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <!--<el-table-column type="index" width="60"></el-table-column>-->
        <!--<el-table-column prop="cusId" label="编号"></el-table-column>-->
        <el-table-column prop="cusMobile" width="115" label="手机"></el-table-column>
        <el-table-column prop="inviteCode" width="100" label="代理编号"></el-table-column>
        <el-table-column prop="cusName" width="65" label="姓名"></el-table-column>
        <el-table-column prop="cusAge" width="50" label="年龄"></el-table-column>
        <el-table-column prop="cusSex" width="50" label="性别"></el-table-column>
        <el-table-column prop="source" width="80" label="类型"></el-table-column>
        <el-table-column prop="device" label="设备" width="80">
          <template slot-scope="scope">
            {{returnDeviceVal(scope.row.device)}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="170"></el-table-column>
        <el-table-column prop="loanFlg" label="状态">
          <template slot-scope="scope">
            <el-tag
              size="small"
              :type="returnTagType(scope.row.auditStatus)"
              close-transition>{{returnTagValue(scope.row.auditStatus)}}
            </el-tag>
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="userinfo(scope.row)">查看档案</el-button>
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
  </el-row>
</template>
<script>
  import util from '../../common/util'
  import waves from '@/common/waves/index.js' // 水波纹指令
  import Api from '@/api';
  import sessionStorage from '@/storage/sessionStorage'
  import proConfig from '../../config';

  const platformName = [
    {key: '1', status: '待认证'},
    {key: '2', status: '自动审核中'},
    {key: '3', status: '机审通过'},
    {key: '4', status: '人工审核通过'},
    {key: '5', status: '黑名单'},
    {key: '7', status: '机审未通过'},
    {key: '8', status: '人工未通过'}
  ]
  const typeSource = [
    {key: '1', source: '商户推广'},
    {key: '5', source: '系统推广'},
  ]

  // arr to obj
  const platformNameKeyValue = platformName.reduce((acc, cur) => {
    acc[cur.key] = cur.status
    return acc
  }, {})
  const typeSourceValue = typeSource.reduce((acc, cur) => {
    acc[cur.key] = cur.source
  })
  export default {
    directives: {
      waves
    },
    data() {
      return {
        search: {
          cusId: '',
          cusName: '',
          cusMobile: '',
        },
        userAuditlist: [],
        platformName,
        typeSource,
        total: 0,
        listQuery: {
          page: 15,
          limit: 1,
          type: undefined,
          sourceVal: undefined,
          startTime: '',
          endTime: '',
        },
        listLoading: false,
      }
    },
    filters: {
      typeFilter(type) {
        return platformNameKeyValue[type]
      },
      typeFilters(type) {
        return typeSourceValue[type]
      }
    },
    created() {
      this.cusList();
    },
    methods: {
      //分页
      handleCurrentChange(val) {
        this.listQuery.limit = val;
        this.cusList()
      },
      handleFilter() {
        this.cusList()
      },
      on_refresh() {
//        this.search.cusId = '';
        this.search.cusName = '';
        this.search.cusMobile = '';
        this.listQuery.type = '';
        this.cusList()
      },
      //获取参数列表-
      cusList() {
        let para = {
          pSize: this.listQuery.page,
          pNum: this.listQuery.limit,
//          cusId: this.search.cusId,
          cusName: this.search.cusName,
          cusMobile: this.search.cusMobile,
          auditStatus: this.listQuery.type || '',
          source: this.listQuery.sourceVal || '',
        };
        this.listLoading = true
        Api.testApi.cusList(util.checkBe(para)).then(res => {
          if (res.code == '0000') {
            if (res.data) {
              if (res.data.creditEvs) {
//              console.log('res____________', res.data.creditEvs)
                let resData = res.data.creditEvs
                this.total = res.data.total;
                for (let i = 0; i < resData.length; i++) {
                  resData[i].createTime = util.formatDate.format(new Date(resData[i].createTime), 'yyyy-MM-dd hh:mm:ss')
                  resData[i].source = this.returnSourceVal(resData[i].source)
                }
                this.userAuditlist = resData;
                this.listLoading = false
              }
            } else {
              this.userAuditlist = [];
              this.total = 0
              this.listLoading = false
            }
          }
        })
      },
      //返回表格内标签的类型
      returnTagType(status) {
        switch (status) {
          case 1:
            return 'success';
          case 2:
            return 'success';
          case 3:
            return 'primary';
          case 4:
            return 'primary';
          case 5:
            return 'info';
          case 7:
            return 'info';
          case 8:
            return 'info'
        }
      },
      //返回表格内标签的内容
      returnTagValue(status) {
        switch (status) {
          case 1:
            return '待认证';
          case 2:
            return '自动审核中';
          case 3:
            return '机审通过';
          case 4:
            return '人工审核通过';
          case 5:
            return '黑名单';
          case 7:
            return '机审未通过';
          case 8:
            return '人工未通过';
        }
      },
      //5：系统推广 其他为商户推广
      returnSourceVal(source) {
        switch (source) {
          case 5:
            return '系统推广'
          default:
            return '商户推广'
        }
      },
      //返回设备来源来源0：苹果，1：安卓，2其他
      returnDeviceVal(Device) {
        switch (Device) {
          case 0:
            return '苹果'
          case 1:
            return '安卓'
          default:
            return '其他'
        }
      },
      //跳档案
      userinfo(row) {
        sessionStorage.$setSessionStorageByName("cusId", row.cusId);
        sessionStorage.$removeSessionStorageByName("auditStatus", row.auditStatus);
        window.open(window.location.origin + proConfig.openurl)
      },
    },
    components: {},
  }
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
