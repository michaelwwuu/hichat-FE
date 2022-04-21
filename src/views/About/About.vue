<template>
  <div class="home-wrapper">
    <div class="home-header">
      <div class="home-user" @click="back"></div>
      <span class="home-header-title">关于HiChat</span>
      <div class="home-add-user"></div>
    </div>
    <div class="home-content">
      <div
        class="setting-button"
        v-for="(item, index) in aboutData"
        :key="index"
        :class="{ 'mt10 border-bottom': item.name === '服务条款' }"
        @click="developmentMessage(item.name)"
      >
        <router-link :to="item.path">
          <div class="setting-button-left">
            <img :src="item.icon" alt="" />
            <span>{{ item.name }}</span>
          </div>
          <div
            class="setting-button-right version"
            v-if="item.name === '使用版本'"
          >
            <span>{{ item.version }}</span>
          </div>
          <div class="setting-button-right" v-else>
            <img src="./../../../static/images/next.png" alt="" />
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { developmentMessage } from "@/assets/tools";

export default {
  name: "About",
  data() {
    return {
      aboutData: [
        {
          name: "使用版本",
          path: "",
          version: "1.1.1",
        },
        {
          name: "服务条款",
          path: "",
        },
        {
          name: "隐私权政策",
          path: "",
        },
      ],
      developmentMessage: developmentMessage,
    };
  },
  methods: {
    back() {
      this.$router.back(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  .home-header {
    .home-user {
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
    }
  }
  .home-content {
    .setting-button {
      padding: 0.5em 0 0.5em 0.5em;
      background-color: #fff;
      a {
        text-decoration: none;
        display: flex;
        justify-content: space-between;
        align-content: center;
        padding: 0.5em 0.7em 0.5em 0;
        margin-left: 10px;
      }
      img {
        height: 1.2em;
      }
      .setting-button-left {
        display: flex;
        align-items: center;
        span {
          margin-left: 1em;
          font-size: 15px;
          color: #333333;
        }
      }
      .setting-button-right {
        display: flex;
        align-items: center;
        span {
          margin-right: 1em;
          font-size: 15px;
          color: #b3b3b3;
        }
      }
      .version {
        span {
          margin-right: 0;
        }
      }
    }
    .mt10 {
      margin-top: 1em;
    }
    .border-bottom {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
  }
}
</style>
