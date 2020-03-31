import NotFond from "@/views/404";
import Forbiden from "@/views/403";

const routes = [
  {
    path: "/user",
    hideInMenu: true, // 添加一个不渲染的标识符
    component: () => {
      return import(/* webpackChunkName: "user" */ "../layouts/UserLayout.vue");
    },
    children: [
      {
        path: "/user",
        redirect: "/user/login"
      },
      {
        path: "/user/login",
        meta: { title: "登录页" },
        name: "login",
        component: () => {
          return import(
            /* webpackChunkName: "user" */ "../views/User/Login.vue"
          );
        }
      },
      {
        path: "/user/register",
        name: "register",
        meta: { title: "注册页面" },
        component: () => {
          return import(
            /* webpackChunkName: "user" */ "../views/User/Register.vue"
          );
        }
      }
    ]
  },
  {
    path: "/",
    meta: { authority: ["user", "admin"] },
    component: () =>
      import(/* webpackChunkName: "layout" */ "../layouts/BasicLayout"),
    children: [
      // dashboard
      {
        path: "/",
        redirect: "/dashboard/analysis"
      },
      {
        path: "/dashboard",
        name: "dashboard",
        meta: { icon: "dashboard", title: "仪表盘" },
        component: { render: h => h("router-view") },
        children: [
          {
            path: "/dashboard/analysis",
            name: "analysis",
            meta: { title: "分析页", icon: "dot-chart" },
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ "../views/Dashboard/Analysis"
              )
          }
        ]
      },
      // form
      {
        path: "/form",
        name: "form",
        component: { render: h => h("router-view") },
        meta: { icon: "form", title: "表单", authority: ["admin"] },
        redirect: "/form/basic-form",
        children: [
          {
            path: "/form/basic-form",
            name: "basicform",
            meta: { title: "基础表单", icon: "container" },
            component: () =>
              import(/* webpackChunkName: "form" */ "../views/Forms/BasicForm")
          },
          {
            path: "/form/step-form",
            name: "stepform",
            hideChildrenInMenu: true,
            meta: { title: "分布表单", icon: "file-markdown" },
            component: () =>
              import(/* webpackChunkName: "form" */ "../views/Forms/StepForm"),
            children: [
              {
                path: "/form/step-form",
                redirect: "/form/step-form/info"
              },
              {
                path: "/form/step-form/info",
                name: "info",
                component: () =>
                  import(
                    /* webpackChunkName: "form" */ "../views/Forms/StepForm/Step1"
                  )
              },
              {
                path: "/form/step-form/confirm",
                name: "confirm",
                component: () =>
                  import(
                    /* webpackChunkName: "form" */ "../views/Forms/StepForm/Step2"
                  )
              },
              {
                path: "/form/step-form/result",
                name: "result",
                component: () =>
                  import(
                    /* webpackChunkName: "form" */ "../views/Forms/StepForm/Step3"
                  )
              }
            ]
          }
        ]
      }
    ]
  },
  // 403页面
  {
    path: "/403",
    name: "403",
    component: Forbiden,
    hideInMenu: true
  },
  // 404页面
  {
    path: "*",
    name: "404",
    component: NotFond,
    hideInMenu: true
  }
];

export default routes;
