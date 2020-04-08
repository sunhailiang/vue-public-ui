const path = require("path");
const webpack = require("webpack");
const AntDesignThemePlugin = require("antd-theme-webpack-plugin");
const options = {
  antDir: path.join(__dirname, "./node_modules/ant-design-vue"),
  stylesDir: path.join(__dirname, "./src"),
  varFile: path.join(
    __dirname,
    "./node_modules/ant-design-vue/lib/style/themes/default.less"
  ),
  mainLessFile: "",
  themeVariables: ["@primary-color"],
  generateOnce: false,
  customColorRegexArray: [] // An array of regex codes to match your custom color variable values so that code can identify that it's a valid color. Make sure your regex does not adds false positives.
};
const themePlugin = new AntDesignThemePlugin(options);

module.exports = {
  configureWebpack: {
    plugins: [themePlugin, new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)],
    resolve: {
      alias: {
        "@ant-design-vue/lib/icon$": path.resolve(__dirname, "./src/icons.js")
      }
    }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 配置主题
          "primary-color": "#1DA57A"
        },
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
