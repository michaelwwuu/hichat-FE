<template>
  <div class="message-pabel-box" @touchmove="$root.handleTouch">
    <div class="spread-box">
      <div
        class="address-box"
        v-for="(item, index) in spreadDataList"
        :key="index"
      >
        <el-image :src="item.icon" />
        <div class="contont-box">
          <span>{{ item.name }}</span>
          <div class="contont-border-bottom"></div>
        </div>
      </div>
    </div>
    <ul class="message-styles-box">

    </ul>
  </div>
</template>

<script>

import { Encrypt, Decrypt } from "@/utils/AESUtils.js";
import { mapState } from "vuex";

export default {
  name: "MessageSpreadPabel",
  data() {
    return {

      device: localStorage.getItem("device"),
      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  computed: {
    ...mapState({
      spreadDataList: (state) => state.ws.spreadDataList,
    }),
  },
  mounted() {
    window.addEventListener(
      "scroll",
      () => {
        let scrollTop = document.querySelector(".message-pabel-box");
        this.showScrollBar = !(
          scrollTop.scrollHeight - scrollTop.scrollTop ===
          scrollTop.clientHeight
        );
      },
      true
    );
  },
  methods: {

    isBase64(data) {
      var base64Rejex =
        /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;
      if (!base64Rejex.test(data)) {
        return data;
      }
      try {
        return Decrypt(data, this.aesKey, this.aesIv);
      } catch (err) {
        return data;
      }
    },
    noIconShow(iconData) {
      if ([undefined, null, ""].includes(iconData.icon)) {
        return require("./../../static/images/image_user_defult.png");
      } else {
        return iconData.icon;
      }
    },

  },

};
</script>

<style lang="scss" scoped>
.hichat-pc {
  .message-pabel-box {
    .message-styles-box {
      .message-layout-left {
        p {
          .el-image {
            width: -webkit-fill-available !important;
            height: 11em !important;
            top: 0;
            /deep/.el-image__inner {
              height: 100%;
            }
          }
        }
        .reply {
          .message-classic {
            padding: 0;
          }
        }
      }
      .message-layout-right {
        p {
          .el-image {
            width: -webkit-fill-available !important;
            height: 11em !important;
            top: 0;
            /deep/.el-image__inner {
              height: 100%;
            }
          }
        }
        .reply {
          .message-classic {
            padding: 0;
          }
        }
        .message-image {
          background-color: #ffffff;
        }
      }
      .message-audio {
        width: 190px;
        display: flex;
      }
      .vueAudioBetter {
        box-shadow: none;
        background-image: none;
        width: auto;
        margin: 0;
        /deep/.operate {
          span {
            &:nth-child(3) {
              color: rgba(0, 0, 0, 0.8) !important;
            }
          }
        }
        /deep/.slider {
          display: none;
        }
        /deep/.icon-notificationfill {
          &:before {
            content: "\E66A";
            display: none;
          }
        }
      }
    }
    /deep/.el-dialog-takePicture {
      .el-dialog {
        width: 450px !important;
      }
    }
  }
}

.message-pabel-box {
  padding: 0 10px 0 20px;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  .message-styles-box {
    margin-bottom: 20px;
  }

}
.spread-box{
  width: 22em;
  margin: 15px -5px;
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
        width: 16em;
        border-bottom: 0.02em solid rgba(0, 0, 0, 0.05);
        position: relative;
      }
    }
  }
}

</style>
