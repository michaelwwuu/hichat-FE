<template>
  <div class="home-content" @touchmove="$root.handleTouch">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="联络人" name="address">
        <div
          class="address-box"
          v-for="(item, index) in contactList"
          :key="index"
          @click="goContactPage(item, 'ContactPage')"
        >
          <el-image :src="noIconShow(item,'user')" />
          <div class="contont-box">
            <div class="msg-box">
              <div :class="{'noOnline-tip':onlineMsg(item) === ''}">
                <span style="margin-top: 1px;">{{ item.name }}</span>
                <span class="content-text" :class="onlineMsg(item) === '在线'?'green-text':'gray-text'" v-if="onlineMsg(item) !== ''"><span>{{onlineMsg(item)}}</span></span>
              </div>
            </div>
            <div class="contont-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="群组" name="group">
        <div
          class="address-box"
          v-for="(item, index) in groupData"
          :key="index"
          @click="goContactPage(item, 'GroupPage')"
        >
          <el-image :src="noIconShow(item,'group')" />
          <div class="contont-box group">
            <span>{{ item.groupName }}</span>
            <div class="contont-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="可能认识" name="maybeKnow" v-if="maybeKnowDataList.length !== 0">
        <div
          class="address-box"
          v-for="(item, index) in maybeKnowDataList"
          :key="index"
        >
          <!-- @click="goContactPage(item, 'GroupPage')" -->
          <el-image :src="noIconShow(item,'user')" />
          <div class="contont-box group">
            <div style="display: flex; align-items: center;">
              <span>{{ item.nickname }}</span>
              <div style="position: absolute; right: 1.5em;" @click="addContactBoxShow(item)">
                <img v-if="device === 'pc'" src="./../../../../static/images/pc/user-plus.svg" alt=""  >
                <img v-else src="./../../../../static/images/add_user.png" alt="" style="height: 1.5em">
              </div>
            </div>
            <div class="contont-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :title="device === 'pc' ? '新增联络人':''"
      :visible.sync="addContactShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device !== 'pc'"><img src="./../../../../static/images/warn.svg" alt="" /></div>
        <span>确认是否加为联络人</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :class="device === 'pc' ? 'background-gray' : 'border-red'" @click="addContactShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="addContact()">确认</el-button>
      </span>
    </el-dialog>    
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { getToken } from "_util/utils.js";
import { mapState, mapMutations } from "vuex";
import { getContactList, getGroupList, getSearchById,getMemberActivity,maybeKnow,addContactUser } from "@/api";
export default {
  name: "Address",
  data() {
    return {
      activeName: "address",
      addInfo:{},
      groupData: [],
      contactList: [],
      memberActivityData:[],
      maybeKnowDataList:[],
      addContactShow:false,
      device: localStorage.getItem("device"),
    };
  },
  created() {
    this.getDataList();
    this.getMaybeKnow()
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.setActiveName(this.activeName);
    Socket.$on("message", this.handleGetMessage);
    this.memberTime = setInterval(() => {
      this.getUserMemberActivity(this.memberActivityData)
    }, 30000);
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
    clearInterval(this.memberTime)
  },
  mounted() {
    this.homeScrollHeight()
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      chatUser: (state) => state.ws.chatUser,
      groupList: (state) => state.ws.groupList,
      groupUser: (state) => state.ws.groupUser,
      myUserInfo: (state) => state.ws.myUserInfo,
      myContactDataList: (state) => state.ws.myContactDataList,
    }),
  },
  watch:{
    chatUser(val){
      if(JSON.stringify(val) === '{}'){
        this.getDataList()
        this.getMaybeKnow()
      }
    },
    myContactDataList(val){
      this.contactList = val
    },
    groupList(val){
      this.groupData = val
    },
  },
  methods: {
    ...mapMutations({
      setInfoMsg: "ws/setInfoMsg",
      setChatUser: "ws/setChatUser",
      setChatGroup: "ws/setChatGroup",
      setAuthority:"ws/setAuthority",
      setGroupList: "ws/setGroupList",
      setMsgInfoPage: "ws/setMsgInfoPage",
      setActiveName: "ws/setActiveName",
      setMaybeKnowNum:"ws/setMaybeKnowNum",
      setMyContactDataList:"ws/setMyContactDataList"
    }),
    homeScrollHeight(){
      let scrollTop = document.querySelector(".home-content");
      let headerScrollTop = document.querySelector(".is-top");
      let tabsContentHeight = scrollTop.scrollHeight - headerScrollTop.scrollHeight
      document.querySelector(".el-tabs__content").style.height = tabsContentHeight + 'px';      
    },
    addContactBoxShow(data){
      this.addContactShow = true
      this.addInfo = data
    },
    addContact(){
      let parmas = {
        contactId: this.addInfo.memberId,
        name: this.addInfo.nickname,
      };
      addContactUser(parmas)
        .then((res) => {
          if (res.code === 200) {
            this.$message({ message: '添加成功', type: "success" });
            this.addContactShow = false;
            this.addInfo = {}
            this.getMaybeKnow()
          } 
        })
    },
    handleClick() {
      this.setInfoMsg({ infoMsgShow: false });
      this.setActiveName(this.activeName);
      if(this.activeName === "address"){
        this.memberTime = setInterval(() => {
          this.getUserMemberActivity(this.memberActivityData)
        }, 30000);
      }else{
        clearInterval(this.memberTime)
      }
    },
    getDataList() {
      getContactList().then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((el) => {
          if (el.contactId === localStorage.getItem("id")) {
            el.name = "嗨聊记事本";
            el.icon = require("./../../../../static/images/image_savemessage.png");
            el.toChatId = "u" + el.memberId;
          } else if (el.icon === undefined) {
            el.icon = require("./../../../../static/images/image_user_defult.png");
          }       
          this.memberActivityData.push(el.contactId)   
        });   
        this.getUserMemberActivity(this.memberActivityData)
      });
      getGroupList().then((res) => {
        res.data.list.forEach((el) => {
          if (el.icon === "") {
            el.icon = require("./../../../../static/images/image_group_defult.png");
          }
          return el.groupId !== 488
        });
        this.groupData = res.data.list.filter((el)=>{
          return el.groupName !== undefined
        })
        this.setGroupList(this.groupData);
      });
 
    },
    getMaybeKnow(){
      maybeKnow().then((res) => {
        this.maybeKnowDataList = res.data
        this.setMaybeKnowNum(this.maybeKnowDataList.length)
        this.getDataList()
        if(this.maybeKnowDataList.length === 0) this.activeName = "address"
      })
    },
    noIconShow(iconData, key) {
      if ([undefined, null, ""].includes(iconData.icon)) {
        return require(`./../../../../static/images/image_${key}_defult.png`);
      } else {
        return iconData.icon;
      }
    },    
    getUserMemberActivity(data){
      let memberId = data
      getMemberActivity({memberId}).then((res) => {
        if(res.code === 200){
          this.userTimeData = res.data
          this.contactList.forEach((list)=>{
            this.userTimeData.forEach((data) => {
              if(list.contactId === JSON.stringify(data.memberId)){
                list.currentTime = data.currentTime 
                list.lastActivityTime = data.lastActivityTime
              }
            });
          })
          this.setMyContactDataList(this.contactList);
        }
      })
    },
    onlineMsg(data){
      if(data.lastActivityTime === 0 || data.name === "嗨聊记事本" ) {
        return ""
      } else {
        let nowTime = data.currentTime
        let lastTime = data.lastActivityTime
        const diffInMills = nowTime - lastTime
        if (diffInMills/1000 < 300){
          return "在线";
        } else {
          return "上次上线于" + this.$root.formatTimeS(data.lastActivityTime)
        }
      } 
    },
    getUserId(data) {
      let id = data.contactId;
      getSearchById({ id }).then((res) => {
        if (res.data.id === this.myUserInfo.id) {
          data.name = "嗨聊记事本";
          data.forChatId = "u" + res.data.id;
          data.icon = require("./../../../../static/images/image_savemessage.png");
        } else {
          data.name = res.data.name;
        }
        data.isBlock = res.data.isBlock;
        data.isContact = res.data.isContact;
        data.username = res.data.username;
        this.setChatUser(data);
      });
    },
    goContactPage(data, path) {
      if (path === "ContactPage") {
        data.toChatId = "u" + data.contactId;
        data.type = this.device === "pc" ? "address" : "";
        this.device === "pc" ? this.getUserId(data) : this.setChatUser(data);
      } else {
        data.toChatId = "g" + data.groupId;
        data.type = this.device === "pc" ? "address" : "";
        this.setChatGroup(data);
        if(data.isAdmin){
          localStorage.removeItem("authority")
        }else if(data.isManager){
          this.setAuthority(data.authority)
        }else if(!data.isAdmin && !data.isManager){
          localStorage.removeItem("authority")
        }
      }
      if (this.device === "moblie") {
        this.setInfoMsg({ infoMsgShow: true, infoMsgNav: path, infoMsgChat:false ,infoMsgMap:'address' });
        this.$router.push({ name: path });
      } else {
        this.setInfoMsg({ infoMsgShow: true, infoMsgNav: path, infoMsgChat:false ,infoMsgMap:'address' });
        this.setMsgInfoPage({ pageShow: true, type: "" });
      }
    },
    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg) {
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        case "SRV_USER_IMAGE":
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
        case "SRV_GROUP_IMAGE":
        case "SRV_GROUP_AUDIO":
        case "SRV_GROUP_SEND":
          this.getHiChatDataList();
          break;
        case "SRV_EDIT_CONTACT":  
          this.getMaybeKnow();
          break
      }
    },
    getHiChatDataList() {
      let chatMsgKey = {
        chatType: "CLI_RECENT_CHAT",
        id: Math.random(),
        tokenType: 0,
        token: getToken("token"),
        deviceId: localStorage.getItem("UUID"),
      };
      Socket.send(chatMsgKey);
    },      
  },
};
</script>
<style lang="scss" scoped>
.home-content{
  overflow: hidden !important;
  .address-box {
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    .contont-box {
      .msg-box {
        .content-text {
          span {
            &:nth-child(2) {
              opacity: 1;
              font-size: 14px;
            }
          }
        }
      }

    } 
  }
}

/deep/.el-dialog-loginOut {
  .el-dialog__footer {
    padding: 0 !important;

    .el-button {
      padding: 20px !important;
      border-radius: 0 !important;

      &:nth-child(2) {
        border-left: 1px solid #efefef !important;
      }
    }
  }
}
.hichat-moblie{
  .el-dialog-loginOut {
    /deep/.el-dialog{
      border-radius: 20px;
      position: relative;
      .el-dialog__header{
        padding: 10px
      }
      .el-dialog__body{
        text-align: center;
        padding: 25px 25px 15px;
        .loginOut-box {
          img{
            height: 5em;
            margin-bottom: 1.2em;
          }
        }
      }
      .el-dialog__footer {
        padding: 20px !important;
        padding-top: 10px !important;
        text-align: right;
        box-sizing: border-box;
        .dialog-footer{
          display: flex;
          justify-content: space-between;
          .el-button {
            width: 100%;
            border-radius: 8px !important;
            padding: 12px 20px !important;
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

