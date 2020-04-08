import Vue from "vue";
import App from "./App.vue";
import router from "./router/router_regurd";
import store from "./store";
import enUS from "./locale/enUS";
import zhCN from "./locale/zhCN";
import VueI18n from "vue-i18n";
import queryString from "query-string";
import "moment/locale/zh-cn"; // 引入中文包，默认是英文的不必理会
import VueHighlightJS from "vue-highlightjs";
import "highlight.js/styles/github.css";
import {
  Button,
  Layout,
  Icon,
  Drawer,
  Radio,
  Menu,
  Form,
  Input,
  Select,
  LocaleProvider,
  Dropdown,
  DatePicker
} from "ant-design-vue";

// 引入权限组件
import Authority from "./components/Authority.vue";
// 全局注册
Vue.component("Authority", Authority);
// 引入指令
import auth from "./directives/auth";
// 注册全局指令
Vue.use(auth);
// 使用axios二次封装的方法进行请求数据
// import request from "./utils/request";
// Vue.use(request);

// 将cdn地址换成阿里图标我们的地址
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1729142_zj4yiayd61.js"
});

// 注册国际化插件
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: queryString.parse(location.search).locale || "zhCN",
  messages: {
    zhCN: { message: zhCN },
    enUS: { message: enUS }
  }
});

// 全局注册
Vue.component("IconFont", IconFont);
Vue.config.productionTip = false;
Vue.use(LocaleProvider);
Vue.use(Dropdown);
Vue.use(DatePicker);
Vue.use(Button);
Vue.use(Layout);
Vue.use(Icon);
Vue.use(Drawer);
Vue.use(Radio);
Vue.use(Menu);
Vue.use(Form);
Vue.use(Input);
Vue.use(Select);
Vue.use(VueHighlightJS);
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
