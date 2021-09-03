<template>
  <div class="login">
      <div class="form">
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :model="formLabelAlign"
          :rules="rules"
          ref="formLabelAlignForm"
        >
          <el-form-item
            label="用户名称"
            prop="username"
            style="margin-bottom: 20px"
          >
            <el-input
              placeholder="请输入用户名称"
              v-model="formLabelAlign.username"
              @keyup.enter.native="login('formLabelAlignForm')"
            >
            </el-input>
          </el-form-item>

          <el-form-item style="margin-bottom: 20%" label="密码" prop="password">
            <el-input
              placeholder="请输入密码"
              v-model="formLabelAlign.password"
              type="password"
              @keyup.enter.native="login('formLabelAlignForm')"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div class="button" @click="login('formLabelAlignForm')">
          <!-- 登入 -->
          <div alt="btn"></div>
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
      labelPosition: "top",
      formLabelAlign: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
        password: [
          { required: true, message: "請輸入密碼", trigger: "blur" },
          { min: 8, message: "最小８個字符以上", trigger: "blur" },
        ],
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
      if (this.formLabelAlign.username.trim() == "") {
        this.formLabelAlign.username = "";
      }
      if (this.formLabelAlign.password.trim() == "") {
        this.formLabelAlign.password = "";
      }
      //驗證表單是否通過
      this.$refs[rules].validate((valid) => {
        if (!valid) {
          alert("登入驗證失敗，請重新輸入並確認");
          return;
        }
        login(this.formLabelAlign)
          .then((res) => {
            console.log('res',res)
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
    //記住我
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
  // background: url("../../assets/baidu/Static BG.png") no-repeat 100% 100%;
  .form {
    width: 20vw;
    margin: 0 auto;
    .el-form-item {
      margin-bottom: 35px;
      position: relative;
      img {
        position: absolute;
        right: 12px;
        top: 10px;
      }
      ::v-deep .el-input__inner {
        height: 35px !important;
        line-height: 35px !important;
        font-size: 12px;
        color: #868e96;
      }
    }
    ::v-deep .el-form-item__error {
      color: #fff;
      font-size: 12px;
    }
    ::v-deep .el-form--label-top .el-form-item__label {
      color: #fff !important;
      font-size: 13px;
    }
    .remenber {
      color: #fff;
      font-size: 13px;
    }
    .button {
      cursor: pointer;
      margin-top: 10px;
      &::before {
        width: 100%;
        line-height: 3em;
        border-radius: 5px;
        border: 2px solid #fff;
        display: block;
        content: "登入";
        text-align: center;
        color: #fff;
      }
    }
  }
}
</style>
