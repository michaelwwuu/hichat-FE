<template>
  <div class="home-content" @touchmove="$root.handleTouch">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="联络人" name="address">
        <div
          v-for="(item, index) in hiChatDataList"
          :key="index"
          class="address-box"
          @click="goChatRoom(item,'ChatMsg')"
        >
          <el-image
            :src="
              item.icon === undefined || item.icon === null || item.icon === ''
                ? require('./../../../../static/images/image_user_defult.png')
                : item.icon
            "
          />
          <div class="contont-box">
            <div class="msg-box">
              <div>
                <span>{{ item.name }}</span>
                <span v-if="item.lastChat.chatType === 'SRV_USER_SEND'" class="content-text">
                  <span>{{item.lastChat.text}}</span>
                  <span v-if="item.lastChat.text.length > 55">...</span>
                </span>
                
                <span v-else-if="item.lastChat.chatType === 'SRV_USER_AUDIO'" class="content-text">
                  传送了语音</span
                >
                <span v-else-if="item.lastChat.chatType === 'SRV_USER_IMAGE'" class="content-text">
                  传送了图片</span
                >
              </div>
              <div class="time">
                {{ $root.formatTimeDay(item.lastChat.sendTime) }}
                <div class="el-badge-box">
                  <el-badge
                    :value="item.unreadCount"
                    class="item"
                    v-if="item.unreadCount !== 0"
                  ></el-badge>
                </div>
              </div>
            </div>
            <div class="contont-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="群组" name="group">
        <div
          v-for="(item, index) in groupDataList"
          :key="index"
          class="address-box"
          @click="goChatRoom(item,'ChatGroupMsg')"
        >
          <el-image
            :src="
              item.icon === undefined || item.icon === null || item.icon === ''
                ? require('./../../../../static/images/image_group_defult.png')
                : item.icon
            "
          />
          
          <div class="contont-box">
            <div class="msg-box">
              <div>
                <span>{{ item.name }}</span>
                <span v-if="item.lastChat.chatType === 'SRV_GROUP_SEND'"  class="content-text">                 
                  <span>{{item.lastChat.text}}</span>
                  <span v-if="item.lastChat.text.length > 55">...</span>
                </span>
                <span v-else-if="item.lastChat.chatType === 'SRV_GROUP_AUDIO'" class="content-text"
                  >传送了语音</span
                >
                <span v-else-if="item.lastChat.chatType === 'SRV_GROUP_IMAGE'" class="content-text"
                  >传送了图片</span
                >
              </div>
              <div class="time">
                {{ $root.formatTimeDay(item.lastChat.sendTime) }}
                <div class="el-badge-box">
                  <el-badge
                    :value="item.unreadCount"
                    class="item"
                    v-if="item.unreadCount !== 0"
                  ></el-badge>
                </div>
              </div>
            </div>
            <div class="contont-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="陌生讯息"
        name="contact"
        v-if="contactDataList.length > 0"
      >
        <span slot="label" v-if="contactDataList.length > 0">
          <span>陌生讯息</span>
          <el-badge v-if="messageNum" is-dot class="contact-badge"></el-badge>
        </span>
        <div
          v-for="(item, index) in contactDataList"
          :key="index"
          class="address-box"
          @click="goChatRoom(item,'ChatMsg')"
        >
          <el-image
            :src="
              item.icon === undefined || item.icon === null || item.icon === ''
                ? require('./../../../../static/images/image_user_defult.png')
                : item.icon
            "
          />
          <div class="contont-box">
            <div class="msg-box">
              <div>
                <span>{{ item.name }}</span>
                <span v-if="item.lastChat.chatType === 'SRV_USER_SEND'" class="content-text">
                  <span>{{item.lastChat.text}}</span>
                  <span v-if="item.lastChat.text.length > 55">...</span>
                </span>
                
                <span v-else-if="item.lastChat.chatType === 'SRV_USER_AUDIO'" class="content-text">
                  传送了语音</span
                >
                <span v-else-if="item.lastChat.chatType === 'SRV_USER_IMAGE'" class="content-text">
                  传送了图片</span
                >
              </div>
              <div class="time">
                {{ $root.formatTimeDay(item.lastChat.sendTime) }}
                <div class="el-badge-box">
                  <el-badge
                    :value="item.unreadCount"
                    class="item"
                    v-if="item.unreadCount !== 0"
                  ></el-badge>
                </div>
              </div>
            </div>
            <div class="contont-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { mapState, mapMutations } from "vuex";
import { getGroupList } from "@/api";

export default {
  name: "HiChat",
  data() {
    return {
      searchKey: "",
      activeName: "address",
      groupList:{},
      groupDataList: [],
      hiChatDataList: [],
      newMsgDataList: [],
      contactDataList: [],
      messageNum:false,
    };
  },
  created() {
    Socket.$on("message", this.handleGetMessage);
    this.getGroupDataList()
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
    }),
  },
  mounted() {
    this.getHiChatDataList();
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
      setChatUser: "ws/setChatUser",
    }),
    handleClick(tab, event) {
      console.log(tab.name);
    },
    getHiChatDataList() {
      let chatMsgKey = {
        chatType: "CLI_RECENT_CHAT",
        id: Math.random(),
        tokenType: 0,
        deviceId: localStorage.getItem("UUID"),
        token: localStorage.getItem("token"),
      };
      Socket.send(chatMsgKey);
    },
    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg) {
      this.setWsRes(JSON.parse(msg));
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        //成功收到
        case "SRV_RECENT_CHAT":
          this.hiChatDataList = userInfo.recentChat.filter(
            (item) => item.isContact
          );
          this.groupDataList = userInfo.recentChat.filter(
            (item) => item.isGroup
          );
          this.contactDataList = userInfo.recentChat.filter(
            (item) => !item.isContact && item.isContact !==null
          );
          this.messageNum = this.contactDataList.some(item => item.unreadCount > 0)
           break;
        case "SRV_USER_IMAGE":
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
        case "SRV_GROUP_SEND":
          this.getHiChatDataList();
          break;
      }
    },
    getGroupDataList(){
      getGroupList().then((res) => {
        this.groupList = res.data.list
      })
    },
    goChatRoom(data,path) {
      if(path === 'ChatMsg'){
        localStorage.setItem("userData", JSON.stringify(data));
        this.setChatUser(data);
      } else {
        data.icon = data.icon
        data.groupName = data.name
        data.groupId = data.toChatId.replace("g", "");
        data.memberId = JSON.parse(data.forChatId.replace("u", ""));
        this.groupList.forEach((item)=>{
          if(item.groupName === data.groupName){
            return data.isAdmin = item.isAdmin
          }
        })
        localStorage.setItem("groupData", JSON.stringify(data))
      }
      if(localStorage.getItem('device') ==='moblie') {
        this.$router.push({ name: path });
      }else{
        let getHistoryMessage = {
          chatType: "CLI_HISTORY_REQ",
          toChatId: data.toChatId,
          id: Math.random(),
          tokenType: 0,
          targetId: "",
          pageSize: 1000,
          deviceId: localStorage.getItem("UUID"),
          token: localStorage.getItem("token"),
        }
        Socket.send(getHistoryMessage);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.address-box {
  cursor: pointer;
  &:hover{
    background-color: #ebeaea81;
  }
  .contont-box{
    padding-left: 1em;
    height:48px;
    .msg-box {
      height: 48px;
      display: flex;
      span {
        display: block;
        font-size: 16px;
        &:nth-child(1) {
          margin-bottom: 7px;
        }
      }
      .content-text{
        display: flex;
        font-size: 14px;
        opacity: 0.5;
        span{
          &:nth-child(1) {
            width: 10em;
            overflow: hidden;
            margin-bottom:0;
            font-size: 14px;
          }
          &:nth-child(2) {
            opacity: 1;
            font-size: 14px;
          }
        }
      }
      .time {
        position: absolute;
        right: 1.5em;
        font-size: 14px;
        .el-badge-box {
          height: 25px;
          .el-badge {
            display: block;
            top: 5px;
          }
        }
      }
    }
    .contont-border-bottom{
      width: 100vw;
      border-bottom: 0.02em solid #b3b3b3;
      position: absolute
    }
  }
}
.contact-badge{
  vertical-align: initial;
  padding-left: 5px;
}
</style>
