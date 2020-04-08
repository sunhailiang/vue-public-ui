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

<script>
export default {
  data() {
    return {
      userErrorStatus: "",
      userHelpText: "",
      phoneErrorStatus: "",
      phoneHelpText: "",
      userName: "",
      phone: "",
      formLayout: "horizontal"
    };
  },
  watch: {
    userName(val) {
      if (val.length < 2) {
        (this.userErrorStatus = "error"),
          (this.userHelpText = "昵称长度不得少于两位");
      } else {
        (this.userErrorStatus = ""), (this.userHelpText = "");
      }
    },
    phone(val) {
      if (val.length < 11) {
        (this.phoneErrorStatus = "error"),
          (this.phoneHelpText = "手机不得少于11位");
      } else {
        (this.phoneErrorStatus = ""), (this.phoneHelpText = "");
      }
    }
  },
  computed: {
    formItemLayout() {
      const { formLayout } = this;
      return formLayout === "horizontal"
        ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 }
          }
        : {};
    },
    buttonItemLayout() {
      const { formLayout } = this;
      return formLayout === "horizontal"
        ? {
            wrapperCol: { span: 14, offset: 4 }
          }
        : {};
    }
  },
  methods: {
    submitHandle() {
      if (this.userName.length < 2) {
        (this.userErrorStatus = "error"),
          (this.userHelpText = "昵称长度不得少于两位");
        return;
      }
      if (this.phone.length < 11) {
        (this.phoneErrorStatus = "error"),
          (this.phoneHelpText = "手机不得少于11位");
        return;
      }
    },
    handleFormLayoutChange(e) {
      this.formLayout = e.target.value;
    }
  }
};
</script>
