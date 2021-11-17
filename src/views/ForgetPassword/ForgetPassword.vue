<template>
  <div :class="[
    { 'register-container-moblie': device === 'moblie' }
  ]">
    <div class="register-header">
      <router-link :to="'/Login'"><div class="register-back"></div></router-link>
      <span class="register-header-title">忘記密碼</span>
    </div>
    <div class="register-content">
      <el-form
        ref="forgetForm"
        :model="forgetForm"
        :rules="forgetRules"
        class="login-form"
        label-position="top"
      >
        <el-form-item prop="email">
          <span class="svg-container">
            <img src="./../../../static/images/mail.png" alt="">
          </span>
          <el-input
            ref="email"
            placeholder="電子郵箱"
            v-model="forgetForm.email"
            name="email"
            type="text"
            tabindex="1"
            @keyup.enter.native="submitForm('forgetForm')"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="authCode">
          <span class="svg-container">
            <img src="./../../../static/images/code.png" alt="">
          </span>
          <el-input
            ref="authCode"
            placeholder="驗證碼"
            v-model="forgetForm.authCode"
            name="authCode"
            type="authCode"
            tabindex="2"
            @keyup.enter.native="submitForm('forgetForm')"
          >
          </el-input>
          <span class="verification-style" @click="getAuthCode(forgetForm.email)">获取驗證碼</span>
        </el-form-item>
        <div class="register-footer">
          <el-button
            style="width: 100%; margin-bottom: 30px"
            :class="disabled ? 'gray-btn':'orange-btn'"
            :disabled="disabled"
            @click="submitForm('forgetForm')"
            >提交</el-button
          >
        </div>
        
      </el-form>
    </div>
  </div>
</template>

<script>
import { getAuthCode } from "@/api";
export default {
  data() {
    return {
      forgetForm: {
        email: "",
        authCode:"",
      },
      forgetRules: {
        email: [{ required: false, message: "請輸入電子郵箱", trigger: "blur" }],
        password: [{ required: false, message: "請輸入登入密碼", trigger: "blur" }],
        authCode: [{ required: false, message: "請輸入驗證碼", trigger: "blur" }],
      },
      device:'',
      disabled:true,
    };
  },
  watch:{
    'forgetForm':{
      handler(val){
        if(val.authCode !==''&& val.email !==''){
          this.disabled = false
        }
      },
      deep:true
    }
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
    getAuthCode(data){
      if (data === '') {
        this.$message({
          message: "資料尚未輸入完全",
          type: "error",
        });
        return;
      }
      getAuthCode(data).then((res)=>{
        console.log(res)
      })
      .catch((err)=>{})
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
        register(this.forgetForm)
          .then((res) => {
            //登入成功
            if (res.code === 200) {
              setToken(res.data.tokenHead + res.data.token);
              this.$router.push({ path: "/Chat" });
            } else if (res.code === 500) {
              this.$message({
                message: res.message,
                type: "error",
              });
              return false;
            }
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
      .verification-style{
        width: 6em;
        height:2.1em;
        line-height: 2.1em;
        font-size: 12px;
        position: absolute;
        top:1em;
        right: 1em;
        text-align: center;
        border: 1px solid #fd5f3f;
        color:#fd5f3f;
        border-radius:5px;
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
}
</style>


