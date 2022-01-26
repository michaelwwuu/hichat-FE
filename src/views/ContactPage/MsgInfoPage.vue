<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <el-header height="70px">
          <div class="home-header">
            <span class="home-header-title">資訊</span>
             <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          <div class="user-data">
            <el-image
              v-if="userData.icon !== undefined"
              :src="noIconShow(userData)"
              :preview-src-list="[noIconShow(userData)]"
            />
            <span>{{ userData.name }}</span>
          </div>
          <div
            class="setting-button"
            v-for="(item, index) in settingData"
            :key="index"
            @click="developmentMessage(item.name)"
          >
            <a>
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
        </div>
      </el-main>
    </el-container>

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
import {
  getSearchById,
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
          name: "查看相片和影片",
          icon: require("./../../../static/images/image_icon.png"),
          path: "",
        },
      ],
      groupDataList: [],
      noIcon:require("./../../../static/images/image_user_defult.png"),
      notification: true,
      successDialogShow: false,

      developmentMessage: developmentMessage,
    };
  },
  created() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.getUserId();
  },
  methods: {
    noIconShow(iconData){
      if(iconData.icon === undefined || iconData.icon === null || iconData.icon === ''){
        return this.noIcon
      }else{
        return iconData.icon
      }
    },
    getUserId() {
      let id = this.userData.toChatId.replace("u", "");
      getSearchById({ id }).then((res) => {
        this.userData.username = res.data.username;
        this.userData.name = res.data.name;
        this.userData.isBlock = res.data.isBlock;
        this.userData.isContact = res.data.isContact;
        localStorage.setItem("userData", JSON.stringify(this.userData));
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
  border-left:1px solid #e1e1e1b0;
  .home-header {
    .home-add-user {
      background-color: #fff;
      background-image: url("./../../../static/images/pc/edit_info.png");
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
