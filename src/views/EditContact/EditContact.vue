<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <template v-if="device === 'moblie'">
          <el-header height="55px">
            <div class="home-header">
              <div class="home-user" @click="back"></div>
              <span class="home-header-title">编辑联络人</span>
              <div class="home-add-user"></div>
            </div>
          </el-header>
        </template>
        <template v-else>
          <el-header height="70px">
            <div class="home-header">
              <span class="home-header-title">
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                  @click="back"
                >
                  <span style="padding-right: 10px"
                    ><img
                      src="./../../../static/images/pc/arrow-left.svg"
                      alt=""
                  /></span>
                  <span>编辑联络人</span>
                </div>
              </span>
              <div
                class="home-add-user home-edit-img"
                @click="editSubmit(userEditForm.nickname)"
              ></div>
            </div>
          </el-header>
        </template>
        <div class="home-content">
          <div class="user-data">
            <el-image
              v-if="userData.icon !== undefined"
              :src="noIconShow(userData)"
              :preview-src-list="[noIconShow(userData)]"
            />
            <div>
              <span>{{ userData.name }}</span>
              <span class="user-data-id" v-if="device === 'moblie'">
                ID :
                <span
                  class="user-paste"
                  @click="copyID()"
                  >{{ userData.username }}</span
                ></span
              >
            </div>
          </div>
          <div class="user-edit-form">
            <el-form ref="form" :model="userEditForm" label-width="100px">
              <el-form-item label="用户昵称">
                <el-input v-model="userEditForm.nickname"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="home-footer-btn" v-if="device === 'moblie'">
          <el-button
            class="orange-btn"
            @click="editSubmit(userEditForm.nickname)"
            >保存</el-button
          >
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { updateContactNickName} from "@/api/memberContactController";
import { copyPaste } from "@/utils/urlCopy.js";

export default {
  name: "EditContact",
  data() {
    return {
      userData: {},
      userEditForm: {
        nickname: "",
      },
      device: localStorage.getItem("device"),
    };
  },
  created() {
    this.userData = this.chatUser;
    this.userEditForm.nickname = this.userData.name;
  },
  computed: {
    ...mapState({
      chatUser: (state) => state.ws.chatUser,
      myContactDataList: (state) => state.ws.myContactDataList,
    }),
  },
  methods: {
    ...mapMutations({
      setChatUser: "ws/setChatUser",
      setMsgInfoPage: "ws/setMsgInfoPage",
      setMyContactDataList: "ws/setMyContactDataList",
    }),
    copyID(){
      copyPaste(this.userData.username)
    },   
    noIconShow(iconData) {
      if ([undefined,null,""].includes(iconData.icon)) {
        return require("./../../../static/images/image_user_defult.png");
      } else {
        return iconData.icon;
      }
    },
    editSubmit(name) {
      let contactId =
        this.userData.contactId === undefined
          ? this.userData.toChatId.replace("u", "")
          : this.userData.contactId;
      updateContactNickName({ name }, contactId).then((res) => {
        if (res.code === 200) {
          if (res.data.icon === undefined) {
            res.data.icon = require("./../../../static/images/image_user_defult.png");
          }
          this.userData.name = res.data.name;
          this.myContactDataList.forEach((el) => {
            if (el.contactId === res.data.contactId) {
              el.name = res.data.name;
            }
          });
          this.setChatUser(this.userData);
          this.setMyContactDataList(this.myContactDataList);
          this.back();
        }
      });
    },
    back() {
      if (this.device === "moblie") {
        this.$router.back(-1);
      } else {
        this.setMsgInfoPage({ pageShow: true, type: "" });
      }
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
    .home-edit-img {
      background-color: #fff;
      background-image: url("./../../../static/images/pc/check.png");
    }
  }
  .home-content {
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
      .el-image {
        width: 4em;
        height: 4em;
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
.hichat-pc {
  .user-edit-form {
    /deep/.el-form {
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.05);
      .el-form-item {
        .el-form-item__label {
          font-size: 17px;
        }
        .el-input {
          .el-input__inner {
            
            background:none;
          }
        }
      }
    }
  }
}
</style>
