import axios from "axios";
import { Notification } from "ant-design-vue";

function request(options) {
  return axios(options)
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log("有什么？", error);

      const {
        response: { status, statusText }
      } = error;
      // 请求失败提醒
      Notification.error({
        message: status,
        description: statusText
      });
      return Promise.reject(error);
    });
}

const install = Vue => {
  if (install.installed) return;
  install.installed = true;
  // 封装成插件
  Object.defineProperties(Vue.prototype, {
    $request: request()
  });
};

export default install;
