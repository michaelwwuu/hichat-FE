<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <el-header :style="num === 2?'height:55px':'height:120px'">
          <div class="home-header">
            <div
              class="home-user"
              :class="{ 'QRcode-img': num === 0 || num === 2 }"
              @click="
                num === 0 || num === 2 ? (centerDialogVisible = true) : ''
              "
            ></div>
            <span class="home-header-title">{{num === 0 ? '通讯录':num === 1 ?'HiChat':'设定'}}</span>
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
                ><img alt="" :src="item.icon" v-show="index !== num"
              /></span>
              <span
                ><img alt="" :src="item.active" v-show="index === num"
              /></span>
              <span>{{ item.name }}</span>
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
        <img src="./../../../static/images/share.png" alt="" @click="copyUrl" />
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
export default {
  name: "Home",
  data() {
    return {
      routerNav: [
        {
          icon: require("./../../../static/images/address.png"),
          active: require("./../../../static/images/address_hover.png"),
          path: "/Address",
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
    };
  },
  created() {
    this.num =
      this.$route.fullPath === "/Address"
        ? 0
        : this.$route.fullPath === "/HiChat"
        ? 1
        : 2;
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
