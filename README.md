# 通用企业级前端 UI 框架

# 项目介绍

> 此项目一套开箱即用的中后台前端框架，这个项目就从 0 到 1 实现

- 该项目优点：
  - 功能齐全
  - 从零搭建前端架构，提高你的单兵作战的能力
  - 技术点应用全面，综合查缺补漏
  - 关于权限管理是个大亮点哟

# template 和 jsx 的区别

- template
  - HTML 扩展的语法
  - 数据使用 Mustache（双括号）
  - 优点：学习成本低，大量指令，组件作用域 css，但是灵活性低
- jsx
  - JS 语法扩展
  - 数据绑定使用单引号
  - 优点：灵活
- 怎么选择：组件基本可以分成两类，一类偏视图表现，一类偏逻辑处理
- 视图表现，很明显 template 更加合适
- 逻辑处理，jsx 或者直接使用渲染函数（vue 中 render 函数）
- 但是：无论你选哪个，其实，这都是语法糖最终都是使用 createElement 而已

# 创建项目

> vue create vue-public-ui

- 选择自定义：Manually select features
- 使用 history 路由
- ESLint+Prettier(Lint on save 和 Lint and fix on commit)
- 单元测试 Jest
- 配置文件独立（In dedicated config files）
- Sava this as a preset for future projects? 是否保存当前设置以后新建项目就直接用 YES

# 安装组件库

> ui 组件库

- yarn add ant-design-vue
  > 日期处理库
- yarn add moment

# 配置个性化 webpack 和 babel

> 配置 ant-design-vue

- 引入组件，全局注册

- main.js

  - import Antd from "ant-design-vue";
  - Vue.use(Antd);

- 引入 antd 的样式

- main.js
  - import "ant-design-vue/dist/antd.less";
  - 注意：此时会报错，不能解析 less

> 此时延申的一个问题，我们自定义项目配置时，需要遵循 vue-cli 标准，所以我们去看一下 vue-cli 中怎么配置 less 的 loader

- 官网 https://cli.vuejs.org/
- 新建 vue.config.js 导出配置模块

> vue.config.js

```js
module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true // 重点是这句
      }
    }
  }
}

// 配置完需要重启，因为我们修改的是配置
// 至此，我们可以全局使用antd组件了
```

# 配置 ant-design-vue 按需加载

> 比如我们使用了 ant-design-vue 这个 ui 库，这个库本身体积很大，但我们项目中或许只用了 button，那么将所有的资源加载下来是很笨重的，但是每个地方用到了再去引入也很繁琐，所以我们采用按需加载策略

- 注意看官网：https://www.antdv.com/docs/vue/use-with-vue-cli-cn/
  - 高级配置部分
- 安装按需加载 babel

  - yarn add babel-plugin-import --dev

- 根据官网提示

> babel.config.js

```js
plugins: [
  [
    'import',
    { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true }
  ]
]
```

> main.js

```js
// 此时通过以上配置我们直接可以引入我们需要的组件类型
import { Button } from 'ant-design-vue'

// 修改了配置项，记得重启
```

# 如何设计高扩展性路由

> router>index.js

```js
    // 采用复合组合路由形式
    path: "/user",
    component: { render: h => h("router-view") }, // 重点解释这一句，这里通过render函数将路由页面渲染。
    // 但是思考问题，很多情况下登录页和注册页长得很像，那这公共的部分不想重复写的话怎么处理好？
    children: [
      {
        path: "/user/login",
        name: "login",
        component: () => {
          return import(
            /* webpackChunkName: "user" */ "../views/User/Login.vue" // 解释一下注释部分：说白了就是告诉webpack将这个代码打包到user代码块中，业务聚合
          );
        }
      },
      {
        path: "/user/register",
        name: "register",
        component: () => {
          return import(
            /* webpackChunkName: "user" */ "../views/User/Register.vue"
          );
        }
      }
    ]
  },

```

## 使用公共布局

-解决问题：解决背景公共布局的问题

- 例：
- 新建 layout 文件夹
- 新建 UserLayout.vue 文件

> UserLayout.vue

```js
<template>
  <div class="user-layout">
    <div class="desc">vue-public-ui</div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>
<style lang="less" scoped></style>

```

### 使用公共布局

> router>index.js

```js
    // 采用复合组合路由形式
    path: "/user",
    component: () => {
          return import(
            /* webpackChunkName: "user" */ "../Layout/UserLayout.vue" //使用布局也
          );
        },
    children: [
      {
        path: "/user/login",
        name: "login",
        component: () => {
          return import(
            /* webpackChunkName: "user" */ "../views/User/Login.vue" // 解释一下注释部分：说白了就是告诉webpack将这个代码打包到user代码块中，业务聚合
          );
        }
      },
      {
        path: "/user/register",
        name: "register",
        component: () => {
          return import(
            /* webpackChunkName: "user" */ "../views/User/Register.vue"
          );
        }
      }
    ]
  },

```

# 页面重定向问题

- 解决问题：比如上面的页面，我们使用嵌套路由，那如果用户输入 user 呢？
- 简单，重定向到 login 页面或者你想要的其他的页面

```js
    // 采用复合组合路由形式
    path: "/user",
    component: () => {
          return import(
            /* webpackChunkName: "user" */ "../Layout/UserLayout.vue" //使用布局也
          );
        },
    children: [
      {
       path:"/user",
       retdirect:'/user/login' // 页面重定向
      },
      {
        path: "/user/login",
        name: "login",
        component: () => {
          return import(
            /* webpackChunkName: "user" */ "../views/User/Login.vue" // 解释一下注释部分：说白了就是告诉webpack将这个代码打包到user代码块中，业务聚合
          );
        }
      },
      {
        path: "/user/register",
        name: "register",
        component: () => {
          return import(
            /* webpackChunkName: "user" */ "../views/User/Register.vue"
          );
        }
      }
    ]
  },

```

# 404 页面配置

- 解决问题:你不能保证覆盖所有路由，所以需要在不存在的路由时，用 404 提高体验度

> router>index.js

```js
 import NotFond from "@/views/404";
  // 404页面
  {
    path: "*",
    name: "404",
    component: NotFond
  }
```

# 使用 NProgress 进度条提高页面交互体验

- NProgress 加载进度条
  - 使用步骤：
    - 安装：yarn add nprogress
    - import NProgress from "nprogress";
    - import "nprogress/nprogress.css";

# 路由守卫

- 所谓的路由守卫就是 vue-router 暴露出来的一个钩子函数，用来在切换路由时执行
  > router>index.js

```js
router.beforeEach((to, from, next) => {
  // 路由切换时，出现进度条，提高交互体验
  NProgress.start()
  next()
})
router.afterEach((to, from, next) => {
  NProgress.done()
  next()
})
```

# 使用 Atd-vue 布局

- 查看 atd 文档，找到符合我们理想布局的样式，粘贴代码到 BasicLayput.vue
- 在 Main.js 中注册 Layout 组件
- 根据 api 可以自由配置样式，如菜单栏收放的功能
- 自行研究官方文档去

# Tips Antd 代码提示小技巧

vsCode-> 应用商店-> Ant Deisign Vue helper

# 页面风格设置抽屉

- 解决的问题
  - 点击按钮，页面窗口右侧弹出主题选择项
- 使用步骤

  - Antd 选抽屉组件
  - component 中新建 SettingDrawer 组件，将 Antd 的组件复制进去
  - 在 layout->baseicLayout 中引入 SettingDrawer 组件
  - 如果报错，没有注册某组件，那就回到 main.js 中统一引入，全局注册即可

## 修改抽屉入口按钮

- 删掉按钮和多余的方法
- 添加一个插槽

```js
     // 根据文档插槽指向handle
     <template v-slot:handle>
     <div class="handle" @click="visible = !visible">
       // 使用一个icon作为标志
       <a-icon :type="visible ? 'close' : 'setting'"></a-icon>
     </div>
   </template>
```

- 修改插槽标记的样式

```css
.handle {
  position: absolute;
  top: 300px;
  right: 268px;
  background-color: saddlebrown;
  height: 40px;
  width: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #1890ff;
  border-radius: 5px;
  color: white;
}
```

# 设计主题

- components->SettingDrawer->index.vue

```html
<a-drawer
  :placement="placement"
  :closable="false"
  @close="onClose"
  :visible="visible"
>
  <template v-slot:handle>
    <div class="handle" @click="visible = !visible">
      <a-icon :type="visible ? 'close' : 'setting'"></a-icon>
    </div>
  </template>
  <!-- 呈现 -->
  <div>
    <h2>整体风格设置</h2>
    <a-radio-group
      @change="e => handleSettingChange('navTheme', e.target.value)"
      :value="this.$route.query.navTheme || 'dark'"
    >
      <a-radio value="dark">黑色</a-radio>
      <a-radio value="white">白色</a-radio>
    </a-radio-group>
    <h2>导航模式</h2>
    <a-radio-group
      @change="e => handleSettingChange('navLayout', e.target.value)"
      :value="this.$route.query.navLayout || 'left'"
    >
      <a-radio value="left">左侧</a-radio>
      <a-radio value="top">顶部</a-radio>
    </a-radio-group>
  </div>
</a-drawer>
```

```js
    handleSettingChange(type, value) {
      console.log('类型', type)
      console.log('类型', value)
      this.$router.push({ query: { ...this.$route.query, [type]: value } }) // 通知路由风格设计
    }
```

## 设置全局风格

- Layouts->BasicLayout.vue

  - 新增计算属性

  ```js
    // 通过路由来判断用户设置的全局皮肤数据
    computed: {
     navTheme() {
     return this.$route.query.navTheme || 'dark'
     },
   navLayout() {
     return this.$route.query.navLayout || 'left'
   }
  }
  ```

  - 布局页最外层设置全局皮肤

  ```html
  <template>
    <!-- 这里使用模板字符串这个要根据计算数据的值进行切换 -->
    <div :class="[`nav-theme-${navTheme}`, `nav-layout-${navLayout}`]"></div>
  </template>
  ```

  - 设置侧边栏的样式

  ```html
  <a-layout-sider
    :theme="navTheme"
    v-if="navLayout === 'left'"
    :trigger="null"
    collapsible
    v-model="collapsed"
  >
  </a-layout-sider>
  ```

  - 设置 logo 基本样式

  ```javascript
  // 确保在切换主题的时候，文字相关的可以不受影响
  .nav-theme-dark .logo {
    color: #ffffff;
  }
  ```

  ## 去掉切换主题时的进度条

  - 切换主题还是路由的变换
  - router->index

  ```javascript
  // 路由守卫
  const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })

  router.beforeEach((to, from, next) => {
    // 只有在路由地址发生变化时触发进度条
    if (to.path != from.path) {
      NProgress.start()
    }
    next()
  })
  router.afterEach(() => {
    NProgress.done()
  })
  ```

# 设计左侧菜单和路由的关系

**注意了:左侧菜单往往跟当前 fu 登陆者的权限有关系，这一类数据可能是后端返回的，可能是多级的关系，那么就要用到递归的方式，所以我们用 Antd 中‘单文件递归菜单’**

- layouts->SiderMenu.vue
- 递归当前 Antd 版本-1.5.0-rc.5 版本
- 你会发现你复制过来的代码有点乱，还报错，还可能看不大懂对吗?
- 因为这个代码中包含了左侧菜单的样式，还有一个递归项：SubMenu
- 索性咱们将 SubMenu 抽离出来做一个递归组件，于是呢，你就再 layouts 下面新建 SubMenu.vue，代码应该是这样的

```html
<template functional>
  <a-sub-menu :key="props.menuInfo.key">
    <span slot="title">
      <a-icon type="mail" /><span>{{ props.menuInfo.title }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="!item.children" :key="item.key">
        <a-icon type="pie-chart" />
        <span>{{ item.title }}</span>
      </a-menu-item>
      <sub-menu v-else :key="item.key" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>
```

```js
<script>
export default {
  props: ['menuInfo'],
  name: 'SubMenu',
  // must add isSubMenu: true
  isSubMenu: true
}
</script>

```

- 于是乎呢，拆解之后你的 SiderMenu 应该是这个样子的

```html
<template>
  <div style="width: 256px">
    <a-button
      type="primary"
      @click="toggleCollapsed"
      style="margin-bottom: 16px"
    >
      <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
    </a-button>
    <a-menu
      :defaultSelectedKeys="['1']"
      :defaultOpenKeys="['2']"
      mode="inline"
      theme="dark"
      :inlineCollapsed="collapsed"
    >
      <template v-for="item in list">
        <a-menu-item v-if="!item.children" :key="item.key">
          <a-icon type="pie-chart" />
          <span>{{ item.title }}</span>
        </a-menu-item>
        <sub-menu v-else :menu-info="item" :key="item.key" />
      </template>
    </a-menu>
  </div>
</template>
```

```js
<script>
// 这个就是你新建的递归组件

import SubMenu from './SubMenu'
export default {
  components: {
    SubMenu
  },
  data() {
    return {
      collapsed: false,
      list: [
        {
          key: '1',
          title: 'Option 1'
        },
        {
          key: '2',
          title: 'Navigation 2',
          children: [
            {
              key: '2.1',
              title: 'Navigation 3',
              children: [{ key: '2.1.1', title: 'Option 2.1.1' }]
            }
          ]
        }
      ]
    }
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed
    }
  }
}
</script>
```

- 至此呢，你的左侧菜单就出来了，剩下的调整样式

  - 是不是宽了？ - 改啊,将 SliderMenu 宽度跟左侧布局的宽度调整一样

    - SliderMenu.vue

    ```html
    <template>
      <div style="width: 256px"></div>
    </template>
    ```

    - BasicLayout.vue

    ```html
      <a-layout-sider
       :theme="navTheme"
       v-if="navLayout === 'left'"
       :trigger="null"
       collapsible
       v-model="collapsed"
       width="256px"  // 改成一个宽度即可
     >
     </a-layout-sider>
    ```

- 到这你的左侧菜单就出来了
- 但是你发现切换主题颜色时，左侧 menu 没有颜色变化，我们要修改成同步的
- SliderMenu

```html
<a-menu :defaultSelectedKeys="['1']" :defaultOpenKeys="['2']" mode="inline"
:theme="theme" // 改成动态的 :inlineCollapsed="collapsed" >
```

```js
  props: {
    theme: {
      type: String,
      default: 'dark' // 默认黑色
    }
  },
```

- BasicLayout.vue

```html
<!-- 将当前页面切换的皮肤传进去 -->
<SiderMenu :theme="navTheme" />
```

## 将我们需要的真实路由渲染到菜单上，实现菜单控制路由

- router->index.js

  - 注意：菜单应该是我登陆之后需要使用的一些功能页面的连接目录，我们希望通过点击菜单目录切换页面，所以有些路由我们不需要渲染到菜单列表中去

    - 比如：登陆页面，渲染到菜单上没意义，我们不需要那么怎么办呢？
    - **约定一：添加一个排除渲染的标签，比如叫：hideInMenu 属性**

    ```js
        path: '/user',
          hideInMenu: true, // 添加一个不渲染的标识符
        component: () => {
        return import(/* webpackChunkName: "user" */ '../layouts/UserLayout.vue')
       }

    ```

    - **约定二：我们之渲染带 name 属性的路由**
    - **约定三：同级路由下的分步展示，比如分步表单，只是步骤的切换，而不是页面切换时，这种情况也不渲染 menu，比如：hideChildrenInMenu: true**

    ```js
     {
            path: '/form/step-form',
            name: 'stepform',
            hideChildrenInMenu: true, // 注意看这里，分布操作时我们需要处理，子代路由不渲染
            meta: { title: '分布表单' },
            component: () =>
              import(/* webpackChunkName: "form" */ '../views/Forms/StepForm'),
            children: [
              {
    ```

### 除此之外了，我们希望有菜单名称和 icon

```js
        path: '/dashboard',
        name: 'dashboard',
        meta: { icon: 'dashboard', title: '仪表盘' }, // 给你需要渲染的menu自定义一个对象用来渲染名称和icon
        component: { render: h => h('router-view') },
```

### 接下来我们就要将规定好的路由渲染到 menu 上去了

- SiderMenu.vue
  - 将原有默认的 list 干掉
  ```js
    // 通过路由对象获取所有的路由信息
    let menuData = this.getMenuData(this.$router.options.routes)

   getMenuData(routes) {
     // 递归的方式获取路由列表，筛选出我们索要呈现的列表
     const menuData = []
     routes.forEach(item => {
       if (item.name && !item.hideInMenu) {
         const newItem = { ...item }
         delete newItem.children
         if (item.children && !item.hideChildrenInMenu) {
           newItem.children = this.getMenuData(item.children)
         }
         menuData.push(newItem)
       } else if (
         !item.hideInMenu &&
         !item.hideChildrenInMenu &&
         item.children
       ) {
         menuData.push(...this.getMenuData(item.children))
       }
       console.log('去你吗的', menuData)
     })
     return menuData
   }
   // 最后将list替换成menuData
  ```
- 修改模板

```html
<template>
  <div style="width: 256px">
    <a-menu
      :defaultSelectedKeys="['1']"
      :defaultOpenKeys="['2']"
      mode="inline"
      :theme="theme"
      :inlineCollapsed="collapsed"
    >
      <!-- 将list改成menuData改成我们要的数据 -->
      <template v-for="item in menuData">
        <a-menu-item v-if="!item.children" :key="item.path">
          <a-icon v-if="item.meta.icon" :type="item.meta.icon" />
          <span>{{ item.meta.title }}</span>
        </a-menu-item>
        <sub-menu v-else :menu-info="item" :key="item.path" />
      </template>
    </a-menu>
  </div>
</template>
```

- 修改 SubMenu.vue

```html
<template functional>
  <a-sub-menu :key="props.menuInfo.path">
    <span slot="title">
      <a-icon
        v-if="props.menuInfo.meta.icon"
        :type="props.menuInfo.meta.icon"
      /><span>{{ props.menuInfo.meta.title }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="!item.children" :key="item.key">
        <a-icon v-if="item.meta.icon" :type="item.meta.icon" />
        <span>{{ item.meta.title }}</span>
      </a-menu-item>
      <sub-menu v-else :key="item.path" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>
<script>
  export default {
    props: ['menuInfo'],
    name: 'SubMenu',
    // must add isSubMenu: true
    isSubMenu: true
  }
</script>
```
