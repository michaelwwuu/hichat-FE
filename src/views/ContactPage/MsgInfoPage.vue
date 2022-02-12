<template>
  <div>
    <div class="home-wrapper" v-if="msgInfoPage.pageShow">
      <el-container>
        <el-main>
          <el-header height="70px">
            <div class="home-header">
              <span class="home-header-title">
                <div style="display: flex; align-items: center; cursor: pointer;" @click="closeInfoMsgShow">
                  <span style="padding-right: 10px" v-if="infoMsg.infoMsgChat"
                    ><img src="./../../../static/images/pc/arrow-left.png" alt=""
                  /></span>
                  <span>資訊</span>
                </div>
              </span>
              <template v-if="infoMsg.infoMsgNav === 'ContactPage'">
                <div class="home-add-user"  @click="editShowBtn(infoMsg.infoMsgNav)"></div>
              </template>
              <template v-else>
                <div class="home-add-user" :class="{'notAdmin':!groupUser.isAdmin}" @click="groupUser.isAdmin?editShowBtn(infoMsg.infoMsgNav):false"></div>
              </template>
            </div>
          </el-header>
          <div class="home-content">
            <template v-if="infoMsg.infoMsgNav === 'ContactPage'">
              <div class="user-data">
                <el-image
                  v-if="chatUser.icon !== undefined"
                  :src="
                    noIconShow(
                      JSON.stringify(chatUser) === '{}' ? userData : chatUser,
                      'user'
                    )
                  "
                  :preview-src-list="[
                    noIconShow(
                      JSON.stringify(chatUser) === '{}' ? userData : chatUser,
                      'user'
                    ),
                  ]"
                />
                <span>{{
                  chatUser.name === null ? userData.name : chatUser.name
                }}</span>
              </div>
              <div
                class="setting-notification"
                @click="developmentMessage('提醒通知')"
              >
                <div class="setting-button-left">
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
                v-for="(item, index) in settingContactData"
                :key="index"
                class="setting-button"
                @click="developmentMessage(item.name)"
              >
                <a @click="goChatRoom(userData, item.path, 'address')">
                  <div class="setting-button-left">
                    <img :src="item.icon" alt="" />
                    <span>{{ item.name }}</span>
                  </div>
                  <img src="./../../../static/images/next.png" alt="" />
                </a>
              </div>
            </template>
            <template v-else>
              <div class="user-data">
                <el-image
                  v-if="groupUser.icon !== undefined"
                  :src="
                    noIconShow(
                      JSON.stringify(groupUser) === '{}' ? groupData : groupUser,
                      'group'
                    )
                  "
                  :preview-src-list="[
                    noIconShow(
                      JSON.stringify(groupUser) === '{}' ? groupData : groupUser,
                      'group'
                    ),
                  ]"
                />
                <span>{{
                  groupUser.groupName === null
                    ? groupData.groupName
                    : groupUser.groupName
                }}</span>
              </div>
              <div
                class="setting-notification"
                @click="developmentMessage('提醒通知')"
              >
                <div class="setting-button-left">
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
                v-for="(item, index) in settingGroupData"
                :key="index"
                @click="developmentMessage(item.name)"
              >
                <a @click="goChatRoom(userData, item.path, 'group')">
                  <div class="setting-button-left">
                    <img :src="item.icon" alt="" />
                    <span>{{ item.name }}</span>
                  </div>
                  <img src="./../../../static/images/next.png" alt="" />
                </a>
              </div>
            </template>
          </div>
        </el-main>
      </el-container>
    </div>
    <edit-contact v-if="msgInfoPage.type === 'ContactPage'"/>
    <edit-group v-else/>
  </div>
  
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { developmentMessage } from "@/assets/tools";
import EditContact from "./../EditContact/EditContact.vue";
import EditGroup from './../EditContact/EditGroup.vue';
export default {
  name: "MsgInfoPage",
  data() {
    return {
      userData: {},
      settingContactData: [
        {
          name: "传送讯息",
          icon: require("./../../../static/images/pc/message.png"),
          path: "HiChat",
        },
        {
          name: "相片和影片",
          icon: require("./../../../static/images/pc/globe.png"),
          path: "",
        },
      ],
      settingGroupData: [
        {
          name: "传送讯息",
          icon: require("./../../../static/images/pc/message.png"),
          path: "HiChat",
        },
        {
          name: "查看相片和影片",
          icon: require("./../../../static/images/pc/image.png"),
          path: "",
        },
        {
          name: "成員",
          icon: require("./../../../static/images/pc/users.png"),
          path: "",
        },
      ],
      getHistoryMessage: {
        chatType: "",
        toChatId: "",
        id: Math.random(),
        tokenType: 0,
        targetId: "",
        pageSize: 1000,
        deviceId: localStorage.getItem("UUID"),
        token: localStorage.getItem("token"),
      },
      groupDataList: [],
      notification: true,
      developmentMessage: developmentMessage,
    };
  },
  computed: {
    ...mapState({
      chatUser: (state) => state.ws.chatUser,
      groupUser: (state) => state.ws.groupUser,
      infoMsg: (state) => state.ws.infoMsg,
      msgInfoPage: (state) => state.ws.msgInfoPage,
    }),
  },
  created() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.groupData = JSON.parse(localStorage.getItem("groupData"));
    // this.getUserId();
    this.infoMsgSettingData()
  },

  methods: {
    ...mapMutations({
      setInfoMsg: "ws/setInfoMsg",
      setChatUser: "ws/setChatUser",
      setHichatNav: "ws/setHichatNav",
      setMsgInfoPage: "ws/setMsgInfoPage",
    }),
    editShowBtn(data){
      let msgInfoPage = {
        pageShow:false,
        type:data,
      }
      this.setMsgInfoPage(msgInfoPage)
    },
    infoMsgSettingData(){
      if(this.infoMsg.infoMsgChat){
        this.settingContactData.splice(0, 1)
        this.settingGroupData.splice(0, 1)
      } 
    },
    closeInfoMsgShow(){
      let infoMsg = { infoMsgShow:false,infoMsgChat:false }
      this.setInfoMsg(infoMsg)
    },
    noIconShow(iconData, key) {
      if (
        iconData.icon === undefined ||
        iconData.icon === null ||
        iconData.icon === ""
      ) {
        return require(`./../../../static/images/image_${key}_defult.png`);
      } else {
        return iconData.icon;
      }
    },
    goChatRoom(data, path, type) {
      console.log(data, path, type)
      let navType = { type: type, num: 1 };
      this.setHichatNav(navType);
      let infoMsg = {
        infoMsgShow: false,
        infoMsgNav: type === "address" ? "ContactPage" : "GroupPage",
      };
      this.setInfoMsg(infoMsg);
      this.$router.push({ name: path, params: data });
    },
    // getUserId() {
    //   let id = this.chatUser.contactId;
    //   getSearchById({ id }).then((res) => {
    //     this.userData.username = res.data.username;
    //     this.userData.name = res.data.name;
    //     this.userData.isBlock = res.data.isBlock;
    //     this.userData.isContact = res.data.isContact;
    //     this.setChatUser(this.userData);
    //   });
    // },
    back() {
      this.$router.back(-1);
    },
  },
  components: {
    EditContact,
    EditGroup
  }
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  border-left: 1px solid #e1e1e1b0;
  .home-header {
    .home-add-user {
      background-color: #fff;
      background-image: url("./../../../static/images/pc/edit_info.png");
    }
    .notAdmin{
      background-image:none;
      cursor:initial;
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
      cursor: pointer;
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
      padding: 1em;
      background-color: #fff;
      margin: 1em 0;
      display: flex;
      justify-content: space-between;
      align-content: center;
      border-bottom: 2px solid #e3e3e3;
      img {
        height: 1.2em;
      }
      .setting-button-left {
        display: flex;
        align-items: center;
        margin-left: 10px;
        width: 20em;
        span {
          margin-left: 0;
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
