<template>
  <div ref="chart" style="height:400px;"></div>
</template>
<script>
import echarts from "echarts";
import { addListener, removeListener } from "resize-detector";
import { debounce } from "lodash";
export default {
  name: "Chart",
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    console.log("进来了吧", this.option);
    this.renderChar();
    // 监听数据dom变化
    addListener(this.$refs.chart, this.resize);
  },
  methods: {
    // 纯粹的自定义组件
    renderChar() {
      // 基于准备好的dom初始化chart示例
      this.chart = echarts.init(this.$refs.chart);

      this.chart.setOption(this.option);
    },
    resize() {
      console.log("变化了");
      this.chart.resize();
    }
  },
  watch: {
    option(val) {
      // 这样有一个问题：option没有变化，但是option中的data数组如果变了是监视不到的，怎么办呢？用深度监听
      this.chart.setOption(val);
    }
    // option: {
    //   // 深度监听的写法:但是依旧很耗性能，怎么办呢？那我们还是采取第一种监听方式
    //   handler(val) {
    //     this.chart.setOption(val)
    //   },
    //   deep: true //
    // }
  },
  beforeDestroy() {
    removeListener(this.$refs.chart, this.resize);
    // 始放图表组件，防止内存泄漏
    this.chart.dispose();
    this.chart = null;
  },
  created() {
    this.resize = debounce(this.resize, 200);
  }
};
</script>
<style lang="less" scoped></style>
