<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <!-- <template>
          <el-header height="120px">
            <div>
              <div class="home-header">
                <div class="home-user QRcode-img" @click="centerDialogVisible = true"></div>
                <span class="home-header-title">通讯录</span>
                <router-link :to="'/AddUser'">
                  <div class="home-add-user"></div>
                </router-link>
              </div>
            </div>
            <div class="home-search">
              <el-input
                placeholder="输入欲搜寻的联络人"
                prefix-icon="el-icon-search"
                v-model="searchKey"
              >
              </el-input>
            </div>
          </el-header>
        </template> -->
        <template>
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
        </template>
        <!-- <template>
          <el-header height="55px">
            <div class="home-header">
              <div class="home-user" @click="centerDialogVisible = true"></div>
              <span class="home-header-title">设定</span>
              <router-link :to="'/EditUser'"
                ><div class="home-add-user" style="background-color: #fff; background-image: url('./../../../static/images/edit.png')"></div
              ></router-link>
            </div>
          </el-header>
        </template> -->
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <div class="home-footer">
          <div
            class="home-footer-btn"
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
        </div>
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
      num: 0,
      searchKey: "",
      qrCodeConfig: {
        text: `${
          process.env.VUE_APP_URL
        }fe/#/AddUser?username=${localStorage.getItem(
          "username"
        )}&id=${localStorage.getItem("id")}`,
        logo: require("./../../../static/images/material_ic_logo.png"),
      },
      downloadFilename: "",
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
      centerDialogVisible: false,      
    };
  },
  created() {
    this.num =
      this.$route.fullPath === "/HiChat"
        ? 1
        : this.$route.fullPath === "/Setting"
        ? 2
        : 0;
  },
  methods: {
    changeImg(index) {
      this.num = index;
      console.log(this.num);
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
        border-right: none;
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
