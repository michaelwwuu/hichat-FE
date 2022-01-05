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
    <el-dialog
      title="我的帐号"
      :visible.sync="centerDialogVisible"
      width="100%"
      center
      append-to-body
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
        text: `${process.env.VUE_APP_URL}/fe/#/AddUser?username=${localStorage.getItem(
          "username"
        )}&id=${localStorage.getItem("id")}`,
        logo: require("./../../../../static/images/material_ic_logo.png"),
      },
      downloadFilename: "",
      elementHeight:0,
    };
  },
  created() {
    this.getAddressList();
    this.getGroupDataList()
    this.userData = JSON.parse(localStorage.getItem("userData")); 
    
  },
  mounted() {;
    let element = document.getElementById('pane-address');  //100
    setTimeout(()=>{
      console.log(element.clientHeight)
    },1000)
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

.el-dialog__wrapper {
  overflow: hidden;
  /deep/.el-dialog {
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

