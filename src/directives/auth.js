import { check } from "@/auth/index";
// 是否加载？
function auth(Vue, options = []) {
  Vue.directive(options.name || "auth", {
    // 父级组件点调用时去判断
    inserted(el, binding) {
      // 如果传过来的值，没有通过校验就移除节点
      if (!check(binding.value)) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    }
  });
}

export default auth;
