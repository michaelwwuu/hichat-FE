<template>
  <div :class="[
    { 'register-container-pc': device === 'pc' },
    { 'register-container-moblie': device === 'moblie' }
  ]">
    <div class="register-header">
      <router-link :to="'/Login'"
        ><div class="register-back"></div
      ></router-link>
      <span class="register-header-title">注册</span>
    </div>
    <div class="register-content">
      <el-form
        ref="loginForm"
        :model="loginForm"
        class="login-form"
        label-position="top"
      >
        <el-form-item prop="email">
          <span class="svg-container">
            <img src="./../../../static/images/mail.png" alt="" />
          </span>
          <el-input
            ref="email"
            placeholder="电子邮箱"
            v-model.trim="loginForm.email"
            name="email"
            type="text"
            tabindex="1"
            maxLength="30"
            @input="
              (v) => (loginForm.email = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
            "
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <img src="./../../../static/images/lock.png" alt="" />
          </span>
          <el-input
            ref="password"
            placeholder="登录密码"
            v-model.trim="loginForm.password"
            name="password"
            :type="passwordType === 'password' ? 'password' : 'text'"
            tabindex="2"
            maxLength="12"
            @input="
              (v) => (loginForm.password = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
            "
          >
          </el-input>
          <span class="show-pwd" @click="showPwd('password')">
            <img
              :src="
                passwordType === 'password'
                  ? require('../../../static/images/eye_closed.png')
                  : require('./../../../static/images/eye-solid.svg')
              "
              alt=""
            />
          </span>
        </el-form-item>
        <span class="tip-text"
          >密码长度为6至12个字元，至少包含1个大写、1个小写英文及1个数字。</span
        >
        <el-form-item prop="passwordAganin">
          <span class="svg-container">
            <img src="./../../../static/images/lock.png" alt="" />
          </span>
          <el-input
            ref="passwordAganin"
            placeholder="再次确认登录密码"
            v-model.trim="loginForm.passwordAganin"
            name="passwordAganin"
            :type="passwordTypeAgain === 'password' ? 'password' : 'text'"
            tabindex="2"
            maxLength="12"
            @input="
              (v) =>
                (loginForm.passwordAganin = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
            "
          >
          </el-input>
          <span class="show-pwd" @click="showPwd('passwordAgain')">
            <img
              :src="
                passwordTypeAgain === 'password'
                  ? require('../../../static/images/eye_closed.png')
                  : require('./../../../static/images/eye-solid.svg')
              "
              alt=""
            />
          </span>
        </el-form-item>
        <el-form-item prop="username">
          <span class="svg-container">
            <img src="./../../../static/images/at.png" alt="" />
          </span>
          <el-input
            ref="username"
            placeholder="用户ID"
            v-model.trim="loginForm.username"
            name="username"
            type="text"
            tabindex="1"
            maxLength="18"
            @input="
              (v) => (loginForm.username = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
            "
          >
          </el-input>
        </el-form-item>
        <span class="tip-text"
          >ID 长度为5至18个字元，允许混用英文字母、数字和底线。</span
        >
        <el-form-item prop="nickname">
          <span class="svg-container">
            <img src="./../../../static/images/user.png" alt="" />
          </span>
          <el-input
            ref="nickname"
            placeholder="名称"
            v-model.trim="loginForm.nickname"
            name="nickname"
            type="text"
            tabindex="1"
            maxLength="18"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="authCode">
          <span class="svg-container">
            <img src="./../../../static/images/code.png" alt="" />
          </span>
          <el-input
            ref="authCode"
            placeholder="验证码"
            v-model.trim="loginForm.authCode"
            name="authCode"
            type="authCode"
            tabindex="2"
            maxLength="6"
            @input="(v) => (loginForm.authCode = v.replace(/[^\d]/g, ''))"
          >
          </el-input>
          <el-button
            class="verification-style"
            :style="
              disabledTime ? 'border: 1px solid #b3b3b3;color: #b3b3b3;' : ''
            "
            plain
            :disabled="disabledTime"
            @click="getAuthCodeData(loginForm.email, true)"
            >获取驗證碼 <span v-if="timer">({{ count }})</span>
          </el-button>
        </el-form-item>
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
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/success.png" alt="" /></div>
        <span>注册完成，系统将自动登录</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <router-link to="/Home">
          <el-button class="background-orange" @click="dialogShow = false">确认</el-button>
        </router-link>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { register, genAuthCode } from "@/api";
import { setToken } from "_util/utils.js";

export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
        passwordAganin: "",
        authCode: "",
        nickname: "",
        username: "",
      },
      device: "",
      passwordType: "password",
      passwordTypeAgain: "password",
      count: 60,
      timer: false,
      disabledTime: false,
      disabled: true,
      dialogShow: false,
    };
  },
  watch: {
    loginForm: {
      handler(val) {
        if (val.password === val.passwordAganin) {
          if (
            Object.values(val).every((el) => el !== "") &&
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,}$/.test(val.password) &&
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,}$/.test(
              val.passwordAganin
            ) &&
            /^[A-Za-z0-9_\_]{5,}$/.test(val.username)
          ) {
            this.disabled = false;
          } else {
            this.disabled = true;
          }
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
    getAuthCodeData(email, key) {
      if (email === "") {
        this.$message({ message: "邮件信箱资料尚未输入", type: "error" });
        return;
      }
      this.disabledTime = true;
      let params = { email: email, forRegister: key };
      genAuthCode(params).then((res) => {
        if (res.code === 200) {
          this.$message({ message: "请至邮件信箱获取验证码", type: "success" });
          this.timer = true;
          let time = null;
          time = setInterval(() => {
            if (this.count > 0) {
              this.count = this.count - 1;
            } else {
              clearInterval(time);
              this.count = 60;
              this.timer = false;
              this.disabledTime = false;
            }
          }, 1000);
        } else {
          this.timer = false;
          this.disabledTime = false;
        }
      });
    },
    showPwd(value) {
      switch (value) {
        case "password":
          this.passwordType =
            this.passwordType === "password" ? "" : "password";
          break;
        case "passwordAgain":
          this.passwordTypeAgain =
            this.passwordTypeAgain === "password" ? "" : "password";
          break;
      }
      this.$nextTick(() => this.$refs.password.focus());
    },
    //登录&&註冊
    submitForm(rules) {
      //驗證註冊表單是否通過
      this.$refs[rules].validate((valid) => {
        if (!valid) {
          this.$message({
            message: "注册失败，请重新输入并确认",
            type: "error",
          });
          return;
        }
        delete this.loginForm.passwordAganin;
        this.disabled = true;
        register(this.loginForm)
          .then((res) => {
            //登录成功
            if (res.code === 200) {
              setToken(res.data.tokenHead + res.data.token);
              this.dialogShow = true;
            }
          })
          .catch((err) => {
            this.$message({
              message: "注册失败，请重新输入并确认",
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
.register-container-pc,
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
        border-radius: 5px !important;
        padding: 8px 10px;
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
      position: relative;
      top: 2em;
    }
  }
  /deep/.el-dialog-loginOut {
    overflow: auto;
    .el-dialog {
      position: relative;
      margin: 0 auto 50px;
      background: #ffffff;
      border-radius: 10px;
      box-sizing: border-box;
      width: 50%;
      .el-dialog__header {
        padding: 10px;
      }
      .el-dialog__body {
        text-align: center;
        padding: 25px 25px 15px;
        .loginOut-box {
          img {
            height: 5em;
            margin-bottom: 1.2em;
          }
        }
      }
      .el-dialog__footer {
        padding: 20px;
        padding-top: 10px;
        text-align: right;
        box-sizing: border-box;
        .dialog-footer {
          display: flex;
          justify-content: space-between;
          a{
            width: 100vw;
          }
          .el-button {
            width: 100%;
            border-radius: 8px;
          }
          .background-red {
            background-color: #ee5253;
            color: #fff;
          }
          .background-orange {
            background-color: #fe5f3f;
            color: #fff;
          }
          .border-red {
            border: 1px solid #fe5f3f;
            color: #fe5f3f;
          }
        }
      }
    }
  }
}
.register-container-pc{
  width: 25%;
  margin: 0 auto;
}
</style>


