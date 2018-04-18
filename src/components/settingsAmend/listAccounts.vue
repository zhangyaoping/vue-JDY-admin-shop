<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <div class="filter-container">
        <el-input clearable @keyup.enter.native="handleFilter" v-model="search.userAccount" style="width: 200px;"
                  class="filter-item"
                  placeholder="用户名称">
        </el-input>
        <el-input clearable @keyup.enter.native="handleFilter" v-model="search.userName" style="width: 200px;"
                  class="filter-item"
                  placeholder="真实姓名">
        </el-input>
        <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="角色">
          <el-option v-for="item in platformName" :key="item.key" :label="item.shopRoleId"
                     :value="item.key">
          </el-option>
        </el-select>
        <el-button @click.stop="on_refresh" class="filter-item" size="small" style="font-size: 16px;" plain v-waves
                   icon="el-icon-refresh"></el-button>
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button type="primary" icon='el-icon-plus' v-waves @click="showAdd">添加账户</el-button>
      </div>

      <!--列表-->
      <el-table :data="userList" border @row-dblclick="showEdit" highlight-current-row v-loading="listLoading"
                @selection-change="selsChange"
                style="width: 100%;">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <el-table-column prop="userId" label="用户编号" width="80"></el-table-column>
        <el-table-column prop="userAccount" label="用户名称" width="115"></el-table-column>
        <el-table-column prop="shopRoleId" label="账户角色" width="115"></el-table-column>
        <el-table-column prop="userName" label="真实姓名" width="100"></el-table-column>
        <el-table-column prop="userIdcard" label="身份号码" min-width="170"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="100"></el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button class="saveBtn-a" type="primary" size="mini" @click="showEdit(scope.$index,scope.row)">编辑
            </el-button>
            <el-button class="saveBtn-a" type="danger" size="mini" @click="deleteUser(scope.row)">删除</el-button>
            <el-button class="saveBtn-a" type="primary" plain size="mini" @click="resetPwd(scope.row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar pad-a">
        <!--<el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>-->

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
      <!--新增编辑界面-->
      <el-dialog
        :title="FormTtile"
        :visible.sync="editFormVisible">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item v-if="editForm.userId" label="用户名称" prop="userAccount">
            <el-input :disabled="editForm.shopRoleId=='超级管理员'?true:false" v-model="editForm.userAccount"
                      auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item v-else label="用户名称" prop="userAccount">
            <el-input v-model="editForm.userAccount" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="userName">
            <el-input v-model="editForm.userName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="身份证号码" prop="userIdcard">
            <el-input v-model="editForm.userIdcard" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="editForm.userId" label="角色" prop="shopRoleId">
            <el-input disabled v-model="editForm.shopRoleId" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item v-else label="角色" prop="shopRoleId">
            <template>
              <el-select @change="changes" v-model="editForm.shopRoleId" placeholder="请选择">
                <el-option
                  v-for="item in roleList"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item v-if="showIfCount" label="QQ号" prop="weChatNum">
            <el-input v-model="editForm.weChatNum" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="showIfCount" label="微信号" prop="qqNum">
            <el-input v-model="editForm.qqNum" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="showIfCount" label="微信二维码">
            <el-upload
              ref="weChatPic"
              class="uploading"
              :action="apiUrl"
              list-type="picture-card"
              :headers="myHeaders"
              :on-success="SuccessWeChatPic"
              :on-preview="handleWeChatPic"
              :limit="limitsImg"
              :before-upload="beforeAvatarUpload"
              :on-remove="RemoveWeChatPic">
              <img v-if="editForm.weChatPic" :src="editForm.weChatPic" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible">
              <img width="100%" :src="editForm.weChatPic" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item v-if="showIfCount" label="分配开关" prop="count">
            <el-switch
              style="margin-left: 15px"
              @change="changeOnOff()"
              v-model="editForm.allotSwitch"
              active-color="#13ce66"
              inactive-color="#C0CCDA"
              active-text="开启"
              inactive-text="关闭">
            </el-switch>
          </el-form-item>
          <el-form-item v-if="showIfCount" label="分配数量" prop="count">
            <el-input type="number" min="20" max="150" :disabled="!editForm.allotSwitch" v-model.number="editForm.count"
                      auto-complete="off"></el-input>
            <p class="counts">单个客服最大分配数量{{maxServiceCount}}</p>
          </el-form-item>
          <el-form-item v-if="showIfAllotRatio" label="分配数量" prop="count">
            <el-input type="number" v-model.number="editForm.allotRatio" min="0" max="100"
                      auto-complete="off"></el-input>
            <p class="counts">分配数量最大限制100</p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click.native="editFormVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click.native="editSubmit" :loading="editLoading">
            {{btnEditText}}
          </el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
  import util from "../../common/util";
  import waves from "@/common/waves/index.js"; // 水波纹指令
  import sessionStorage from "@/storage/sessionStorage";
  import Api from "@/api";
  import proConfig from '@/config';


  const platformName = [
    {key: "1", shopRoleId: "超级管理员"},
    {key: "2", shopRoleId: "信审主管"},
    {key: "3", shopRoleId: "催收主管"},
    {key: "4", shopRoleId: "运营主管"},
    {key: "7", shopRoleId: "催收专员"},
    {key: "9", shopRoleId: "运营专员"},
    {key: "10", shopRoleId: "信审专员"},
    {key: "11", shopRoleId: "客服专员"},
    {key: "12", shopRoleId: "终审主管"},
  ];
  // arr to obj
  const platformNameKeyValue = platformName.reduce((acc, cur) => {
    acc[cur.key] = cur.shopRoleId;
    return acc;
  }, {});
  export default {
    directives: {
      waves
    },
    data() {
      return {
        search: {
          userName: "",
          userAccount: ""
        },
        platformName,
        roleList: [],
        userList: [],
        total: 0,
        listQuery: {
          page: 15,
          limit: 1,
          type: ''
        },
        listLoading: false,
        showIfCount: false,
        showIfAllotRatio: false,
        sels: [], //列表选中列
        //编辑相关数据
        FormTtile: "", //新增编辑title
        editFormVisible: false, //新增编辑界面是否显示
        btnEditText: "提 交",
        editLoading: false,
        editFormRules: {
          userAccount: [
            {required: true, message: '请输入用户名称!', trigger: 'blur'}
          ],
          userName: [
            {required: true, message: '请输入用户姓名!', trigger: 'blur'}
          ],
          userIdcard: [
            {required: true, message: '请输入身份证号码!', trigger: 'blur'}
          ],
        },
        maxServiceCount: '',
        //新增编辑数据
        editForm: {
          userId: null,
          userAccount: "",
          userName: "",
          userIdcard: "",
          shopRoleId: "",
          count: '',
          allotRatio: '',
          allotSwitch: false,
          weChatNum: '',
          qqNum: '',
          weChatPic: ''
        },
        myHeaders: {
          tokenId: sessionStorage.$getSessionStorageByName("tokenId")
        }, // 要保证取到
        apiUrl: proConfig.apiUrl + '/sys/shop/uploadImg',
        limitsImg: 1,
        dialogVisible: false
      };
    },
    filters: {
      typeFilter(type) {
        return platformNameKeyValue[type];
      }
    },
    mounted() {
      this.listAccounts();
      this.getAllRoles();
    },
    methods: {
      //分页
      handleCurrentChange(val) {
        this.listQuery.limit = val;
        this.listAccounts();
      },
      handleFilter() {
        this.listAccounts();
      },
      on_refresh() {
        this.search.userName = ''
        this.search.userAccount = ''
        this.listQuery.type = ''
        this.listAccounts()
      },

      //上传微信二维码图片
      RemoveWeChatPic(file, fileList) {
        this.editForm.weChatPic = "";
      },
      handleWeChatPic(file) {
        this.editForm.weChatPic = file.url;
        this.dialogVisible = true;
      },
      async SuccessWeChatPic(response) {
        console.log(response)
        this.editForm.weChatPic = await response.data;
      },
      beforeAvatarUpload(file) {
        const isRightType = file.type === "image/jpeg" || file.type === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isRightType) {
          this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 10MB!");
        }
        return isRightType && isLt2M;
      },

      //获取账户列表
      listAccounts() {
        let para = {
          pSize: this.listQuery.page,
          pNum: this.listQuery.limit,
          userName: this.search.userName,
          userAccount: this.search.userAccount,
          shopRoleId: this.listQuery.type
        };
        Api.testApi.userList(util.checkBe(para)).then(res => {
          if (res.code == "0000") {
            if (res.data.sysUserEvs) {
              let resData = res.data.sysUserEvs;
              for (let i = 0; i < resData.length; i++) {
                resData[i].createTime = util.formatDate.format(
                  new Date(resData[i].createTime),
                  "yyyy-MM-dd"
                );
                resData[i].shopRoleId = this.returnVal(resData[i].shopRoleId);
              }
              this.maxServiceCount = res.data.maxServiceCount;
              this.total = res.data.total;
              this.userList = resData;
            } else {
              this.total = 0
              this.userList = []
            }
          }
        });
      },
      //获取所有角色信息
      getAllRoles() {
        Api.testApi.getAllRoles().then(res => {
          let resData = res.data;
          if (resData) {
            this.roleList = resData;
          }
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //显示添加编辑
      showAdd: function () {
        this.showIfCount = false;
        this.showIfAllotRatio = false;
        this.editFormVisible = true;
        this.FormTtile = "添加";
        this.editForm = {
          userAccount: "",
          userName: "",
          shopRoleId: "",
          userIdcard: "",
          count: "",
          weChatNum: '',
          qqNum: '',
          weChatPic: '',
          allotRatio: '',
          allotSwitch: false,
        };
        // console.log('hshs', this.editForm)
      },
      showEdit: function (index, row) {
        if (this.returnVal1(row.shopRoleId) == 11) {
          this.showIfCount = true;
        } else {
          this.showIfCount = false;
        }
        if (this.returnVal1(row.shopRoleId) == 10) {
          this.showIfAllotRatio = true;
        } else {
          this.showIfAllotRatio = false;
        }
        this.editFormVisible = true;
        this.FormTtile = "编辑";
        this.editForm = Object.assign({}, row);
        this.editForm.count = this.editForm.allotCount;
      },
      //编辑or新增
      editSubmit: function () {
        var _this = this;
        if (!this.editForm.shopRoleId) {
          this.$message({
            message: "请选择用户角色!",
            type: "warning"
          })
          return
        }
        //客服
        if (_this.returnVal1(this.editForm.shopRoleId) == 11) {
          if (this.editForm.count < 0||this.editForm.count==='' ) {
            this.$message({
              message: this.editForm.count < 0 ? "用户分配量不能低于0!" : "用户分配量不能为空!",
              type: "warning"
            })
            return
          }
          if (this.editForm.count > this.maxServiceCount) {
            this.$message({
              message: `单个客服最大分配数量为${this.maxServiceCount}!`,
              type: "warning"
            })
            return
          }
          if (!this.editForm.qqNum || !this.editForm.weChatNum || !this.editForm.weChatPic) {
            this.$message({
              message: "请完善信息!",
              type: "warning"
            })
            return
          }
        }
        _this.editForm.userAccount = _this.editForm.userAccount.replace(/\s/ig,'');
        //信审
        if (_this.returnVal1(this.editForm.shopRoleId) == 10) {
          if (this.editForm.allotRatio < 0) {
            this.$message({
              message: "用户分配量不能低于0!",
              type: "warning"
            })
            return
          }
          if (this.editForm.allotRatio > 100) {
            this.$message({
              message: "用户分配量不能大于100!",
              type: "warning"
            })
            return
          }
        }
        _this.$refs.editForm.validate(valid => {
          if (valid) {
            _this.$confirm("确认提交吗？", "提示", {}).then(() => {
              if (!_this.editForm.userId) {
                //新增
                let para = Object.assign({}, _this.editForm);
                para.shopRoleId = _this.returnVal1(para.shopRoleId)
                Api.testApi.addUser(para).then(res => {
                  if (res.code == "0000") {
                    this.$message({
                      message: "提交成功",
                      type: "success"
                    });
                    this.$refs["editForm"].resetFields();
                    this.editFormVisible = false;
                    this.listAccounts();
                  }
                });
              } else {
                //编辑
                // let para = Object.assign({}, this.editForm)
                let para = {
                  userId: _this.editForm.userId,
                  shopRoleId: _this.returnVal1(_this.editForm.shopRoleId),
                  //shopRoleId: _this.editForm.shopRoleId,
                  userName: _this.editForm.userName,
                  userAccount: _this.editForm.userAccount,
                  userIdcard: _this.editForm.userIdcard,
                  count: _this.editForm.count,
                  weChatNum: _this.editForm.weChatNum,
                  qqNum: _this.editForm.qqNum,
                  weChatPic: _this.editForm.weChatPic,
                  allotSwitch: _this.editForm.allotSwitch,
                  allotRatio: _this.editForm.allotRatio
                };
                Api.testApi.changeUser(para).then(res => {
                  if (res.code == "0000") {
                    this.$message({
                      message: "保存成功",
                      type: "success"
                    });
                    this.$refs["editForm"].resetFields();
                    this.editFormVisible = false;
                    this.listAccounts();
                  }
                });
              }
            });
          }
        });
      },
      changeOnOff(row) {

      },
      changes() {
        if (this.editForm.shopRoleId == '11') {
          this.showIfCount = true;
          this.showIfAllotRatio = false;
          this.editForm.count = 0
        }
        if (this.editForm.shopRoleId == '10') {
          this.showIfCount = false;
          this.showIfAllotRatio = true;
          this.editForm.allotRatio = 0
        }
        this.editForm.shopRoleId = this.returnVal(this.editForm.shopRoleId)
      },
      //删除
      deleteUser(row) {
        this.$confirm("确认删除吗?", "提示", {type: "warning"})
          .then(() => {
            let para = {userId: row.userId};

            Api.testApi.delateUser(para).then(res => {
              if ((res.code = "0000")) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.listAccounts();
              }
            });
          })
          .catch(() => {
          });
      },
      resetPwd(row) {
        this.$confirm("确认重置密码吗?", "提示", {type: "warning"}).then(() => {
          let para = {
            sysUserId: sessionStorage.$getSessionStorageByName("userId"),
            userId: row.userId
          };

          // console.log('sssss', para)
          Api.testApi.resetPwd(para).then(res => {
            if ((res.code = "0000")) {
              this.$message({
                message: "重置密码成功",
                type: "success"
              });
              this.listAccounts();
            }
          });
        }).catch(() => {
        });
      },
      //角色选择
      currentSelectFun(data) {
        //        console.log(data);
      },
      returnVal(val) {
        switch (val) {
          case 1:
            return "超级管理员";
          case 2:
            return "信审主管";
          case 3:
            return "催收主管";
          case 4:
            return "运营主管";
          case 6:
            return "渠道代理";
          case 7:
            return "催收专员";
          case 9:
            return "运营专员";
          case 10:
            return "信审专员";
          case 11:
            return "客服专员"
          case 12:
            return "终审主管"

        }
      },
      returnVal1(val) {
        switch (val) {
          case "超级管理员":
            return 1;
          case "信审主管":
            return 2;
          case "催收主管":
            return 3;
          case "运营主管":
            return 4;
          case "渠道代理":
            return 6;
          case "催收专员":
            return 7;
          case "运营专员":
            return 9;
          case "信审专员":
            return 10;
          case "客服专员":
            return 11
          case "终审主管":
            return 12
        }

      }
    },
    mounted() {
      this.listAccounts();
      this.getAllRoles();
    },
    components: {}
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .filter-container {
    padding: 20px 0;
    line-height: 50px;
  }

  .uploading {
    width: 148px;
    height: 148px;
    overflow: hidden;
    margin-left: 0;
  }

  .avatar {
    width: 100%;
    height: 100%;
  }

  .counts {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
</style>
