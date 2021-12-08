<template>
  <div class="home-wrapper">
    <div class="home-header">
      <router-link :to="'/Setting'">
        <div class="home-user"></div>
      </router-link>
      <span class="home-header-title">密码管理</span>
      <div class="home-add-user"></div>
    </div>
    <div class="address-content">
      <div
        class="setting-button"
        v-for="(item, index) in aboutData"
        :key="index"
        :class="{ 'border-bottom' : item.name === '修改登录密码'}"
        @click="developmentMessage(item.name)"
      >
        <router-link :to="item.path" >
          <div class="setting-button-left">
            <img :src="item.icon" alt="" />
            <span>{{ item.name }}</span>
          </div>
          <div class="setting-button-right version" v-if="item.name === '生物辨识'">
            <el-switch
              v-model="notification"
              active-color="#fd5f3f"
              inactive-color="#666666"
              disabled>
            </el-switch>
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
  name: "passwordMange",
  data() {
    return {
      aboutData: [
        {
          name: "修改登录密码",
          path: "/passwordEdit",
        },
        {
          name: "生物辨识",
          path: "",
        },
      ],
      developmentMessage:developmentMessage,
      notification:false,
    }
  },

};
</script>

<style lang="scss" scoped>
.home-wrapper{
  min-height: 100%;
  width: 100%;
  background-color: #eaf5fa;
  overflow: hidden;
  .home-header {
    margin: 1em;
    display: flex;
    align-items: center;
    .home-user {
      width: 2em;
      height: 2em;
      border-radius: 10px;
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
    }
    .home-header-title {
      margin: 0 auto;
      color: #10686e;
      font-weight: 600;
    }
    .home-add-user{
      width: 2em;
      height: 2em;
    }
  }
  .address-content {
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
      .version{
        span {
          margin-right: 0;
        }
      }
    }
    .mt10{
      margin-top: 1em;
    }
    .border-bottom{
      &::after {
        content: "";
        display: block;
        border-bottom: 1px solid #b3b3b3;
        width: 100%;
        margin-left: 10px;
        position: relative;
        top: 9px;
      }
    }
  }
}
</style>
