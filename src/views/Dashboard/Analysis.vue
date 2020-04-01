<template>
  <div>
    <Chart :option="opitons" style="height:400px" />
  </div>
</template>
<script>
import Chart from "@/components/chart/Chart";
import request from "@/utils/request";
export default {
  data() {
    return {
      // 指定图表的配置s项和数据
      fuck: "FUCK",
      opitons: {
        title: {
          text: "ECharts 入门示例"
        },
        tooltip: {},
        legend: {
          data: ["销量"]
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }
    };
  },
  mounted() {
    // 调用mock接口
    this.getCharData();
    setInterval(() => {
      this.getCharData();
      // this.opitons.series[0].data = this.opitons.series[0].data.map(() =>
      //   random(100)
      // )
      // // 重新赋值,是要数据发生变化就更新数据
      // this.opitons = { ...this.opitons }
    }, 5000);
  },
  methods: {
    // 模拟mock数据
    getCharData() {
      request({
        url: "/service/mock/chartData",
        method: "get",
        params: { ID: 12346 }
      }).then(res => {
        this.opitons = {
          title: {
            text: "ECharts 入门示例"
          },
          tooltip: {},
          legend: {
            data: ["销量"]
          },
          xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
          },
          yAxis: {},
          series: [
            {
              name: "销量",
              type: "bar",
              data: res.data
            }
          ]
        };
      });
    }
  },
  components: {
    Chart
  }
};
</script>
<style lang="less" scoped></style>
