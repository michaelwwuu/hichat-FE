<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <el-header
          :style="
            num === 2
              ? 'height:55px'
              : device === 'pc'
              ? 'height:70px'
              : 'height:120px'
          "
        >
          <div class="home-header" v-if="device === 'moblie'">
            <div
              class="home-user"
              :class="{ 'QRcode-img': num === 0 || num === 2 }"
              @click="
                num === 0 || num === 2 ? (centerDialogVisible = true) : ''
              "
            ></div>
            <span class="home-header-title">{{
              num === 0 ? "通讯录" : num === 1 ? "HiChat" : "设定"
            }}</span>
            <template v-if="num === 0">
              <router-link :to="'/AddUser'">
                <div class="home-add-user address-img"></div>
              </router-link>
            </template>
            <template v-else-if="num === 1">
              <router-link :to="'/AddGroup'">
                <div class="home-add-user hichat-img"></div>
              </router-link>
            </template>
            <template v-else>
              <router-link :to="'/EditUser'"
                ><div class="home-add-user setting-img"></div
              ></router-link>
            </template>
          </div>
          <div class="home-search" v-if="num !== 2">
            <el-input
              placeholder="搜索"
              prefix-icon="el-icon-search"
              v-model="searchKey"
            >
            </el-input>
            <router-link :to="'/AddUser'">
              <img src="./../../../static/images/pc/user-plus.png" alt="" v-if="device !== 'moblie'">
            </router-link>
          </div>
        </el-header>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <el-footer class="home-footer-nav">
          <div
            class="footer-nav-btn"
            v-for="(item, index) in routerNav"
            :key="index"
            @click="changeImg(index)"
          >
            <router-link :to="item.path">
              <span
                ><img :src="index !== num ? item.icon : item.active"
              /></span>
              <span v-if="device === 'moblie'">{{ item.name }}</span>
            </router-link>
          </div>
        </el-footer>
      </el-main>
    </el-container>
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
          ><img src="./../../../static/images/scan.png" alt=""
        /></router-link>
        <img
          src="./../../../static/images/share.png"
          alt=""
          @click="copyUrl"
        />
        <img
          src="./../../../static/images/download.png"
          alt=""
          @click="downloadImg"
        />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import urlCopy from "@/utils/urlCopy.js";
import Socket from "@/utils/socket";
export default {
  name: "Home",
  data() {
    return {
      routerNav: [
        {
          icon: require("./../../../static/images/address.png"),
          active: require("./../../../static/images/address_hover.png"),
          path: '/Address',
          name: "通讯录",
        },
        {
          icon: require("./../../../static/images/chat.png"),
          active: require("./../../../static/images/chat_hover.png"),
          path: "/HiChat",
          name: "聊天",
        },
        {
          icon: require("./../../../static/images/setting.png"),
          active: require("./../../../static/images/setting_hover.png"),
          path: "/Setting",
          name: "设定",
        },
      ],
      qrCodeConfig: {
        text: `${
          process.env.VUE_APP_URL
        }fe/#/AddUser?username=${localStorage.getItem(
          "username"
        )}&id=${localStorage.getItem("id")}`,
        logo: require("./../../../static/images/material_ic_logo.png"),
      },
      num: 0,
      searchKey: "",
      downloadFilename: "",
      centerDialogVisible: false,
      device: localStorage.getItem("device"),
    };
  },
  created() {
    this.num =
      this.$route.fullPath === "/Address"
        ? 0
        : this.$route.fullPath === "/HiChat"
        ? 1
        : 2;
    // Socket.$on("message", this.handleGetMessage);
  },
  methods: {
    changeImg(index) {
      this.num = index;
    },
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
    handleGetMessage(msg) {
      let msgInfo = JSON.parse(msg);
      switch (msgInfo.chatType) {
        case "SRV_USER_IMAGE":
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
        case "SRV_GROUP_SEND":
          this.notifyMe();
          break;
      }
    },
    notifyMe() {
      console.log(Notification);
      // 先检查浏览器是否支持
      if (!("Notification" in window)) {
        this.$message({
          message: "This browser does not support desktop notification",
          type: "error",
        });
      }
      // 检查用户是否同意接受通知
      else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification("你好snowball:", {
          dir: "auto", //auto（自动）, ltr（从左到右）, or rtl（从右到左）
          lang: "zh", //指定通知中所使用的语言。这个字符串必须在 BCP 47 language tag 文档中是有效的。
          tag: "testTag", //赋予通知一个ID，以便在必要的时候对通知进行刷新、替换或移除。
          icon: "https://img.iplaysoft.com/wp-content/uploads/2019/free-images/free_stock_photo.jpg", //提示时候的图标
          body: "今天是个好天气", // 一个图片的URL，将被用于显示通知的图标。
        });
      }
      // 否则我们需要向用户获取权限
      else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
          // 如果用户同意，就可以向他们发送通知
          if (permission === "granted") {
            var notification = new Notification("你好snowball:", {
              dir: "auto", //auto（自动）, ltr（从左到右）, or rtl（从右到左）
              lang: "zh", //指定通知中所使用的语言。这个字符串必须在 BCP 47 language tag 文档中是有效的。
              tag: "testTag", //赋予通知一个ID，以便在必要的时候对通知进行刷新、替换或移除。
              icon: "https://img.iplaysoft.com/wp-content/uploads/2019/free-images/free_stock_photo.jpg", //提示时候的图标
              body: "今天是个好天气", // 一个图片的URL，将被用于显示通知的图标。
            });
          }
        });
      }
      // 最后，如果执行到这里，说明用户已经拒绝对相关通知进行授权
      // 出于尊重，我们不应该再打扰他们了
    },
  },
  components: {
    VueQr,
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  .el-container {
    /deep/.el-main {
      .el-header {
        .home-header {
          .QRcode-img {
            background-color: #fff;
            background-image: url("./../../../static/images/qrcode.png");
          }
          .home-add-user {
            background-color: #fff;
          }
          .address-img {
            background-image: url("./../../../static/images/add_user.png");
          }
          .hichat-img {
            background-image: url("./../../../static/images/add_chat.png");
          }
          .setting-img {
            background-image: url("./../../../static/images/edit.png");
          }
        }
      }
    }
  }
}
</style>
