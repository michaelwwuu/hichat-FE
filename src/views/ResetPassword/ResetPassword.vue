<template>
  <div :class="[{ 'register-container-moblie': device === 'moblie' }]">
    <div class="register-header">
      <router-link :to="'/Login'"
        ><div class="register-back"></div
      ></router-link>
      <span class="register-header-title">帐号解除锁定</span>
    </div>
    <div class="register-content">
      <el-form
        ref="loginForm"
        :model="loginForm"
        class="login-form"
        label-position="top"
      >
        <el-form-item prop="authCode">
          <span class="svg-container">
            <img src="./../../../static/images/code.png" alt="" />
          </span>
          <el-input
            ref="authCode"
            placeholder="驗證碼"
            v-model="loginForm.authCode"
            name="authCode"
            type="authCode"
            tabindex="2"
            maxLength="6"
            @input="(v) => (loginForm.authCode = v.replace(/[^\d]/g, ''))"
          >
          </el-input>
          <span
            class="verification-style"
            :style="timer ?'width:8em':''"
            @click="timer ? getAuthCodeData(loginForm.email,timer=true) : getAuthCodeData(loginForm.email,true)"
            >获取驗證碼 <span v-if="timer">({{count}})</span></span
          >
        </el-form-item>
        <span class="tip-text">请至注册邮箱确认验证码</span>
        <div class="register-footer">
          <el-button
            style="width: 100%; margin-bottom: 30px"
            :class="disabled ? 'gray-btn' : 'orange-btn'"
            :disabled="disabled"
            @click="submitForm('loginForm')"
            >提交</el-button
          >
        </div>
      </el-form>
    </div>
    <el-dialog
      :visible.sync="dialogShow"
      class="dialog-style"
      width="90%"
      :show-close="false"
      center
    >
      <div align="center">
        <img src="./../../../static/images/success.png" alt="" />
      </div>
      <div align="center">帐号已解除锁定，请重新登录。</div>
      <div align="center">若忘記密码，可使用「忘记密码」功能。</div>
      <span slot="footer" class="dialog-footer">
        <router-link to="/Login">
          <el-button @click="dialogShow = false">确认</el-button>
        </router-link>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAuthCodeData } from "@/assets/tools";

import { unlockUser } from "@/api";

export default {
  data() {
    return {
      loginForm: {
        email: localStorage.getItem("email"),
        authCode: "",
      },
      device: "",
      count:60,
      timer:false,
      disabled: true,
      getAuthCodeData: getAuthCodeData,
      dialogShow: false,
    };
  },
  watch: {
    loginForm: {
      handler(val) {
        if (Object.values(val).every((el) => el !== "")) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      },
      deep: true,
    },
  },
  created() {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      this.device = "moblie";
    } else {
      this.device = "pc";
    }
  },
  methods: {
    //登录&&註冊
    submitForm(rules) {
      //驗證註冊表單是否通過
      this.$refs[rules].validate((valid) => {
        if (!valid) {
          this.$message({
            message: "输入失败，请重新输入并确认",
            type: "error",
          });
          return;
        }
        unlockUser(this.loginForm)
          .then((res) => {
            if (res.code === 200) this.dialogShow = true;
          })
          .catch((err) => {
            this.$message({
              message: "输入失败，请重新输入并确认",
              type: "error",
            });
            return false;
          });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.register-container-moblie {
  min-height: 100%;
  width: 100%;
  background-color: #eaf5fa;
  overflow: hidden;
  .register-header {
    margin: 1em;
    display: flex;
    align-items: center;
    .register-back {
      width: 2em;
      height: 2em;
      border-radius: 10px;
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
    }
    .register-header-title {
      margin: 0 auto;
      position: relative;
      left: -0.5em;
      color: #10686e;
      font-weight: 600;
    }
  }
  .register-content {
    .tip-text {
      font-size: 12px;
      color: #6666667c;
      position: relative;
      top: -10px;
    }
    .login-form {
      position: relative;
      height: 80vh;
      max-width: 100%;
      padding: 0.5em 0;
      margin: 1em;
      overflow: hidden;
      .el-form-item {
        background: #ffffff;
        border-radius: 10px;
        color: #454545;
        margin-bottom: 20px;
        .el-input {
          display: inline-block;
          height: 47px;
          width: 85%;
          /deep/.el-input__inner {
            border: 0 !important;
          }
        }
      }
      .verification-style {
        width: 6em;
        height: 2.1em;
        line-height: 2.1em;
        font-size: 12px;
        position: absolute;
        top: 1em;
        right: 1em;
        text-align: center;
        border: 1px solid #fd5f3f;
        color: #fd5f3f;
        border-radius: 5px;
      }
      .gray-btn {
        background-color: #b3b3b3;
        color: #fff;
      }
      .orange-btn {
        background-color: #fe5f3f;
        color: #fff;
      }
    }
    .show-pwd {
      height: 2.1em;
      line-height: 2.1em;
      position: absolute;
      top: 1em;
      right: 1em;
      img {
        height: 1.2em;
      }
    }
    .svg-container {
      padding: 6px 0 6px 15px;
      vertical-align: middle;
      width: 20px;
      font-size: 22px;
      display: inline-block;
      img {
        height: 17px;
      }
    }
    .register-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
    }
  }
  .dialog-style {
    /deep/.el-dialog {
      border-radius: 10px;
      .el-dialog__body {
        margin-top: -2.5em;
        margin-bottom: -1.5em;
        div {
          img {
            height: 5em;
          }
          &:nth-child(1) {
            margin: 2em 0;
          }
          &:nth-child(2) {
            margin: 2em 0 1em 0;
          }
          &:nth-child(3) {
            margin: 0 0 1em 0;
          }
        }
      }
      .el-dialog__footer {
        width: 100%;
        .dialog-footer {
          .el-button {
            width: 90%;
            background-color: #fd5f3f;
            color: #fff;
            border: 0;
          }
        }
      }
    }
  }
}
</style>


