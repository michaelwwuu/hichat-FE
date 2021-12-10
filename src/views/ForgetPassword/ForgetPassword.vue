<template>
  <div :class="[
    { 'register-container-moblie': device === 'moblie' }
  ]">
    <div class="register-header">
      <router-link :to="'/Login'"><div class="register-back"></div></router-link>
      <span class="register-header-title">忘记密码</span>
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
        <el-form-item prop="authCode">
          <span class="svg-container">
            <img src="./../../../static/images/code.png" alt="">
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
            :style="disabledTime ? 'border: 1px solid #b3b3b3;color: #b3b3b3;' : ''"
            plain
            :disabled="disabledTime"
            @click="getAuthCodeData(loginForm.email,false)"
            >获取驗證碼 <span v-if="timer">({{count}})</span>
          </el-button>
        </el-form-item>
        <div class="register-footer">
          <el-button
            style="width: 100%; margin-bottom: 30px"
            :class="disabled ? 'gray-btn':'orange-btn'"
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
      <div align="center">密码已变更，请重新登录。</div>
      <span slot="footer" class="dialog-footer">
        <router-link to="/Login">
          <el-button @click="dialogShow = false">确认</el-button>
        </router-link>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { forgetPassword,genAuthCode } from "@/api";

export default {
  data() {
    return {
      loginForm: {
        email: "",
        authCode:"",
      },
      device:'',
      count:60,
      timer:false,
      disabled:true,
      dialogShow:false,
      disabledTime:false,
    };
  },
  watch: {
    loginForm: {
      handler(val) {
        if (Object.values(val).every(el => el !== "")) {
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
    getAuthCodeData(email,key) {
      if (email === '') {
        this.$message({ message: "邮件信箱资料尚未输入", type: "error" });
        return 
      }
      this.disabledTime = true;
      let params = { email:email, forRegister:key }
      genAuthCode(params).then((res)=>{
        if(res.code === 200){
          this.$message({ message: "请至邮件信箱获取验证码", type: "success"});
          this.timer = true;
          let time = null;
          time = setInterval(() =>{
            if (this.count > 0) {
              this.count = this.count - 1;
            } else {
              clearInterval(time);
              this.count = 60;
              this.timer = false;
              this.disabledTime = false;
            }
          }, 1000);
        } else{
          this.timer = false;
          this.disabledTime = false;
        } 
      })
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
        this.disabled = true
        forgetPassword(this.loginForm)
          .then((res) => {
            if(res.code === 200) {
              this.dialogShow = true;
            } else {
              this.loginForm.authCode="";
            }
          })
          .catch((err) => {
            this.$message({
              message: "输入失败，请重新输入并确认",
              type: "error",
            });
            this.disabled = false
            return false;
          });
      });
    },
    //清空表格
  },
};
</script>
<style lang="scss" scoped>
.register-container-moblie{
  min-height: 100%;
  width: 100%;
  background-color: #eaf5fa;
  overflow: hidden;
  .register-header{
    margin: 1em;
    display: flex;
    align-items: center;
    .register-back{
      width: 2em;
      height: 2em;
      border-radius: 10px;
      background-color: #FFF;
      background-image: url('./../../../static/images/back.png');
      background-size: 50%;
      background-position:center;
      background-repeat: no-repeat;
    }
    .register-header-title{
      margin: 0 auto;
      position: relative;
      left:-0.5em;
      color: #10686e;
      font-weight: 600;
    }
  }
  .register-content{ 
    .tip-text{
      font-size: 12px;
      color: #6666667c;
      position: relative;
      top:-10px;
    }
    .login-form {
      position: relative;
      height: 80vh;
      max-width: 100%;
      padding: 0.5em 0;
      margin: 1em;
      overflow: hidden;
      .el-form-item{
        background: #FFFFFF;
        border-radius: 10px;
        color: #454545;
        margin-bottom: 20px;
        .el-input {
          display: inline-block;
          height: 47px;
          width: 85%;
          /deep/.el-input__inner{
            border:0 !important;
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
      .gray-btn{
        background-color: #b3b3b3;
        color: #FFF;
      }
      .orange-btn{
        background-color: #fe5f3f;
        color: #FFF;
      }
    }
    .show-pwd{
      height:2.1em;
      line-height: 2.1em;
      position: absolute;
      top:1em;
      right: 1em;
      img{
        height:1.2em;
      }
    }
    .svg-container {
      padding: 6px 0 6px 15px;
      vertical-align: middle;
      width: 20px;
      font-size: 22px;
      display: inline-block;
      img{
        height:17px
      }
    }
    .register-footer{
      position: absolute;
      bottom: 0;
      width: 100%;
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


