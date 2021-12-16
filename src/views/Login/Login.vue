<template>
  <div
    :class="[
      { 'login-container-pc': device === 'pc' },
      { 'login-container-moblie': device === 'moblie' },
    ]"
  >
    <el-form
      ref="loginForm"
      :model="loginForm"
      class="login-form"
      label-position="top"
    >
      <div class="title-container">
        <img src="./../../../static/images/material_ic_logo.png" alt="" />
      </div>
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
          placeholder="登录密碼"
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
        <span class="show-pwd" @click="showPwd">
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
      <div class="remember-style">
        <el-switch
          v-model="remember"
          active-color="#fd5f3f"
          inactive-color="#666666"
          active-text="记住帐号"
        >
        </el-switch>
        <router-link :to="'/ForgetPassword'" style="text-decoration: none">
          <span>忘记密码</span>
        </router-link>
      </div>
      <div>
        <el-button
          style="width: 100%; margin-bottom: 30px"
          @click="submitForm('loginForm')"
          >登录</el-button
        >
      </div>
      <div>
        <router-link :to="'/Register'">
          <el-button
            style="
              width: 100%;
              margin-bottom: 30px;
              background-color: #67c23a00;
              border: 1px solid #fd5f3f;
              color: #fd5f3f;
            "
            >注册</el-button
          >
        </router-link>
      </div>
    </el-form>
    <el-dialog
      :visible.sync="dialogShow"
      class="dialog-style"
      width="90%"
      :show-close="false"
      center
    >
      <div align="center">
        <img src="./../../../static/images/warn.png" alt="" />
      </div>
      <div align="center">帐号已锁定。</div>
      <div align="center">请至邮箱取得验证码以解锁帐号。</div>
      <span slot="footer" class="dialog-footer">
        <router-link :to="'/ResetPassword'">
          <el-button @click="dialogShow = false">确认</el-button>
        </router-link>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { login } from "_api/index.js";

export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
      device: "",
      token: localStorage.getItem("token"),
      passwordType: "password",
      remember: true,
      disabled: true,
      dialogShow: false,
    };
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
  watch: {
    loginForm: {
      handler(val) {
        if (
          Object.values(val).every((el) => el !== "") &&
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,}$/.test(val.password)
        ) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
        this.remember ? localStorage.setItem("email", val.email) : "";
      },
      deep: true,
    },
    remember(val) {
      !val
        ? localStorage.removeItem("email")
        : localStorage.setItem("email", this.loginForm.email);
    },
  },
  mounted() {
    if (this.remember)
      this.loginForm.email =
        localStorage.getItem("email") !== null
          ? localStorage.getItem("email")
          : "";
    this.getUUID();
  },
  methods: {
    showPwd() {
      this.passwordType = this.passwordType === "password" ? "" : "password";
      this.$nextTick(() => this.$refs.password.focus());
    },
    getUUID() {
      let number = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
      localStorage.setItem("UUID", "hiWeb" + number);
    },
    //登录&&註冊
    submitForm(rules) {
      //驗證登录表單是否通過
      this.$refs[rules].validate(() => {
        if (this.disabled) {
          this.$message({
            message: "资料尚未输入完全或帳號密碼格式錯誤",
            type: "error",
          });
          return;
        }
        login(this.loginForm)
          .then((res) => {
            //登录成功
            if (res.code === 200) {
              localStorage.setItem("token",res.data.tokenHead + res.data.token);
              this.$router.push({ path: "/Home" });
            } else if (res.code === 10009) {
              //登录失敗
              this.dialogShow = true;
            }
          })
          .catch((err) => {
            this.$message({
              message: "登录验证失败，请重输入并确认",
              type: "error",
            });
            return false;
          });
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$bg: #eaf5fa;
$light_gray: #666666;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container-pc .el-input input,
  .login-container-moblie .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container-pc,
.login-container-moblie {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $cursor inset !important;
      }
    }
  }

  .el-form-item {
    background: #ffffff;
    border-radius: 10px;
    color: #454545;
    margin-bottom: 20px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #eaf5fa;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container-pc {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  /deep/.el-dialog__wrapper {
    .el-input__inner {
      color: #000000;
      &:-webkit-autofill {
        box-shadow: 0 0 1000px 0 #e8e2e2 inset !important;
        -webkit-text-fill-color: #000000 !important;
      }
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 0 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 20px;
    font-size: 22px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    img {
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}

.login-container-moblie {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .title-container {
    display: flex;
    img {
      height: 5em;
      margin: 0px auto 40px auto;
      text-align: center;
    }
  }
  .login-form {
    position: relative;
    width: 80vw;
    max-width: 100%;
    padding: 4em 0;
    margin: 0 auto;
    overflow: hidden;

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
    .remember-style {
      margin: 1em 0 5em 0;
      display: flex;
      justify-content: space-between;
      /deep/.is-checked {
        .is-active {
          color: #303133;
        }
      }
      span {
        font-size: 14px;
        color: #fd5f3f;
      }
    }
    .el-button {
      background-color: #fd5f3f;
      color: #fff;
    }
  }
  .svg-container {
    padding: 6px 0 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 20px;
    font-size: 22px;
    display: inline-block;
    img {
      height: 17px;
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

