<template>
  <div style="flex:1; overflow-y: auto;">
    <el-tabs v-model="activeName">
      <el-tab-pane label="联络人" name="address" class="address" >
        <div
          class="address-box"
          v-for="(item, index) in contactList"
          :key="index"
          @click="goContactPage(item,'ContactPage')"
        >
          <el-image :src="item.icon" />
          <div class="contont-box">
            <span>{{ item.name }}</span>
            <div class="contont-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="群组" name="group" class="address" >
        <div
          class="address-box"
          v-for="(item, index) in groupList"
          :key="index"
          @click="goContactPage(item,'GroupPage')"
        >
          <el-image :src="item.icon"/>
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
import { getContactList,getGroupList } from "@/api";
export default {
  name: "Address",
  data() {
    return {
      searchKey: "",
      groupList:[],
      contactList: [],
      activeName: "address",
    };
  },
  created() {
    this.getAddressList();
    this.getGroupDataList()
    this.userData = JSON.parse(localStorage.getItem("userData")); 
  },
  methods: {
    getAddressList() {
      getContactList().then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((el) => {
          if (el.icon === undefined)el.icon = require("./../../../../static/images/image_user_defult.png")
        });
        localStorage.setItem("myContactDataList",JSON.stringify(this.contactList))
      });
    },
    getGroupDataList(){
      getGroupList().then((res) => {
        this.groupList = res.data.list
        this.groupList.forEach((el) => {
          if (el.icon === "")
            el.icon = require("./../../../../static/images/image_group_defult.png");
        });
      })
    },
    goContactPage(data,path) {
      if(path === 'ContactPage'){
        data.toChatId = "u" + data.contactId;
        localStorage.setItem("userData", JSON.stringify(data));
      }else{
        localStorage.setItem("groupData", JSON.stringify(data));
      }
      this.$router.push({ name: path });
    },   
  },
};
</script>
<style lang="scss" scoped>
.address-box {
  .contont-box{
    padding-left: 1em;
    height:48px;
    span {
      font-size: 14px;
      height: 48px;
      display: flex;
      align-items: center;
    }
    .contont-border-bottom{
      width: 100vw;
      border-bottom: 0.02em solid #b3b3b3;
      position: absolute
    }
  }
}
</style>

