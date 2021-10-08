<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      label-position="top"
      @submit.native.prevent
    >
      <div class="title-container">
        <h3 class="title">{{ headerTitle }}</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <font-awesome-icon icon="user" />
        </span>
        <el-input
          ref="username"
          placeholder="请输入用户名称"
          v-model="loginForm.username"
          name="username"
          type="text"
          tabindex="1"
          @keyup.enter.native="submitForm('loginForm')"
        >
        </el-input>
      </el-form-item>
      <el-button
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click="submitForm('loginForm')"
        >登入</el-button
      >
      <el-select v-model="loginValue" :placeholder="loginValue">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form>
  </div>
</template>

<script>
import { login } from "_api/index.js";
import { setLocal,setToken } from "_util/utils.js";
export default {
  data() {
    return {
      loginValue:'登入方式',
      headerTitle: "聊天室登入系統",
      loginForm: {
        isGuest:false,
        username: "",
        sign:"",
        platformCode:"dcw", 
      },
      loginRules: {
        username: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
      },
      options: [
        {
          value: '',
          label: '会员登入'
        }, 
        {
          value: 'guest',
          label: '访客登入'
        },
      ],
    };
  },
  created() {
    localStorage.clear()
  },
  methods: {
    //生成 deviceId 32編碼 
    getUUID() {
      let number = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
      setLocal("UUID", "hiWeb" + number);
    },
    //登入&&註冊
    submitForm(rules) {
      if (this.loginForm.username.trim() === "") this.loginForm.username = "";
      if (this.loginValue === "guest"){
        this.loginForm.username = "guest"
        this.loginForm.isGuest = !this.loginForm.isGuest;
      } 
      let params = this.loginForm
      // md5 加密
      this.loginForm.sign = this.$md5(`code=dcw&username=${ this.loginForm.username }&key=59493d81f1e08daf2a4752225751ef31`)

      //驗證登入表單是否通過
      this.$refs[rules].validate(valid => {
        if (!valid) {
          this.$message({
            message: "登入驗證失敗，請重新輸入並確認",
            type: "error",
          });
          return;
        }
        login(params)
          .then((res) => {
            //登入成功
            if (res.code === 200) {
              setToken(res.data.tokenHead + res.data.token);
              localStorage.setItem('isGuest',this.loginForm.isGuest)
              this.getUUID()
              this.$router.push({ path: "/Room" });
            } else {
              this.$message({
                message: res.message,
                type: "error",
              });
              return false;
            }
            //登入失敗
          })
          .catch((err) => {
            this.$message({
              message: "登入驗證失敗，請重新輸入並確認",
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
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
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
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-select{
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    float: right;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
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

    .title {
      font-size: 26px;
      color: $light_gray;
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
</style>
