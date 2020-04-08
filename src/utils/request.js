import axios from "axios";
import { Notification } from "ant-design-vue";

function request(options) {
  return axios(options)
    .then(res => {
      return res;
    })
    .catch(error => {
      const {
        response: { status, statusText }
      } = error;
      // 请求失败提醒
      Notification.error({
        //eslint-disable-next-line no-unused-vars
        message: h => (
          <div>
            请求错误：<span style="color:red">{status}</span>
            <br />
            {options.url}
          </div>
        ),
        description: statusText
      });
      // 返回reject的好处就是你在使用的时候，直接通过catch去捕捉，不会在进入then里面让你处理相关逻辑
      return Promise.reject(error);
    });
}

export default request;
