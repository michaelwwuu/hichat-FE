<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <el-header height="55px">
          <div class="home-header">
            <div class="home-user" @click="back"></div>
            <span class="home-header-title"></span>
            <router-link :to="'/EditContact'">
              <div class="home-add-user"></div>
            </router-link>
          </div>
        </el-header>
        <div class="home-content">
          <div class="user-data">
            <el-image
              v-if="chatUser.icon !== undefined"
              :src="noIconShow(chatUser)"
              :preview-src-list="[noIconShow(chatUser)]"
            />
            <div>
              <span>{{ chatUser.name }}</span>
              <span class="user-data-id">
                ID :
                <span
                  class="user-paste"
                  @click="copyPaste(chatUser.username)"
                  >{{ chatUser.username }}</span
                ></span
              >
            </div>
          </div>
          <div
            class="setting-button"
            v-for="(item, index) in settingData"
            :key="index"
            @click="developmentMessage(item.name)"
          >
            <a @click="goChatRoom(chatUser, item.path)">
              <div class="setting-button-left">
                <img :src="item.icon" alt="" />
                <span>{{ item.name }}</span>
              </div>
              <img src="./../../../static/images/next.png" alt="" />
            </a>
          </div>

          <div
            class="setting-notification"
            @click="developmentMessage('提醒通知')"
          >
            <div class="setting-button-left">
              <img src="./../../../static/images/notification.png" alt="" />
              <span>提醒通知</span>
            </div>
            <el-switch
              v-model="notification"
              active-color="#fd5f3f"
              inactive-color="#666666"
              disabled
            >
            </el-switch>
          </div>
          <div
            class="setting-button"
            @click="dialogShow(!chatUser.isBlock ? 'block' : 'unBlock')"
          >
            <a>
              <div class="setting-button-left">
                <img src="./../../../static/images/blockade.png" alt="" />
                <span>{{ !chatUser.isBlock ? "封锁联络人" : "解除封锁" }}</span>
              </div>
            </a>
          </div>
          <div
            class="setting-button"
            @click="dialogShow(!chatUser.isContact ? 'add' : 'delete')"
          >
            <a>
              <div class="setting-button-left">
                <img
                  :src="
                    require(`./../../../static/images/${
                      !chatUser.isContact ? 'add_user' : 'trash'
                    }.png`)
                  "
                  alt=""
                />
                <span class="red-text">{{
                  !chatUser.isContact ? "加入联络人" : "刪除联络人"
                }}</span>
              </div>
            </a>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      :visible.sync="settingDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/warn.png" alt="" /></div>
        <span>{{ dialogContent }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="border-red" @click="settingDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="submitBtn(dialogContent)"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="addContactDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/success.png" alt="" /></div>
        <span>已加入联络人</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-orange" @click="back()">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="successDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/success.png" alt="" /></div>
        <span>操作成功</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-orange" @click="back">確認</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { developmentMessage } from "@/assets/tools";
import { mapState,mapMutations } from "vuex";
import {
  addContactUser,
  addBlockContactUser,
  unBlockContactUser,
  deleteContactUser,
} from "@/api";

export default {
  name: "ContactPage",
  data() {
    return {
      userData: {},
      settingData: [
        {
          name: "传送讯息",
          icon: require("./../../../static/images/chat_icon.png"),
          path: "ChatMsg",
        },
        {
          name: "在对话中搜寻",
          icon: require("./../../../static/images/search.png"),
          path: "",
        },
        {
          name: "查看相片和影片",
          icon: require("./../../../static/images/image_icon.png"),
          path: "",
        },
      ],
      dialogContent: "",
      noIcon: require("./../../../static/images/image_user_defult.png"),
      notification: true,
      successDialogShow: false,
      settingDialogShow: false,
      addContactDialogShow: false,
      developmentMessage: developmentMessage,
    };
  },
  computed: {
    ...mapState({
      chatUser: (state) => state.ws.chatUser,
    }),
  },
  created() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.setChatUser(this.userData);
    this.getUserId(this.chatUser)
  },
  methods: {
    ...mapMutations({
      setChatUser: "ws/setChatUser",
    }),
    noIconShow(iconData) {
      if (
        iconData.icon === undefined ||
        iconData.icon === null ||
        iconData.icon === ""
      ) {
        return this.noIcon;
      } else {
        return iconData.icon;
      }
    },
    copyPaste(data) {
      let url = document.createElement("input");
      document.body.appendChild(url);
      url.value = data;
      url.select();
      document.execCommand("copy");
      document.body.removeChild(url);
      this.$message({
        message: `ID : ${data} 复制成功`,
        type: "success",
        duration: 1000,
      });
    },
    goChatRoom(data, path) {
      this.$router.push({ name: path, params: data });
    },
    back() {
      this.$router.back(-1);
    },
    dialogShow(type) {
      this.settingDialogShow = true;
      switch (type) {
        case "block":
        case "unBlock":
          this.dialogContent = `确认是否${
            type === "block" ? "封锁" : "解除封锁"
          }好友${this.chatUser.name}？`;
          break;
        case "delete":
          this.dialogContent = `确认是否${type === "delete" ? "删除" : ""}好友${
            this.chatUser.name
          }？`;
          break;
        case "add":
          this.dialogContent = `确认是否将${this.chatUser.name}加入联络人`;
          break;
      }
    },
    submitBtn(dialogContent) {
      switch (dialogContent) {
        case `确认是否封锁好友${this.chatUser.name}？`:
          let blockId = this.chatUser.toChatId.replace("u", "");
          addBlockContactUser({ blockId }).then((res) => {
            if (res.code === 200) {
              this.successDialogShow = true;
              this.chatUser.isBlock = true;
              this.setChatUser(this.chatUser)
            }
          });
          break;
        case `确认是否解除封锁好友${this.chatUser.name}？`:
          let blockIdList = [this.chatUser.toChatId.replace("u", "")];
          unBlockContactUser({ blockIdList })
            .then((res) => {
              if (res.code === 200) {
                this.successDialogShow = true;
                this.chatUser.isBlock = false;
                this.setChatUser(this.chatUser)
              }
            })
            .catch((err) => {
              this.$message({ message: err, type: "error" });
              return false;
            });
          break;
        case `确认是否删除好友${this.chatUser.name}？`:
          let contactId = this.chatUser.toChatId.replace("u", "");
          deleteContactUser(contactId)
            .then((res) => {
              if (res.code === 200) {
                this.successDialogShow = true;
                this.chatUser.isContact = false;
                this.setChatUser(this.chatUser)
              }
            })
            .catch((err) => {
              this.$message({ message: err, type: "error" });
              return false;
            });
          break;
        case `确认是否将${this.chatUser.name}加入联络人`:
          let parmas = {
            contactId: this.chatUser.memberId,
            name: this.chatUser.username,
          };
          addContactUser(parmas).then((res) => {
            if (res.code === 200) {
              this.settingDialogShow = false;
              this.chatUser.isContact = true;
              this.addContactDialogShow = true;
              this.setChatUser(this.chatUser)
            }
          });
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
    .home-add-user {
      background-color: #fff;
      background-image: url("./../../../static/images/edit.png");
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
      }
    }
    .setting-button {
      padding: 0.5em 0 0.5em 0.5em;
      background-color: #fff;
      &::after {
        content: "";
        display: block;
        border-bottom: 1px solid #b3b3b3;
        width: 100%;
        margin-left: 10px;
        position: relative;
        top: 9px;
      }
      a {
        text-decoration: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5em 0.7em 0.5em 0;
        margin-left: 10px;
      }
      img {
        height: 1.2em;
      }
      .setting-button-left {
        display: flex;
        align-items: center;
        width: 20em;
        span {
          margin-left: 1em;
          font-size: 15px;
          color: #333333;
        }
      }
    }
    .setting-notification {
      padding: 1em 0.5em;
      background-color: #fff;
      margin: 1em 0;
      display: flex;
      justify-content: space-between;
      align-content: center;
      img {
        height: 1.2em;
      }
      .setting-button-left {
        display: flex;
        align-items: center;
        margin-left: 10px;
        width: 20em;
        span {
          margin-left: 1em;
          font-size: 15px;
          color: #333333;
        }
      }
    }
    .red-text {
      color: #ee5253 !important;
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

</style>
