import Vue from "vue";
import App from "./App.vue";
import router from "./router/router_regurd";
import store from "./store";
import { Button, Layout, Icon, Drawer, Radio, Menu } from "ant-design-vue";

// 引入权限组件
import Authority from "./components/Authority.vue";
// 全局注册
Vue.component("Authority", Authority);
// 引入指令
import auth from "./directives/auth";
// 注册全局指令
Vue.use(auth);
// 使用axios二次封装的方法进行请求数据
import request from "./utils/request";
Vue.use(request);

Vue.config.productionTip = false;

Vue.use(Button);
Vue.use(Layout);
Vue.use(Icon);
Vue.use(Drawer);
Vue.use(Radio);
Vue.use(Menu);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
