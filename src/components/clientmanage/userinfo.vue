<template>
  <div element-loading-text="拼命加载中" v-loading="listLoading">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="one">
        <header class="form_header">基本信息</header>
        <el-form :model="formData" :label-position="labelPosition" :rules="foodrules" ref="formData" label-width="140px"
                 class="form food_form">
          <el-row class="form-row" :gutter="24">
            <el-col :span="12">
              <el-form-item label="用户编号：" prop="cusId">
                <el-input :disabled="true" v-model="formData.cusId"></el-input>
              </el-form-item>
              <el-form-item label="手机号码：" prop="cusMobile">
                <el-input :disabled="true" v-model="formData.cusMobile"></el-input>
              </el-form-item>
              <el-form-item label="所在省市：" prop="address">
                <el-input :disabled="true" v-model="formData.address"></el-input>
              </el-form-item>
              <el-form-item label="QQ号：" prop="qq">
                <el-input :disabled="true" v-model="formData.qq"></el-input>
              </el-form-item>
              <el-form-item label="婚姻状态：" prop="married">
                <el-input :disabled="true" v-model="formData.married"></el-input>
              </el-form-item>
              <el-form-item label="职业：" prop="profession">
                <el-input :disabled="true" v-model="formData.profession"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名：" prop="cusName">
                <el-input :disabled="isdisabled" v-model="formData.cusName"></el-input>
              </el-form-item>
              <el-form-item label="身份证号：" prop="cardId">
                <el-input :disabled="isdisabled" v-model="formData.cardId"></el-input>
              </el-form-item>
              <el-form-item label="教育程度：" prop="educational">
                <el-input :disabled="true" v-model="formData.educational"></el-input>
              </el-form-item>
              <el-form-item label="公司名称：" prop="duty">
                <el-input :disabled="true" v-model="formData.duty"></el-input>
              </el-form-item>
              <el-form-item label="收入(元)：" prop="monthAmount">
                <el-input :disabled="true" v-model="formData.monthAmount"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="submit-box">
            <el-button v-if="!isdisabled" class="saveBtn" type="primary" @click.native="canceladit">取消</el-button>
            <el-button class="saveBtn" type="primary" @click.native="editDisabled('formData')">{{btnEditText}}
            </el-button>
          </div>
        </el-form>
        <div class="identity-pic">
          <p>OCR-身份证照片(点击图片放大查看)</p>
          <div class="imgList" v-if="imgList0.length">
            <img :src="value" v-for="(value,index) in imgList0" :key="value" @click="bigImgs(index,'img0')">
          </div>
          <div class="imgMask" v-if="showBigImg0" @click.stop="showBigImg0=!showBigImg0">
            <img class="prev" @click.stop="prev(imgList0)" src="./../../assets/images/sq_br_prev.png">
            <div class="showImg">
              <img id="bigImg" class="bigImg" :src="imgList0[num]">
            </div>
            <img class="xuanz" src="../../assets/images/xuanz.png" @click.stop="xuanz('bigImg')" alt="">
            <img class="next" @click.stop="next(imgList0)" src="./../../assets/images/sq_br_next.png">
          </div>
          <p>芝麻分截图(点击图片放大查看)</p>
          <div class="imgList1" @click="zhimaImg">
            <img v-if="zhimaImgUrl" :src="zhimaImgUrl" alt="">
          </div>
          <div class="imgMask1" v-if="showzhimaImg" @click.stop="showzhimaImg=!showzhimaImg">
            <div class="showImg1">
              <img v-if="zhimaImgUrl" id="zhimaImg" class="bigImg" :src="zhimaImgUrl">
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="借贷认证" name="ten2">
        <div class="jiedai-title">
          <p>借贷认证截图(点击图片放大查看)</p>
          <el-button size="small" style="position: absolute;top:15px;right: 0;" type="primary"
                     @click.native="uploadimg">上传截图
          </el-button>
        </div>
        <!--///111111111-->
        <div class="identity-pic" v-if="imgList1.length">
          <div class="imgList2">
            <p>{{titlelist.jiedaibaoUrl}}</p>
            <!--@click="bigImg(index)"-->
            <img :src="value" v-for="(value,index) in imgList1" :key="value" @click="bigImgs(index,'img1')">
          </div>
          <div class="imgMask" v-if="showBigImg1" @click.stop="showBigImg1=!showBigImg1">
            <img class="prev" @click.stop="prev(imgList1)" src="./../../assets/images/sq_br_prev.png">
            <div class="showImg">
              <img id="bigImg1" class="bigImg" :src="imgList1[num]">
            </div>
            <img class="xuanz" src="../../assets/images/xuanz.png" @click.stop="xuanz('bigImg1')" alt="">
            <img class="next" @click.stop="next(imgList1) " src="./../../assets/images/sq_br_next.png">
          </div>
        </div>
        <!--///2222222222-->
        <div class="identity-pic" v-if="imgList2.length">
          <div class="imgList2">
            <p>{{titlelist.jinjiedaoUrl}}</p>
            <!--@click="bigImg(index)"-->
            <img :src="value" v-for="(value,index) in imgList2" :key="value" @click="bigImgs(index,'img2')">
          </div>
          <div class="imgMask" v-if="showBigImg2" @click.stop="showBigImg2=!showBigImg2">
            <img class="prev" @click.stop="prev(imgList2)" src="./../../assets/images/sq_br_prev.png">
            <div class="showImg">
              <img id="bigImg2" class="bigImg" :src="imgList2[num]">
            </div>
            <img class="xuanz" src="../../assets/images/xuanz.png" @click.stop="xuanz('bigImg2')" alt="">
            <img class="next" @click.stop="next(imgList2)" src="./../../assets/images/sq_br_next.png">
          </div>
        </div>
        <!--///33333333333-->
        <div class="identity-pic" v-if="imgList3.length">
          <div class="imgList2">
            <p>{{titlelist.mifangUrl}}</p>
            <!--@click="bigImg(index)"-->
            <img :src="value" v-for="(value,index) in imgList3" :key="value" @click="bigImgs(index,'img3')">
          </div>
          <div class="imgMask" v-if="showBigImg3" @click.stop="showBigImg3=!showBigImg3">
            <img class="prev" @click.stop="prev(imgList3)" src="./../../assets/images/sq_br_prev.png">
            <div class="showImg">
              <img class="bigImg" id="bigImg3" :src="imgList3[num]">
            </div>
            <img class="xuanz" src="../../assets/images/xuanz.png" @click.stop="xuanz('bigImg3')" alt="">
            <img class="next" @click.stop="next(imgList3)" src="./../../assets/images/sq_br_next.png">
          </div>
        </div>
        <!--///4444444444-->
        <div class="identity-pic" v-if="imgList4.length">
          <div class="imgList2">
            <p>{{titlelist.youpingzhengUrl}}</p>
            <!--@click="bigImg(index)"-->
            <img :src="value" v-for="(value,index) in imgList4" :key="value" @click="bigImgs(index,'img4')">
          </div>
          <div class="imgMask" v-if="showBigImg4" @click.stop="showBigImg4=!showBigImg4">
            <img class="prev" @click.stop="prev(imgList4)" src="./../../assets/images/sq_br_prev.png">
            <div class="showImg">
              <img class="bigImg" id="bigImg4" :src="imgList4[num]">
            </div>
            <img class="xuanz" src="../../assets/images/xuanz.png" @click.stop="xuanz('bigImg4')" alt="">
            <img class="next" @click.stop="next(imgList4)" src="./../../assets/images/sq_br_next.png">
          </div>
        </div>
        <!--///5555555555555-->
        <div class="identity-pic" v-if="imgList5.length">
          <div class="imgList2">
            <p>{{titlelist.wuyouUrl}}</p>
            <!--@click="bigImg(index)"-->
            <img :src="value" v-for="(value,index) in imgList5" :key="value" @click="bigImgs(index,'img5')">
          </div>
          <div class="imgMask" v-if="showBigImg5" @click.stop="showBigImg5=!showBigImg5">
            <img class="prev" @click.stop="prev(imgList5)" src="./../../assets/images/sq_br_prev.png">
            <div class="showImg">
              <img class="bigImg" id="bigImg5" :src="imgList5[num]">
            </div>
            <img class="xuanz" src="../../assets/images/xuanz.png" @click.stop="xuanz('bigImg5')" alt="">
            <img class="next" @click.stop="next(imgList5)" src="./../../assets/images/sq_br_next.png">
          </div>
        </div>
        <!--///6666666666666-->
        <div class="identity-pic" v-if="imgList6.length">
          <div class="imgList2">
            <p>{{titlelist.alipayUrl}}</p>
            <!--@click="bigImg(index)"-->
            <img :src="value" v-for="(value,index) in imgList6" :key="value" @click="bigImgs(index,'img6')">
          </div>
          <div class="imgMask" v-if="showBigImg6" @click.stop="showBigImg6=!showBigImg6">
            <img class="prev" @click.stop="prev(imgList6)" src="./../../assets/images/sq_br_prev.png">
            <div class="showImg">
              <img class="bigImg" id="bigImg6" :src="imgList6[num]">
            </div>
            <img class="xuanz" src="../../assets/images/xuanz.png" @click.stop="xuanz('bigImg6')" alt="">
            <img class="next" @click.stop="next(imgList6)" src="./../../assets/images/sq_br_next.png">
          </div>
        </div>

      </el-tab-pane>
      <el-tab-pane label="紧急联系人" name="four">
        <div class="contacts-box">
          <p>紧急联系人</p>
          <el-table
            :data="contacts"
            border
            style="width: 100%">
            <el-table-column prop="relation1" label="联系人关系"></el-table-column>
            <el-table-column prop="name1" label="联系人姓名"></el-table-column>
            <el-table-column prop="phone1" label="手机号码"></el-table-column>
            <el-table-column prop="linkman_contact_count" label="有效通话次数"></el-table-column>
          </el-table>
        </div>
        <div class="contacts-box">
          <p>通讯录备注联系人</p>
          <el-table
            :data="contacts_1"
            border
            style="width: 100%">
            <el-table-column prop="relation" label="联系人关系"></el-table-column>
            <el-table-column prop="name" label="联系人姓名"></el-table-column>
            <el-table-column prop="mobile" label="手机号码"></el-table-column>
            <el-table-column prop="count" label="有效通话次数"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="网贷黑名单" name="five">
        <div class="contacts-box">
          <p>网贷黑名单</p>
          <el-table
            :data="creditRisk"
            border
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="总个数：">
                    <span>{{ props.row.item_detail.platform_count }}</span>
                  </el-form-item>
                  <template v-for="item in props.row.item_detail.platform_detail_dimension">
                    <el-form-item :label="item.dimension+':'">
                      <span>{{ item.detail[0] }}</span>
                    </el-form-item>
                  </template>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="group" label="检查项"></el-table-column>
            <el-table-column prop="item_name" label="检查项目"></el-table-column>
            <el-table-column prop="risk_level" label="风险等级"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="手机运营商" name="eight">
        <div class="contacts-box">
          <p>手机运营商</p>
          <el-tabs :tab-position="record" type="border-card">
            <el-tab-pane label="个人信息">
              <!--information5-->
              <el-form :model="mobilecarriers" :label-position="labelPosition" :rules="foodrules" ref="information5"
                       label-width="140px"
                       class="form food_form">
                <el-row class="form-row" :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="真实姓名：" prop="real_name">
                      <el-input :disabled="true" v-model="mobilecarriers.real_name"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码：" prop="user_mobile">
                      <el-input :disabled="true" v-model="mobilecarriers.user_mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="渠道类型：" prop="channel_type">
                      <el-input :disabled="true" v-model="mobilecarriers.channel_type"></el-input>
                    </el-form-item>
                    <el-form-item label="号码归属地：" prop="channel_attr">
                      <el-input :disabled="true" v-model="mobilecarriers.channel_attr"></el-input>
                    </el-form-item>
                    <el-form-item label="手机静默天数(天)：" prop="unuse_time">
                      <el-input :disabled="true" v-model="mobilecarriers.unuse_time"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="用户名：" prop="user_name">
                      <el-input :disabled="true" v-model="mobilecarriers.user_name"></el-input>
                    </el-form-item>
                    <el-form-item label="渠道编码：" prop="channel_code">
                      <el-input :disabled="true" v-model="mobilecarriers.channel_code"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号码：" prop="identity_code">
                      <el-input :disabled="true" v-model="mobilecarriers.identity_code"></el-input>
                    </el-form-item>
                    <el-form-item label="任务创建时间：" prop="created_time">
                      <el-input :disabled="true" v-model="mobilecarriers.created_time"></el-input>
                    </el-form-item>
                    <el-form-item label="入网时间(月)：" prop="net_age">
                      <el-input :disabled="true" v-model="mobilecarriers5.net_age"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="账单信息">
              <!--mobilecarriers1-->
              <el-table
                :data="mobilecarriers1"
                border
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-table
                        :data="props.row.bill_record"
                        border
                        style="width: 100%">
                        <el-table-column prop="user_number" label="用户号码"></el-table-column>
                        <el-table-column prop="fee_name" label="费用名称"></el-table-column>
                        <el-table-column prop="fee_category" label="费用类别"></el-table-column>
                        <el-table-column label="金额">
                          <template slot-scope="scope">
                            {{parseFloat(scope.row.fee_amount/100).toFixed(2)}}
                          </template>
                        </el-table-column>
                      </el-table>
                      <!--<template v-for="item in props.row.bill_record">-->
                      <!---->
                      <!--</template>-->
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="bill_cycle" label="账单周期"></el-table-column>
                <el-table-column label="账单费用">
                  <template slot-scope="scope">
                    {{parseFloat(scope.row.bill_fee/100).toFixed(2)}}
                  </template>
                </el-table-column>
                <el-table-column label="费用合计">
                  <template slot-scope="scope">
                    {{parseFloat(scope.row.bill_total/100).toFixed(2)}}
                  </template>
                </el-table-column>
                <el-table-column label="已支付">
                  <template slot-scope="scope">
                    {{scope.row.paid_amount?parseFloat(scope.row.paid_amount/100).toFixed(2):''}}
                  </template>
                </el-table-column>
                <el-table-column label="未支付">
                  <template slot-scope="scope">
                    {{scope.row.unpaid_amount?parseFloat(scope.row.unpaid_amount/100).toFixed(2):''}}
                  </template>
                </el-table-column>
                <el-table-column label="违约金">
                  <template slot-scope="scope">
                    {{scope.row.breach_amount?parseFloat(scope.row.breach_amount/100).toFixed(2):''}}
                  </template>
                </el-table-column>
                <el-table-column label="减免">
                  <template slot-scope="scope">
                    {{scope.row.bill_discount?parseFloat(scope.row.bill_discount/100).toFixed(2):''}}
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="通话详单">
              <!--mobilecarriers1-->
              <el-table
                :data="mobilecarriers2"
                border
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-table
                        :data="props.row.call_record"
                        border
                        style="width: 100%">
                        <el-table-column prop="call_start_time" label="起始时间"></el-table-column>
                        <el-table-column prop="call_address" label="通话地点"></el-table-column>
                        <el-table-column prop="call_type_name" label="呼叫类型"></el-table-column>
                        <el-table-column prop="call_other_number" label="对方号码"></el-table-column>
                        <el-table-column prop="call_time" label="通话时长（秒）"></el-table-column>
                        <el-table-column prop="call_land_type" label="通话类型"></el-table-column>
                        <el-table-column prop="call_roam_cost" label="本地费或漫游费"></el-table-column>
                        <el-table-column prop="call_discount" label="减免"></el-table-column>
                        <el-table-column prop="call_cost" label="费用小计"></el-table-column>
                      </el-table>
                      <!--<template v-for="item in props.row.bill_record">-->
                      <!---->
                      <!--</template>-->
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="call_cycle" label="通话周期"></el-table-column>
                <el-table-column prop="total_fee" label="费用合计"></el-table-column>
                <el-table-column prop="total_call_time" label="总通话时长（秒）"></el-table-column>
                <el-table-column prop="total_call_count" label="总通话次数"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="缴费信息">
              <!--mobilecarriers1-->
              <el-table
                :data="mobilecarriers3"
                border
                style="width: 100%">
                <el-table-column prop="pay_date" label="日期"></el-table-column>
                <el-table-column label="金额">
                  <template slot-scope="scope">
                    {{parseFloat(scope.row.pay_fee/100).toFixed(2)}}
                  </template>
                </el-table-column>
                <el-table-column prop="pay_type" label="缴费方式"></el-table-column>
                <el-table-column prop="pay_channel" label="缴费渠道"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="亲情网信息">
              <!--mobilecarriers1-->
              <el-table
                :data="mobilecarriers4"
                border
                style="width: 100%">
                <el-table-column prop="member_number" label="成员号码"></el-table-column>
                <el-table-column prop="member_cornet" label="成员短号"></el-table-column>
                <el-table-column prop="member_type" label="成员类型"></el-table-column>
                <el-table-column prop="pay_channel" label="缴费渠道"></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
      <!--电商start-->
      <el-tab-pane label="电商信息" name="six">
        <div class="contacts-box">
          <p>电商信息</p>
          <el-tabs :tab-position="record" type="border-card">
            <template>
              <el-tab-pane label="淘宝个人信息">
                <!--information5-->
                <el-form :model="information5" :label-position="labelPosition" :rules="foodrules" ref="information5"
                         label-width="140px"
                         class="form food_form">
                  <el-row class="form-row" :gutter="24">
                    <el-col :span="12">
                      <el-form-item label="真实姓名：">
                        <el-input :disabled="true" v-model="information5.RealName"></el-input>
                      </el-form-item>
                      <el-form-item label="借呗余额：" prop="JiebeiQuota">
                        <el-input :disabled="isdisabled" v-model="information5.JiebeiQuota"></el-input>
                      </el-form-item>
                      <el-form-item label="借呗额度：" prop="JiebeiBalance">
                        <el-input :disabled="isdisabled" v-model="information5.JiebeiBalance"></el-input>
                      </el-form-item>
                      <el-form-item label="花呗额度：" prop="HuabeiQuota">
                        <el-input :disabled="true" v-model="information5.HuabeiQuota"></el-input>
                      </el-form-item>
                      <el-form-item label="花呗余额：" prop="HuabeiBalance">
                        <el-input :disabled="true" v-model="information5.HuabeiBalance"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="身份证号码：" prop="Idcard">
                        <el-input :disabled="true" v-model="information5.Idcard"></el-input>
                      </el-form-item>
                      <el-form-item label="信用：" prop="Credit">
                        <el-input :disabled="true" v-model="information5.Credit"></el-input>
                      </el-form-item>
                      <el-form-item label="订单数：" prop="email">
                        <el-input :disabled="true" v-model="information6.OrderCount"></el-input>
                      </el-form-item>
                      <el-form-item label="订单总金额：" prop="name">
                        <el-input :disabled="true" v-model="information6.OrderAmount"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-tab-pane>
            </template>
            <el-tab-pane label="淘宝消费记录">
              <el-table
                :data="information1"
                border
                style="width: 100%">
                <el-table-column prop="Month" label="时间"></el-table-column>
                <el-table-column prop="Count" label="消费次数"></el-table-column>
                <el-table-column prop="Amount" label="消费金额">
                  <template slot-scope="scope">
                    {{scope.row.Amount?parseFloat(scope.row.Amount).toFixed(2):''}}
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="淘宝银行卡信息">
              <el-table
                :data="information4"
                border
                style="width: 100%">
                <el-table-column prop="Name" label="姓名"></el-table-column>
                <el-table-column prop="CardType" label="银行卡类型"></el-table-column>
                <el-table-column prop="BankName" label="银行名称"></el-table-column>
                <el-table-column prop="CardNo" label="银行卡后四位"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="支付宝交易信息">
              <el-table
                :data="information2"
                border
                style="width: 100%">
                <el-table-column prop="Title" label="标题"></el-table-column>
                <el-table-column prop="TradeTime" label="交易时间"></el-table-column>
                <el-table-column prop="TradeStatus" label="交易状态"></el-table-column>
                <el-table-column prop="TradeAmount" label="消费金额">
                  <template slot-scope="scope">
                    {{scope.row.TradeAmount?parseFloat(scope.row.TradeAmount).toFixed(2):''}}
                  </template>
                </el-table-column>
                <el-table-column prop="TradeType" label="交易类型"></el-table-column>
                <el-table-column prop="TradeOtherSide" label="交易对方"></el-table-column>
                <el-table-column prop="PayType" label="支付方式"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="支付宝支出信息">
              <el-table
                :data="information7"
                border
                style="width: 100%">
                <el-table-column prop="Type" label="支出类型"></el-table-column>
                <el-table-column prop="Amount" label="支出金额">
                  <template slot-scope="scope">
                    {{scope.row.Amount?parseFloat(scope.row.Amount).toFixed(2):''}}
                  </template>
                </el-table-column>
                <el-table-column prop="Rate" label="支出占比(%)">
                  <template slot-scope="scope">
                    {{scope.row.Rate?parseFloat(scope.row.Rate).toFixed(2):''}}
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="芝麻信用">
              <el-table
                :data="information3"
                border
                style="width: 100%">
                <el-table-column prop="Score" label="芝麻分数"></el-table-column>
                <el-table-column prop="Month" label="时间"></el-table-column>
                <el-table-column prop="ScoreIncrease" label="增加分数"></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
      <!--电商end-->
      <!--今借到start-->
      <el-tab-pane label="JJD信息" name="seven">
        <div class="contacts-box">
          <p>JJD信息</p>
          <el-tabs :tab-position="record" type="border-card">
            <el-tab-pane label="JJD账户信息">
              <el-form :model="jinjiedaodata" :label-position="tabPosition" :rules="foodrules" ref="jinjiedaodata"
                       label-width="140px"
                       class="form food_form">
                <el-row class="form-row" :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="姓名：" prop="Name">
                      <el-input :disabled="true" v-model="jinjiedaodata.Name"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：" prop="Mobile">
                      <el-input :disabled="true" v-model="jinjiedaodata.Mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="当前余额：" prop="CurBalance">
                      <el-input :disabled="true" v-model="jinjiedaodata.CurBalance"></el-input>
                    </el-form-item>
                    <el-form-item label="待还金额：" prop="CurBalance">
                      <el-input :disabled="true" v-model="jinjiedaodata.RepaymentAmount"></el-input>
                    </el-form-item>
                    <el-form-item label="待收金额：" prop="CurBalance">
                      <el-input :disabled="true" v-model="jinjiedaodata.ReceiveAmount"></el-input>
                    </el-form-item>
                    <el-form-item label="当前借入金额：" prop="CurBalance">
                      <el-input :disabled="true" v-model="jinjiedaodata.CurBorrowAmount"></el-input>
                    </el-form-item>
                    <el-form-item label="累计借入笔数：" prop="CurBalance">
                      <el-input :disabled="true" v-model="jinjiedaodata.BorrowCount"></el-input>
                    </el-form-item>
                    <el-form-item label="累计借入人数：" prop="CurBalance">
                      <el-input :disabled="true" v-model="jinjiedaodata.BorrowPersonCount"></el-input>
                    </el-form-item>
                    <el-form-item label="最大借入金额：" prop="CurBalance">
                      <el-input :disabled="true" v-model="jinjiedaodata.MaxBorrowAmount"></el-input>
                    </el-form-item>
                    <el-form-item label="当前借出金额：" prop="CurBalance">
                      <el-input :disabled="true" v-model="jinjiedaodata.CurLendAmount"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="最大借出金额：" prop="CurBalance">
                      <el-input :disabled="true" v-model="jinjiedaodata.MaxLendAmount"></el-input>
                    </el-form-item>
                    <el-form-item label="累计借出笔数：" prop="CurBalance">
                      <el-input :disabled="true" v-model="jinjiedaodata.LendCount"></el-input>
                    </el-form-item>
                    <el-form-item label="累计借出人数：" prop="CurBalance">
                      <el-input :disabled="true" v-model="jinjiedaodata.LendPersonCount"></el-input>
                    </el-form-item>
                    <el-form-item label="当前担保金额：" prop="Idcard">
                      <el-input :disabled="true" v-model="jinjiedaodata.CurGuaranteeAmount"></el-input>
                    </el-form-item>
                    <el-form-item label="最大担保金额：" prop="Idcard">
                      <el-input :disabled="true" v-model="jinjiedaodata.MaxGuaranteeAmount"></el-input>
                    </el-form-item>
                    <el-form-item label="累计担保笔数：" prop="Idcard">
                      <el-input :disabled="true" v-model="jinjiedaodata.GuaranteeCount"></el-input>
                    </el-form-item>
                    <el-form-item label="累计担保人数：" prop="Idcard">
                      <el-input :disabled="true" v-model="jinjiedaodata.GuaranteePersonCount"></el-input>
                    </el-form-item>
                    <el-form-item label="当日借入当日还款比率：" prop="Idcard">
                      <el-input :disabled="true" v-model="jinjiedaodata.BorrowAndRepaymentSameDayRate"></el-input>
                    </el-form-item>
                    <el-form-item label="当日借出当日还款比率：" prop="Idcard">
                      <el-input :disabled="true" v-model="jinjiedaodata.LendAndRepaymentSameDayRate"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="JJD借入信息">
              <!--information5-->
              <div class="amount-ha">
                <p>最大待还金额 :{{jinjiedaodata1.MaxRepaymentAmount||0}}</p>
                <p>总利息 :{{jinjiedaodata1.Interest||0}}</p>
              </div>
              <el-table
                :data="jinjiedaodata1.JinjiedaoBorrowDetailInfos"
                border
                style="width: 100%">
                <el-table-column prop="CreateTime" label="借入时间"></el-table-column>
                <el-table-column prop="BorrowName" label="借款人"></el-table-column>
                <el-table-column prop="BorrowAmount" label="借款金额"></el-table-column>
                <el-table-column prop="LendName" label="出借人"></el-table-column>
                <el-table-column prop="RepaymentAmount" label="待还金额"></el-table-column>
                <el-table-column prop="RepaidAmount" label="已还金额"></el-table-column>
                <el-table-column prop="Status" label="状态"></el-table-column>
                <el-table-column prop="BorrowType" label="借款方式"></el-table-column>
                <el-table-column prop="BorrowDate" label="借款日期"></el-table-column>
                <el-table-column prop="RepaymentType" label="还款方式"></el-table-column>
                <el-table-column prop="RepaymentType" label="还款日期"></el-table-column>
                <el-table-column prop="InterestRate" label="借款利率"></el-table-column>
                <el-table-column prop="ServiceFee" label="服务费"></el-table-column>
                <el-table-column prop="GuaranteeFee" label="担保费"></el-table-column>
                <el-table-column prop="BorrowUsage" label="借款用途"></el-table-column>
                <el-table-column prop="Supplement" label="补充说明"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="JJD借出信息">
              <!--information5-->
              <div class="amount-ha">
                <p>最大待收金额 :{{jinjiedaodata2.MaxReceiveAmount||0}}</p>
                <p>总利息 :{{jinjiedaodata2.Interest||0}}</p>
              </div>
              <el-table
                :data="jinjiedaodata2.JinjiedaoLendDetailInfos"
                border
                style="width: 100%">
                <el-table-column prop="CreateTime" label="借出时间"></el-table-column>
                <el-table-column prop="BorrowName" label="借款人"></el-table-column>
                <el-table-column prop="LendName" label="出借人"></el-table-column>
                <el-table-column prop="LendAmount" label="出借金额"></el-table-column>
                <el-table-column prop="RepaymentAmount" label="待还金额"></el-table-column>
                <el-table-column prop="RepaidAmount" label="已还金额"></el-table-column>
                <el-table-column prop="Status" label="状态"></el-table-column>
                <el-table-column prop="LendType" label="借出方式"></el-table-column>
                <el-table-column prop="LendDate" label="借款日期"></el-table-column>
                <el-table-column prop="RepaymentType" label="还款方式"></el-table-column>
                <el-table-column prop="RepaymentType" label="还款日期"></el-table-column>
                <el-table-column prop="InterestRate" label="出借利率"></el-table-column>
                <el-table-column prop="ServiceFee" label="服务费"></el-table-column>
                <el-table-column prop="GuaranteeFee" label="担保费"></el-table-column>
                <el-table-column prop="BorrowUsage" label="借款用途"></el-table-column>
                <el-table-column prop="Supplement" label="补充说明"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="好友借款信息">
              <el-table
                :data="jinjiedaodata3"
                border
                style="width: 100%">
                <el-table-column prop="CreateTime" label="借款日期"></el-table-column>
                <el-table-column prop="BorrowName" label="借款人姓名"></el-table-column>
                <el-table-column prop="BorrowMobile" label="借款人手机号"></el-table-column>
                <el-table-column prop="SurplusDay" label="剩余天数"></el-table-column>
                <el-table-column prop="BorrowType" label="借款方式"></el-table-column>
                <el-table-column prop="BorrowStatus" label="借款状态"></el-table-column>
                <el-table-column prop="BorrowAmount" label="借款金额"></el-table-column>
                <el-table-column prop="FundAmount" label="已筹金额"></el-table-column>
                <el-table-column prop="BorrowDuration" label="借款时长"></el-table-column>
                <el-table-column prop="InterestRate" label="借款利率"></el-table-column>
                <el-table-column prop="ServiceFee" label="服务费"></el-table-column>
                <el-table-column prop="GuaranteeRate" label="担保利率"></el-table-column>
                <el-table-column prop="RepaymentType" label="还款方式"></el-table-column>
                <el-table-column prop="RepaymentDate" label="还款日期"></el-table-column>
                <el-table-column prop="BorrowUsage" label="借款用途"></el-table-column>
                <el-table-column prop="Supplement" label="补充说明"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="好友出借信息">
              <el-table
                :data="jinjiedaodata3"
                border
                style="width: 100%">
                <el-table-column prop="LendName" label="出借人"></el-table-column>
                <el-table-column prop="LendMobile" label="出借人手机号码"></el-table-column>
                <el-table-column prop="LendAmount" label="出借金额"></el-table-column>
                <el-table-column prop="LendDuration" label="出借时长"></el-table-column>
                <el-table-column prop="RepaymentType" label="还款类型"></el-table-column>
                <el-table-column prop="InterestRate" label="利率"></el-table-column>
                <el-table-column prop="ServiceFee" label="服务费"></el-table-column>
                <el-table-column prop="ServiceFeeRate" label="服务费率"></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
      <!--今借到end-->
      <!--借贷宝start-->
      <el-tab-pane label="JDB信息" name="nine">
        <div class="contacts-box">
          <p>JDB信息</p>
          <el-tabs :tab-position="record" type="border-card">
            <el-tab-pane label="JDB信息">
              <!--information5-->
              <el-form :model="jiedaibaodata" :label-position="tabPosition" :rules="foodrules" ref="jiedaibaodata"
                       label-width="140px"
                       class="form food_form">
                <el-row class="form-row" :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="姓名：" prop="AuthItem">
                      <el-input :disabled="true" v-model="jiedaibaodata.Name"></el-input>
                    </el-form-item>
                    <el-form-item label="认证项：" prop="AuthItem">
                      <el-input :disabled="true" v-model="jiedaibaodata.AuthItem"></el-input>
                    </el-form-item>
                    <el-form-item label="账户名：" prop="Account">
                      <el-input :disabled="true" v-model="jiedaibaodata.Account"></el-input>
                    </el-form-item>
                    <el-form-item label="账号等级：" prop="Level">
                      <el-input :disabled="true" v-model="jiedaibaodata.Level"></el-input>
                    </el-form-item>
                    <el-form-item label="是否上传头像：" prop="IsFace">
                      <el-input :disabled="true" v-model="jiedaibaodata.IsFace"></el-input>
                    </el-form-item>
                    <el-form-item label="累计借贷金额：" prop="IsFace">
                      <el-input :disabled="true" v-model="jiedaibaodata3.BorrowAmount"></el-input>
                    </el-form-item>
                    <el-form-item label="已还金额：" prop="IsFace">
                      <el-input :disabled="true" v-model="jiedaibaodata3.RepaymentAmount"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="JDB余额：" prop="Idcard">
                      <el-input :disabled="true" v-model="jiedaibaodata.Balance"></el-input>
                    </el-form-item>
                    <el-form-item label="是否实名认证：" prop="HasIdentityAuth">
                      <el-input :disabled="true" v-model="jiedaibaodata.HasIdentityAuth"></el-input>
                    </el-form-item>
                    <el-form-item label="是否绑定银行卡：" prop="IsBindBankcard">
                      <el-input :disabled="true" v-model="jiedaibaodata.IsBindBankcard"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码：" prop="Mobile">
                      <el-input :disabled="true" v-model="jiedaibaodata.Mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="信用记录：" prop="BorrowCount">
                      <el-input :disabled="true" v-model="jiedaibaodata.CreditRecord"></el-input>
                    </el-form-item>
                    <el-form-item label="累计借贷次数：" prop="BorrowCount">
                      <el-input :disabled="true" v-model="jiedaibaodata3.BorrowCount"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="JDB借出已收回信息">
              <!--information5-->
              <div class="amount-ha">
                <p>已收回金额 :{{jiedaibaodata1.Amount||0}}</p>
                <p>已实现收益 :{{jiedaibaodata1.Interest||0}}</p>
              </div>
              <el-table
                :data="jiedaibaodata1.JiedaibaoPayoffDetailInfos"
                border
                style="width: 100%">
                <el-table-column prop="BorrowMember" label="借款人"></el-table-column>
                <!--<el-table-column prop="Interest" label="本金"></el-table-column>-->
                <el-table-column prop="Interest" label="利息"></el-table-column>
                <el-table-column prop="InterestRate" label="年利率"></el-table-column>
                <el-table-column prop="LendObject" label="借款对象"></el-table-column>
                <el-table-column prop="LendUsage" label="借款用途"></el-table-column>
                <el-table-column prop="ReceivedAmount" label="已收款"></el-table-column>
                <el-table-column prop="RepaymentMethod" label="还款方式"></el-table-column>
                <el-table-column prop="TotalAmount" label="本息合计"></el-table-column>
                <el-table-column prop="WaitReceiveAmount" label="待收款"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="JDB借出信息">
              <!--information5-->
              <div class="amount-ha">
                <p>当前借出金额 :{{jiedaibaodata2.CurAmount||0}}</p>
                <p>应收利息 :{{jiedaibaodata2.Interest||0}}</p>
              </div>
              <el-table
                :data="jiedaibaodata2.JiedaibaoLendDetailInfos"
                border
                style="width: 100%">
                <el-table-column prop="LendTime" label="借出日"></el-table-column>
                <el-table-column prop="ExpireTime" label="到期日"></el-table-column>
                <el-table-column prop="Status" label="当前状态"></el-table-column>
                <el-table-column prop="Principal" label="本金"></el-table-column>
                <el-table-column prop="InterestRate" label="年利率"></el-table-column>
                <el-table-column prop="LendObject" label="借款对象"></el-table-column>
                <el-table-column prop="LendUsage" label="借款用途"></el-table-column>
                <el-table-column prop="ReceivedAmount" label="已收款"></el-table-column>
                <el-table-column prop="RepaymentMethod" label="还款方式"></el-table-column>
                <el-table-column prop="TotalAmount" label="本息合计"></el-table-column>
                <el-table-column prop="WaitReceiveAmount" label="待收款"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="JDB借入信息">
              <!--information5-->
              <div class="amount-ha">
                <p>当前借入金额 :{{jiedaibaodata4.CurAmount||0}}</p>
                <p>应付利息 :{{jiedaibaodata4.Interest||0}}</p>
              </div>
              <el-table
                :data="jiedaibaodata4.JiedaibaoBorrowDetailInfos"
                border
                style="width: 100%">
                <el-table-column prop="CreateTime" label="借款日期"></el-table-column>
                <el-table-column prop="ExpireTime" label="到期日"></el-table-column>
                <el-table-column prop="Status" label="当前状态"></el-table-column>
                <el-table-column prop="Principal" label="本金"></el-table-column>
                <el-table-column prop="Rate" label="年利率"></el-table-column>
                <el-table-column prop="BorrowObject" label="借款对象"></el-table-column>
                <el-table-column prop="BorrowUseage" label="借款用途"></el-table-column>
                <el-table-column prop="RepaymentMethod" label="还款方式"></el-table-column>
                <el-table-column prop="Interest" label="应付利息"></el-table-column>
                <el-table-column prop="LessInterest" label="少付利息"></el-table-column>
                <el-table-column prop="RepaymentAmount" label="应还金额"></el-table-column>
                <el-table-column prop="EarlyRepaymentAmount" label="提前还款金额"></el-table-column>
              </el-table>
            </el-tab-pane>

          </el-tabs>
        </div>
      </el-tab-pane>
      <!--借贷宝end-->
      <!--网贷共享报告start-->
      <!--<el-tab-pane label="网贷共享报告" name="ten1">-->
      <!--&lt;!&ndash;LoanSharePlatInfo&ndash;&gt;-->
      <!--<div class="contacts-box">-->
      <!--<p>网贷共享报告</p>-->
      <!--<el-tabs :tab-position="record" type="border-card">-->
      <!--<el-tab-pane label="共享平台申请贷款信息">-->
      <!--&lt;!&ndash;information5&ndash;&gt;-->
      <!--<el-form :model="LoanSharePlatInfo" :label-position="tabPosition" :rules="foodrules"-->
      <!--ref="LoanSharePlatInfo"-->
      <!--label-width="140px"-->
      <!--class="form food_form">-->
      <!--<el-row class="form-row" :gutter="24">-->
      <!--<el-col :span="12">-->
      <!--<el-form-item label="申请贷款机构类型：" prop="OrganizationType">-->
      <!--<el-input :disabled="true" v-model="LoanSharePlatInfo.OrganizationType"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="申请时间：" prop="OrganizationType">-->
      <!--<el-input :disabled="true" v-model="LoanSharePlatInfo.ApplyTime"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="申请金额：" prop="OrganizationType">-->
      <!--<el-input :disabled="true" v-model="LoanSharePlatInfo.ApplyAmount"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="申请月数：" prop="OrganizationType">-->
      <!--<el-input :disabled="true" v-model="LoanSharePlatInfo.ApplyMonth"></el-input>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="12">-->
      <!--<el-form-item label="申请类型：" prop="Idcard">-->
      <!--<el-input :disabled="true" v-model="LoanSharePlatInfo.ApplyType"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="申请状态：" prop="Idcard">-->
      <!--<el-input :disabled="true" v-model="LoanSharePlatInfo.ApplyStatus"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="最后更新时间：" prop="Idcard">-->
      <!--<el-input :disabled="true" v-model="LoanSharePlatInfo.LastUpdTime"></el-input>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <!--</el-form>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="共享平台担保信息">-->
      <!--&lt;!&ndash;information5&ndash;&gt;-->
      <!--<el-table-->
      <!--:data="LoanSharePlatInfo2"-->
      <!--border-->
      <!--style="width: 100%">-->
      <!--<el-table-column prop="GuaranteeItem" label="担保项目"></el-table-column>-->
      <!--<el-table-column prop="GuaranteeDate" label="担保日期"></el-table-column>-->
      <!--<el-table-column prop="GuaranteeAmount" label="担保金额"></el-table-column>-->
      <!--<el-table-column prop="LastUpdTime" label="最后更新时间"></el-table-column>-->
      <!--<el-table-column prop="GuaranteeRelation" label="担保关系"></el-table-column>-->
      <!--</el-table>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="共享平台特殊交易信息">-->
      <!--&lt;!&ndash;information5&ndash;&gt;-->
      <!--<el-table-->
      <!--:data="LoanSharePlatInfo3"-->
      <!--border-->
      <!--style="width: 100%">-->
      <!--<el-table-column prop="RecordSource" label="记录来源"></el-table-column>-->
      <!--<el-table-column prop="RecordType" label="记录类型"></el-table-column>-->
      <!--<el-table-column prop="Date" label="日期"></el-table-column>-->
      <!--<el-table-column prop="Amount" label="金额"></el-table-column>-->
      <!--<el-table-column prop="Month" label="月数"></el-table-column>-->
      <!--<el-table-column prop="Detail" label="详细"></el-table-column>-->
      <!--<el-table-column prop="LastUpdTime" label="最后更新时间"></el-table-column>-->
      <!--</el-table>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="共享平台查询信息">-->
      <!--&lt;!&ndash;information5&ndash;&gt;-->
      <!--<el-table-->
      <!--:data="LoanSharePlatInfo4"-->
      <!--border-->
      <!--style="width: 100%">-->
      <!--<el-table-column prop="QueryType" label="查询机构类型"></el-table-column>-->
      <!--<el-table-column prop="QueryReason" label="查询原因"></el-table-column>-->
      <!--<el-table-column prop="QueryDate" label="查询日期"></el-table-column>-->
      <!--<el-table-column prop="LastUpdTime" label="最后更新时间"></el-table-column>-->
      <!--</el-table>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="共享平台还款信息">-->
      <!--<el-table-->
      <!--:data="LoanSharePlatInfo1"-->
      <!--border-->
      <!--style="width: 100%">-->
      <!--<el-table-column prop="OrganizationType" label="贷款机构类型"></el-table-column>-->
      <!--<el-table-column prop="LoanPurpose" label="贷款用途"></el-table-column>-->
      <!--<el-table-column prop="LoanAmount" label="可贷款额度"></el-table-column>-->
      <!--<el-table-column prop="LoanStyle" label="贷款形式"></el-table-column>-->
      <!--<el-table-column prop="LoanPlace" label="贷款地点"></el-table-column>-->
      <!--<el-table-column prop="RepaymentFrequency" label="还款频率"></el-table-column>-->
      <!--<el-table-column prop="RepaymentDate" label="	还款日"></el-table-column>-->
      <!--<el-table-column prop="RepaymentAmount" label="还款金额"></el-table-column>-->
      <!--<el-table-column prop="ActualRepaymentDate" label="实际还款日"></el-table-column>-->
      <!--<el-table-column prop="ActualRepaymentAmount" label="实际还款金额"></el-table-column>-->
      <!--<el-table-column prop="OverdueAmount" label="当前逾期金额"></el-table-column>-->
      <!--<el-table-column prop="OverdueCount" label="当前逾期期数"></el-table-column>-->
      <!--<el-table-column prop="SumOverdueCount" label="累计到当前的逾期期数"></el-table-column>-->
      <!--<el-table-column prop="MaxOverdueCount" label="最高逾期期数"></el-table-column>-->
      <!--<el-table-column prop="LastUpdTime" label="最后更新时间"></el-table-column>-->
      <!--</el-table>-->
      <!--</el-tab-pane>-->
      <!--</el-tabs>-->
      <!--</div>-->
      <!--</el-tab-pane>-->
      <!--网贷共享报告end-->
      <!--手机通讯录start-->
      <el-tab-pane label="手机通讯录" name="ten">
        <div class="contacts-box1">
          <div class="phone-box">
            <p>手机通讯录</p>
            <el-upload
              class="upload-demo"
              :action="apiUrl"
              :on-preview="handlePhone"
              :on-remove="RemovePhone"
              :headers="myHeaders"
              :data="cusIds"
              :on-success="SuccessPhone"
              multiple
              :limit="1"
              :file-list="fileList">
              <el-button size="small" type="primary">上传手机通讯录</el-button>
            </el-upload>
          </div>
          <!--phonebook-->
          <el-table
            :data="phonebook"
            border
            style="width: 100%">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column prop="name" label="通讯录">
              <template slot-scope="scope">
                <span
                  :style="{color:scope.row.mobile=='110'||scope.row.mobile=='120'||scope.row.mobile=='122'||scope.row.mobile=='119'?'red':'#606266'}">
                  {{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="mobile" label="手机号">
              <template slot-scope="scope">
                <span
                  :style="{color:scope.row.mobile=='110'||scope.row.mobile=='120'||scope.row.mobile=='122'||scope.row.mobile=='119'?'red':'#606266'}">
                  {{scope.row.mobile}}
                </span>
              </template>
            </el-table-column>
            <el-table-column sortable prop="count" label="通话次数">
              <template slot-scope="scope">
                <span
                  :style="{color:scope.row.mobile=='110'||scope.row.mobile=='120'||scope.row.mobile=='122'||scope.row.mobile=='119'?'red':'#606266'}">
                  {{scope.row.count}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="callTime" label="通话时长(分)">
              <template slot-scope="scope">
                <span
                  :style="{color:scope.row.mobile=='110'||scope.row.mobile=='120'||scope.row.mobile=='122'||scope.row.mobile=='119'?'red':'#606266'}">
                  {{scope.row.callTime}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="linkDensity" label="联系密度分析（周-月-三月）" width="220">
              <template slot-scope="scope">
                <span
                  :style="{color:scope.row.mobile=='110'||scope.row.mobile=='120'||scope.row.mobile=='122'||scope.row.mobile=='119'?'red':'#606266'}">
                  {{scope.row.linkDensity}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="callTime" label="主叫次数">
              <template slot-scope="scope">
                <span
                  :style="{color:scope.row.mobile=='110'||scope.row.mobile=='120'||scope.row.mobile=='122'||scope.row.mobile=='119'?'red':'#606266'}">
                  {{scope.row.zhujiaoCount}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="beijiaoCount" label="被叫次数">
              <template slot-scope="scope">
                <span
                  :style="{color:scope.row.mobile=='110'||scope.row.mobile=='120'||scope.row.mobile=='122'||scope.row.mobile=='119'?'red':'#606266'}">
                  {{scope.row.beijiaoCount}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="260">
              <template slot-scope="scope">
                <el-button size="mini" type="success" @click="remarkContacts(scope.row)">备注联系人</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <!--手机通讯录end-->
      <!--记录-->
      <el-tab-pane label=" 用户记录" name="two">
        <el-tabs :tab-position="record" type="border-card">
          <el-tab-pane label="备注">
            <div class="addremark">
              <el-button size="mini" @click="addremarkloding=true" type="primary">添加备注</el-button>
            </div>
            <el-table
              :data="opType6"
              border
              style="width: 100%">
              <el-table-column prop="userName" label="处理人"></el-table-column>
              <el-table-column prop="opType" label="处理类型"></el-table-column>
              <el-table-column prop="opTime" label="处理时间"></el-table-column>
              <el-table-column prop="opStatus" label="处理状态"></el-table-column>
              <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="认领记录">
            <el-table
              :data="opType1"
              border
              style="width: 100%">
              <el-table-column prop="userName" label="处理人"></el-table-column>
              <el-table-column prop="opType" label="处理类型"></el-table-column>
              <el-table-column prop="opTime" label="处理时间"></el-table-column>
              <el-table-column prop="opStatus" label="处理状态"></el-table-column>
              <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="审核记录">
            <el-table
              :data="opType2"
              border
              style="width: 100%">
              <el-table-column prop="userName" label="处理人"></el-table-column>
              <el-table-column prop="opType" label="处理类型"></el-table-column>
              <el-table-column prop="opTime" label="处理时间"></el-table-column>
              <el-table-column prop="opStatus" label="处理状态"></el-table-column>
              <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="打款记录">
            <el-table
              :data="opType3"
              border
              style="width: 100%">
              <el-table-column prop="userName" label="处理人"></el-table-column>
              <el-table-column prop="opType" label="处理类型"></el-table-column>
              <el-table-column prop="opTime" label="处理时间"></el-table-column>
              <el-table-column prop="opStatus" label="处理状态"></el-table-column>
              <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="还款记录">
            <el-table
              :data="opType4"
              border
              style="width: 100%">
              <el-table-column prop="userName" label="处理人"></el-table-column>
              <el-table-column prop="opType" label="处理类型"></el-table-column>
              <el-table-column prop="opTime" label="处理时间"></el-table-column>
              <el-table-column prop="opStatus" label="处理状态"></el-table-column>
              <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="冻结记录">
            <el-table
              :data="opType7"
              border
              style="width: 100%">
              <el-table-column prop="userName" label="处理人"></el-table-column>
              <el-table-column prop="opType" label="处理类型"></el-table-column>
              <el-table-column prop="opTime" label="处理时间"></el-table-column>
              <el-table-column prop="opStatus" label="处理状态"></el-table-column>
              <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <!--记录end-->
      <el-tab-pane label="机审结果" name="three">
        <div class="contacts-box">
          <p>审核</p>
          <el-table
            :data="auditlist"
            border
            style="width: 100%">
            <el-table-column prop="remark" label="检查项"></el-table-column>
            <el-table-column prop="status" label="检查结果">
              <template slot-scope="scope">
                <el-tag
                  :type="returnTagType(scope.row.status)"
                  close-transition>{{returnTagValue(scope.row.status)}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="score" label="各项审核分">
              <template slot-scope="scope">
                {{scope.row.score?parseFloat(scope.row.score).toFixed(2):''}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--添加备注-->
    <el-dialog
      title='添加备注'
      :visible.sync="addremarkloding"
      width="30%"
      center>
      <el-form label-width="80px" :model="remarkdata">
        <el-form-item label="备注">
          <el-input type="textarea" v-model="remarkdata.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="addremarkloding = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="addCusRemark">确认</el-button>
        </span>
    </el-dialog>
    <el-dialog
      :title="FormTtile"
      :visible.sync="editFormVisible">
      <el-form label-width="100px" ref="editForm">
        <el-form-item label="借贷宝：">
          <el-upload
            ref="uploadJdb"
            :action="apiUrls"
            list-type="picture-card"
            :headers="myHeaders"
            :class="{'disabled':isDisableds}"
            :on-success="SuccessJdb"
            :on-preview="handleJdb"
            :before-upload="beforeAvatarUpload"
            :on-remove="RemoveJdb">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="今借到：">
          <el-upload
            ref="uploadRegJjd"
            :action="apiUrls"
            list-type="picture-card"
            :headers="myHeaders"
            :class="{'disabled':isDisableds}"
            :on-success="SuccessRegJjd"
            :on-preview="handleRegJjd"
            :before-upload="beforeAvatarUpload"
            :on-remove="RemoveRegJjd">
            <!--<img v-if="editForm.jinjiedaoUrl" :src="editForm.jinjiedaoUrl" class="avatar">-->
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="米房：">
          <el-upload
            ref="uploadMf"
            :action="apiUrls"
            list-type="picture-card"
            :headers="myHeaders"
            :class="{'disabled':isDisableds}"
            :on-success="SuccessMf"
            :on-preview="handleMf"
            :before-upload="beforeAvatarUpload"
            :on-remove="RemoveMf">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="有凭证：">
          <el-upload
            ref="uploadMf"
            :action="apiUrls"
            list-type="picture-card"
            :headers="myHeaders"
            :class="{'disabled':isDisableds}"
            :on-success="SuccessYpz"
            :on-preview="handleYpz"
            :before-upload="beforeAvatarUpload"
            :on-remove="RemoveYpz">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="无忧：">
          <el-upload
            ref="uploadMf"
            :action="apiUrls"
            list-type="picture-card"
            :headers="myHeaders"
            :class="{'disabled':isDisableds}"
            :on-success="SuccessWy"
            :on-preview="handleWy"
            :before-upload="beforeAvatarUpload"
            :on-remove="RemoveWy">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="支付宝：">
          <el-upload
            ref="uploadZfb"
            :action="apiUrls"
            list-type="picture-card"
            :headers="myHeaders"
            :class="{'disabled':isDisableds}"
            :on-success="SuccessZfb"
            :on-preview="handleZfb"
            :before-upload="beforeAvatarUpload"
            :on-remove="RemoveZfb">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click.native="editFormVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click.native="editSubmitImg" :loading="editLoading">
          {{btnEditText1}}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title='备注联系人'
      :visible.sync="remarkContactsloding"
      width="30%"
      center>
      <el-form label-width="80px" :model="remarkContactsFrom">
        <el-form-item label="姓名">
          <el-input v-model="remarkContactsFrom.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input disabled v-model="remarkContactsFrom.mobile"></el-input>
        </el-form-item>
        <el-form-item label="关系">
          <el-input v-model="remarkContactsFrom.relation"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="remarkContactsloding = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="remarkContactsSub">确认</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  import Api from '@/api'
  import sessionStorage from '@/storage/sessionStorage'
  import proConfig from '@/config';
  import util from '../../common/util'

  export default {
    data() {
      return {
        myHeaders: {
          tokenId: sessionStorage.$getSessionStorageByName("tokenId")
        }, // 要保证取到
        isdisabled: true,
        listLoading: false,
        labelPosition: 'left',
        cusId: sessionStorage.$getSessionStorageByName("cusId"),
        auditStatus: sessionStorage.$getSessionStorageByName("auditStatus"),
        tabPosition: 'left',
        record: 'left',
        activeName: 'one',
        btnEditText: '编辑',
        formData: {},
        foodrules: {},
        //1
        showBigImg0: false,
        showBigImg1: false,
        showBigImg2: false,
        showBigImg3: false,
        showBigImg4: false,
        showBigImg5: false,
        showBigImg6: false,

        showzhimaImg: false,
        num: 0,
        imgList0: [],
        imgList1: [],
        imgList2: [],
        imgList3: [],
        imgList4: [],
        imgList5: [],
        imgList6: [],
        titlelist: {
          jiedaibaoUrl: "借贷宝截图",
          jinjiedaoUrl: "今借到截图",
          mifangUrl: "米房截图",
          youpingzhengUrl: '有凭证截图',
          wuyouUrl: '无忧截图',
          alipayUrl: "支付宝截图"
        },
        zhimaImgUrl: '',
        //2
        contacts: [],
        contacts_1: [],
        //借贷认证
        jiedaibaoUrl: [],
        jinjiedaoUrl: [],
        mifangUrl: [],
        youpingzhengUrl: [],
        wuyouUrl: [],
        alipayUrl: [],
        FormTtile: '上传截图',
        btnEditText1: '提交',
        apiUrls: proConfig.apiUrl + '/sys/shop/uploadImg',
        editFormVisible: false,
        editLoading: false,
        current: 0,
        //电商
        information1: [],
        information2: [],
        information3: [],
        information4: [],
        information5: {
          RealName: '',
          JiebeiQuota: '',
          JiebeiBalance: '',
          HuabeiQuota: '',
          HuabeiBalance: '',
          Idcard: '',
          Credit: '',
        },
        information6: {
          OrderCount: '',
          OrderAmount: '',
        },
        information7: [],
        //手机运营商
        mobilecarriers: {},//个人信息
        mobilecarriers1: [],//账单信息
        mobilecarriers2: [],//通话详单
        mobilecarriers3: [],//缴费信息
        mobilecarriers4: [],//亲情网信息
        mobilecarriers5: [],//入网信息
        //借贷保
        jiedaibaodata: {},
        jiedaibaodata1: {},
        jiedaibaodata2: {},
        jiedaibaodata3: {},
        jiedaibaodata4: {},
        //今借到
        jinjiedaodata: {},
        jinjiedaodata1: {},
        jinjiedaodata2: {},
        jinjiedaodata3: [],
        jinjiedaodata4: [],
        //手机通讯录
        phonebook: [],
        limitsImg: 1,
        fileList: [],
        apiUrl: proConfig.apiUrl + '/sys/cus/upload',
        activeColor: '',
        remarkContactsloding: false,
        remarkContactsFrom: {
          name: '',
          mobile: '',
          relation: '',
        },
        //网贷共享报告
        LoanSharePlatInfo: {},
        LoanSharePlatInfo1: [],
        LoanSharePlatInfo2: [],
        LoanSharePlatInfo3: [],
        LoanSharePlatInfo4: [],
        //记录
        opType1: [],
        opType2: [],
        opType3: [],
        opType4: [],
        opType6: [],
        opType7: [],
        remarkdata: {
          remark: ''
        },
        addremarkloding: false,
        //3
        auditlist: [],
        //贷前风险
        creditRisk: [],
      }
    },
    computed: {
      isDisableds() {
        return this.limitsImg >= 1;
      }
    },
    watch: {
      editFormVisible: "querydata"
    },
    created() {
      this.cusIds = {
        cusId: sessionStorage.$getSessionStorageByName("cusId")
      }
      this.getInformation();
    },
    methods: {
      //基本信息start
      handleClick(tab, event) {
        if (this.activeName == 'one') {
          this.getInformation();
        } else if (this.activeName == 'two') {
          this.getCusRecord();
        } else if (this.activeName == 'three') {
          this.getModuleInfo();
        } else if (this.activeName == 'four') {
          this.getContactInfo()
          this._getLinkMan()
        } else if (this.activeName == 'five') {
          this.blackList()
        } else if (this.activeName == 'six') {
          this._businecss()
        } else if (this.activeName == 'eight') {
          this._getMhmobileDetailInfo()
        } else if (this.activeName == 'nine') {
          this._getCreditJiedaibaoInfo()
        } else if (this.activeName == 'seven') {
          this._getCreditJinjiedaoInfo()
        } else if (this.activeName == 'ten') {
          this._getCreditAddressInfo()
        } else if (this.activeName == 'ten1') {
          this._getCreditWdgxInfo()
        } else if (this.activeName == 'ten2') {
          this._getCusModuleInfo()
        }
      },
      //身份证照片放大切换查看
      bigImgs(index, imgs) {
        if (imgs === 'img0') {
          this.showBigImg0 = true;
        }
        if (imgs === 'img1') {
          this.showBigImg1 = true;
        }
        if (imgs === 'img2') {
          this.showBigImg2 = true;
        }
        if (imgs === 'img3') {
          this.showBigImg3 = true;
        }
        if (imgs === 'img4') {
          this.showBigImg4 = true;
        }
        if (imgs === 'img5') {
          this.showBigImg5 = true;
        }
        if (imgs === 'img6') {
          this.showBigImg6 = true;
        }
        this.num = index;
      },
      //芝麻分截图放大
      zhimaImg() {
        this.showzhimaImg = true;
      },
      prev(list) {
        this.num--;//前一张图片.所以下标要减1
        if (this.num < 0) {//如果下标小于 0
          this.num = list.length - 1;//那么下标修改为最大下标  这样就可以循环显示图片
        }
      },
      next(list) {
        this.num++;//后一张,所以下标要增加1
        if (this.num > list.length - 1) {//如果移到到数组的最大下标
          this.num = 0;//那么下标为0 . 这样就可以循环显示图片
        }
      },
      xuanz(id) {
        this.current = (this.current + 90) % 360;
        document.getElementById(id).style.transform = `rotate(${this.current}deg)`;
      },
      //获取基本信息
      getInformation() {
        this.imgList0 = []
        let para = {
          cusId: this.cusId,
        }
        this.listLoading = true
        Api.testApi.getCusInfo(para).then(res => {
          if (res.code == '0000') {
            this.formData = res.data;
            this.formData = Object.assign({}, this.formData, JSON.parse(this.formData.cusInfo))
            delete this.formData.cusInfo;
            this.zhimaImgUrl = this.formData.zhimaImgUrl
            if (this.formData.frontCard) {
              this.imgList0.push(this.formData.frontCard);
            }
            if (this.formData.backidcard) {
              this.imgList0.push(this.formData.backidcard);
            }
            if (this.formData.handCard) {
              this.imgList0.push(this.formData.handCard);
            }
            //          this.merchantList.push(Object.assign({}, list[0], JSON.parse(list[0].shopInfo)))
            this.listLoading = false
          }
        })
      },
      //取消编辑
      canceladit() {
        this.btnEditText = '编辑'
        this.isdisabled = true;
      },
      //基础信息编辑
      editDisabled() {
        if (this.btnEditText == '提交') {
          this.editSubmit();//提交保存
        }
        this.btnEditText = '提交'
        this.isdisabled = false;
      },
      //提交保存
      editSubmit() {
        var _this = this;
        _this.$refs.formData.validate((valid) => {
          if (valid) {
            _this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              let obj = Object.assign({}, _this.formData);
              let para = {
                cusId: obj.cusId,
                cusName: obj.cusName,
                cardId: obj.cardId
              };
              Api.testApi.changeCusInfo(para).then(res => {
                if (res.code == '0000') {
                  this.editLoading = false;
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.btnEditText = '编辑'
                  this.isdisabled = true;
                }
              });
            })
          }
        });
      },
      //基本信息end
      //记录start
      getCusRecord() {
        this.opType1 = []
        this.opType2 = []
        this.opType3 = []
        this.opType4 = []
        this.opType6 = []
        this.opType7 = []
        let para = {
          cusId: this.cusId,
        }
        Api.testApi.getCusRecord(para).then(res => {
          if (res.code == '0000') {
            if (res.data) {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].opTime = util.formatDate.format(
                  new Date(res.data[i].opTime),
                  "yyyy-MM-dd hh:mm:ss"
                );
                if (res.data[i].opType == 1) {
                  res.data[i].opType = this.returnTypeopType(res.data[i].opType)
                  res.data[i].opStatus = this.returnTypeopopStatus(res.data[i].opStatus)
                  this.opType1.push(res.data[i]);
                }
                if (res.data[i].opType == 2) {
                  res.data[i].opType = this.returnTypeopType(res.data[i].opType)
                  res.data[i].opStatus = this.returnTypeopopStatus(res.data[i].opStatus)
                  this.opType2.push(res.data[i]);
                }
                if (res.data[i].opType == 3) {
                  res.data[i].opType = this.returnTypeopType(res.data[i].opType)
                  res.data[i].opStatus = this.returnTypeopopStatus(res.data[i].opStatus)
                  this.opType3.push(res.data[i]);
                }
                if (res.data[i].opType == 4) {
                  res.data[i].opType = this.returnTypeopType(res.data[i].opType)
                  res.data[i].opStatus = this.returnTypeopopStatus(res.data[i].opStatus)
                  this.opType4.push(res.data[i]);
                }
                if (res.data[i].opType == 6) {
                  res.data[i].opType = this.returnTypeopType(res.data[i].opType)
                  res.data[i].opStatus = this.returnTypeopopStatus(res.data[i].opStatus)
                  this.opType6.push(res.data[i]);
                }
                if (res.data[i].opType == 7) {
                  res.data[i].opType = this.returnTypeopType(res.data[i].opType)
                  res.data[i].opStatus = this.returnTypeopopStatus(res.data[i].opStatus)
                  this.opType7.push(res.data[i]);
                }
              }
            }
          }
        })
      },
      //备注提交
      addCusRemark() {
        let para = {
          cusId: this.cusId,
          remark: this.remarkdata.remark,
        }
        Api.testApi.addCusRemark(para).then(res => {
          // console.log('res', res)
          if (res.code === '0000') {
            this.getCusRecord();
            this.addremarkloding = false;
          }
        })
      },
      //记录end
      //网贷黑名单start
      blackList() {
        let para = {
          cusId: this.cusId,
        }
        Api.testApi.getTdBacklistInfo(para).then(res => {
          if (res.code === '0000') {
            // console.log('res', res)
            if (res.data) {
              let resData = JSON.parse(res.data)
              this.creditRisk = resData.risk_items

              for (let i in this.creditRisk) {
                this.creditRisk[i].risk_level = this.returnRiskLevel(
                  this.creditRisk[i].risk_level
                );
              }
            }
          }
        })
      },
      //网贷黑名单end
      // 网贷共享报告start
      _getCreditWdgxInfo() {
        let para = {
          cusId: this.cusId,
        }
        // Api.testApi.getCreditWdgxInfo(para).then(res => {
        //   if (res.code === '0000') {
        //     if (res.data) {
        //       let resData = JSON.parse(res.data)
        //       if (resData.SharePlatLoanApplyInfos) {
        //         this.LoanSharePlatInfo = resData.SharePlatLoanApplyInfos
        //       }
        //       if (resData.SharePlatRepaymentInfos) {
        //         this.LoanSharePlatInfo1 = resData.SharePlatRepaymentInfos
        //       }
        //       if (resData.SharePlatGuaranteeInfos) {
        //         this.LoanSharePlatInfo2 = resData.SharePlatGuaranteeInfos
        //       }
        //       if (resData.SharePlatSpecailTradeInfos) {
        //         this.LoanSharePlatInfo3 = resData.SharePlatSpecailTradeInfos
        //       }
        //       if (resData.SharePlatQueryInfos) {
        //         this.LoanSharePlatInfo4 = resData.SharePlatQueryInfos
        //       }
        //     }
        //   }
        // })
      },
      // 网贷共享报告end
      //借贷认证
      //上传今借到截图
      RemoveJdb(file, fileList) {
        // this.editForm.jiedaibaoUrl = [];
        //        console.log(file, fileList);
      },
      handleJdb(file) {

      },
      async SuccessJdb(response) {
        this.jiedaibaoUrl.push(response.data)
      },
      //今借到
      RemoveRegJjd(file, fileList) {
        // this.editForm.jinjiedaoUrl = [],
        //        console.log(file, fileList);
      },
      handleRegJjd(file) {

      },
      async SuccessRegJjd(response) {
        this.jinjiedaoUrl.push(response.data)
      },
      //米房
      RemoveMf(file, fileList) {
        // this.editForm.mifangUrl = "";
        //        console.log(file, fileList);
      },
      handleMf(file) {

      },
      async SuccessMf(response) {
        this.mifangUrl.push(response.data);
      },
      //无忧
      RemoveWy(file, fileList) {
        // this.editForm.mifangUrl = "";
        //        console.log(file, fileList);
      },
      handleWy(file) {

      },
      async SuccessWy(response) {
        this.wuyouUrl.push(response.data);
      },
      //有凭证
      RemoveYpz(file, fileList) {
        // this.editForm.mifangUrl = "";
        //        console.log(file, fileList);
      },
      handleYpz(file) {

      },
      async SuccessYpz(response) {
        this.youpingzhengUrl.push(response.data);
      },
      //支付宝
      RemoveZfb(file, fileList) {
        // this.editForm.alipayUrl = "";
        //        console.log(file, fileList);
      },
      handleZfb(file) {

      },
      async SuccessZfb(response) {
        this.alipayUrl.push(response.data);
      },
      beforeAvatarUpload(file) {
        const isRightType =
          file.type === "image/jpeg" || file.type === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isRightType) {
          this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 10MB!");
        }
        return isRightType && isLt2M;
      },
      _getCusModuleInfo() {
        let para = {
          cusId: this.cusId,
          moduleName: 'creditLoanProveService'
        }
        Api.testApi.getCusModuleInfo(para).then(res => {
          if (res.code === '0000') {
            if (res.data) {

              if (res.data) {
                if (res.data.jiedaibaoUrl && res.data.jiedaibaoUrl.length > 0) {
                  this.jiedaibaoUrl = res.data.jiedaibaoUrl.split(',')
                  this.imgList1 = this.jiedaibaoUrl
                  // this.titlelist.push(title.jiedaibaoUrl)
                }

                if (res.data.jinjiedaoUrl && res.data.jinjiedaoUrl.length > 0) {
                  this.jinjiedaoUrl = res.data.jinjiedaoUrl.split(',');
                  this.imgList2 = this.jinjiedaoUrl
                  // this.titlelist.push(title.jinjiedaoUrl)
                }

                if (res.data.mifangUrl && res.data.mifangUrl.length > 0) {
                  this.mifangUrl = res.data.mifangUrl.split(',');
                  this.imgList3 = this.mifangUrl
                  // this.titlelist.push(title.mifangUrl)
                }
                if (res.data.youpingzhengUrl && res.data.youpingzhengUrl.length > 0) {
                  this.youpingzhengUrl = res.data.youpingzhengUrl.split(',');
                  this.imgList4 = this.youpingzhengUrl
                  // this.titlelist.push(title.youpingzhengUrl)
                }

                if (res.data.wuyouUrl && res.data.wuyouUrl.length > 0) {
                  this.wuyouUrl = res.data.wuyouUrl.split(',');
                  this.imgList5 = this.wuyouUrl
                  // this.titlelist.push(title.wuyouUrl)
                }

                if (res.data.alipayUrl && res.data.alipayUrl.length > 0) {
                  this.alipayUrl = res.data.alipayUrl.split(',');
                  this.imgList6 = this.alipayUrl
                  // console.log('res', this.imgList5)
                  // this.titlelist.push(title.alipayUrl)
                }
              }
            }
          }
        })
      },
      editSubmitImg() {
        this.$confirm("确认提交吗？", "提示", {}).then(() => {
          let para = {
            jiedaibaoUrl: this.jiedaibaoUrl ? this.jiedaibaoUrl.join(',') : this.jiedaibaoUrl,
            jinjiedaoUrl: this.jinjiedaoUrl ? this.jinjiedaoUrl.join(',') : this.jinjiedaoUrl,
            mifangUrl: this.mifangUrl ? this.mifangUrl.join(',') : this.mifangUrl,
            youpingzhengUrl: this.youpingzhengUrl ? this.youpingzhengUrl.join(',') : this.youpingzhengUrl,
            wuyouUrl: this.wuyouUrl ? this.wuyouUrl.join(',') : this.wuyouUrl,
            alipayUrl: this.alipayUrl ? this.alipayUrl.join(',') : this.alipayUrl,
            // module: 'creditLoanProveService'
          }
          // let para = Object.assign({}, this.editForm);
          para.cusId = this.cusId
          Api.testApi.uploadLoanProve(para).then(res => {
            if (res.code == "0000") {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this._getCusModuleInfo()
              this.editFormVisible = false
            }
          });
        });
      },
      querydata() {
        if (this.editFormVisible) {
          // console.log("hhh", this.editFormVisible);
        } else {
          this.clearUploadedImage();
        }
      },
      //      清空file
      clearUploadedImage() {
        this.$refs.uploadJdb.clearFiles();
        this.$refs.uploadRegJjd.clearFiles();
        this.$refs.uploadMf.clearFiles();
        this.$refs.uploadZfb.clearFiles();
      },
      uploadimg() {
        this.editFormVisible = true
      },
      //手机运营商start
      _getMhmobileDetailInfo() {
        let para = {
          cusId: this.cusId,
        }
        Api.testApi.getMhmobileDetailInfo(para).then(res => {
          if (res.code === '0000') {
            if (res.data) {
              let resData = res.data
              this.mobilecarriers = resData
              this.mobilecarriers.unuse_time = ''
              if (resData.mobile_info) {
                if (JSON.parse(resData.mobile_info).unuse_time) {
                  if (JSON.parse(resData.mobile_info).unuse_time.unuse_time) {
                    this.mobilecarriers.unuse_time = JSON.parse(resData.mobile_info).unuse_time.unuse_time
                  }
                }
              }
              let taskData = resData.task_data//账单信息
              let call_info = resData.call_info //通话详单
              let payment_info = resData.call_info //缴费信息
              let family_info = resData.call_info //亲情网信息
              this.mobilecarriers1 = taskData.bill_info
              this.mobilecarriers2 = taskData.call_info
              this.mobilecarriers3 = taskData.payment_info
              this.mobilecarriers4 = taskData.family_info
              this.mobilecarriers5 = taskData.account_info
            }
          }
        })
      },
      //手机运营商end
      //借贷宝
      _getCreditJiedaibaoInfo() {
        let para = {
          cusId: this.cusId,
        }
        Api.testApi.getCreditJiedaibaoInfo(para).then(res => {
          if (res.code === '0000') {
            if (res.data) {
              let resData = JSON.parse(res.data)
              // console.log('res', resData)
              if (resData.JiedaibaoAccountInfo) {
                this.jiedaibaodata = resData.JiedaibaoAccountInfo
              }
              if (resData.JiedaibaoPayoffInfo) {
                this.jiedaibaodata1 = resData.JiedaibaoPayoffInfo
              }
              if (resData.JiedaibaoLendInfo) {
                this.jiedaibaodata2 = resData.JiedaibaoLendInfo
              }
              if (resData.JiedaibaoTradeInfo) {
                this.jiedaibaodata3 = resData.JiedaibaoTradeInfo
              }
              if (resData.JiedaibaoBorrowInfo) {
                this.jiedaibaodata4 = resData.JiedaibaoBorrowInfo
                // console.log('res=============', this.jiedaibaodata4)
              }
            }
          }
        })
      },
      //今借到
      _getCreditJinjiedaoInfo() {
        let para = {
          cusId: this.cusId,
        }
        Api.testApi.getCreditJinjiedaoInfo(para).then(res => {
          if (res.code === '0000') {
            if (res.data) {
              let resData = JSON.parse(res.data)
              // console.log('res', resData)
              if (resData.JinjiedaoAccountInfo) {
                this.jinjiedaodata = resData.JinjiedaoAccountInfo
              }
              if (resData.JinjiedaoBorrowInfo) {
                this.jinjiedaodata1 = resData.JinjiedaoBorrowInfo
              }
              if (resData.JinjiedaoLendInfo) {
                this.jinjiedaodata2 = resData.JinjiedaoLendInfo
              }
              if (resData.JinjiedaoFriendBorrowInfos) {
                this.jinjiedaodata3 = resData.JinjiedaoFriendBorrowInfos
              }
              if (resData.JinjiedaoFriendLendInfos) {
                this.jinjiedaodata4 = resData.JinjiedaoFriendLendInfos
              }
            }
          }
        })
      },
      //手机通讯录
      remarkContacts(row) {
        this.remarkContactsloding = true;
        this.remarkContactsFrom = {
          name: row.name,
          mobile: row.mobile,
          relation: row.relation ? row.relation : ''
        }
      },
      remarkContactsSub() {
        var _this = this;
        _this.$refs.formData.validate((valid) => {
          if (valid) {
            _this.$confirm('确认提交吗？', '提示', {}).then(() => {
              if (this.remarkContactsFrom.relation == '') {
                this.$message({
                  message: '请输入关系！',
                  type: 'warning'
                });
                return false;
              }
              let para = Object.assign({}, this.remarkContactsFrom)
              para.cusId = this.cusId
              Api.testApi.addLinkMan(para).then(res => {
                if (res.code === '0000') {
                  this.$message({
                    message: '操作成功!',
                    type: 'success'
                  });
                  this.remarkContactsloding = false;
                }
              })
            })
          }
        });
      },
      _getCreditAddressInfo() {
        let para = {
          cusId: this.cusId,
        }
        Api.testApi.getCreditAddressInfo(para).then(res => {
          if (res.code === '0000') {
            if (res.data) {
              for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].mobile === '110' || res.data[i].mobile === '120' || res.data[i].mobile === '119' || res.data[i].mobile === '122') {
                  if (res.data[i].mobile === '110') {
                    res.data[i].name = '公安机关(匪警)- 特殊号码'
                  }
                  if (res.data[i].mobile === '120') {
                    res.data[i].name = '医院 - 特殊号码'
                  }
                  if (res.data[i].mobile === '119') {
                    res.data[i].name = '火警 - 特殊号码'
                  }
                  if (res.data[i].mobile === '122') {
                    res.data[i].name = '交通事故 - 特殊号码'
                  }
                  res.data.unshift(res.data[i])
                  res.data.splice(i, 1);
                }
                res.data[i].callTime = parseFloat(res.data[i].callTime / 60).toFixed(2)
                res.data[i].linkDensity = `${res.data[i].sevenDayCount}次--${res.data[i].oneMonthCount}次--${res.data[i].threeMonthCount}次`
              }
              this.phonebook = res.data
            }
          }
        })
      },
      RemovePhone(file, fileList) {
        console.log("3-------");
      },
      handlePhone(file) {
        console.log('file', file)
      },
      async SuccessPhone(response) {
        setTimeout((res) => {
          this._getCreditAddressInfo()
        }, 1000)
      },
      //电商start
      _businecss() {
        let para = {
          cusId: this.cusId,
        }
        Api.testApi.getShopData(para).then(res => {
          if (res.data.taobao) {
            let dataList = res.data.taobao ? JSON.parse(res.data.taobao) : null
            if (dataList) {
              this.information1 = dataList.TaobaoCostInfos
              this.information4 = dataList.TaobaoBankcardInfos
              if (dataList.TaobaoOrderStatisticsInfo) {
                this.information6 = dataList.TaobaoOrderStatisticsInfo
              }
              if (dataList.TaobaoBasicInfo) {
                this.information5 = dataList.TaobaoBasicInfo
              }
            }
          }
          if (res.data.alipay) {
            let dataList1 = res.data.taobao ? JSON.parse(res.data.alipay) : null
            if (dataList1) {
              if (dataList1.AlipayTradeInfos) {
                this.information2 = dataList1.AlipayTradeInfos
                for (let i = 0; i < dataList1.AlipayPayExpendInfos.length; i++) {
                  // dataList1.AlipayPayExpendInfos[i].Rate = parseInt(dataList1.AlipayPayExpendInfos[i].Rate*100).toFixed(2)
                  dataList1.AlipayPayExpendInfos[i].Rate = dataList1.AlipayPayExpendInfos[i].Rate * 100
                }
                this.information7 = dataList1.AlipayPayExpendInfos
              }
            }
          }
          if (res.data.zhima) {
            let dataList2 = res.data.taobao ? JSON.parse(res.data.zhima) : null
            if (dataList2) {
              this.information3 = dataList2.ZhimaScoreInfos
            }
          }
        })
      },
      //电商end
      //审核start
      getModuleInfo() {
        let para = {
          cusId: this.cusId
        }
        Api.testApi.getModuleInfo(para).then(res => {
          if (res.code == '0000') {
            this.auditlist = res.data.modules;
          }
        })
      },
      //返回表格内标签的类型
      returnRiskLevel(data) {
        switch (data) {
          case 'low' :
            return "低"
          case 'medium':
            return "中";
          case 'high':
            return "高";
        }
      },
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
            return '待审核';
          case 2:
            return '自动审核中';
          case 3:
            return '机审通过';
          case 4:
            return '人工审核通过';
          case 5:
            return '黑名单';
          case 7:
            return '审核未通过';
          case 8:
            return '人工未通过';
        }
      },
      //1-认领 2-审核 3-打款 4-还款 5-催收 6-备注 7冻结 , 0 表示不需要处理
      returnTypeopType(status) {
        switch (status) {
          case 1:
            return "认领";
          case 2:
            return "审核";
          case 3:
            return "打款";
          case 4:
            return "还款";
//          case 5:
//            return "第三方身份证识别费用";
          case 6:
            return "备注";
          case 7:
            return "冻结";
        }
      },
      returnTypeopopStatus(status) {
        switch (status) {
          case 0 :
            return "暂无状态"
          case 1:
            return "已通过";
          case -1:
            return "已拒绝";
        }
      },
      //审核end
      //联系人start
      getContactInfo() {
        let para = {
          cusId: this.cusId,
        }
        Api.testApi.getContactInfo(para).then(res => {
          if (res.code == '0000') {
            if (res.data) {
              let a = JSON.parse(res.data.relation);
              let b = []
              let keys = Object.keys(a)
              b[0] = {};
              b[1] = {};
              for (let i of keys) {
                if (/1$/.test(i)) {
                  b[0][i] = a[i]
                } else {
                  b[1][i] = a[i];
                }
              }
              b[1].name1 = b[1].name2;
              delete b[1].name2;
              b[1].phone1 = b[1].phone2;
              delete b[1].phone2;
              b[1].relation1 = b[1].relation2;
              delete b[1].relation2;
              if (res.data.relation_count) {
                if (res.data.relation_count.link_contact_count) {
                  if (res.data.relation_count.link_contact_count.linkman_contact_count) {
                    let linkman_contact_count = res.data.relation_count.link_contact_count.linkman_contact_count
                    linkman_contact_count = linkman_contact_count.split(',');
                    for (var i in linkman_contact_count) {
                      linkman_contact_count[i] = linkman_contact_count[i].split(':')[1];
                    }
                    b[0].linkman_contact_count = linkman_contact_count[0];
                    b[1].linkman_contact_count = linkman_contact_count[1];
                  }
                }
              }
              this.contacts = b
            }
          }
        })
      },
      _getLinkMan() {
        let para = {
          cusId: this.cusId,
        }
        Api.testApi.getLinkMan(para).then(res => {
          if (res.code == '0000') {
            if (res.data) {
              if (res.data.rawInfo) {
                this.contacts_1 = JSON.parse(res.data.rawInfo)
              }
            }
          }
        })
      }
      //联系人end
    }
  }
</script>
<style type="text/scss" lang="scss">
  //基本信息
  .form_header {
    text-align: center;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: 15px;
  }

  .food_form {
    margin-bottom: 15px;
    border: 1px solid #e5e5e5;
    padding: 30px;
    border-radius: 5px;
  }

  .form-row {
    margin: 0 !important;
  }

  .submit-box {
    text-align: right;
    padding-right: 10px;
  }

  .jiedai-title {
    position: relative;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 20px 0;
  }

  .identity-pic {
    padding: 15px;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    margin-top: 10px;
    p {
      margin: 10px;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #e5e5e5;
    }
  }

  .imgList {
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    img {
      width: 300px;
      height: 200px;
      margin-left: 10px;
    }
  }

  .imgList1 {
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    img {
      width: 300px;
      height: 500px;
      margin-left: 10px;
    }
  }

  .imgList2 {
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px 0;
    border-bottom: 1px solid #e5e5e5;
    p {
      width: 100px;
      border: none;
    }
    img {
      width: 100px;
      height: 100px;
      margin-left: 10px;
    }
  }

  .imgMask {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 100;
    background: rgba(0, 0, 0, .6);
  }

  .imgMask1 {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 100;
    background: rgba(0, 0, 0, .6);
  }

  .showImg {
    height: 600px;
    width: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 10px solid #fff;
  }

  .showImg1 {
    height: 700px;
    width: 550px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 10px solid #fff;
  }

  .bigImg {
    width: 100%;
    height: 100%;
  }

  .prev {
    position: absolute;
    top: 50%;
    left: 10%;
    width: 40px;
    cursor: pointer;
    transform: translate(10px, -50%);
  }

  .next {
    width: 40px;
    transform: translate(10px, -50%);
    position: absolute;
    top: 50%;
    cursor: pointer;
    right: 10%;
  }

  .xuanz {
    width: 50px;
    height: 50px;
    position: absolute;
    bottom: 50px;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 9999;
    cursor: pointer;
  }

  .audit-btn {
    padding-top: 20px;
    padding-left: 25px;
  }

  //记录
  .el-tabs--border-card {
    border-radius: 5px;
  }

  .el-tabs--left.el-tabs--border-card .el-tabs__item {
    text-align: center !important;
  }

  .addremark {
    text-align: right;
    margin-bottom: 15px;
  }

  //审核
  //联系人
  .contacts-box {
    border-radius: 5px;
    border: 1px solid #e5e5e5;
    margin-bottom: 10px;
    padding: 15px;
    padding-top: 0;
    p {
      text-align: center;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #e5e5e5;
      margin-bottom: 15px;
    }
  }

  .contacts-box1 {
    border-radius: 5px;
    border: 1px solid #e5e5e5;
    margin-bottom: 10px;
    padding: 15px;
    padding-top: 0;
    .phone-box {
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      padding: 20px 0;
    }
  }

  .el-form--label-left .el-form-item__label {
    text-align: right;
  }

  //借款记录
  .amount-ha {
    p {
      text-align: left;
      color: #108ee9;
      background: #d2eafb;
      border-color: #d2eafb;
      padding-left: 15px;
    }
  }

  .el-upload--picture-card img {
    width: 100%;
    height: 100%;
  }

  /*.disabled {*/
  /*width: 80px;*/
  /*height: 80px;*/
  /*overflow: hidden;*/
  /*}*/
</style>
