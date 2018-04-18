<template>
  <el-row class="warp">
    <div class="operator">
      <el-button size="small" type="primary" @click='createNewChart(3)'>三天</el-button>
      <el-button size="small" type="primary" @click='createNewChart(7)'>七天</el-button>
      <el-button size="small" type="primary" @click='createNewChart(15)'>半个月</el-button>
    </div>
    <el-col :span="12" class="warp-main">
      <v-chart id='myChart1' :option='option1' :style="{height:height,width:width}" ref='myChart1'></v-chart>
    </el-col>
    <el-col :span="12" class="warp-main">
      <v-chart id='myChart2' :option='option2' :style="{height:height,width:width}" ref='myChart2'></v-chart>
    </el-col>
    <el-col :span="12" class="warp-main">
      <v-chart id='myChart3' :option='option3' :style="{height:height,width:width}" ref='myChart3'></v-chart>
    </el-col>
    <el-col :span="12" class="warp-main">
      <v-chart id='myChart4' :option='option4' :style="{height:height,width:width}" :fun='tollFun'
               ref='myChart4'></v-chart>
    </el-col>
    <!--列表-->
    <el-col :span="12" class="warp-main">
      <p class="tit">收费标准 <span class="totalMoney">昨日费用总计：{{Number(totalMoney).toFixed(2)||'0.00'}}元</span></p>
      <el-table :data="billingDetailList" border highlight-current-row style="width: 100%;">
        <el-table-column prop="name_cn" label="名称"></el-table-column>
        <el-table-column prop="total_count" label="数量"></el-table-column>
        <el-table-column prop="unit_price" label="单价(元)"></el-table-column>
        <el-table-column prop="total_amount" label="总消费(元)"></el-table-column>
      </el-table>
    </el-col>
    <!-- {{roleName}}! 欢迎登录。 -->
  </el-row>
</template>
<script>
  import echarts from 'echarts'
  import util from "../../common/util";
  import vChart from '@/components/common/echart'
  import waves from "@/common/waves/index" // 水波纹指令
  import Api from "@/api"
  import sessionStorage from '@/storage/sessionStorage'

  export default {
    name: 'home',
    data() {
      return {
        height: '500px',
        width: '100%',
        currentDate: new Date(),
        roleName: '',
        billingDetailList: [],
        totalMoney: null,
        option1: {
          title: {
            text: '进件',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{b0}<br />{a0}: {c0}人<br />{a1}: {c1}人<br />{a2}: {c2}人'
          },
          toolbox: {
            feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          legend: {  //折线名字
            left: '3%',
            data: ['统共', '平台', '商户']
          },
          grid: {
            left: '5%',
            right: '8%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: 'value',
            name: '人数'
          },
          series: [
            {
              name: '统共',
              type: 'line', //柱状bar
              data: []
            },
            {
              name: '平台',
              type: 'line',
              data: []
            },
            {
              name: '商户',
              type: 'line',
              data: []
            }
          ]
        },
        option2: {
          title: {
            text: '转化量',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{b0}<br />{a0}: {c0}人<br />{a1}: {c1}人<br />{a2}: {c2}人'
          },
          toolbox: {
            feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          legend: {  //折线名字
            left: '3%',
            data: ['统共', '平台', '商户']
          },
          grid: {
            left: '5%',
            right: '8%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: 'value',
            name: '人数'
          },
          series: [
            {
              name: '统共',
              type: 'line', //柱状bar
              data: []
            },
            {
              name: '平台',
              type: 'line',
              data: []
            },
            {
              name: '商户',
              type: 'line',
              data: []
            }
          ]
        },
        option3: {
          title: {
            text: '转化率',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{b0}<br />{a0}: {c0}%<br />{a1}: {c1}%<br />{a2}: {c2}%'
          },
          toolbox: {
            feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          legend: {  //折线名字
            left: '3%',
            data: ['统共', '平台', '商户']
          },
          grid: {
            left: '5%',
            right: '8%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: 'value',
            name: '百分比  '

          },
          series: [
            {
              name: '统共',
              type: 'line', //柱状bar
              data: []
            },
            {
              name: '平台',
              type: 'line',
              data: []
            },
            {
              name: '商户',
              type: 'line',
              data: []
            }
          ]
        },
        option4: {
          title: {
            text: '支出',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{b0}<br />{a0}: {c0}元'
          },
          toolbox: {
            feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          grid: {
            left: '5%',
            right: '8%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: 'value',
            name: '元'

          },
          series: [
            {
              name: '价格',
              type: 'line', //柱状bar
              data: []
            }
          ]
        }
      };
    },
    directives: {
      waves
    },
    components: {
      'v-chart': vChart
    },
    created() {
      this.roleName = decodeURI(sessionStorage.$getSessionStorageByName('roleName'))
      this.createNewChart(7)
      this.getBillingDetails()
    },
    mounted() {
    },
    methods: {
      createNewChart(n) {
        this.clearData(this.option1)
        this.clearData(this.option2)
        this.clearData(this.option3)
        this.clearData(this.option4)
        let para = {
          days: n
        }
        Api.testApi.chargingList(util.checkBe(para)).then(res => {
          if (res.code == "0000") {
            //进件
            if (res.data.registerList) {
              let datas = res.data.registerList;
              for (let i = 0; i < datas.platformList.length; i++) {
                this.option1.xAxis.data.push(datas.platformList[i].create_time)
                this.option1.series[1].data.push(datas.platformList[i].count); //平台
              }
              for (let j = 0; j < datas.merchantList.length; j++) {
                this.option1.series[2].data.push(datas.merchantList[j].count);//商户
                this.option1.series[0].data.push(datas.merchantList[j].count + datas.platformList[j].count);//统共
              }
            }
            //转化量
            if (res.data.transList) {
              let datas = res.data.transList;
              for (let i = 0; i < datas.platformLoanList.length; i++) {
                this.option2.xAxis.data.push(datas.platformLoanList[i].create_time)
                this.option2.series[1].data.push(datas.platformLoanList[i].count); //平台
              }
              for (let j = 0; j < datas.merchantLoanList.length; j++) {
                this.option2.series[2].data.push(datas.merchantLoanList[j].count);//商户
                this.option2.series[0].data.push(datas.merchantLoanList[j].count + datas.platformLoanList[j].count);//统共
              }
            }
            //转化率
            if (res.data.rateList) {
              let datas = res.data.rateList;
              datas.platformLoanRateList.forEach(curr => {  //平台
                this.option3.xAxis.data.push(curr.create_time);
                this.option3.series[1].data.push(curr.platformRate);
              })
              datas.merchantLoanRateList.forEach(curr => {  //商户
                this.option3.series[2].data.push(curr.merchantRate);
              })
              //统共
              let transTotal = this.option2.series[0].data,
                registerTotal = this.option1.series[0].data;
              for (let i = 0; i < transTotal.length; i++) {
                let rate = registerTotal[i] != 0 ? ((transTotal[i] / registerTotal[i]) * 100).toFixed(2) : 0;
                this.option3.series[0].data.push(rate)
              }
            }
            //收费标准
            if (res.data.chargingList) {
              let datas = res.data.chargingList;
              datas.forEach(curr => {  //商户
                this.option4.series[0].data.push(curr.total_amount);
                this.option4.xAxis.data.push(curr.create_time);
              })
            }
          }
        });
      },
      //收费明细
      getBillingDetails() {
        this.totalMoney = null;
        let para = {}
        Api.testApi.getBillingDetails(util.checkBe(para)).then(res => {
          if (res.code == "0000") {
            this.billingDetailList = JSON.parse(res.data);
            for (let i in this.billingDetailList) {
              this.totalMoney += this.billingDetailList[i].total_amount
            }
          }
        });
      },
      tollFun(param) {
        console.log(param)
      },
      clearData(option) {
        option.xAxis.data = [];
        option.series.forEach(curr => {
          curr.data = []
        })
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .warp {
    position: relative;

    .operator {
      position: absolute;
      top: 0;
      left: 20px;
    }
  }

  .warp-main {
    margin-top: 60px;
    .tit {
      font-size: 18px;
      font-weight: bolder;
      text-align: center;
      margin-bottom: 20px;
      position: relative;
      .totalMoney {
        position: absolute;
        right: 0;
        font-size: 16px;
      }
    }
  }
</style>
