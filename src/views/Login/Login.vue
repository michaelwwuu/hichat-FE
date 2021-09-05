<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      label-position="top"
      autocomplete="on" 
    >
      <div class="title-container">
        <h3 class="title">{{headerTitle}}</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <font-awesome-icon icon="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名称"
          @keyup.enter.native="login('loginForm')"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        >
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <font-awesome-icon icon="key" />
        </span>
        <el-input
          placeholder="请输入密码"
          v-model="loginForm.password"
          type="password"
          @keyup.enter.native="login('loginForm')"
        >
        </el-input>
      </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" @click="login('loginForm')">登入</el-button>
    </el-form>
  </div>
</template>

<script>
import { login } from "_api/index.js";
import { setToken, setLocal, getLocal } from "_util/utils.js";
// import { getUserInfo } from "@/api";
export default {
  data() {
    return {
      headerTitle:'聊天室登入系統',
      tableIndex: 0,
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [{ required: true, message: "請輸入帳號", trigger: "blur"}],
        password: [
          { required: true, message: "請輸入密碼", trigger: "blur" },
          { min: 8, message: "最小8個字符以上", trigger: "blur" },
        ],
      },
      token: getLocal("token"),
    };
  },
  mounted() {
    // 判斷是否記住我
    if (this.token) {
      //驗證token是否過期
      getUserInfo({}).then((res) => {
        if (res.code == 200) {
          this.$router.push({ path: "/domain/home" });
        } else {
          return false;
        }
      });
    }
  },
  methods: {
    //登入
    login(rules) {
      if (this.loginForm.username.trim() == "") {
        this.loginForm.username = "";
      }
      if (this.loginForm.password.trim() == "") {
        this.loginForm.password = "";
      }
      //驗證表單是否通過
      this.$refs[rules].validate((valid) => {
        if (!valid) {
          alert("登入驗證失敗，請重新輸入並確認");
          return;
        }
        login(this.loginForm)
          .then((res) => {
            //登入成功
            if (res.code == 200) {
              setToken(res.data.token);
              this.$store.commit("getToken", res.data.token);
              this.$router.push({ path: "/domain/home" });
            } else {
              alert("登入失敗，請重新確認帳號密碼");
              return false;
            }
            //登入失敗
          })
          .catch((err) => {
            alert("登入失敗，請重新確認帳號密碼");
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

$bg:#283443;
$light_gray:#fff;
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
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

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
