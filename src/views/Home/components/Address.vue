<template>
  <div class="home-content" @touchmove="$root.handleTouch">
    <el-tabs v-model="activeName">
      <el-tab-pane label="联络人" name="address">
        <div
          class="address-box"
          v-for="(item, index) in contactList"
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
          @click="goContactPage(item, 'groupPage')"
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
import { mapState,mapMutations } from "vuex";
import { getContactList, getGroupList, getSearchById } from "@/api";
export default {
  name: "Address",
  data() {
    return {
      searchKey: "",
      groupList: [],
      contactList: [],
      activeName: "address",
      device: localStorage.getItem("device"),
    };
  },
  created() {
    this.getDataList();
    this.userData = JSON.parse(localStorage.getItem("userData"));
  },  
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      groupUser: (state) => state.ws.groupUser,
    }),
  },
  methods: {
    ...mapMutations({
      setChatUser: "ws/setChatUser",
      setChatGroup:"ws/setChatGroup",
      setGroupList:"ws/setGroupList",
      setInfoMsg:"ws/setInfoMsg"
    }),
    getDataList() {
      getContactList().then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((el) => {
          if (el.icon === undefined)
            el.icon = require("./../../../../static/images/image_user_defult.png");
        });
        localStorage.setItem(
          "myContactDataList",
          JSON.stringify(this.contactList)
        );
      });
      getGroupList().then((res) => {
        this.groupList = res.data.list;
        this.groupList.forEach((el) => {
          if (el.icon === "")
            el.icon = require("./../../../../static/images/image_group_defult.png");
        });
        this.setGroupList(this.groupList)
      });
    },
    getUserId(data) {
      let id = data.contactId;
      getSearchById({ id }).then((res) => {
        data.username = res.data.username;
        data.name = res.data.name;
        data.isBlock = res.data.isBlock;
        data.isContact = res.data.isContact;
        this.setChatUser(data);
      });
    },
    goContactPage(data, path) {
      if(this.device ==='moblie') {
        if (path === "ContactPage") {
          data.toChatId = "u" + data.contactId;
          this.setChatUser(data);
        } else{
          data.toChatId = "u" + data.groupId;
          this.setChatGroup(data);
        }
        this.$router.push({ name: path });
      }else{
        let infoStore ={
          infoMsgShow:true,
          infoMsgNav:path,
        }
        if (path === "ContactPage") {
          data.toChatId = "u" + data.contactId;
          this.getUserId(data)
          this.setInfoMsg(infoStore)
        } else{
          data.toChatId = "g" + data.groupId;
          this.setChatGroup(data);
          this.setInfoMsg(infoStore)
        }
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
      border-bottom: 0.02em solid #b3b3b3;
      position: absolute;
    }
  }
}
</style>

