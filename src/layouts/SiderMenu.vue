<template>
  <div style="width: 256px">
    <a-menu
      :selectedKeys="selectedKeys"
      :openKeys.sync="openKeys"
      mode="inline"
      :theme="theme"
    >
      <template v-for="item in menuData">
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

<script>
import SubMenu from "./SubMenu";
import { check } from "@/auth/index";
export default {
  components: {
    SubMenu
  },
  props: {
    theme: {
      type: String,
      default: "dark"
    }
  },
  data() {
    this.selectedKeysMap = {};
    this.openKeysMap = {};
    let menuData = this.getMenuData(this.$router.options.routes);
    return {
      menuData,
      collapsed: false,
      selectedKeys: this.selectedKeysMap[this.$route.path],
      openKeys: this.collapsed ? [] : this.openKeysMap[this.$route.path]
    };
  },
  watch: {
    "$route.path": function(val) {
      // 同步观察路由变换实时更新
      this.selectedKeys = this.selectedKeysMap[val];
      this.openKeys = this.collapsed ? [] : this.openKeysMap[val];
    }
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    getMenuData(routes = [], parentKeys = [], selectedKey) {
      // 递归的方式获取路由列表，筛选出我们索要呈现的列表
      const menuData = [];
      routes.forEach(item => {
        if (item.meta && item.meta.authority && !check(item.meta.authority)) {
          return false;
        }
        if (item.name && !item.hideInMenu) {
          // 过滤只有带name的属性的路由信息和非隐藏路由
          this.openKeysMap[item.path] = parentKeys;
          this.selectedKeysMap[item.path] = [item.path || selectedKey];

          const newItem = { ...item };
          delete newItem.children;
          if (item.children && !item.hideChildrenInMenu) {
            // 如果存在子项，就继续递归子项
            newItem.children = this.getMenuData(item.children, [
              ...parentKeys,
              item.path
            ]);
          } else {
            this.getMenuData(
              item.children,
              selectedKey ? parentKeys : [...parentKeys, item.path], // 解释这一步，这个解决什么呢，比如分布表单，我们点击步骤，不能按步骤跳吧，是他的父级路由才会发生跳转，所以呢，我们找他的父级路由作为跳转对象
              selectedKey || item.path
            );
          }
          menuData.push(newItem);
        } else if (
          !item.hideInMenu &&
          !item.hideChildrenInMenu &&
          item.children
        ) {
          menuData.push(
            ...this.getMenuData(item.children, [...parentKeys, item.path])
          );
        }
      });
      return menuData;
    }
  }
};
</script>
