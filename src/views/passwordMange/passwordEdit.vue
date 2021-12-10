<template>
  <div class="home-wrapper">
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
                (loginForm.newPasswordAganin = v.replace(/^[\u4E00-\u9FA5]+$/, ''))
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
    <el-dialog
      :visible.sync="dialogShow"
      class="dialog-style"
      width="90%"
      :show-close="false"
      center>
      <div align="center"><img src="./../../../static/images/success.png" alt="" /></div>
      <div align="center">登录密码已修改。</div>
      <span slot="footer" class="dialog-footer">
        <router-link to="/passwordMange">
          <el-button @click="dialogShow = false">确认</el-button>
        </router-link>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updatePassword } from "@/api";

export default {
  name: "passwordEdit",
  data() {
    return {
      loginForm: {
        newPassword: "",
        oldPassword: ""
      },
      email:localStorage.getItem("email"),
      oldPasswordType: "password",
      newPasswordType: "password",
      newPasswordTypeAgain: "password",
      notification:false,
      disabled: true,
      dialogShow:false,
    }
  },
  watch: {
    loginForm: {
      handler(val) {
        if(val.newPassword === val.newPasswordAganin) {
          if (
            Object.values(val).every(el => el !== "") &&
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,}$/.test(val.oldPassword) &&
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,}$/.test(val.newPassword) &&
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,}$/.test(val.newPasswordAganin)
          ) {
            this.disabled = false;
          } 
        }else{
          this.disabled = true;
        }
      },
      deep: true,
    },
  },
  methods: {
    showPwd(value) {
      switch (value) {
        case 'oldPassword':
          this.oldPasswordType = this.oldPasswordType === "password" ? "" : "password";
          break;
        case 'newPassword':
          this.newPasswordType = this.newPasswordType === "password" ? "" : "password";
          break;
        case 'newPasswordAgain':
          this.newPasswordTypeAgain = this.newPasswordTypeAgain === "password" ? "" : "password";
          break;  
      }
      this.$nextTick(() => this.$refs.newPassword.focus());
    },
    submitForm(rules) {
      //驗證註冊表單是否通過
      this.$refs[rules].validate(valid => {
        if (!valid) {
          this.$message({ message: "修改失败，请重新输入并确认", type: "error", });
          return;
        }
        delete this.loginForm.newPasswordAganin;
        updatePassword(this.loginForm)
          .then((res) => {
            //登录成功
            if (res.code === 200) {
              this.dialogShow = true
            }
          })
          .catch((err) => {
            this.$message({ message: "修改失败，请重新输入并确认", type: "error",});
            return false;
          });
      });
    },
    back(){
      this.$router.back(-1)
    }
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper{
  min-height: 100%;
  width: 100%;
  background-color: #eaf5fa;
  overflow: hidden;
  .home-header {
    margin: 1em;
    display: flex;
    align-items: center;
    .home-user {
      width: 2em;
      height: 2em;
      border-radius: 10px;
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
    }
    .home-header-title {
      margin: 0 auto;
      color: #10686e;
      font-weight: 600;
    }
    .home-add-user{
      width: 2em;
      height: 2em;
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
  .dialog-style{
    /deep/.el-dialog{
      border-radius: 10px;
      .el-dialog__body{
        margin-top:-2.5em;
        margin-bottom:-1.5em;
        div{
          margin: 2em 0;
          img{
            height:5em;
          }
        }
      }
      .el-dialog__footer{
        width: 100%;
        .dialog-footer{
          .el-button{
            width: 90%;
            background-color: #fd5f3f;
            color: #FFF;
          }
        }
      }
    }
    
  }
}
</style>
