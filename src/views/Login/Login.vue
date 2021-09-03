<template>
  <div class="login">
    <div class="form">
      <div class="form-border">
        <div class="form-table">
          <span>登入</span>
          <span>註冊</span>
        </div>
        <el-form
          v-if="tableIndex === 0"
          :label-position="labelPosition"
          label-width="220px"
          :model="loginLabel"
          :rules="rules"
          ref="loginLabel"
        >
          <el-form-item
          
            label="用户名称"
            prop="username"
            style="margin-bottom: 20px"
          >
            <el-input
              placeholder="请输入用户名称"
              v-model="loginLabel.username"
              @keyup.enter.native="login('loginLabel')"
            >
            </el-input>
          </el-form-item>

          <el-form-item style="margin-bottom: 20%" label="密码" prop="password">
            <el-input
              placeholder="请输入密码"
              v-model="loginLabel.password"
              type="password"
              @keyup.enter.native="login('loginLabel')"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="form-button">
            <el-button type="primary" @click="login('loginLabel')">登入</el-button>
          </el-form-item>
        </el-form>
        <el-form
          v-if="tableIndex === 1"
          :label-position="labelPosition"
          label-width="220px"
          :model="registerLabel"
          :rules="rules"
          ref="registerLabel"
        >
          <el-form-item
          
            label="用户名称"
            prop="username"
            style="margin-bottom: 20px"
          >
            <el-input
              placeholder="请输入用户名称"
              v-model="registerLabel.username"
              @keyup.enter.native="login('registerLabel')"
            >
            </el-input>
          </el-form-item>

          <el-form-item style="margin-bottom: 20%" label="密码" prop="password">
            <el-input
              placeholder="请输入密码"
              v-model="registerLabel.password"
              type="password"
              @keyup.enter.native="login('registerLabel')"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="form-button">
            <el-button class="warning" @click="login('loginLabel')">立即註冊</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "_api/index.js";
import { setToken, setLocal, getLocal } from "_util/utils.js";
// import { getUserInfo } from "@/api";
export default {
  data() {
    return {
      tableIndex: 0,
      labelPosition: "top",
      loginLabel: {
        username: "",
        password: "",
      },
      registerLabel:{
        countryCallingCode :"",
        email :"",
        telephone :"",
        username :"",
        password :"",
      },
      rules: {
        username: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
        password: [
          { required: true, message: "請輸入密碼", trigger: "blur" },
          { min: 8, message: "最小８個字符以上", trigger: "blur" },
        ],
        telephone:[{ required: true, message: "請輸入電話", trigger: "blur" }],
        email:[{ required: true, message: "請輸入信箱", trigger: "blur" }],
      },
      token: getLocal("token"),
    };
  },
  mounted() {
    // 判斷是否記住我
    if (this.isRemember && this.token) {
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
      if (this.loginLabel.username.trim() == "") {
        this.loginLabel.username = "";
      }
      if (this.loginLabel.password.trim() == "") {
        this.loginLabel.password = "";
      }
      //驗證表單是否通過
      this.$refs[rules].validate((valid) => {
        if (!valid) {
          alert("登入驗證失敗，請重新輸入並確認");
          return;
        }
        login(this.loginLabel)
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
            console.log(err);
            alert("登入失敗，請重新確認帳號密碼");
            return false;
          });
      });    
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  background-color:#000000 ;
  background: url("./../../assets/bg-img/chat-bg.jpg") no-repeat;
  background-size: cover;
  .form {
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    .form-border{
      background-color: #000000bd;
      padding: 3vw 3vw;
      border-radius: 10px;
      .form-table{
        display: flex;
        justify-content: center;
        span{
          background-color: #c22f2fbd;
          padding: 1.5vw 3vw;
          color: #FFF;
          height: 1rem;
          &:first-child{
            border-radius: 5px 0 0 5px;
            border-right: 0.01rem solid #FFFFFF;
          }
          &:last-child{
            border-radius: 0 5px 5px 0;
          }
        }
      }
      .el-form-item {
        margin-bottom: 35px;
        position: relative;
        img {
          position: absolute;
          right: 12px;
          top: 10px;
        }
        /deep/ .el-input__inner {
          width: 20vw;
          height: 35px !important;
          line-height: 35px !important;
          font-size: 12px;
          color: #868e96;
        }
      }
      /deep/ .el-form-item__error {
        color: #fff;
        font-size: 12px;
      }
      /deep/ .el-form--label-top .el-form-item__label {
        color: #fff !important;
        font-size: 13px;
      }
      .remenber {
        color: #fff;
        font-size: 13px;
      }
      .form-button{
        display: flex;
        justify-content: center;
      }
    }

  }
}
</style>
