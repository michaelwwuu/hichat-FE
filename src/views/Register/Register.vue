<template>
  <div :class="[{ 'register-container-moblie': device === 'moblie' }]">
    <div class="register-header">
      <router-link :to="'/Login'"
        ><div class="register-back"></div
      ></router-link>
      <span class="register-header-title">註冊</span>
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
            placeholder="電子郵箱"
            v-model="loginForm.email"
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
            placeholder="登入密碼"
            v-model="loginForm.password"
            name="password"
            :type="passwordType === 'password' ? 'password' : 'text'"
            tabindex="2"
            maxLength="12"
            @input="
              (v) =>
                (loginForm.password = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
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
          >密碼長度為8至12個字元，允許混用英文字母、數字和符號。</span
        >
        <el-form-item prop="passwordAganin">
          <span class="svg-container">
            <img src="./../../../static/images/lock.png" alt="" />
          </span>
          <el-input
            ref="passwordAganin"
            placeholder="再次確認登入密碼"
            v-model="loginForm.passwordAganin"
            name="passwordAganin"
            :type="passwordTypeAganin === 'password' ? 'password' : 'text'"
            tabindex="2"
            minLength="8"
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
                passwordTypeAganin === 'password'
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
            placeholder="使用者ID"
            v-model="loginForm.username"
            name="username"
            type="text"
            tabindex="1"
            minLength="5"
            maxLength="18"
            @input="
              (v) =>
                (loginForm.username = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
            "
          >
          </el-input>
        </el-form-item>
        <span class="tip-text"
          >ID 長度為5至18個字元，允許混用英文字母、數字和底線。</span
        >
        <el-form-item prop="nickname">
          <span class="svg-container">
            <img src="./../../../static/images/user.png" alt="" />
          </span>
          <el-input
            ref="nickname"
            placeholder="暱稱"
            v-model="loginForm.nickname"
            name="nickname"
            type="text"
            tabindex="1"
            minLength="5"
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
            @click="getAuthCodeData(loginForm.email)"
            >获取驗證碼</span
          >
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
  </div>
</template>

<script>
import { getAuthCode, register } from "@/api";
export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
        authCode: "",
        nickname: "",
        username: "",
      },
      device: "",
      passwordType: "password",
      passwordTypeAganin: "password",
      disabled: true,
    };
  },
  watch: {
    loginForm: {
      handler(val) {
        if (
          Object.values(val).every((el) => el !== "") &&
          /^(?=.*?[A-Z])(?=.*?[#?!@$%^&*-]).{8,}$/.test(val.password) &&
          /^(?=.*?[A-Z])(?=.*?[#?!@$%^&*-]).{8,}$/.test(val.passwordAganin) &&
          /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-]).{5,}$/.test(val.username) 
        ) {
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
    showPwd(value) {
      if(value === 'password'){
        this.passwordType = this.passwordType === "password" ? "" : "password";
      } else if(value === 'passwordAgain'){
        this.passwordTypeAganin = this.passwordTypeAganin === "password" ? "" : "password";
      }
      this.$nextTick(() => this.$refs.password.focus());
    },
    getAuthCodeData(email) {
      if (email === "") {
        this.$message({
          message: "資料尚未輸入完全",
          type: "error",
        });
        return;
      }
      getAuthCode({ email })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {});
    },
    //登入&&註冊
    submitForm(rules) {
      //驗證註冊表單是否通過
      this.$refs[rules].validate((valid) => {
        if (!valid) {
          this.$message({
            message: "註冊失敗，請重新輸入並確認",
            type: "error",
          });
          return;
        }
        delete this.loginForm.passwordAganin;
        register(this.loginForm)
          .then((res) => {
            //登入成功
            // if (res.code === 200) {
            //   setToken(res.data.tokenHead + res.data.token);
            //   this.$router.push({ path: "/Chat" });
            // } else if (res.code === 500) {
            //   this.$message({
            //     message: res.message,
            //     type: "error",
            //   });
            //   return false;
            // }
          })
          .catch((err) => {
            this.$message({
              message: "註冊失敗，請重新輸入並確認",
              type: "error",
            });
            return false;
          });
      });
    },
    //清空表格
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
}
</style>


