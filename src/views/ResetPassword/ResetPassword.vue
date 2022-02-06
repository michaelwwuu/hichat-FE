<template>
  <div :class="[
    { 'register-container-pc': device === 'pc' },
    { 'register-container-moblie': device === 'moblie' }
  ]">
    <template v-if="device === 'moblie'">
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
            <el-button
              class="verification-style"
              :style="
                disabledTime ? 'border: 1px solid #b3b3b3; color: #b3b3b3;' : ''
              "
              plain
              :disabled="disabledTime"
              @click="getAuthCodeData(loginForm.email, false)"
              >获取驗證碼 <span v-if="timer">({{ count }})</span>
            </el-button>
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
    </template>
    <template v-else>
      <div class="register-header">
        <div class="title-container">
          <img src="./../../../static/images/material_ic_logo.png" alt="" />
          <span class="register-header-title">帐号解除锁定</span>
        </div>
      </div>
      <div class="register-content">
        <el-form
          ref="loginForm"
          :model="loginForm"
          class="login-form"
          label-position="top"
        >
          <el-form-item prop="authCode">
            <span class="svg-container">驗證碼</span>
            <el-input
              ref="authCode"
              v-model="loginForm.authCode"
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
                disabledTime ? 'border: 1px solid #b3b3b3; color: #b3b3b3;' : ''
              "
              plain
              :disabled="disabledTime"
              @click="getAuthCodeData(loginForm.email, false)"
              >获取驗證碼 <span v-if="timer">({{ count }})</span>
            </el-button>
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
    </template>
    <el-dialog
      :title="device === 'pc'?'解除帳號鎖定':''"
      :visible.sync="dialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'moblie'"><img src="./../../../static/images/success.png" alt="" /></div>
        <div style="margin-bottom:10px;"><span >帐号已解除锁定，请重新登录。</span></div>
        <div><span>若忘記密码，可使用「忘记密码」功能。</span></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <router-link to="/Login">
          <el-button :class="device === 'moblie' ?'background-orange':'background-red'" @click="dialogShow = false">确认</el-button>
        </router-link>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { unlockUser, genAuthCode } from "@/api";

export default {
  data() {
    return {
      loginForm: {
        email: localStorage.getItem("email"),
        authCode: "",
      },
      device: "",
      count: 60,
      timer: false,
      disabled: true,
      dialogShow: false,
      disabledTime: false,
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
            if (res.code === 200) {
              this.dialogShow = true;
            }
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
      position: absolute;
      bottom: 0;
      width: 100%;
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
  width: 481px;
  margin: 0 auto;
  overflow: hidden;
  .register-header{
    justify-content: center;
    margin-top: 13.3em;
    .register-header-title{
      left: 0;
      color: #474747;
      margin: 19px 0 16px 0;
      font-size: 20px;
    }
    .title-container{
      display: flex;
      align-items: center;
      flex-direction: column;
      img{
        height: 5em;
      }
    }
  }
  .register-content{
    .svg-container{
      font-size: 14px;
      width: 15%;
    }
    .login-form{
      height: 15em;
      padding: 0.45em 0;
      .el-form-item{
        .el-input{
          width: 70%;
          /deep/.el-input__inner{
            vertical-align: middle;
          }
        }
      }
    }
    .show-pwd{
      cursor: pointer;
    }
    .eye-off{
      img {
        height: 1.5em;
      }
    }
  }

  .verification-style{
    font-size: 14px !important;
    border: 0 !important;
    right: 0.5em;
  }
}
</style>


