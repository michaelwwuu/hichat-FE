<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container v-if="device === 'moblie'">
      <el-main>
        <el-header height="60px">
          <div class="home-header">
            <div class="home-user" @click="back()"></div>
            <span class="home-header-title">管理员权限设定</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          <div class="setting-title">管理员权限</div>
          <div
            class="setting-button"
            v-for="(item, index) in adminPermission"
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
        </div>
        <div class="home-footer-btn">
          <el-button
            class="orange-btn"
            >设定群组资讯</el-button
          >
        </div>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="300px">
        <el-header height="60px">
          <div class="home-header flex-start">
            <div class="home-user-pc" @click="back()"></div>
            <span class="home-header-title">管理员权限设定</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          <div class="setting-title">管理员权限</div>
          <div
            class="setting-button"
            v-for="(item, index) in adminPermission"
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
        </div>
        <div class="home-footer-btn">
          <el-button
            class="orange-btn"
            >设定群组资讯</el-button
          >
        </div>
      </el-aside>
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
      adminPermission:[
        {
          name:"传送讯息与媒体档案",
          key:"sendMessageFile",
          isCheck:true,
        },
        {
          name:"置顶讯息",
          key:"topMsg",
          isCheck:true,
        },
        {
          name:"禁言设定",
          key:"banSetting",
          isCheck:true,
        },
        {
          name:"禁言字词设定",
          key:"banMessage",
          isCheck:true,
        },
        {
          name:"加入成員",
          key:"joinPeople",
          isCheck:true,
        },
        {
          name:"踢除成員",
          key:"leavePeople",
          isCheck:true,
        },
        {
          name:"变更群组资讯",
          key:"editGroupMsg",
          isCheck:true,
        },
        {
          name:"删除群组成员讯息",
          key:"deleteGroupMsg",
          isCheck:true,
        },
        {
          name:"查看群组成员资讯",
          key:"lookGroupMsg",
          isCheck:true,
        },
      ],
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
      a,.setting-box {
        text-decoration: none;
        display: flex;
        justify-content: space-between;
        align-content: center;
        padding: 0.5em 0.7em 0.5em 0;
        margin-left: 10px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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
