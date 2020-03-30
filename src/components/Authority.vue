<script>
import { check } from "@/auth/index";
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
