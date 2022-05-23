<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container v-if="device === 'moblie'">
      <el-main>
        <el-header height="125px">
          <div class="home-header">
            <div class="home-user" @click="back()"></div>
            <span class="home-header-title">管理员设定</span>
            <router-link
              :to="''"
            >
              <div class="home-add-user"></div>
            </router-link>
          </div>
          <div class="home-search" >
            <el-input
              placeholder="搜寻"
              prefix-icon="el-icon-search"
              v-model="searchKey"
            >
            </el-input>
          </div>
        </el-header>
        <div class="home-content">
          <div
            v-for="(item, index) in adminUser"
            :key="index"
          >
            <div class="setting-button mt10">
              <div class="setting-box">
                <div class="setting-button-left">
                  <div class="el-image">
                    <img :src="item.icon" alt="" class="el-image__inner"/>
                  </div>
                  <span>{{item.name}}</span>
                </div>
                <div class="setting-button-right">
                  <router-link to="/AdminSettingDetail">
                    <img src="./../../../static/images/next.png" alt="" />
                  </router-link>
                  
                  <span @click="unAdmin">－</span>
                </div>
              </div>  
            </div>
          </div>
        </div>
        <div class="home-footer-btn">
          <el-button
            class="orange-btn"
            >储存编辑</el-button
          >
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState,mapMutations } from "vuex";
import { developmentMessage } from "@/assets/tools";
import { addGroup } from "@/api";

export default {
  name: "AdminSetting",
  data() {
    return {
      searchKey:"",
      device: localStorage.getItem("device"),
      adminUser:[{
        name:"Michael",
        icon:"http://test.hichat.tools/images/icon/68f981ed-c647-4ec1-b24d-dc0c1f2bee49.jpg"
      }]
    };
  },
  computed: {
    ...mapState({
      groupPermissionData: (state) => state.ws.groupPermissionData,
    }),
  },  
  methods: {
    unAdmin(){

    },
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
    .home-user-pc {
      background-color: #fff;
      background-image: url("./../../../static/images/pc/arrow-left.png");
      cursor: pointer;
    }
    .home-add-user {
      background-color: #fff;
      background-image: url("./../../../static/images/edit.png");
    }    
  }
  .home-content {
    .setting-title {
      padding: 15px 20px;
      color: rgba(0, 0, 0, 0.4);
      font-size: 15px;
    }
    .setting-button {
      padding: 0.5em 0 0.5em 0.5em;
      background-color: #fff;
      &::after {
        content: "";
        display: block;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        width: 94%;
        /* margin-left: 0; */
        position: relative;
        top: -14px;
        left: 74px;
      }
      a,.setting-box {
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
      .setting-button-left{
        .el-image{
          .el-image__inner{
            height: -webkit-fill-available !important;
          }
        }
      }

      .setting-button-left {
        display: flex;
        align-items: center;
        width: 20em;
        span {
          font-size: 16px;
          padding-left: 1em;
          color: #333333;
        }
      }
      .setting-button-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 10em;
        span {
          margin-right: 1em;
          font-size: 15px;
          color: #b3b3b3;
        }
      }
    }    
  }
}
</style>
