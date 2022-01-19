<template>
  <div class="home-content">
    <template v-if="device === 'moblie'">
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
    </template>
    <template v-else>
      <el-tabs v-model="activeName">
        <el-tab-pane label="联络人" name="address">
          <div
            class="address-box"
            v-for="(item, index) in contactList"
            :key="index"
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
          >
            <el-image :src="item.icon" />
            <div class="contont-box">
              <span>{{ item.groupName }}</span>
              <div class="contont-border-bottom"></div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
import { getContactList, getGroupList } from "@/api";
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
  methods: {
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
        console.log(this.groupList)
        this.groupList.forEach((el) => {
          if (el.icon === "")
            el.icon = require("./../../../../static/images/image_group_defult.png");
        });
      });
    },
    goContactPage(data, path) {
      if (path === "ContactPage") {
        data.toChatId = "u" + data.contactId;
        localStorage.setItem("userData", JSON.stringify(data));
      } else {
        localStorage.setItem("groupData", JSON.stringify(data));
      }
      this.$router.push({ name: path });
    },
  },
};
</script>
<style lang="scss" scoped>
.address-box {
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

