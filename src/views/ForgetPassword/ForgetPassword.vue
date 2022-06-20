<template>
  <div 
    :class="[
      { 'register-container-pc': device === 'pc' },
      { 'register-container-moblie': device === 'moblie' }
    ]"
    >
    <template v-if="device === 'moblie'">
      <div class="register-header">
        <router-link :to="'/Login'"
          ><div class="register-back"></div
        ></router-link>
        <span class="register-header-title">忘记密码</span>
      </div>
      <div class="register-content">
        <el-form
          ref="loginForm"
          :model="loginForm"
          class="login-form"
          label-position="top"
        >
          <el-form-item prop="phoneNo">
            <span class="svg-container">
              <img src="./../../../static/images/mail.png" alt="" />
            </span>
            <el-input
              ref="phoneNo"
              placeholder="手机号码"
              v-model="loginForm.phoneNo"
              name="phoneNo"
              type="text"
              tabindex="1"
              maxLength="30"
              @input="
                (v) => (loginForm.phoneNo = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
              "
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
                disabledTime ? 'border: 1px solid #b3b3b3;color: #b3b3b3;' : ''
              "
              plain
              :disabled="disabledTime"
              @click="getAuthCodeData(loginForm.phoneNo, false)"
              >获取驗證碼 <span v-if="timer">({{ count }})</span>
            </el-button>
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <img src="./../../../static/images/lock.png" alt="" />
            </span>
            <el-input
              ref="password"
              placeholder="登录密码"
              v-model.trim="loginForm.newPassword"
              name="newPassword"
              :type="passwordType === 'password' ? 'password' : 'text'"
              tabindex="2"
              maxLength="12"
              @input="
                (v) =>
                  (loginForm.newPassword = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
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
                  (loginForm.passwordAganin = v.replace(
                    /^[\u4E00-\u9FA5]+$/,
                    ''
                  ))
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
          <span class="register-header-title">忘記密碼</span>
        </div>
      </div>
      <div class="register-content">
        <el-form
          ref="loginForm"
          :model="loginForm"
          class="login-form"
          label-position="top"
        >
          <el-form-item prop="phoneNo">
            <span class="svg-container">手机号码</span>
            <el-input
              ref="phoneNo"
              v-model="loginForm.phoneNo"
              name="phoneNo"
              type="text"
              tabindex="1"
              maxLength="30"
              @input="
                (v) => (loginForm.phoneNo = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
              "
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="authCode">
            <span class="svg-container">验证码</span>
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
                disabledTime ? 'border: 1px solid #b3b3b3;color: #b3b3b3;' : ''
              "
              plain
              :disabled="disabledTime"
              @click="getAuthCodeData(loginForm.phoneNo, false)"
              >获取驗證碼 <span v-if="timer">({{ count }})</span>
            </el-button>
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">登录密码</span>
            <el-input
              ref="password"
              v-model.trim="loginForm.newPassword"
              name="password"
              :type="passwordType === 'password' ? 'password' : 'text'"
              tabindex="2"
              maxLength="12"
              @input="
                (v) =>
                  (loginForm.newPassword = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
              "
            >
            </el-input>
            <span
              class="show-pwd"
              :class="{ 'eye-off': passwordType === 'password' }"
              @click="showPwd('password')"
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
          <el-form-item prop="passwordAganin">
            <span class="svg-container">确认密码</span>
            <el-input
              ref="passwordAganin"
              v-model.trim="loginForm.passwordAganin"
              name="passwordAganin"
              :type="passwordTypeAgain === 'password' ? 'password' : 'text'"
              tabindex="2"
              maxLength="12"
              @input="
                (v) =>
                  (loginForm.passwordAganin = v.replace(
                    /^[\u4E00-\u9FA5]+$/,
                    ''
                  ))
              "
            >
            </el-input>
            <span
              class="show-pwd"
              :class="{ 'eye-off': passwordTypeAgain === 'password' }"
              @click="showPwd('passwordAgain')"
            >
              <img
                :src="
                  passwordTypeAgain === 'password'
                    ? require('../../../static/images/pc/eye-off.png')
                    : require('./../../../static/images/eye-solid.svg')
                "
                alt=""
              />
            </span>
          </el-form-item>
          <div class="register-footer">
            <div>
              <el-button
                style="width: 100%; margin-bottom: 30px"
                :class="disabled ? 'gray-btn' : 'orange-btn'"
                :disabled="disabled"
                @click="submitForm('loginForm')"
                >提交</el-button
              >
            </div>
            <div>
              <router-link :to="'/Login'">
                <el-button
                  style="
                    width: 100%;
                    background-color: #67c23a00;
                    border: 1px solid #fd5f3f;
                    color: #fd5f3f;
                  "
                  >回到登录</el-button
                >
              </router-link>
            </div>
          </div>
        </el-form>
      </div>
    </template>
    <el-dialog
      :title="device === 'pc'?'忘記密碼':''"
      :visible.sync="dialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"      
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'moblie'"><img src="./../../../static/images/success.png" alt="" /></div>
        <span>密码已变更，请重新登录。</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :class="device === 'moblie' ?'background-orange':'background-red'" @click="back">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { forgetPassword, genAuthCode } from "@/api";
import { Encrypt,Decrypt } from "@/utils/AESUtils.js";
export default {
  data() {
    return {
      loginForm: {
        phoneNo: "",
        authCode: "",
        newPassword: "",
        passwordAganin: "",
        version:1,
      },
      passwordType: "password",
      passwordTypeAgain: "password",
      count: 60,
      timer: false,
      disabled: true,
      dialogShow: false,
      disabledTime: false,
      device: localStorage.getItem("device"),     
       
      //加解密 key iv
      aesKey: "142c7ec1b64ae0c6",
      aesIv: "0000000000000000",

    };
  },
  watch: {
    loginForm: {
      handler(val) {
        if (val.newPassword === val.passwordAganin) {
          if (
            Object.values(val).every((el) => el !== "") &&
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,}$/.test(val.newPassword) &&
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
  methods: {
    getAuthCodeData(phoneNo, key) {
      if (phoneNo === "") {
        this.$message({ message: "手机号码尚未输入", type: "error" });
        return;
      }
      this.disabledTime = true;
      let params = { phoneNo: phoneNo, forRegister: key };
      genAuthCode(params).then((res) => {
        if (res.code === 200) {
          this.$message({ message: "请至註冊手机確認驗證碼", type: "success" });
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
            message: "输入失败，请重新输入并确认",
            type: "error",
          });
          return;
        }
        delete this.loginForm.passwordAganin;
        this.loginForm.newPassword = Encrypt(this.loginForm.newPassword,this.aesKey,this.aesIv) 
        this.disabled = true;
        forgetPassword(this.loginForm)
          .then((res) => {
            this.loginForm.newPassword = Decrypt(this.loginForm.newPassword,this.aesKey,this.aesIv)
            if (res.code === 200) {
              this.dialogShow = true;
            } else {
              this.loginForm.authCode = "";
            }
          })
          .catch((err) => {
            this.disabled = false;
            this.$message({
              message: "输入失败，请重新输入并确认",
              type: "error",
            });
            return false;
          });
      });
    },
    back() {
      this.$router.back(-1);
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
  width: 370px;
  margin: 0 auto;
  overflow: hidden;
  .register-header{
    justify-content: center;
    margin-top: 105px;
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
      width: 60px;
    }
    .login-form{
      height: 25em;
      padding: 0.45em 0;
      .el-form-item{
        .el-input{
           width:60%;
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


