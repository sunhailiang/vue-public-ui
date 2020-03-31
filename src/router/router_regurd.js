import Vue from "vue";
import VueRouter from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import findLast from "lodash/findLast";
import { check, isLogin } from "@/auth/index";
import nProgress from "nprogress";
import { Notification } from "ant-design-vue";
import routes from "./index";

Vue.use(VueRouter);
// 路由守卫
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  // 只有在路由地址发生变化时触发进度条
  if (to.path != from.path) {
    NProgress.start();
  }
  const record = findLast(to.matched, record => record.meta.authority);
  if (record && !check(record.meta.authority)) {
    // 如果没有权限
    // 再次判断是否登陆了
    if (!isLogin() && to.path !== "/user/login") {
      //登陆直接跳到登录页页面
      next({
        path: "/user/login"
      });
    } else if (to.path !== "/403") {
      // 如果权限不够直接去403，需要去新建一个403的页面和路由
      Notification.error({
        message: "403",
        description: "没有访问权限，请联系管理员"
      });
      next({
        path: "/403"
      });
    }
    nProgress.done();
  }
  next();
});
router.afterEach(() => {
  NProgress.done();
});

export default router;
