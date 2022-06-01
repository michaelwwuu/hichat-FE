<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container v-if="device === 'moblie'">
      <el-main>
        <el-header height="60px">
          <div class="home-header">
            <div class="home-user" @click="back()"></div>
            <span class="home-header-title">权限</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          <div class="setting-title">群组成员</div>
          <div
            class="setting-button"
            v-for="(item, index) in messagePermissionData"
            :key="item + index"
          >
            <div class="setting-box">
              <div class="setting-button-left">
                <span>{{ item.name }}</span>
              </div>
              <div class="setting-button-right">
                <el-switch
                  v-model="item.isCheck"
                  active-color="#fd5f3f"
                  inactive-color="#666666"
                  @change="chengeSoundNofiy(item)"
                >
                </el-switch>
              </div>
            </div>
          </div>
          <div
            v-for="(item, index) in settingPermission"
            :key="index"
          >
            <div class="setting-title">{{item.name}}</div>
            <div class="setting-button mt10">
              <router-link :to="item.path">
                <div class="setting-button-left">
                  <span>{{item.value}}</span>
                </div>
                <div class="setting-button-right">
                  <img src="./../../../static/images/next.png" alt="" />
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <div class="home-footer-btn">
          <el-button
            class="orange-btn"
            >储存设定</el-button
          >
        </div>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="300px">
        <el-header height="60px">
          <div class="home-header flex-start">
            <div class="home-user-pc" @click="back()"></div>
            <span class="home-header-title">权限</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          <div class="setting-title">群组成员</div>
          <div
            class="setting-button"
            v-for="(item, index) in messagePermissionData"
            :key="item + index"
          >
            <div class="setting-box">
              <div class="setting-button-left">
                <span>{{ item.name }}</span>
              </div>
              <div class="setting-button-right">
                <el-switch
                  v-model="item.isCheck"
                  active-color="#fd5f3f"
                  inactive-color="#666666"
                  @change="chengeSoundNofiy(item)"
                >
                </el-switch>
              </div>
            </div>
          </div>
          <div
            v-for="(item, index) in settingPermission"
            :key="index"
          >
            <div class="setting-title">{{item.name}}</div>
            <div class="setting-button mt10">
              <router-link :to="item.path">
                <div class="setting-button-left">
                  <span>{{item.value}}</span>
                </div>
                <div class="setting-button-right">
                  <img src="./../../../static/images/next.png" alt="" />
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <div class="home-footer-btn">
          <el-button
            class="orange-btn"
            >储存设定</el-button
          >
        </div>
      </el-aside>
    </el-container>    
  </div>
</template>

<script>
import { mapState,mapMutations } from "vuex";
import { developmentMessage } from "@/assets/tools";
import { addGroup,getGroupAuthoritySetting } from "@/api";

export default {
  name: "SettingGroup",
  data() {
    return {
      messagePermissionData:[
        {
          name:"传送讯息与媒体档案",
          key:"sendMessageFile",
          isCheck:true,
        },
        {
          name:"查看群组成员资讯",
          key:"lookGroupInfo",
          isCheck:false,
        },
        {
          name:"置顶讯息",
          key:"topMsg",
          isCheck:false,
        },
      ],
      settingPermission:[
        {
          name:"管理員",
          value:"管理员设定",
          path:"/AdminSetting",
        },
        {
          name:"禁言",
          value:"禁言设定",
          path:"/BanSetting",
        },
        {
          name:"禁用字词屏蔽",
          value:"禁用字词设定",
          path:"/BanWord",
        }
      ],
      device: localStorage.getItem("device"),
    };
  },
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,
      groupPermissionData: (state) => state.ws.groupPermissionData,
    }),
  },  
  created() {
    if(this.device === "moblie"){
      this.groupData = JSON.parse(localStorage.getItem("groupData"));
    }else{
      this.groupData = this.groupUser
    }
  },
  mounted() {
    this.getGroupAuthority()
  },
  methods: {
    getGroupAuthority(){
      let groupId = this.groupData.groupId;
      getGroupAuthoritySetting({groupId}).then((res)=>{
        if(res.code === 200 ){
          if(res.data === null){

          }
        }
      })
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
        width: 100%;
        margin-left: 10px;
        position: relative;
        top: 9px;
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
      .setting-button-left {
        display: flex;
        align-items: center;
        width: 20em;
        span {
          font-size: 15px;
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
