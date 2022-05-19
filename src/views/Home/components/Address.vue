<template>
  <div class="home-content" @touchmove="$root.handleTouch">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="联络人" name="address">
        <div
          class="address-box"
          v-for="(item, index) in myContactDataList"
          :key="index"
          @click="goContactPage(item, 'ContactPage')"
        >
          <el-image :src="item.icon" />
          <div class="contont-box">
            <span>{{ item.name }}</span>
            <div class="contont-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="群组" name="group">
        <div
          class="address-box"
          v-for="(item, index) in groupList"
          :key="index"
          @click="goContactPage(item, 'GroupPage')"
        >
          <el-image :src="item.icon" />
          <div class="contont-box">
            <span>{{ item.groupName }}</span>
            <div class="contont-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getContactList, getGroupList, getSearchById } from "@/api";
export default {
  name: "Address",
  data() {
    return {
      searchKey: "",
      activeName: "address",
      groupData: [],
      contactList: [],
      device: localStorage.getItem("device"),
    };
  },
  created() {
    this.getDataList();
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.setActiveName(this.activeName);
  },

  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      groupList: (state) => state.ws.groupList,
      groupUser: (state) => state.ws.groupUser,
      myUserInfo: (state) => state.ws.myUserInfo,
      myContactDataList: (state) => state.ws.myContactDataList,
    }),
  },
  methods: {
    ...mapMutations({
      setInfoMsg: "ws/setInfoMsg",
      setChatUser: "ws/setChatUser",
      setChatGroup: "ws/setChatGroup",
      setGroupList: "ws/setGroupList",
      setMsgInfoPage: "ws/setMsgInfoPage",
      setActiveName: "ws/setActiveName",
      setMyContactDataList: "ws/setMyContactDataList",
    }),
    handleClick() {
      this.setInfoMsg({ infoMsgShow: false });
      this.setActiveName(this.activeName);
    },
    getDataList() {
      getContactList().then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((el) => {
          if (el.contactId === localStorage.getItem("id")) {
            el.name = "Hichat 记事本";
            el.icon = require("./../../../../static/images/image_savemessage.png");
          } else if (el.icon === undefined) {
            el.icon = require("./../../../../static/images/image_user_defult.png");
          }
        });
        this.setMyContactDataList(this.contactList);
      });
      getGroupList().then((res) => {
        this.groupData = res.data.list;
        this.groupData.forEach((el) => {
          if (el.icon === "") {
            el.icon = require("./../../../../static/images/image_group_defult.png");
          }
        });
        this.setGroupList(this.groupData);
      });
    },
    getUserId(data) {
      let id = data.contactId;
      getSearchById({ id }).then((res) => {
        if (res.data.id === this.myUserInfo.id) {
          data.name = "Hichat 记事本";
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
      }
      if (this.device === "moblie") {
        this.$router.push({ name: path });
      } else {
        this.setInfoMsg({ infoMsgShow: true, infoMsgNav: path });
        this.setMsgInfoPage({ pageShow: true, type: "" });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.address-box {
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  .contont-box {
    padding-left: 1em;
    height: 48px;
    span {
      font-size: 14px;
      height: 48px;
      display: flex;
      align-items: center;
    }
    .contont-border-bottom {
      width: 100vw;
      border-bottom: 0.02em solid rgba(0, 0, 0, 0.05);
      position: absolute;
    }
  }
}
</style>

