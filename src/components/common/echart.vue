<template>
  <div :id="id" :style="{height:height,width:width}" :fun='fun' ref="myEchart">
  </div>
</template>
<script>
//1. npm install --save echarts
import echarts from 'echarts'
export default {
  name: 'chart',
  data() {
    return {
      //echart实例
      chart: null
    }
  },
  props: {
    //父组件需要传递的参数：id，width，height，option
    id: {
      type: String,
      default: 'yourID'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    option: {
      type: Object
    },
    fun: {
      type: Function 
    }
  },
  watch: {
    option: {
      handler(newVal, oldVal) {
        if (this.chart) {
          newVal ? this.chart.setOption(newVal) : this.chart.setOption(oldVal)
        } else {
          this.init();
        }
      },
      deep: true 
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose(); //销毁图表
    this.chart = null;
  },
  methods: {
    init() {
      //随窗口大小自适应
      this.chart = new echarts.init(this.$refs.myEchart);
      this.chart.on('mouseover',this.fun)

      // 把配置和数据放这里                
      this.$nextTick(() => {
        this.chart.setOption(this.option)
      })
      window.addEventListener("resize", this.chart.resize);
    }
  }
}
</script>