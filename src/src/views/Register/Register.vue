<template>
  <div
    :class="[
      { 'register-container-pc': device === 'pc' },
      { 'register-container-moblie': device === 'moblie' },
    ]"
  >
    <template v-if="device === 'moblie'">
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
          <el-form-item prop="phone">
            <span class="svg-container">
              <img src="./../../../static/images/mail.png" alt="" />
            </span>
            <el-input
              ref="phone"
              placeholder="手机号码"
              v-model.trim="loginForm.phone"
              name="phone"
              type="text"
              tabindex="1"
              maxLength="13"
              @input="
                (v) => (loginForm.phone = v.replace(/^[\u4E00-\u9FA5_a-zA-Z]+$/, ''))
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
            >密码长度为4至12个字元。</span
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
                (v) =>
                  (loginForm.username = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
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
              @blur="recover"
            >
            </el-input>
            <el-button
              class="verification-style"
              :style="
                disabledTime ? 'border: 1px solid #b3b3b3;color: #b3b3b3;' : ''
              "
              plain
              :disabled="disabledTime"
              @click="getAuthCodeData(loginForm.phone, true)"
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
    </template>
    <template v-else>
      <div class="register-header">
        <div class="title-container">
          <img src="./../../../static/images/material_ic_logo.png" alt="" />
          <span class="register-header-title">注册 嗨聊</span>
        </div>
      </div>
      <div class="register-content">
        <el-form
          ref="loginForm"
          :model="loginForm"
          class="login-form"
          label-position="top"
        >
          <el-form-item prop="phone">
            <span class="svg-container">手机号码</span>
            <el-input
              ref="phone"
              v-model.trim="loginForm.phone"
              name="phone"
              type="text"
              tabindex="1"
              maxLength="13"
              @input="
                (v) => (loginForm.phone = v.replace(/^[\u4E00-\u9FA5_a-zA-Z]+$/, ''))
              "
              @blur="recover"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">登录密码</span>
            <el-input
              ref="password"
              v-model.trim="loginForm.password"
              name="password"
              :type="passwordType === 'password' ? 'password' : 'text'"
              tabindex="2"
              maxLength="12"
              @input="
                (v) =>
                  (loginForm.password = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
              "
              @blur="recover"
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
                    ? require('./../../../static/images/pc/eye-off.svg')
                    : require('./../../../static/images/pc/eye.svg')
                "
                alt=""
              />
            </span>
          </el-form-item>
          <!-- <span class="tip-text"
            >密码长度为6至12个字元，至少包含1个大写、1个小写英文及1个数字。</span
          > -->
          <span class="tip-text"
            >密码长度为4至12个字元。</span
          >
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
              @blur="recover"
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
                    ? require('./../../../static/images/pc/eye-off.svg')
                    : require('./../../../static/images/pc/eye.svg')
                "
                alt=""
              />
            </span>
          </el-form-item>
          <el-form-item prop="username">
            <span class="svg-container">帐号 ID</span>
            <el-input
              ref="username"
              v-model.trim="loginForm.username"
              name="username"
              type="text"
              tabindex="1"
              maxLength="18"
              @input="
                (v) =>
                  (loginForm.username = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
              "
              @blur="recover"
            >
            </el-input>
          </el-form-item>
          <span class="tip-text"
            >ID 长度为5至18个字元，允许混用英文字母、数字和底线。</span
          >
          <el-form-item prop="nickname">
            <span class="svg-container">昵称</span>
            <el-input
              ref="nickname"
              v-model.trim="loginForm.nickname"
              name="nickname"
              type="text"
              tabindex="1"
              maxLength="18"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="authCode">
            <span class="svg-container"> 验证码 </span>
            <el-input
              ref="authCode"
              v-model.trim="loginForm.authCode"
              name="authCode"
              type="authCode"
              tabindex="2"
              maxLength="6"
              @input="(v) => (loginForm.authCode = v.replace(/[^\d]/g, ''))"
              @blur="recover"
            >
            </el-input>
            <el-button
              class="verification-style"
              :style="
                disabledTime ? 'border: 1px solid #b3b3b3;color: #b3b3b3;' : ''
              "
              plain
              :disabled="disabledTime"
              @click="getAuthCodeData(loginForm.phone, true)"
              >获取驗證碼 <span v-if="timer">({{ count }})</span>
            </el-button>
          </el-form-item>        
          <div class="register-footer">
            <div>
              <el-button
                style="width: 100%; margin-bottom: 30px"
                :class="disabled ? 'gray-btn' : 'orange-btn'"
                :disabled="disabled"
                @click="submitForm('loginForm')"
                >注册</el-button
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
      :title="device === 'pc' ? '会员注册' : ''"
      :visible.sync="dialogShow"
      class="el-dialog-loginOut"
      :show-close="false"
      :close-on-click-modal="false"
      width="70%"
      center
    >
      <div class="loginOut-box">
        <template v-if="device === 'moblie'">
          <div><img src="./../../../static/images/success.png" alt="" /></div>
          <span>注册完成，系统将自动登录</span>
        </template>
        <template v-else>
          <span>您已成功注册嗨聊会员！</span>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <router-link to="/Home">
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
import { register, genAuthCode } from "@/api";
import { Encrypt, Decrypt } from "@/utils/AESUtils.js";
import * as phoneValidator from '@/utils/phoneValidator';
import { setToken } from "_util/utils.js";

export default {
  data() {
    return {
      loginForm: {
        authCode: "",
        nickname: "",
        password: "",
        passwordAganin: "",
        phone: "",
        username: "",
        version: 1,
        readChecked: false,
        deviceId: localStorage.getItem("UUID"),
        deviceName: "",
        deviceType: 0,
      },
      passwordType: "password",
      passwordTypeAgain: "password",
      count: 60,
      timer: false,
      disabledTime: false,
      disabled: true,
      dialogShow: false,
      device: localStorage.getItem("device"),

      //加解密 key iv
      aesKey: "142c7ec1b64ae0c6",
      aesIv: "0000000000000000",
    };
  },
  watch: {
    loginForm: {
      handler(val) {
        let newNum = []
        Array.from(val.phone).forEach((num)=>{
          if(!/^[\u4E00-\u9FA5_a-zA-Z/@~!#$%.^&*=<>:?"{}()]+$/.test(num)) newNum.push(num)
        })
        this.loginForm.phone = newNum.toString().replace(/,/g, "")
        if (
          Object.values(val).every((el) => el !== "") &&
          val.password.toString().length >= 4 &&
          val.passwordAganin.toString().length >= 4 &&
          /^[A-Za-z0-9_\_]{5,}$/.test(val.username)
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
    this.browserType()
  },
  methods: {
    browserType() {
      var userAgent = navigator.userAgent; //取得瀏覽器的userAgent字串
      var isOpera = userAgent.indexOf("Opera") > -1; //判斷是否Opera瀏覽器
      var isIE =
        userAgent.indexOf("compatible") > -1 &&
        userAgent.indexOf("MSIE") > -1 &&
        !isOpera; //判斷是否IE瀏覽器
      var isEdge = userAgent.indexOf("Edge") > -1; //判斷是否IE的Edge瀏覽器
      var isFF = userAgent.indexOf("Firefox") > -1; //判斷是否Firefox瀏覽器
      var isSafari =
        userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判斷是否Safari瀏覽器
      var isChrome =
        userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判斷Chrome瀏覽器
      if (isOpera) {
        this.loginForm.deviceName = "Opera";
      } else if (isIE) {
        this.loginForm.deviceName = "compatible";
      } else if (isEdge) {
        this.loginForm.deviceName = "Edge";
      } else if (isFF) {
        this.loginForm.deviceName = "Firefox";
      } else if (isSafari) {
        this.loginForm.deviceName = "Safari";
      } else if (isChrome) {
        this.loginForm.deviceName = "Chrome";
      }
    },    
    recover(){
		  let agentValue = navigator.userAgent;
      // userAgent属性是一个只读的字符串，声明了浏览器用于 HTTP 请求的用户代理头的值，用于判断是Android设备还是IOS设备
      let isIOS = !!agentValue.match( /\(i[^;]+;( U;)? CPU.+Mac OS X/ ); // 判断是否是ios终端
      if( isIOS ) {
          window.scrollTo( 0, 0 ); // 如果是ios终端，则在失焦的时候使页面返回顶部
      }
    },
    getAuthCodeData(phone, key) {
      if (phone === "") {
        this.$message({ message: "手机号码尚未输入", type: "error" });
        return;
      } else if(!phoneValidator.isPhoneNumberValid(phone, "CN")){
        this.$message({
          message: "請輸入正確手机号码格式!",
          type: "error",
        });
        return;
      }
      this.disabledTime = true;
      let params = { phoneNo: phone, forRegister: key };
      genAuthCode(params).then((res) => {
        if (res.code === 200) {
          this.$message({ message: "请至注册手机号码确认验证码", type: "success" });
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
      if (this.loginForm.password !== this.loginForm.passwordAganin) {
        this.$message({
          message: "两次输入密码不一致!",
          type: "error",
        });
        return;
      } else if(!phoneValidator.isPhoneNumberValid(this.loginForm.phone, "CN")){
        this.$message({
          message: "請輸入正確手机号码格式!",
          type: "error",
        });
        return;
      }
      //驗證註冊表單是否通過;
      this.$refs[rules].validate((valid) => {
        if (!valid) {
          this.$message({
            message: "注册失败，请重新输入并确认",
            type: "error",
          });
          return;
        }
        delete this.loginForm.passwordAganin;
        this.loginForm.password = Encrypt(this.loginForm.password,this.aesKey,this.aesIv)
        this.disabled = true;
        register(this.loginForm)
          .then((res) => {
            //登录成功
            if (res.code === 200) {
              setToken(res.data.tokenHead + res.data.token);
              localStorage.setItem("phone", this.loginForm.phone);
              this.dialogShow = true;
              this.loginForm.password = Decrypt(this.loginForm.password,this.aesKey,this.aesIv)
            }else{
              this.loginForm.password = Decrypt(this.loginForm.password,this.aesKey,this.aesIv)
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
//H5 PC 共同樣式
.register-container-pc,
.register-container-moblie {
  width: 100%;
  height: 100%;
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
      position: relative;
      top: 2em;
    }
  }
  .read-check-box {
    margin-bottom: 1em;
    /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
      color: rgba(0, 0, 0, 0.8);
    }
    /deep/.el-checkbox {
      .el-checkbox__input {
        .el-checkbox__inner {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          &:after {
            border: 2px solid #ffffff;
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

//PC版本樣式
.register-container-pc {
  width: 370px;
  margin: 3em auto;
  overflow: initial;
  .register-header {
    justify-content: center;
    .register-header-title {
      left: 0;
      color: #474747;
      margin: 20px 0;
      font-size: 20px;
    }
    .title-container {
      display: flex;
      align-items: center;
      flex-direction: column;
      img {
        height: 5em;
      }
    }
  }
  .register-content {
    .svg-container {
      font-size: 14px;
      width: 60px;
    }
    .login-form {
      .el-form-item {
        .el-input {
          width: 60%;
          /deep/.el-input__inner {
            vertical-align: middle;
            background-color: #ffffff !important;
          }
        }
      }
    }
    .register-footer {
      top: 0;
    }
    .show-pwd {
      cursor: pointer;
      img {
        height: 1.5em;
      }
    }
    .eye-off {
      img {
        height: 1.5em;
      }
    }
  }
  .verification-style {
    font-size: 14px !important;
    border: 0 !important;
    right: 0.5em;
  }
  /deep/.el-dialog-loginOut {
    overflow: auto;
    .el-dialog {
      .el-dialog__footer {
        padding: 0 !important;
      }
    }
  }
}
.-webkit-input-placeholder {
  background-color: #ffffff;
}
</style>