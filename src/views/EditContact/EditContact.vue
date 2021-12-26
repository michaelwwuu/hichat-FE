<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <el-header height="55px">
          <div class="home-header">
            <div class="home-user" @click="back"></div>
            <span class="home-header-title">编辑联络人</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="address-content">
          <div class="user-data">
            <el-image
              v-if="userData.icon !== undefined"
              :src="userData.icon"
              :preview-src-list="[userData.icon]"
            />
            <div>
              <span>{{ userData.name }}</span>
              <span class="user-data-id">
                ID :
                <span class="user-paste" @click="copyPaste(userData.username)">{{
                  userData.username
                }}</span></span
              >
            </div>
          </div>
          <div class="home-footer-btn">
            <el-button @click="editSubmit(userEditForm.nickname)">保存</el-button>
          </div>
          <div class="user-edit-form">
          <el-form ref="form" :model="userEditForm" label-width="100px">
            <el-form-item label="用户昵称">
              <el-input v-model="userEditForm.nickname"></el-input>
            </el-form-item>
          </el-form>
        </div>
        </div>

      </el-main>
    </el-container>
  </div>
</template>

<script>
import { updateContactNickName } from "@/api";

export default {
  name: "EditContact",
  data() {
    return {
      userData: {},
      userEditForm: {
        nickname: "",
      },
    };
  },
  created() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.userEditForm.nickname = this.userData.name;
  },
  methods: {
    editSubmit() {
      let name = this.userEditForm.nickname;
      let contactId =
        this.userData.contactId === undefined
          ? this.userData.toChatId.replace("u", "")
          : this.userData.contactId;
      updateContactNickName({ name }, contactId).then((res) => {
        if (res.code === 200) {
          if (res.data.icon === undefined){
            res.data.icon = require("./../../../static/images/image_user_defult.png");
          }
          this.back();
        }
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
  .address-content {
    .user-data {
      .user-data-id {
        margin: -3.5em 0 -5em 0;
        font-size: 13px;
        color: #b3b3b3;
      }
      .user-paste {
        width: 1em;
        display: contents;
      }
      span {
        display: block;
        text-align: center;
        height: 4.5em;
        font-weight: 600;
        margin-top: 0.3em;
      }
      .el-image{
        width: 4em;
        height: 4em;
      }  
    }
    .home-footer-btn {
      margin: 1em 0;
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      .el-button {
        width: 93%;
        background-color: #fe5f3f;
        color: #fff;
      }
    }
  }
  .user-edit-form {
    margin: 1em;
    background-color: #fff;
    border-radius: 10px;
    /deep/.el-form {
      .el-form-item__label {
        font-size: 17px;
      }
      .el-input {
        font-size: 19px;
        .el-input__inner {
          border: none;
        }
      }
    }
  }
}
</style>
