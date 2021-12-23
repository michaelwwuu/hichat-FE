<template>
  <div class="home-wrapper">
    <div class="home-header">
      <div class="home-user" @click="back"></div>
      <span class="home-header-title"></span>
      <router-link :to="'/EditContact'">
        <div class="home-add-user"></div>
      </router-link>
    </div>
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

      <div
        class="setting-button"
        v-for="(item, index) in settingData"
        :key="index"
        @click="developmentMessage(item.name)"
      >
        <span @click="goChatRoom(userData, item.path)">
          <div class="setting-button-left">
            <img :src="item.icon" alt="" />
            <span>{{ item.name }}</span>
          </div>
          <img src="./../../../static/images/next.png" alt="" />
        </span>
      </div>

      <div class="setting-notification" @click="developmentMessage('提醒通知')">
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
        class="setting-disable"
        @click="dialogShow(!userData.isBlock ? 'block' : 'unBlock')"
      >
        <span>
          <div class="setting-button-left">
            <img src="./../../../static/images/blockade.png" alt="" />
            <span>{{ blockContent }}</span>
          </div>
        </span>
      </div>
      <div class="setting-delete" @click="dialogShow('delete')">
        <span>
          <div class="setting-button-left">
            <img src="./../../../static/images/trash.png" alt="" />
            <span>刪除联络人</span>
          </div>
        </span>
      </div>
    </div>
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
  </div>
</template>

<script>
import { developmentMessage } from "@/assets/tools";
import { getSearchById, addBlockUser, unBlockUser, deleteUser } from "@/api";

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
      blockContent: "",
      notification: true,
      settingDialogShow: false,
      developmentMessage: developmentMessage,
    };
  },
  created() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.getUserId();
  },
  methods: {
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
    getUserId() {
      let id = this.userData.toChatId.replace("u", "");
      getSearchById({ id }).then((res) => {
        this.blockContent = !res.data.isBlock ? "封锁联络人" : "解除封锁";
        this.userData.username = res.data.username;
        this.userData.name = res.data.name;
        this.userData.isBlock = res.data.isBlock;
        localStorage.setItem("userData", JSON.stringify(this.userData));
      });
    },
    back() {
      this.$router.back(-1);
    },
    dialogShow(type) {
      this.settingDialogShow = true;
      console.log(type);
      switch (type) {
        case "block":
        case "unBlock":
          this.dialogContent = `确认是否${
            type === "block" ? "封锁" : "解除封锁"
          }好友${this.userData.name}？`;
          break;
        case "delete":
          this.dialogContent = `确认是否${type === "delete" ? "删除" : ""}好友${
            this.userData.name
          }？`;
          break;
      }
    },
    submitBtn(dialogContent) {
      switch (dialogContent) {
        case `确认是否封锁好友${this.userData.name}？`:
          let blockId = this.userData.toChatId.replace("u", "");
          addBlockUser({ blockId }).then((res) => {
            if (res.code === 200) {
              this.settingDialogShow = false;
              this.back()
            }
          });
          break;
        case `确认是否解除封锁好友${this.userData.name}？`:
          let blockIdList = [this.userData.toChatId.replace("u", "")];
          unBlockUser({ blockIdList }).then((res) => {
            if (res.code === 200) {
              this.settingDialogShow = false;
              this.back()
            }
          });
          break;
        case `确认是否删除好友${this.userData.name}？`:
          console.log(456);
          let contactId = this.userData.toChatId.replace("u", "");
          deleteUser(contactId).then((res) => {
            if (res.code === 200) {
              this.settingDialogShow = false;
              this.$router.push({ name: "Address" });
            }
          });
          break;
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
  .address-content {
    .user-data {
      margin: 2.5em auto;
      text-align: center;
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
        margin-top: 0.3em;
        font-weight: 600;
      }
      .el-image {
        width: 4em;
      }    
    }
    .setting-button,
    .setting-disable,
    .setting-delete {
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
      span {
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
      padding: 1em 0.5em 1em 0.5em;
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

    .setting-delete {
      span {
        color: #ee5253 !important;
      }
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
