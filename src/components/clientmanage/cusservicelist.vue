<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>初审列表</el-breadcrumb-item>
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

        <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="标签状态">
          <el-option v-for="item in platformName" :key="item.key" :label="item.status"
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
        <el-table-column prop="cusMobile" width="115" label="手机"></el-table-column>
        <el-table-column prop="inviteCode" width="110" label="代理编号"></el-table-column>
        <el-table-column prop="cusName" width="65" label="姓名"></el-table-column>
        <el-table-column prop="cusAge" width="50" label="年龄"></el-table-column>
        <el-table-column prop="cusSex" width="50" label="性别"></el-table-column>
        <el-table-column prop="source" width="80" label="类型"></el-table-column>
        <el-table-column prop="device" width="80" label="设备">
          <template slot-scope="scope">
            {{returnDeviceVal(scope.row.device)}}
          </template>
        </el-table-column>
        <el-table-column prop="serviceUserName" width="65" label="客服"></el-table-column>
        <el-table-column prop="auditUserName" width="80" label="信审人员"></el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="170"></el-table-column>
        <!--<el-table-column prop="loanFlg" label="借款次数"></el-table-column>-->
        <el-table-column prop="loanFlg" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag
              size="small"
              :type="returnTagType(scope.row.auditStatus)"
              close-transition>{{returnTagValue(scope.row.auditStatus)}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="loanFlg" label="标签" width="120">
          <template slot-scope="scope">
            <el-tag
              size="small"
              :type="returnTagKey(scope.row.serviceLabel)"
              close-transition>{{returnkey(scope.row.serviceLabel)}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column min-width="160" label="打回原因">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.remark }}</p>
              <div slot="reference" class="name-wrapper">
                <span style="color: red;">{{scope.row.remark}}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="340">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="userinfo(scope.row)">查看档案</el-button>
            <!--<el-button :disabled="isBtn(scope.row)" size="small" type="primary" plain @click="pushmessage(scope.row)">-->
            <!--推送消息-->
            <!--</el-button>-->
            <el-button :disabled="isBtn(scope.row)" size="mini" type="primary" plain @click="thelinkUrl(scope.row)">
              链接
            </el-button>
            <el-button size="mini" type="success" @click="tally(scope.row)">标签</el-button>
            <el-button size="mini" type="primary" @click="submitaudit(scope.row)">提交审核</el-button>
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
      title="添加标签"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div>
        <el-select @change="changes" v-model="serviceLabel" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="tally_submit">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="复制消息"
      :visible.sync="dialogVisible4"
      width="50%">
      <div class="links_url">
        <span>消息推送</span>
        <el-input v-model="linkurl" id="biao2" placeholder="请输入内容"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="complexsystem1">复 制</el-button>
        </div>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
  import util from '../../common/util'
  import waves from '@/common/waves/index.js' // 水波纹指令
  import Api from '@/api';
  import sessionStorage from '@/storage/sessionStorage'
  import proConfig from '../../config';

  const platformName = [
    {key: '0', status: '待拔打'},
    {key: '1', status: '未接听'},
    {key: '4', status: '待加微信'},
    {key: '3', status: '已拒绝'},
    {key: '2', status: '已通过'},
    {key: '5', status: '已打回'},
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
        search: {
          cusId: '',
          cusName: '',
          cusMobile: '',
        },
        dialogVisible: false,
        dialogVisible4: false,
        linkurl: '',
        options: [{
          value: '1',
          label: '未接听'
        }, {
          value: '4',
          label: '待加微信'
        }, {
          value: '3',
          label: '已拒绝'
        }, {
          value: '2',
          label: '已通过'
        }],
        serviceLabel: '',
        cusIds: '',
        userAuditlist: [],
        platformName,
        total: 0,
        listQuery: {
          page: 15,
          limit: 1,
          type: undefined,
          startTime: '',
          endTime: '',
        },
        listLoading: false,
      }
    },
    filters: {
      typeFilter(type) {
        return platformNameKeyValue[type]
      }
    },
    created() {
      this.cusServiceList();
    },
    methods: {
      //分页
      handleCurrentChange(val) {
        this.listQuery.limit = val;
        this.cusServiceList()
      },
      handleFilter() {
        this.cusServiceList()
      },
      on_refresh() {
        this.search.cusName = '';
        this.search.cusMobile = '';
        this.listQuery.type = '';
        this.cusServiceList()
      },
      //获取参数列表-
      cusServiceList() {
        let para = {
          pSize: this.listQuery.page,
          pNum: this.listQuery.limit,
          cusName: this.search.cusName,
          cusMobile: this.search.cusMobile,
          serviceLabel: this.listQuery.type || '',
        };

        this.listLoading = true
        Api.testApi.cusServiceList(util.checkBe(para)).then(res => {
          if (res.code == '0000') {
            if (res.data) {
              let resData = res.data.logEvs
              this.total = res.data.total;
              for (let i = 0; i < resData.length; i++) {
                resData[i].createTime = util.formatDate.format(new Date(resData[i].createTime), 'yyyy-MM-dd hh:mm:ss')
                resData[i].source = this.returnSourceVal(resData[i].source)
              }
              this.userAuditlist = resData;
              this.listLoading = false
            } else {
              this.userAuditlist = [];
              this.total = 0
              this.listLoading = false
            }
          }
        })
      },
      //跳档案
      userinfo(row) {
        sessionStorage.$setSessionStorageByName("cusId", row.cusId);
        sessionStorage.$removeSessionStorageByName("auditStatus", row.auditStatus);
        window.open(window.location.origin + proConfig.openurl)
      },
      //推送消息
      pushmessage(row) {
        let para = {
          cusId: row.cusId
        }
        this.time_range("06:00", "20:00")
        Api.testApi.sendGeneralizeMessage(para).then(res => {
          if (res.code === '0000') {
            this.$message({
              message: "发送成功!",
              type: "success"
            });
            this.cusServiceList()
            this.dialogVisible = false;
          }
        })
      },
      //是否可推送
      isBtn(row) {
        return row.sendStatus == 1 ? true : false;
      },
      thelinkUrl(row) {
        this.dialogVisible4 = true;
        let para = {
          cusId: row.cusId
        }
        Api.testApi.getlink(para).then(res => {
          if (res.code === '0000') {
            if (res.data) {
              this.linkurl = res.data
            }
          }
        })

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
      //标签
      tally(row) {
        this.dialogVisible = true;
        this.serviceLabel = this.returnkey(row.serviceLabel)
        this.cusIds = row.cusId
      },
      tally_submit() {
        let para = {
          serviceLabel: this.returnkeys(this.serviceLabel),
          cusId: this.cusIds
        }
        Api.testApi.changeLabel(para).then(res => {
          if (res.code === '0000') {
            this.$message({
              message: "操作成功!",
              type: "success"
            });
            this.dialogVisible = false;
            this.cusServiceList();
          }
        })
      },
      changes() {
        this.serviceLabel = this.returnkey(Number(this.serviceLabel))
      },
      submitaudit(row) {
        this.$prompt("备注", "提交审核", {
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
              cusId:row.cusId,
              remark:value
            };
            Api.testApi.subAnlyseCustomer(util.checkBe(para)).then(res => {
              if (res.code == "0000") {
                this.$message({
                  message: "操作成功!",
                  type: "success"
                });
                this.cusServiceList();
              }
            });
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
      returnTagKey(key) {
        switch (key) {
          case 0:
            return 'info';
          case 1:
            return 'warning';
          case 3:
            return 'danger';
          case 2:
            return '';
          case 4:
            return 'warning';
        }
      },
      returnkey(key) {
        switch (key) {
          case 0:
            return '待拔打'
          case 1:
            return '未接听'
          case 4:
            return '待加微信'
          case 3:
            return '已拒绝'
          case 2:
            return '已通过'
          case 5:
            return '已打回'
        }
      },
      returnkeys(key) {
        switch (key) {
          case '待拔打':
            return 0
          case  '未接听':
            return 1
          case '待加微信':
            return 4
          case '已拒绝':
            return 3
          case '已通过':
            return 2
        }
      },
      //返回类型：5：系统推广 其他为商户推广
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
      //时间段
      time_range(beginTime, endTime) {
        var strb = beginTime.split(":");
        if (strb.length != 2) {
          return false;
        }
        var stre = endTime.split(":");
        if (stre.length != 2) {
          return false;
        }
        var b = new Date();
        var e = new Date();
        var n = new Date();
        b.setHours(strb[0]);
        b.setMinutes(strb[1]);
        e.setHours(stre[0]);
        e.setMinutes(stre[1]);
        if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
          return true;
        } else {
          this.$message({
            type: 'warning',
            message: `当前时间是${n.getHours()}:${n.getMinutes()}，不在推送消息时间范围内，请在早上6点至晚上8点内进行推送！`
          });
          return false;
        }
      }
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
