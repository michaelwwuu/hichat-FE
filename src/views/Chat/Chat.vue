<template>
  <div class="wrapper">
    <!-- <div class="search">
      <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="searchForm.name"  placeholder="请输入 不輸入則顯示所有聊天室" style="width: 250px; margin-right: 10px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSearch">搜寻</el-button>
        </el-form-item>
      </el-form>
      
    </div>
    <div class="search-list">
      <span>聊天室選擇 :</span>
      <el-row v-for="item in searchData" :key="item.i">
        <el-button type="primary" plain round>{{item.chatRoomName}}</el-button>
      </el-row>
    </div> -->
    <el-container>
      <el-aside width="290px">
        <el-header height="55px">
          <img src="./../../../static/images/user-group.svg" alt="" />
          <span class="title"
            >聊天室人數
            <img
              class="online-img"
              src="./../../../static/images/online.svg"
              alt=""
            />{{ concats.length }}</span
          >
        </el-header>
        <message-group :concats="concats" />
      </el-aside>
      <el-main>
        <el-header height="55px">
          <el-row>
            <el-button
              size="mini"
              style="margin-right: 15px"
              @click="clearDialog = true"
              >清频</el-button
            >
            <el-checkbox v-model="checked">滚动</el-checkbox>
          </el-row>
        </el-header>
        <message-pabel
          :roomMsg="roomMsg"
          :localInfo="localInfo"
          :nowSwitchId="nowSwitchId"
          @message="message" />
        <message-input
          :concats="concats"
          :localInfo="localInfo"
        />
      </el-main>
      <footer class="footer">
        <a href="https://xiaobaicai.fun/" target="_blank">WeiLin</a> &copy; 2020
      </footer>
      <audio id="notify-audio" src="./../../../static/wav/tim.wav"></audio>
    </el-container>
    <el-dialog
      title="聊天室清除"
      :visible.sync="clearDialog"
      width="30%"
      center
    >
      <span>確定要清除聊天室</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="clearChat">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { mapState,mapMutations } from "vuex";
import MessageGroup from "@/components/message-group";
import MessagePabel from "@/components/message-pabel";
import MessageInput from "@/components/message-input";
import { getSearchChat } from "@/api";

export default {
  name: "Chat",
  data() {
    return {
      concats: [],
      searchData: [],
      roomMsg:[],
      clearDialog: false,
      checked: true,
      nowSwitch: 0,
      nowSwitchId: 'group',
      localInfo: {},
      searchForm: {
        pageSize: 10,
        pageNum: 1,
        name: "",
      },
      
    };
  },
  created() {
    Socket.$on("message", this.handleGetMessage);
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
    }),
  },
  watch: {
    wsRes(val) {
      const StatusCode = val;
      StatusCode === 0 && this.$message({ type: "error", message: "查詢失敗" });
      let chatType = val.chatType;
      switch (chatType) {
        case "SRV_JOIN_ROOM":
          console.log('<--成功連線------聊天室人員已列表加載-->')
          this.concats = StatusCode.roomMemberList
          this.adminUser = {
            chatRoomId: "c1",
            createTime: 1631327281438,
            id: "0",
            isAdmin: false,
            memberId: "admin",
            nickname: "彩票之神 -- 百投百胜",
            username: "master-admin",
          },
          this.concats.unshift(this.adminUser)
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    if (localStorage.getItem("token") === '') this.goBack();
    this.advertiseMsg()
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
    }),
    advertiseMsg(){
      let adminRoomMsg = {
        chatType: 'SRV_ROOM_SEND',
        avatar: require("./../../../static/avatar/group.png"),
        fromId: "admin",
        gotoId: "c1",
        message: { 
          time: +new Date(), 
          content: "欢迎大家来到彩票之神 --百投百胜群组，跟着彩票之神投注，百投百胜，就是你们，万中选一，跟着我走必会胜利，机会不等人，赶快下注！ ！", 
          textContent: "欢迎大家来到彩票之神 --百投百胜群组，跟着彩票之神投注，百投百胜，就是你们，万中选一，跟着我走必会胜利，机会不等人，赶快下注！ ！" 
        },
        nickName:"彩票之神 -- 百投百胜",
      };
      this.roomMsg.push(adminRoomMsg)
    },
    // 收取 socket 回來訊息
    handleGetMessage(msg) {
      // 一些全局的動作可以放在這裡
      this.setWsRes(JSON.parse(msg));
      let userInfo = JSON.parse(msg)
      switch (userInfo.chatType) {
        case "SRV_RECENT_CHAT":
          console.log('<--成功連線------寫入登入者資訊-->')
          this.localInfo = {
            fromChatId: userInfo.toChatId,
          };
          break;
        case "SRV_ROOM_SEND":
          console.log('<--成功連線------群組內所有人訊息-->',userInfo)
          if(userInfo.fromChatId === "u120"){
            this.userImg = require("./../../../static/avatar/avatar_03.jpg")
            this.userRoomName = "jed"
          }else if(userInfo.fromChatId === "u146"){
            this.userImg = require("./../../../static/avatar/avatar_02.jpg")
            this.userRoomName = "michael"
          }
          let srvRoomMsg = {
            chatType: userInfo.chatType,
            avatar: this.userImg,
            fromId: userInfo.fromChatId,
            gotoId: userInfo.toChatId,
            message: { 
              time: +new Date(), 
              content: userInfo.text, 
              textContent: userInfo.text 
            },
            nickName: this.userRoomName,
          };
          this.roomMsg.push(srvRoomMsg)
          break;
        default:
          break;
      }
    },
    onSearch() {
      getSearchChat(this.searchForm)
        .then((res) => {
          if (res.code === 200) {
            this.searchData = res.data.list;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 接收消息-父件需用到資料時
     */
    message(response) {
      let chatType = response.chatType
      switch (chatType) {
        case "CLI_ROOM_SEND":
          this.roomMsg.push(response)
        default:
          break;
      }
      // let notifyAudio = document.getElementById("notify-audio");

      // // 服务器返回的消息
      // if (type === "server-message") {
      //   if (respone.id === "robots") {
      //     id = "robots";
      //   }
      // }

      // // 更新联系人消息
      // for (let i = 0; i < length; i++) {
      //   if (concats[i].id === id) {
      //     Object.assign(this.concats[i].message, body.message);
      //   }
      // }
    },
    clearChat() {
      this.clearDialog = false;
      this.roomMsg = []
    },
    /**
     * 防呆 判定使用者是否正確
     */
    goBack() {
      localStorage.clear();
      this.$$route.push({ path: "/Login" });
    },
  },
  components: {
    MessageGroup,
    MessagePabel,
    MessageInput,
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  background-image: url("/static/images/bg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  .search {
    display: inline-flex;
    align-content: center;
    position: fixed;
    top: 0px;
    bottom: 0;
    left: 0;
    right: 0;
    width: 95%;
    margin: 30px auto;
  }
  .search-list {
    display: inline-flex;
    align-content: center;
    align-items: center;
    position: fixed;
    top: 45px;
    bottom: 0;
    left: 0;
    right: 0;
    width: 95%;
    height: 6%;
    margin: 30px auto;
    div {
      margin-left: 10px;
    }
  }
  .el-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 95%;
    margin: 30px auto;
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
      position: relative;
      line-height: 55px;
      background-image: linear-gradient(#579fff, #3481e8);
      overflow: hidden;
      border-right: 1px solid #ffffff;
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
</style>
