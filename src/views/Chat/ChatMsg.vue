<template>
  <div class="wrapper">
    <el-container>
      <el-main>
        <el-header height="55px">
          <div class="home-header">
            <router-link :to="'/HiChat'">
              <div class="home-user"></div>
            </router-link>
            <span class="home-header-title">通訊錄</span>
            <div class="home-user-search"></div>
            <router-link :to="'/AddUser'">
              <div class="home-add-user"></div>
            </router-link>
          </div>
        </el-header>
        <message-pabel
          :isAdmin="isAdmin"
          :messageData="messageData"
          :userInfoData="userInfoData"
          @isShowMoreBtn="isShowMoreBtn"
        />
        <message-input :userInfoData="userInfoData" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { mapState, mapMutations } from "vuex";
import MessagePabel from "@/components/message-pabel";
import MessageInput from "@/components/message-input-moblie";
import { getLocal, getToken } from "_util/utils.js";
export default {
  name: "ChatMsg",
  data() {
    return {
      concats: [],
      messageData: [],
      userMemberList: [],
      userInfoData: {
        token: getToken("token"),
        deviceId: getLocal("UUID"),
        tokenType: 0,
      },
      isAdmin: false,
    };
  },
  mounted() {
    if(!getToken("token")) return this.$router.push({ path: "/Login" });  
  },
  created() {
    Socket.$on("message", this.handleGetMessage);
    window.addEventListener("beforeunload", this.closeWebsocket);

  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
    this.closeWebsocket();
  },
  destroyed() {
    window.removeEventListener("beforeunload", this.closeWebsocket);
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
    }),
  },
  watch: {
    wsRes(val) {
      let chatType = val.chatType;
      switch (chatType) {
        case "SRV_JOIN_ROOM":
          this.$nextTick(() => {
            setTimeout(() => {
              // 過濾 socket 斷線不重新Show提示
              this.concats.forEach((el) => {
                this.userMemberList.push(el.username);
                // 封禁人員 自動解開
                this.banUserMsg(el)
              });
              // 新陣列 統計自己進入次數 長度大於一就不 Show 提示
              this.statisticalData = this.userMemberList.filter(el => el === val.username);
              if (this.statisticalData.length === 1) this.promptPopup(val)
              this.userMemberList = Array.from(new Set(this.userMemberList))
            });
          });  
          break;
        case "SRV_LEAVE_ROOM":
          // 斷線移除此人
          this.userMemberList = this.userMemberList.filter(el => el !== val.username);
          this.promptPopup(val)
          break;
      }
    }, 
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
    }),
   
    // 訊息統一格式
    messageList(data) {
      this.chatRoomMsg = {
        banRemainTime: data.banRemainTime,
        chatType: data.chatType,
        chatRoomId: data.toChatId,
        platformCode: data.platformCode,
        historyId: data.historyId,
        message: {
          time: data.sendTime,
          content: data.text
        },
        username: data.fromChatId,
      };
    },


    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg) {
      this.setWsRes(JSON.parse(msg));
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        // 加入房间成功
        case "SRV_JOIN_ROOM":
        // 离开房间成功
        case "SRV_LEAVE_ROOM": 
          // 房主排序第一
          this.concats = userInfo.roomMemberList.sort((a, b) => b.isAdmin - a.isAdmin);
          this.$nextTick(() => {
            setTimeout(() => {
              if(!getLocal('isGuest')){
                this.chatAdminUser = this.concats.filter(el => el.username === getLocal("username"))
                this.isAdmin = true && this.chatAdminUser[0].isAdmin;
              }
            })
          })
          break
        // 发送讯息成功
        case "SRV_ROOM_SEND":
        // 发送红包成功 目前只有事件 没有功能
        case "SRV_ROOM_RED":
          this.concats.forEach((res) => {
            if (userInfo.fromChatId === res.username) return (userInfo.banRemainTime = res.banRemainTime);
          });
          this.messageList(userInfo)
          this.messageData.push(this.chatRoomMsg);
          break;
        // 封禁成功   
        case "SRV_ROOM_BAN":
        // 解除封禁
        case "SRV_ROOM_LIFT_BAN":
          this.concats.forEach(el => this.banUserInput(el,userInfo));
          this.messageData.forEach(el => this.banUserInput(el,userInfo));
          break;
        // 历史讯息
        case "SRV_ROOM_HISTORY_RSP":
          let historyMsgList = userInfo.historyMessage;
          let historyPageSize = userInfo.pageSize;
          if (historyMsgList.length !== historyPageSize) this.isShowMoreMsg = false;
          historyMsgList.forEach((el) => {
            this.concats.forEach((res) => {
              if (el.fromChatId === res.username) return (el.banRemainTime = res.banRemainTime);
            });
            this.banUserMsg(el)
            this.messageList(el)
            this.messageData.unshift(this.chatRoomMsg);
          });
          break;  
      }
    },

    // 通知加入
    promptPopup(data){
      this.$notify({
        title: `通知`,
        dangerouslyUseHTMLString: true,
        message: `
          <div class="notify-content" style="font-size:16px; font-weight:600">
            <strong class="notify-title">${data.chatType === 'SRV_JOIN_ROOM' ? '欢迎':''}:)</strong>
            <span><strong>【${data.username}】${data.chatType === 'SRV_JOIN_ROOM' ? '进入':'离开'}聊天室</strong</span>
          </div>
        `,
      });
    },


    // 封禁列表 讯息内
    banUserMsg(el){
      let banUserTime = el.banRemainTime > 49392123903 ? 49392123903: el.banRemainTime 
      setTimeout(() => {
        return el.banRemainTime = null
      },banUserTime);
    },

    // 封禁列表 输入框
    banUserInput(el,userInfo){
      let banUserTime = userInfo.banRemainTime > 49392123903 ? 49392123903: userInfo.banRemainTime;
      if (el.username === userInfo.banUser) {
        el.banRemainTime = userInfo.banRemainTime
        setTimeout(() => {
          return el.banRemainTime = null
        },banUserTime);
      }
      

    },

    // 历史讯息查看按钮
    isShowMoreBtn(val) {
      this.isShowMoreMsg = val;
    },


    // 关闭socket
    closeWebsocket() {
      Socket.onClose();
      window.location.reload();
    },
  },
  components: {
    MessagePabel,
    MessageInput,
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  min-height: 100%;
  width: 100%;
  background-color: #eaf5fa;
  overflow: hidden;
  .el-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    // width: 95%;
    // margin: 30px auto;
    .el-aside,
    .el-main {
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      /deep/.el-row {
        float: right;
        .el-button {
          background-image: linear-gradient(#579fff, #3481e8);
          color: #ffffff;
        }
        .el-checkbox__inner {
          border-radius: 0;
          border: 1px solid #dcdfe6;
          &::after {
            border: 1px solid #4fba00;
            border-left: 0;
            border-top: 0;
          }
        }
        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: #ffffff;
        }
        .el-checkbox__label {
          color: #fff;
        }
      }
    }
    .el-aside {
      border-radius: 6px 0px 6px 6px;
    }
    .el-main {
      border-radius: 0px 6px 6px 6px;
    }
    .el-aside {
      background: rgba(235, 233, 232, 0.8);
    }
    .el-main {
      padding: 0;
    }
    .el-header {
      padding: 0;
      position: relative;
      overflow: hidden;
      border-right: 1px solid #ffffff;
      .home-header {
        margin: 1em;
        display: flex;
        align-items: center;
        .home-user {
          width: 2em;
          height: 2em;
          border-radius: 10px;
          background-color: #fff;
          background-image: url("./../../../static/images/back.png");
          background-size: 50%;
          background-position: center;
          background-repeat: no-repeat;
        }
        .home-header-title {
          margin: 0 auto 0 8em;
          color: #10686e;
          font-weight: 600;
        }
        .home-add-user,.home-user-search{
          width: 2em;
          height: 2em;
          border-radius: 10px;
          background-color: #fff;
          background-size: 50%;
          background-position: center;
          background-repeat: no-repeat;
        }
        .home-user-search{
          margin-right: 10px;
          background-image: url("./../../../static/images/search_icon.png");

        }
        .home-add-user{
          background-image: url("./../../../static/images/add_user.png");

        }
      }
      img {
        position: relative;
        top: 7px;
      }
      .online-img {
        position: relative;
        top: 9px;
      }
      .title,
      .icon-message {
        color: #ffffff;
      }
      .icon-message {
        font-size: 20px;
        vertical-align: middle;
      }
      .title {
        display: inline-block;
        margin-left: 5px;
        font-size: 16px;
        letter-spacing: 1px;
      }
    }
  }
  .footer {
    position: absolute;
    bottom: -23px;
    right: 0;
    left: 0;
    margin: auto;
    font-size: 13px;
    width: 150px;
    color: #ffffff;
    text-align: center;
    a {
      color: #ffffff;
      &:hover {
        color: #377ec8;
      }
    }
  }
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey; 

  // border-radius: 10px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background-image: linear-gradient(180deg,rgb(138, 138, 138), rgb(138, 138, 138));
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background-image: linear-gradient(180deg,rgb(138, 138, 138), rgb(138, 138, 138));

}
</style>
