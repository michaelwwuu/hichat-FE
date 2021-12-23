<template>
  <div>
    <div class="home-header">
      <div class="home-user" @click="centerDialogVisible = true"></div>
      <span class="home-header-title">通讯录</span>
      <router-link :to="'/AddUser'">
        <div class="home-add-user"></div>
      </router-link>
    </div>
    <div class="home-search">
      <el-input
        placeholder="输入欲搜寻的联络人"
        prefix-icon="el-icon-search"
        v-model="searchKey"
      >
      </el-input>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="联络人" name="address">
        <div
          class="address-box"
          v-for="(item, index) in contactList"
          :key="index"
          @click="goContactPage(item)"
        >
          <el-image :src="item.icon" />
          <span>{{ item.name }}</span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="群组" name="group">
        <div
          class="address-box"
          v-for="(item, index) in groupList"
          :key="index"
          @click="goGroupPage(item)"
        >
          <el-image :src="item.icon"/>
          <span>{{ item.groupName }}</span>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="我的帐号"
      :visible.sync="centerDialogVisible"
      width="100%"
      center
    >
      <div class="qrcode-box">
        <vue-qr
          ref="Qrcode"
          :correctLevel="3"
          :autoColor="false"
          colorDark="#333333"
          :text="qrCodeConfig.text"
          :download="downloadFilename"
          :size="100"
          :margin="0"
          :logoSrc="qrCodeConfig.logo"
          :logoCornerRadius="2"
          :logoMargin="1"
        ></vue-qr>
      </div>
      <span class="qrcode-box-text"
        >嗨聊用户扫描此二维码后，可将您加入好友！</span
      >
      <span slot="footer" class="dialog-footer">
        <router-link :to="'/QRcode'"
          ><img src="./../../../../static/images/scan.png" alt=""
        /></router-link>
        <img
          src="./../../../../static/images/share.png"
          alt=""
          @click="copyUrl"
        />
        <img
          src="./../../../../static/images/download.png"
          alt=""
          @click="downloadImg"
        />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getContactList,getGroupList } from "@/api";
import VueQr from "vue-qr";
import urlCopy from "@/utils/urlCopy.js";
export default {
  name: "Address",
  data() {
    return {
      searchKey: "",
      contactList: [],
      groupList:[],
      activeName: "address",
      centerDialogVisible: false,
      qrCodeConfig: {
        text: `${process.env.VUE_APP_URL}#/AddUser?username=${localStorage.getItem(
          "username"
        )}&id=${localStorage.getItem("id")}`,
        logo: require("./../../../../static/images/material_ic_logo.png"),
      },
      downloadFilename: "",
    };
  },
  created() {
    this.getAddressList();
    this.getGroupDataList()
  },
  methods: {
    copyUrl() {
      let url = this.qrCodeConfig.text;
      urlCopy(url);
    },
    downloadImg() {
      const iconUrl = this.$refs.Qrcode.$el.src;
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = "二维码";
      a.href = iconUrl;
      a.dispatchEvent(event);
    },
    getAddressList() {
      getContactList().then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((el) => {
          if (el.icon === undefined)
            el.icon = require("./../../../../static/images/image_user_defult.png");
        });
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
    goContactPage(data) {
      data.toChatId = "u" + data.contactId;
      localStorage.setItem("userData", JSON.stringify(data));
      this.$router.push({ name: "ContactPage" });
    },
    goGroupPage(data) {
      localStorage.setItem("groupData", JSON.stringify(data));
      this.$router.push({ name: "GroupPage" });
    },    
    // handleClick(tab) {
    //   if(tab.name === 'address'){
    //     this.getAddressList()
    //   }else if(tab.name === 'group'){
    //     this.getGroupDataList()
    //   }
    // }
  },
  components: {
    VueQr,
  },
};
</script>
<style lang="scss" scoped>
.home-header {
  .home-user {
    background-color: #fff;
    background-image: url("./../../../../static/images/qrcode.png");
  }
  .home-add-user {
    background-color: #fff;
    background-image: url("./../../../../static/images/add_user.png");
  }
}
.address-box {
  span {
    padding-left: 1em;
    font-size: 14px;
  }
  ::after {
    content: "";
    display: block;
    position: absolute;
    margin-top: 1.5em;
    width: 100%;
    border-bottom: 0.02em solid #b3b3b3;
  }
}

/deep/.el-dialog__wrapper {
  overflow: hidden;
  .el-dialog {
    margin: 0 auto;
    border-radius: 20px 20px 0 0;
    position: absolute;
    bottom: 0;
    .el-dialog__header {
      .el-dialog__title {
        color: #10686e;
        font-weight: 600;
      }
      .el-dialog__headerbtn {
        position: inherit;
        float: left;
        .el-dialog__close {
          color: #f60;
        }
      }
    }
    .el-dialog__body {
      text-align: center;
      .qrcode-box {
        width: 15em;
        height: 15em;
        border: 2px solid #333;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          height: 14em;
        }
      }
      .qrcode-box-text {
        color: #0c0d0d;
        font-weight: 600;
        margin-top: 2em;
        display: block;
      }
    }
    .el-dialog__footer {
      padding: 20px 30px 20px 30px;
      .dialog-footer {
        display: flex;
        justify-content: space-between;
        img {
          height: 1em;
        }
      }
    }
  }
}
</style>

