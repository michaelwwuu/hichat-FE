<template>
  <div class="home-wrapper">
    <div class="home-header">
      <div class="home-user" @click="back"></div>
      <span class="home-header-title"></span>
      <div class="home-add-user"></div>
    </div>
    <div class="address-content">
      <div class="user-data">
        <el-image
          v-if="groupData.icon !== undefined"
          :src="groupData.icon"
          :preview-src-list="[groupData.icon]"
        />
        <div>
          <span>{{ groupData.groupName }}</span>
          <span class="user-data-id">
            <span class="user-paste" ></span>
          </span>
        </div>
      </div>

      <div
        class="setting-button"
        v-for="(item, index) in settingData"
        :key="index"
        @click="developmentMessage(item.name)"
      >
        <span @click="goChatRoom(groupData, item.path)">
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

      <div class="setting-delete" @click="dialogShow('delete')">
        <span>
          <div class="setting-button-left">
            <img src="./../../../static/images/logout.png" alt="" />
            <span>退出群组</span>
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
        <span>{{dialogContent}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="border-red" @click="settingDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="submitBtn(dialogContent)">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { developmentMessage } from "@/assets/tools";
import { getSearchById,addBlockUser,unBlockUser,deleteUser } from "@/api";

export default {
  name: "GroupPage",
  data() {
    return {
      groupData: {},
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
        {
          name: "成員",
          icon: require("./../../../static/images/users.png"),
          path: "",
        },
      ],
      dialogContent:'',
      notification: true,
      settingDialogShow:false,
      developmentMessage: developmentMessage,
    };
  },
  created() {
    this.groupData = JSON.parse(localStorage.getItem("groupData"));
  },
  methods: {
    goChatRoom(data, path) {
      this.$router.push({ name: path, params: data });
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
