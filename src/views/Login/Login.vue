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
        <span class="header-title" v-if="device === 'pc'">登录 Hichat</span><!--{{ $t('LOGIN.LGOIN_TITLE') }}-->
      </div>
      <template v-if="device === 'moblie'">
        <el-form-item prop="email">
          <span class="svg-container">
            <img src="./../../../static/images/mail.png" alt="" />
          </span>
          <el-input
            ref="email"
            v-model.trim="loginForm.email"
            placeholder="电子邮箱"
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
      </template>
      <template v-else>
        <el-form-item prop="email">
          <span class="svg-container">电子邮箱</span>
          <el-input
            ref="email"
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
          <span class="svg-container">登录密碼</span>
          <el-input
            ref="password"
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
          <span
            class="show-pwd"
            :class="{ 'eye-off': passwordType === 'password' }"
            @click="showPwd"
          >
            <img
              :src="
                passwordType === 'password'
                  ? require('../../../static/images/pc/eye-off.png')
                  : require('./../../../static/images/eye-solid.svg')
              "
              alt=""
            />
          </span>
        </el-form-item>
      </template>
      <div
        class="remember-style"
        :style="device === 'moblie' ? 'flex-direction: row-reverse' : ''"
      >
        <el-switch
          v-model="remember"
          active-color="#fe5f3f"
          inactive-color="#666666"
          active-text="记住帐号"
        >
        </el-switch>
        <router-link :to="'/ForgetPassword'" style="text-decoration: none">
          <span>忘记密码</span>
        </router-link>
      </div>
      <div class="read-check-box">
        <el-checkbox v-model="readChecked">
          已阅读并同意<a
            href="https://www.hichat.info/pub/userAgreement.html"
            target="_blank"
            >服务条款</a
          >與<a
            href="https://www.hichat.info/pub/privacyPolicy.html"
            target="_blank"
            >隐私权政策</a
          ></el-checkbox
        >
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
              background-color: #67c23a00;
              border: 1px solid #fe5f3f;
              color: #fe5f3f;
            "
            >注册</el-button
          >
        </router-link>
      </div>
      <!-- <el-dropdown>
        <span class="el-dropdown-link">
          選擇語言<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item data-lang="tw" @click.native="setLang">中文</el-dropdown-item>
          <el-dropdown-item data-lang="en" @click.native="setLang">English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </el-form>
    <el-dialog
      :title="device === 'pc' ? '帐号已锁定' : ''"
      :visible.sync="dialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'moblie'">
          <img src="./../../../static/images/warn.png" alt="" />
        </div>
        <div style="margin-bottom: 10px"><span>帐号已锁定。</span></div>
        <div><span>请至邮箱取得验证码以解锁帐号。</span></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <router-link :to="'/ResetPassword'">
          <el-button
            :class="
              device === 'moblie' ? 'background-orange' : 'background-red'
            "
            @click="dialogShow = false"
            >确认</el-button
          >
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
      passwordType: "password",
      remember: true,
      disabled: true,
      readChecked: false,
      dialogShow: false,
      token: localStorage.getItem("token"),
      device: localStorage.getItem("device"),
    };
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
    if (this.remember) {
      this.loginForm.email =
        localStorage.getItem("email") !== null
          ? localStorage.getItem("email")
          : "";
    }
    this.getUUID();
  },
  methods: {
    setActiveLanguage(lang) {
      localStorage.setItem('language', lang)
    },
    setLang(evt) {
      const lang = evt.target.dataset.lang
      this.setActiveLanguage(lang)
      return history.go(0)
    },
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
      if (!this.readChecked) {
        this.$message({
          message: "尚未勾選同意條款",
          type: "warning",
        });
        return;
      }
      //驗證登录表單是否通過
      this.$refs[rules].validate(() => {
        if (this.disabled) {
          this.$message({
            message: "资料尚未输入完全或帳號密碼格式錯誤",
            type: "error",
          });
          return;
        }
        this.loginForm.email = this.loginForm.email.trim();
        login(this.loginForm)
          .then((res) => {
            //登录成功
            if (res.code === 200) {
              localStorage.setItem(
                "token",
                res.data.tokenHead + res.data.token
              );
              localStorage.setItem(
                "id",
                res.data.memberId
              );
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
            localStorage.clear();
            this.getUUID();
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
      padding: 12px 5px 12px 10px;
      color: $light_gray;
      height: 47px;
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
.login-container-pc,
.login-container-moblie {
  width: 100%;
  height: 100%;
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
      border: 1px solid #fe5f3f;
      color: #fe5f3f;
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
    .eye-off {
      img {
        height: 1.5em;
      }
    }
    .remember-style {
      margin: 1em 0 2em 0;
      display: flex;
      justify-content: space-between;
      /deep/.is-checked {
        .is-active {
          color: rgba(0, 0, 0, 0.8);
        }
      }
      span {
        font-size: 14px;
        color: #fe5f3f;
      }
    }
    .read-check-box {
      margin-bottom: 3em;
      /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
        color: rgba(0, 0, 0, 0.8);
      }
      /deep/.el-checkbox{
        .el-checkbox__input{
          .el-checkbox__inner{
            width: 20px;
            height: 20px;
            border-radius: 50%;
            &:after{
              border: 2px solid #FFFFFF;
              border-left: 0;
              border-top: 0;
              height: 13px;
              left: 7px;
            }
          }
        }
      }

      .el-checkbox__label {
        a {
          color: #10686e;
          text-decoration: none;
        }
      }
    }
    .el-button {
      background-color: #fe5f3f;
      color: #fff;
      padding: 16px 20px;
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
          a {
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
.login-container-pc {
  display: flex;
  align-items: center;
  .login-form {
    width: 370px;
    .show-pwd {
      cursor: pointer;
    }
    .remember-style {
      margin: 1em 0 2em 0;
      display: flex;
      justify-content: space-between;
      /deep/.is-checked {
        .is-active {
          color: rgba(0, 0, 0, 0.8);
        }
      }
      span {
        font-size: 14px;
        color: #fe5f3f;
      }
    }
    .read-check-box {
      margin-bottom: 3em;
    }
  }
  .title-container {
    display: flex;
    flex-direction: column;
    margin: 0 auto 40px auto;
    img {
      margin: 0px auto;
    }
    .header-title {
      margin: 1em auto 0 auto;
      font-size: 1.2em;
      color: #474747;
    }
  }
  .svg-container {
    font-size: 14px;
    width: 60px;
    vertical-align: inherit;
    color: #454545;
  }
  .el-input {
     width:60%;
  }
}
</style>

