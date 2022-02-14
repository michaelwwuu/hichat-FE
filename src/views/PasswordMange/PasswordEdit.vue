<template>
  <div class="home-wrapper">
    <template v-if="device === 'moblie'">
      <div class="home-header">
        <div class="home-user" @click="back"></div>
        <span class="home-header-title">修改登录密码</span>
        <div class="home-add-user"></div>
      </div>
      <div class="register-content">
        <el-form
          ref="loginForm"
          :model="loginForm"
          class="login-form"
          label-position="top"
        >
          <el-form-item prop="oldPassword">
            <span class="svg-container">
              <img src="./../../../static/images/lock.png" alt="" />
            </span>
            <el-input
              ref="oldPassword"
              placeholder="目前的密码"
              v-model="loginForm.oldPassword"
              name="oldPassword"
              :type="oldPasswordType === 'password' ? 'password' : 'text'"
              tabindex="2"
              maxLength="12"
              @input="
                (v) =>
                  (loginForm.oldPassword = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
              "
            >
            </el-input>
            <span class="show-pwd" @click="showPwd('oldPassword')">
              <img
                :src="
                  oldPasswordType === 'password'
                    ? require('../../../static/images/eye_closed.png')
                    : require('./../../../static/images/eye-solid.svg')
                "
                alt=""
              />
            </span>
          </el-form-item>
          <el-form-item prop="newPassword">
            <span class="svg-container">
              <img src="./../../../static/images/lock.png" alt="" />
            </span>
            <el-input
              ref="newPassword"
              placeholder="欲设定的密码"
              v-model="loginForm.newPassword"
              name="newPassword"
              :type="newPasswordType === 'password' ? 'password' : 'text'"
              tabindex="2"
              maxLength="12"
              @input="
                (v) =>
                  (loginForm.newPassword = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
              "
            >
            </el-input>
            <span class="show-pwd" @click="showPwd('newPassword')">
              <img
                :src="
                  newPasswordType === 'password'
                    ? require('../../../static/images/eye_closed.png')
                    : require('./../../../static/images/eye-solid.svg')
                "
                alt=""
              />
            </span>
          </el-form-item>
          <el-form-item prop="newPasswordAganin">
            <span class="svg-container">
              <img src="./../../../static/images/lock.png" alt="" />
            </span>
            <el-input
              ref="newPasswordAganin"
              placeholder="确认欲设定的密码"
              v-model="loginForm.newPasswordAganin"
              name="newPasswordAganin"
              :type="newPasswordTypeAgain === 'password' ? 'password' : 'text'"
              tabindex="2"
              maxLength="12"
              @input="
                (v) =>
                  (loginForm.newPasswordAganin = v.replace(
                    /^[\u4E00-\u9FA5]+$/,
                    ''
                  ))
              "
            >
            </el-input>
            <span class="show-pwd" @click="showPwd('newPasswordAgain')">
              <img
                :src="
                  newPasswordTypeAgain === 'password'
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
      <el-container>
        <el-aside width="20%">
          <el-header height="70px">
            <div class="home-header">
              <span class="home-header-title">
                <div style="display: flex; align-items: center; cursor: pointer;" @click="back">
                  <span style="padding-right: 10px"
                    ><img src="./../../../static/images/pc/arrow-left.png" alt=""
                  /></span>
                  <span>修改登录密码</span>
                </div>
              </span>
              <div class="home-add-user home-edit-img"  @click="submitForm('loginForm')"></div>
            </div>
          </el-header>
          <div class="register-content">
            <el-form
              ref="loginForm"
              :model="loginForm"
              class="login-form"
              label-position="top"
            >
              <el-form-item prop="oldPassword">
                <span class="svg-container">
                  <img src="./../../../static/images/lock.png" alt="" />
                </span>
                <el-input
                  ref="oldPassword"
                  placeholder="目前的密码"
                  v-model="loginForm.oldPassword"
                  name="oldPassword"
                  :type="oldPasswordType === 'password' ? 'password' : 'text'"
                  tabindex="2"
                  maxLength="12"
                  @input="
                    (v) =>
                      (loginForm.oldPassword = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
                  "
                >
                </el-input>
                <span class="show-pwd" @click="showPwd('oldPassword')">
                  <img
                    :src="
                      oldPasswordType === 'password'
                        ? require('../../../static/images/eye_closed.png')
                        : require('./../../../static/images/eye-solid.svg')
                    "
                    alt=""
                  />
                </span>
              </el-form-item>
              <el-form-item prop="newPassword">
                <span class="svg-container">
                  <img src="./../../../static/images/lock.png" alt="" />
                </span>
                <el-input
                  ref="newPassword"
                  placeholder="欲设定的密码"
                  v-model="loginForm.newPassword"
                  name="newPassword"
                  :type="newPasswordType === 'password' ? 'password' : 'text'"
                  tabindex="2"
                  maxLength="12"
                  @input="
                    (v) =>
                      (loginForm.newPassword = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
                  "
                >
                </el-input>
                <span class="show-pwd" @click="showPwd('newPassword')">
                  <img
                    :src="
                      newPasswordType === 'password'
                        ? require('../../../static/images/eye_closed.png')
                        : require('./../../../static/images/eye-solid.svg')
                    "
                    alt=""
                  />
                </span>
              </el-form-item>
              <el-form-item prop="newPasswordAganin">
                <span class="svg-container">
                  <img src="./../../../static/images/lock.png" alt="" />
                </span>
                <el-input
                  ref="newPasswordAganin"
                  placeholder="确认欲设定的密码"
                  v-model="loginForm.newPasswordAganin"
                  name="newPasswordAganin"
                  :type="newPasswordTypeAgain === 'password' ? 'password' : 'text'"
                  tabindex="2"
                  maxLength="12"
                  @input="
                    (v) =>
                      (loginForm.newPasswordAganin = v.replace(
                        /^[\u4E00-\u9FA5]+$/,
                        ''
                      ))
                  "
                >
                </el-input>
                <span class="show-pwd" @click="showPwd('newPasswordAgain')">
                  <img
                    :src="
                      newPasswordTypeAgain === 'password'
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
            </el-form>
          </div>
        </el-aside>
      </el-container>
    </template>
    <el-dialog
      :title="device === 'pc'?'登录密码':''"
      :visible.sync="dialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'moblie'"><img src="./../../../static/images/success.png" alt="" /></div>
        <span>登录密码已修改。</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-orange" @click="back">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updatePassword } from "@/api";

export default {
  name: "PasswordEdit",
  data() {
    return {
      loginForm: {
        newPassword: "",
        oldPassword: "",
      },
      email: localStorage.getItem("email"),
      oldPasswordType: "password",
      newPasswordType: "password",
      newPasswordTypeAgain: "password",
      disabled: true,
      dialogShow: false,
      notification: false,
      device: localStorage.getItem("device"),
    };
  },
  watch: {
    loginForm: {
      handler(val) {
        if (val.newPassword === val.newPasswordAganin) {
          if (
            Object.values(val).every((el) => el !== "") &&
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,}$/.test(val.oldPassword) &&
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,}$/.test(val.newPassword) &&
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,}$/.test(
              val.newPasswordAganin
            )
          ) {
            this.disabled = false;
          } else{
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
    showPwd(value) {
      switch (value) {
        case "oldPassword":
          this.oldPasswordType =
            this.oldPasswordType === "password" ? "" : "password";
          break;
        case "newPassword":
          this.newPasswordType =
            this.newPasswordType === "password" ? "" : "password";
          break;
        case "newPasswordAgain":
          this.newPasswordTypeAgain =
            this.newPasswordTypeAgain === "password" ? "" : "password";
          break;
      }
      this.$nextTick(() => this.$refs.newPassword.focus());
    },
    submitForm(rules) {
      //驗證註冊表單是否通過
      this.$refs[rules].validate((valid) => {
        if (!valid) {
          this.$message({
            message: "修改失败，请重新输入并确认",
            type: "error",
          });
          return;
        }
        delete this.loginForm.newPasswordAganin;
        updatePassword(this.loginForm)
          .then((res) => {
            //登录成功
            if (res.code === 200) {
              this.dialogShow = true;
            }
          })
          .catch((err) => {
            this.$message({
              message: "修改失败，请重新输入并确认",
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
.home-wrapper {
  .home-header {
    .home-user {
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
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
.hichat-pc{
  .home-edit-img{
    background-color: #fff;
    background-image: url("./../../../static/images/pc/check.png");      
  }
  .register-content{
    /deep/.el-form{
      .el-form-item{
        border-radius: 8px;
        background-color: #eaeaea;
        .el-form-item__label {
          font-size: 17px;
        }
        .el-input{
          .el-input__inner{
            background-color: #eaeaea;
          }
        }
      }
    }
  }
  .el-dialog-loginOut{
    /deep/.el-dialog__footer{
      padding: 0 !important;
    }
  }
}
</style>
