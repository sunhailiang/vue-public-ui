module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    proxy: {
      "/service": {
        target: "http://localhost:3000",
        bypass: function(req, res) {
          if (req.headers.accept.indexOf("html") !== -1) {
            console.log("Skipping proxy for browser request.");
            return "/index.html";
          } else {
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
