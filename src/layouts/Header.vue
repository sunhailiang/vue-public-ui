<template>
  <div class="header">
    <a-dropdown>
      <a class="ant-dropdown-link" @click="e => e.preventDefault()">
        <a-icon style="font-size:28px; margin-right:20px" type="global" />
      </a>
      <a-menu
        slot="overlay"
        @click="localeChange"
        :selectedKeys="[$route.query.locale || 'zhCN']"
      >
        <a-menu-item key="zhCN">
          <a href="javascript:;">中文</a>
        </a-menu-item>
        <a-menu-item key="enUS">
          <a href="javascript:;">English</a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    localeChange(obj) {
      this.$router.push({ query: { locale: obj.key } });
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  float: right;
}
</style>
