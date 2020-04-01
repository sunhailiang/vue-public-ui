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

### 接下来我们就要将规定好的路由信息渲染到 menu 上去了

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

### 点击菜单跳转路由

- SiderMenu.vue
  - 外层路由链接

```html
<template>
  <div style="width: 256px">
    <a-menu
      :selectedKeys="selectedKeys"
      :openKeys.sync="openKeys"
      mode="inline"
      :theme="theme"
    >
      <template v-for="item in menuData">
        <!-- 给每一个menu绑定一个点击事件，切换路由：看click事件 -->
        <!-- 注意了：这里只是最外层链接哦,那如果路由曾经很多怎么办呢？是不是想到递归 -->
        <a-menu-item
          v-if="!item.children"
          :key="item.path"
          @click="
            () =>
              this.$router.push({ path: item.path, query: this.$router.query })  
          "
        >
          <a-icon v-if="item.meta.icon" :type="item.meta.icon" />
          <span>{{ item.meta.title }}</span>
        </a-menu-item>
        <sub-menu v-else :menu-info="item" :key="item.path" />
      </template>
    </a-menu>
  </div>
</template>
```

```js
<script>
import SubMenu from './SubMenu'
export default {
  components: {
    SubMenu
  },
  props: {
    theme: {
      type: String,
      default: 'dark'
    }
  },
  data() {
    this.selectedKeysMap = {}
    this.openKeysMap = {}
    let menuData = this.getMenuData(this.$router.options.routes)
    return {
      menuData,
      collapsed: false,
      selectedKeys: this.selectedKeysMap[this.$route.path],
      openKeys: this.collapsed ? [] : this.openKeysMap[this.$route.path]
    }
  },
  watch: {
    '$route.path': function(val) {
      // 同步观察路由变换实时更新
      this.selectedKeys = this.selectedKeysMap[val]
      this.openKeys = this.collapsed ? [] : this.openKeysMap[val]
    }
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed
    },
    getMenuData(routes = [], parentKeys = [], selectedKey) {
      // 递归的方式获取路由列表，筛选出我们索要呈现的列表
      const menuData = []
      routes.forEach(item => {
        if (item.name && !item.hideInMenu) {
          // 过滤只有带name的属性的路由信息和非隐藏路由
          this.openKeysMap[item.path] = parentKeys
          this.selectedKeysMap[item.path] = [item.path || selectedKey]

          const newItem = { ...item }
          delete newItem.children
          if (item.children && !item.hideChildrenInMenu) {
            // 如果存在子项，就继续递归子项-解决多级路由的问题
            newItem.children = this.getMenuData(item.children, [
              ...parentKeys,
              item.path
            ])
          } else {
            this.getMenuData(
              item.children,
              selectedKey ? parentKeys : [...parentKeys, item.path], // 解释这一步，这个解决什么呢，比如分布表单，我们点击步骤，不能按步骤跳吧，是他的父级路由才会发生跳转，所以呢，我们找他的父级路由作为跳转对象
              selectedKey || item.path
            )
          }
          menuData.push(newItem)
        } else if (
          !item.hideInMenu &&
          !item.hideChildrenInMenu &&
          item.children
        ) {
          menuData.push(
            ...this.getMenuData(item.children, [...parentKeys, item.path])
          )
        }
      })
      return menuData
    }
  }
}
</script>
```

- SubMenu.vue
  - 循环多层路由链接

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
      <a-menu-item
        v-if="!item.children"
        :key="item.path"
        @click=" 
          () =>
            parent.$router.push({
              path: item.path,
              query: parent.$router.query
            })
        "
      >
        <a-icon v-if="item.meta.icon" :type="item.meta.icon" />
        <span>{{ item.meta.title }}</span>
      </a-menu-item>
      <sub-menu v-else :key="item.path" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>
```

# 路由权限管理

- 根据用户权限，来渲染路由列表，达到权限控制的目的
- 新建 anth 文件夹
- auth->index.js

```js
// 获取权限
export function getCurrentAuthority() {
  // 这里返回的权限应该是从后端读取回来的，此时用admin替代
  return ['admin']
}

// 鉴权
export function check(authority) {
  const current = getCurrentAuthority()
  return current.some(item => authority.includes(item))
}

// 判断是否登陆
export function isLogin() {
  const current = getCurrentAuthority()
  return current && current[0] !== 'guest'
}
```

- 接下来去判断用户是否具有路由权限
  - 1、给路由添加 authority 范围
  - 2、在路由守卫中做统一处理
- router->index.js
- 在每个路由的 meta 对象中新增 authority 属性，然后 authority 的值就是权限类型
- 如：

```js
{
    path: "/",
    meta:{authority:['user','admin']}, // 约定只有user和admin才能访问
}
```

- 在比如：

```js
  {
        path: '/form',
        name: 'form',
        component: { render: h => h('router-view') },
        meta: { icon: 'form', title: '表单', authority: ['admin'] }, // 约定表单只有admin才能访问
        redirect: '/form/basic-form'
  }
```

- 普及一个新的知识点：lodash.js
  - 这是个什么玩意儿呢？你可以理解成代码兵器库，what？，类似于 jquery 一样，用原生的 js 写出了很多趁手的常用的方法，供我们使用，很神奇，很高效哦~
- 为了方便咱们开发我们可以引入这个库

  - npm i --save lodash
  - https://www.lodashjs.com/docs/lodash.concat

- 使用 lodash import findLast from 'lodash/findLast' 引入即可
- 引入权限控制的文件

  - import { check, isLogin } from '@/auth/index'

- router->index

```js
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
  const record = findLast(to.matched, record => record.meta.authority)
  if (record && !check(record.meta.authority)) {
    // 如果没有权限
    // 再次判断是否登陆了
    if (!isLogin() && to.path !== '/user/login') {
      //登陆直接跳到登录页页面
      next({
        path: '/user/login'
      })
    } else if (to.path !== '/403') {
      // 如果权限不够直接去403，需要去新建一个403的页面和路由
      next({
        path: '/403'
      })
    }
    nProgress.done()
  }
  next()
})
router.afterEach(() => {
  NProgress.done()
})

export default router
```

- 新增一个 403

```js
  // 403页面
  {
    path: '/403',
    name: '403',
    component: Forbiden,
    hideInMenu: true
  },
```

- views->403.vue 新增一个页面
- 此时你去修改 auth->index.js 中的权限，比如把 admin，改成 user，你会发现，你的表单直接跳到 403，why？ 那是因为你去 router->index，看看你新增的 meta 的 authority,是不是限制了权限？这样就关联起来了，懂么？
- 但是此时依旧有一个问题，我们通常希望，没有权限的路由咱就直接不让你看见了对吧，所以要微调一下，既然你要控制菜单渲染，就要回到菜单中去 SiderMenu.vue

```js
    // 引入权限校验的类库
    import { check } from '@/auth/index'
    getMenuData(routes = [], parentKeys = [], selectedKey) {
      // 递归的方式获取路由列表，筛选出我们索要呈现的列表
      const menuData = []
      routes.forEach(item => {
        // 注意这里：这里就是如果权限不够呢，直接阻止列表渲染
        if (item.meta && item.meta.authority && !check(item.meta.authority)) {
          return false
        }
        if (item.name && !item.hideInMenu) {
          // 过滤只有带name的属性的路由信息和非隐藏路由
          this.openKeysMap[item.path] = parentKeys
          this.selectedKeysMap[item.path] = [item.path || selectedKey]

          const newItem = { ...item }
          delete newItem.children
          if (item.children && !item.hideChildrenInMenu) {
            // 如果存在子项，就继续递归子项
            newItem.children = this.getMenuData(item.children, [
              ...parentKeys,
              item.path
            ])
          } else {
            this.getMenuData(
              item.children,
              selectedKey ? parentKeys : [...parentKeys, item.path], // 解释这一步，这个解决什么呢，比如分布表单，我们点击步骤，不能按步骤跳吧，是他的父级路由才会发生跳转，所以呢，我们找他的父级路由作为跳转对象
              selectedKey || item.path
            )
          }
          menuData.push(newItem)
        } else if (
          !item.hideInMenu &&
          !item.hideChildrenInMenu &&
          item.children
        ) {
          menuData.push(
            ...this.getMenuData(item.children, [...parentKeys, item.path])
          )
        }
      })
      return menuData
    }
```

- 此时你去修改 auth->index 中的权限时，就会发现菜单列表不满足权限的都没有渲染

- 如果权限不够时，我希望有提示信息，于是乎呢，去 Antd 中找到 Notification 组件
  - 然后在 403 时做一个提示
- router->index

```js
    import { Notification } from 'ant-design-vue' // 引入组件

    } else if (to.path !== '/403') {
      // 如果权限不够直接去403，需要去新建一个403的页面和路由
      Notification.error({ // 做一个403全局提示
        message: '403',
        description: '没有访问权限，请联系管理员'
      })
```

# 精细化权限控制(权限组件)

- 权限组件

  - 我们采用函数式组件方式，这样性能更好，但是函数式组件跟 template 模板不是很友好，所以我们直接采用 render 方式渲染
  - components 新建 Authority 组件

  ```js
  <script>
  import { check } from "@/auth/index";
  import { constants } from "os";
  export default {
  functional: true,
  props: {
   authority: {
     type: Array,
     required: true
   }
  },
  // 解释一个函数式渲染，render函数有两个参数，一个式creatElement，包含了dom的信息，但是指向的是一个虚拟的dom
  // context 则包含了该实例对象的各种属性
  // 如果你用了权限校验的组件，那么将会做判断
  render(creatElement, context) {
   const { props, scopedSlots } = context; // 结构出参数和所有的插槽
   // 如果校验通过则执行该组件内部的插槽组件，否则怎么也不做
   return check(props.authority) ? scopedSlots.default() : null;
  }
  };
  </script>

  ```

- 既然是权限校验，那么在整个项目钟肯定会出现多次，所以我们注册成全局组件
  - main.js
  ```js
  // 引入权限组件
  import Authority from './components/Authority.vue'
  // 全局注册
  Vue.component('Authority', Authority)
  ```
- 此时经过测试
  - 如：全局样式的抽屉，只有 admin 才能操作设置
  - layouts->BasicLayout.vue
  ```html
  此时你会发现只有admin时抽屉参会展示
  <Authority :authority="['admin']">
    <SettingDrawer />
  </Authority>
  ```
- 至此：权限组件就 Ok 了

# 精细化权限控制(权限指令)

- 通过指令的方式来控制权限
- 新建指令仓库 directives 用来存放各种自定义指令
- directives->auth.js

```js
import { check } from '@/auth/index'
// 是否加载？
function auth(Vue, options = []) {
  Vue.directive(options.name || 'auth', {
    // 父级组件点调用时去判断
    inserted(el, binding) {
      // 如果传过来的值，没有通过校验就移除节点
      if (!check(binding.value)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  })
}
export default auth
```

- 然后去进行指令的全局注册
  - main.js

```js
// 引入指令
import auth from './directives/auth'
// 注册全局指令
Vue.use(auth)
```

- 测试

  - layouts->BasicLayout.vue

  ```js
        <a-layout-header style="background: #fff; padding: 0">
         <a-icon
           v-auth="['admin']"   // 使用组件，修改权限名称，此时会发现会权限不足就没法渲染
           class="trigger"
           :type="collapsed ? 'menu-unfold' : 'menu-fold'"
           @click="() => (collapsed = !collapsed)"
         />
         <Header />
       </a-layout-header>
  ```

- 至此我们通过路由，组件，指令三种方式来控制权限
- 注意：权限指令旨在第一次加载的时候有效果，如果动态的控制就会有问题
- 注意: 灵活度比较高，但是写法上稍微复杂度高一些

# 封装图表组件

- 我们选择免费的，功能比较多的 Echart,当然了你也可以选择 AntV,也有 highChart

  - 安装 echart: npm install echarts --save
  - 新建 chart 组件库：components->chart->Chart.vue

  ```js
  <template>
  <div ref="chart" style="width: 600px;height:400px;"></div>
  </template>
  <script>
  import echarts from 'echarts'
  export default {
  name: 'Chart',
  mounted() {
    var myChart = echarts.init(this.$refs.chart)
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  }
  }
  </script>
  <style lang="less" scoped></style>

  ```

  - 但是此时有些问题，就是这个组件的数据渲染的一些功能，有很多异步的操作，所以你想针对这个 dom 去操作时就会有问题，怎么办呢？
  - 推荐一个 vue 中监听 dom 元素大小的库
  - npm i --save resize-detector

  ```html
  <template>
    <div ref="chart" style="height:400px;"></div>
  </template>
  ```

  ```js
  import echarts from 'echarts'
  import { addListener, removeListener } from 'resize-detector'
  export default {
  name: 'Chart',
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    }
    // 使用刚指定的配置项和数据显示图表。
    this.chart.setOption(option)
    // 监听数据dom变化
    addListener(this.$refs.chart, this.resize)
  },
  methods: {
    resize() {
      console.log('变化了')

      this.chart.resize()
    },
    removeChart() {
      console.log('卸载')
    }
  },
  beforeDestroy() {
    // 卸载时移除监听事件
    removeListener(this.$refs.chart, this.removeChart)
    // 始放图表组件，防止内存泄漏
    this.chart.dispose()
    this.chart = null
  }
  }
  </script>
  ```

  - 现在你改变页面布局你会发现一个问题，元素变化确实收到了，但是你仔细看控制台，一次页面的布局大小的变化要触发好多次，resize 事件
  - 怎么解决这个问题？对！防抖函数！这样可以提升代码性能
  - 我们之前引入的 lodash，lodash 就有一个防抖函数 **debounce**

  ```js
  import { debounce } from 'lodash'
  // 在created中添加一个debounce防抖函数
    created() {
    this.resize = debounce(this.resize, 200)
  }
  ```

  - 此时你在打开页面改变页面布局大小，就会发现多次触发 resize 的事件不在了

  ## 封装成通用的图表组件

  - components->chart->Chart.vue

  ```js
  <script>
  import echarts from 'echarts'
  import { addListener, removeListener } from 'resize-detector'
  import { debounce } from 'lodash'
  export default {
  props: {// 关于图表的类型,咱们通过组件调用传参过来即可
    option: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.renderChar()
    // 监听数据dom变化
    addListener(this.$refs.chart, this.resize)
  },
  methods: {
    // 纯粹的自定义组件
    renderChar() {
      // 基于准备好的dom初始化chart示例
      this.chart = echarts.init(this.$refs.chart)
      this.chart.setOption(this.option)
    },
    resize() {
      console.log('变化了')
      this.chart.resize()
    }
  },
  watch: {
    option(val) {
      // 这样有一个问题：option没有变化，但是option中的data数组如果变了是监视不到的，怎么办呢？用深度监听？
      this.chart.setOption(val)
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
    removeListener(this.$refs.chart, this.resize)
    // 始放图表组件，防止内存泄漏
    this.chart.dispose()
    this.chart = null
  },
  created() {
    this.resize = debounce(this.resize, 200)
  }
  }
  </script>
  ```

  - Analysis.vue

  ```html
  <div><Chart :option="opitons" style="height:400px" /></div>
  ```

  ```js
  <script>
  // 引入公共的图表组件
  import Chart from '@/components/chart/Chart'
  // 使用随机数
  import { random } from 'lodash'
  export default {
  data() {
    return {
      // 指定图表的配置s项和数据
      fuck: 'FUCK',
      opitons: {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }
    }
  },
  mounted() {
    setInterval(() => {
      this.opitons.series[0].data = this.opitons.series[0].data.map(() =>
        random(100)
      )
      // 重新赋值,是要数据发生变化就更新数据
      this.opitons = { ...this.opitons }
    }, 800)
  },
  components: {
    Chart
   }
  }
  </script>
  ```

# 前后分离之 MOCK 数据

- 就当前来看，项目开发中依旧推崇前后分离，也就是其实前端后端在最开始碰需求的时候，只要把数据结构和字段名称等等信息约定好以后，大家各自开发自己的
- 前后端并行，这样能提高开发效率，那么此时前端想模拟数据接口怎么办？是不是要跟后端要？
- 不！其实我们最开始已经约定数据结构和字段类型等等信息，那么我们可以通过 mock 的方式模拟接口，这样子，等到前后端对接数据的时候我们只要换掉接口即可立马打通数据

> 安装 axios->cnpm i axios
> 新建 service 文件夹->mock->index.js

- Analysis.vue

  1. 引入 axios
  2. 写请求数据的方法

  ```js
  // 引入axios
  import axios from 'axios'
    mounted() {
   // 调用mock接口
   this.getCharData()

   setInterval(() => {
     this.getCharData()
     // this.opitons.series[0].data = this.opitons.series[0].data.map(() =>
     //   random(100)
     // )
     // // 重新赋值,是要数据发生变化就更新数据
     // this.opitons = { ...this.opitons }
   }, 800)
  },
   methods: {
    // 模拟mock数据
    getCharData() {
      axios
        .get('/service/mock/chartData', { params: { ID: 12346 } })
        .then(res => {
          this.opitons = {
            title: {
              text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
              data: ['销量']
            },
            xAxis: {
              data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            },
            yAxis: {},
            series: [
              {
                name: '销量',
                type: 'bar',
                data: res.data
              }
            ]
          }
        })
    }
  },
  ```

  > service->mock->index

  ```js
  function chartData(method) {
    let res = null
    switch (method) {
      case 'GET':
        res = [200, 40, 44, 12, 34, 200]
        break
      default:
        res = null
    }
    return res
  }

  module.exports = { chartData }
  ```

> 配置 webpack->vue.config.js

- devServer
- https://webpack.js.org/configuration/dev-server/#devserverproxy

```js
  devServer: {
    proxy: {
      '/service': {
        target: 'http://localhost:3000',
        bypass: function(req, res) {
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.')
            return '/index.html'
          } else {
            const name = req.path.split('/')[3]
            const mock = require(`./service/mock/index`)[name]
            const result = mock(req.method)
            delete require.cache[require.resolve(`./service/mock/index`)] //清除缓存这样，每次你只要一修改mock数据页面及时刷新
            return res.send(result)
          }
        }
      }
    }
  }
```

- 但是此时还有一个问题，就是如果你改了 mock 数据，页面并不会立马更新，因为有缓存,

```js
delete require.cache[require.r
esolve(`./service/mock/index`)] //清除缓存这样，每次你只要一修改mock数据页面及时刷新
```

# 与服务端发生交互快速切换 mock 和正式环境

- 说白了这一步就是区分一下环境变量，根据设置不同的环境变量来区分环境
- package.json
- 新增一个命令，设置 mock 环境标志，这样运行时就是 mock 状态
- 先安装 cnpm i cross-env 运行跨平台设置和使用环境变量的脚本

```js
  "scripts": {
    "serve": "vue-cli-service serve",
    // 新增serve:mock命令此时就会将MOCK设置成环境变量cross-env设置跨平台环境变量设置
    "serve:mock": "cross-env MOCK=true vue-cli-service serve",
    "build": "vue-cli-service build",
    "test:unit": "vue-cli-service test:unit",
    "lint": "vue-cli-service lint"
  },
```

- vue.config.js
- 根据环境变量来切换是否走 mock 接口

```js
  devServer: {
    proxy: {
      "/service": {
        target: "http://localhost:3000",
        bypass: function(req, res) {
          if (req.headers.accept.indexOf("html") !== -1) {
            console.log("Skipping proxy for browser request.");
            return "/index.html";
          } else if(process.env.MOCK==='true') { // 通过环境变量来执行下面mock代理
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
```

# 统一管理接口，二次封装请求文件

- 新建 utils 工具箱
- utils 里面新建 request.js 文件用封装 axios

```js
import axios from 'axios'
import { Notification } from 'ant-design-vue'

function request(options) {
  return axios(options)
    .then(res => {
      return res
    })
    .catch(error => {
      const {
        response: { status, statusText }
      } = error
      // 请求失败提醒
      Notification.error({
        message: status,
        description: statusText
      })
      // 返回reject的好处就是你在使用的时候，直接通过catch去捕捉，不会在进入then里面让你处理相关逻辑
      return Promise.reject(error)
    })
}
export default request
```

- 回到 Analysis.vue 中

```js
// 引入封装好的方法
import request from '@/utils/request'
  methods: {
    // 模拟mock数据
    getCharData() {
      // 使用该方法
      request({
        url: '/service/mock/chartData',
        method: 'get',
        params: { ID: 12346 }
      }).then(res => {
        this.opitons = {
          title: {
            text: 'ECharts 入门示例'
          },
          tooltip: {},
          legend: {
            data: ['销量']
          },
          xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          },
          yAxis: {},
          series: [
            {
              name: '销量',
              type: 'bar',
              data: res.data
            }
          ]
        }
      })
    }
  },
```

- 此时呢你运行页面你会发现，数据请求成功，如果你改变请求地址，你还会发现错误信息提醒
- 如果只不过呢，有一个问题如果我想给提示信息写一些特殊的样式怎么办？
- 很明显这个 js 文件没法写单文件组件，那么 render？还是 jsx？前者写法比较复杂，那么咱们引入 jsx 吧
  > 怎么用呢？ 看这：https://github.com/vuejs/jsx
  > npm install @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props
  > babel.config.js 添加配置

```js
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset', '@vue/babel-preset-jsx'] // 添加jsx配置
}
```

- request.js

```js
import axios from 'axios'
import { Notification } from 'ant-design-vue'

function request(options) {
  return axios(options)
    .then(res => {
      return res
    })
    .catch(error => {
      const {
        response: { status, statusText }
      } = error
      // 请求失败提醒
      Notification.error({
        // 注意了：下面的这句注释,是用来告诉eslint不用校验了，否则h没使用过就会报错
        //eslint-disable-next-line no-unused-vars
        message: h => (
          // 注意看这里：咱们就可以使用jsx语法定义想要的样式了
          <div>
            请求错误：<span style="color:red">{status}</span>
            <br />
            {options.url}
          </div>
        ),
        description: statusText
      })
      // 返回reject的好处就是你在使用的时候，直接通过catch去捕捉，不会在进入then里面让你处理相关逻辑
      return Promise.reject(error)
    })
}

export default request
```

# 关于表单和表单校验（Antd）

- 最简单粗暴的方式
- 去 antd 复制粘贴一个基础表单出来
- Forms->BasicForm.vue
- 应该是这样的

```html
<template>
  <a-form :layout="formLayout">
    <a-form-item
      label="Form Layout"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
    >
      <a-radio-group
        default-value="horizontal"
        @change="handleFormLayoutChange"
      >
        <a-radio-button value="horizontal">
          Horizontal
        </a-radio-button>
        <a-radio-button value="vertical">
          Vertical
        </a-radio-button>
        <a-radio-button value="inline">
          Inline
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      label="Field A"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
    >
      <a-input placeholder="input placeholder" />
    </a-form-item>
    <a-form-item
      label="Field B"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
    >
      <a-input placeholder="input placeholder" />
    </a-form-item>
    <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
      <a-button type="primary">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>
```

```js
<script>
export default {
  data() {
    return {
      formLayout: 'horizontal'
    }
  },
  computed: {
    formItemLayout() {
      const { formLayout } = this
      return formLayout === 'horizontal'
        ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 }
          }
        : {}
    },
    buttonItemLayout() {
      const { formLayout } = this
      return formLayout === 'horizontal'
        ? {
            wrapperCol: { span: 14, offset: 4 }
          }
        : {}
    }
  },
  methods: {
    handleFormLayoutChange(e) {
      this.formLayout = e.target.value
    }
  }
}
</script>

```

- 接下来我们去自定义校验
- 刚好 antd 也提供了自定义校验的东西

```js
// 你看官方提供了这么写属性供咱们使用
validateStatus: 校验状态，可选 ‘success’, ‘warning’, ‘error’, ‘validating’。
hasFeedback：用于给输入框添加反馈图标。
help：设置校验文案
```

> 注意了：我们根据官方提供的这些属性改造一下表单校验

```html
<template>
  <a-form :layout="formLayout">
    <a-form-item
      label="Form Layout"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
    >
      <a-radio-group
        default-value="horizontal"
        @change="handleFormLayoutChange"
      >
        <a-radio-button value="horizontal">
          Horizontal
        </a-radio-button>
        <a-radio-button value="vertical">
          Vertical
        </a-radio-button>
        <a-radio-button value="inline">
          Inline
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      label="姓名"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      :validateStatus="userErrorStatus"
      :help="userHelpText"
    >
      <a-input placeholder="请输入用户名称" v-model="userName" />
    </a-form-item>
    <a-form-item
      label="手机"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      :validateStatus="phoneErrorStatus"
      :help="phoneHelpText"
    >
      <a-input type="number" placeholder="请输入手机号码" v-model="phone" />
    </a-form-item>
    <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
      <a-button type="primary" @click="submitHandle">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>
```

```js
<script>
export default {
  data() {
    return {
      userErrorStatus: '',
      userHelpText: '',
      phoneErrorStatus: '',
      phoneHelpText: '',
      userName: '',
      phone: '',
      formLayout: 'horizontal'
    }
  },
  watch: {
    // 监听校验
    userName(val) {
      if (val.length < 2) {
        ;(this.userErrorStatus = 'error'),
          (this.userHelpText = '昵称长度不得少于两位')
      } else {
        ;(this.userErrorStatus = ''), (this.userHelpText = '')
      }
    },
    phone(val) {
      if (val.length < 11) {
        ;(this.phoneErrorStatus = 'error'),
          (this.phoneHelpText = '手机不得少于11位')
      } else {
        ;(this.phoneErrorStatus = ''), (this.phoneHelpText = '')
      }
    }
  },
  computed: {
    formItemLayout() {
      const { formLayout } = this
      return formLayout === 'horizontal'
        ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 }
          }
        : {}
    },
    buttonItemLayout() {
      const { formLayout } = this
      return formLayout === 'horizontal'
        ? {
            wrapperCol: { span: 14, offset: 4 }
          }
        : {}
    }
  },
  methods: {
       // 提交校验
    submitHandle() {
      if (this.userName.length < 2) {
        ;(this.userErrorStatus = 'error'),
          (this.userHelpText = '昵称长度不得少于两位')
        return
      }
      if (this.phone.length < 11) {
        ;(this.phoneErrorStatus = 'error'),
          (this.phoneHelpText = '手机不得少于11位')
        return
      }
    },
    handleFormLayoutChange(e) {
      this.formLayout = e.target.value
    }
  }
}
</script>

```

- 嗯...看起来没什么问题，好像实现了~但是是不是有点繁琐了？？？？很明显不够人性，智能化，如果是个大表单，有的忙了~
- 不写了，自己去 Antd 看官方的动态校验规则（仔细研究文档，一切答案都有）

# 复杂的分布表单

- 结合 vuex
- store 中新建 moudles->form.js
- 看上源码三个地方
- store->moudles->form
- store-> index
- componens->ReceiverAccount.vue
- views->Dashboard->Forms->Step1~
  如果你看不懂，你就留言给我，我带你看~关于组件的使用

# 关于项目中图标的管理

- 添加项目需要用的 iconfont
  去阿里矢量图库->图标管理->我的项目->新建项目

## 关于 iconfont 的使用

- 已阿里 icon 库为例：https://www.iconfont.cn/
- 这是本地化操作
  - 去 icon 官网找到适合的 iconfont
  - 添加到购物车
  - 将购物车中的要用的 icon 添加到项目
  - 下载到本地
  - 解压文件夹，将所有的字体文件和 iconfont.css 分别放到资源文件夹下
  - 修改 iconfont.css 中字体路径
  - 删除默认图标，直接使用 64 位或者 16 进制
  - main.js 中引入 iconfont.css
- 这是使用 cdn 的方式

  - 将你需要的 icon 选中添加购物车
  - 将购物车内的 icon 添加到项目
  - 选择 Symbol 类型
  - 查看在线链接
  - 去 main.js

  ```js
  // 使用Icon
  import { Icon } from 'ant-design-vue'
  // 将cdn地址换成阿里图标我们的地址
  const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1729142_92zhgmdrlj8.js'
  })
  // 全局注册
  Vue.component('IconFont', IconFont)
  ```

- 然后你可以选择在任何地方使用这个图片，这个 type 就是你图标库中的图标的名称
- **注意：你可以改图标库中的名称等信息，但是你改完之后，会重新生成一个地址，你只要把那个地址重新覆盖到我们本地项目中就行了**
- 我使用了 404 的图标放在 404 页面，你可以去看

```html
<IconFont type="iconicon-404"></IconFont>
```

## 特殊 ICon

- 以上呢是现有满足我们的 icon，那如果我们设计师给我们特殊的 icon 呢?
- 假设你已经拿到设计师设计好的 SVG 文件
- 你可以直接引入这个 svg，然后给 img 的 src 属性就行了
- 这里我们采用**组件式的 SVG** 更加方便一点，何为组件式？意思是一旦这样配置之后，我们将会向用组件一样用 SVG
- 首先我们需要去 vue.config.js 中添加一个**vue-svg-loader**配置,如果没有需要安装一下
- vue.config.js

```js
chainWebpack: config => {
  const svgRule = config.module.rule('svg')

  // 清除已有的所有 loader。
  // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
  svgRule.uses.clear()

  // 添加要替换的 loader
  svgRule.use('vue-svg-loader').loader('vue-svg-loader')
}
```

- 然后呢，你照常 import 这个 svg 就像这样
- 404 页面

```html
<template>
  <div style=" text-align:center">
    <!-- 看，当组件用了，是不是方便一些 -->
    <Man />
  </div>
</template>
```

```js
import Man from '@/assets/man.svg' // 注意哦，此时你引入的是一个组件哦，所以需要干啥子？没错就是要注册
export default {
  components: {
    // 注册组件
    Man
  }
}
```

# 如何查看你配置的 loader 等配置项呢？

- vue inspect > output.js
