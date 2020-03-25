<template>
  <div>
    <a-drawer :placement="placement" :closable="false" :visible="visible">
      <template v-slot:handle>
        <div class="handle" @click="visible = !visible">
          <a-icon :type="visible ? 'close' : 'setting'"></a-icon>
        </div>
      </template>
      <div>
        <h2>整体风格设置</h2>
        <a-radio-group
          @change="e => handleSettingChange('navTheme', e.target.value)"
          :value="this.$route.query.navTheme || 'dark'"
        >
          <a-radio value="dark">黑色</a-radio>
          <a-radio value="light">白色</a-radio>
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
  </div>
</template>
<script>
export default {
  name: "SettingDrawer",
  data() {
    return {
      visible: false,
      placement: "right"
    };
  },
  methods: {
    handleSettingChange(type, value) {
      this.$router.push({ query: { ...this.$route.query, [type]: value } }); // 通知路由风格设计
    }
  }
};
</script>
<style lang="less" scoped>
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
</style>
