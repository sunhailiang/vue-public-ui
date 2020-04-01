module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");

    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear();

    // 添加要替换的 loader
    svgRule.use("vue-svg-loader").loader("vue-svg-loader");
  },
  devServer: {
    proxy: {
      "/service": {
        target: "http://localhost:3000",
        bypass: function(req, res) {
          if (req.headers.accept.indexOf("html") !== -1) {
            console.log("Skipping proxy for browser request.");
            return "/index.html";
          } else if (process.env.MOCK === "true") {
            const name = req.path.split("/")[3];
            const mock = require(`./service/mock/index`)[name];
            const result = mock(req.method);
            delete require.cache[require.resolve(`./service/mock/index`)]; //清除缓存这样，每次你只要一修改mock数据页面及时刷新
            return res.send(result);
          }
        }
      }
    }
  }
};
