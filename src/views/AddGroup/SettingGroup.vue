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
          <template v-if="groupData.isAdmin">
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
                    
                  >
                  </el-switch>
                </div>
              </div>
            </div>
          </template>
          <div v-if="groupData.isAdmin">
            <div class="setting-title">管理員</div>
            <div class="setting-button mt10">
              <router-link to="/AdminSetting">
                <div class="setting-button-left">
                  <span>管理员设定</span>
                </div>
                <div class="setting-button-right">
                  <img src="./../../../static/images/next.png" alt="" />
                </div>
              </router-link>
            </div>
          </div>
          <div
            v-for="(item, index) in settingPermission"
            :key="index"
          >
            <div class="setting-title" >{{item.name}}</div>
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
            @click="authoritySettingBtn"
            >储存设定</el-button
          >
        </div>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="300px">
        <el-header height="70px">
          <div class="home-header flex-start" style="position: relative; left: -4px; top: -1px;">
            <div class="home-user-pc" @click="back()"></div>
            <span class="home-header-title">权限</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          <div class="setting-title">群组成员</div>
          <template v-if="groupData.isAdmin">
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
                  >
                  </el-switch>
                </div>
              </div>
            </div>
          </template>

          <div v-if="groupData.isAdmin">
            <div class="setting-title">管理員</div>
            <div class="setting-button mt10">
              <a @click="changeSettingGroupShow">
                <div class="setting-button-left">
                  <span>管理员设定</span>
                </div>
                <div class="setting-button-right">
                  <img src="./../../../static/images/next.png" alt="" />
                </div>
              </a>
            </div>
          </div>          
          <div
            v-for="(item, index) in settingPermission"
            :key="index"
          >
            <div class="setting-title">{{item.name}}</div>
            <div class="setting-button mt10">
              <a @click="goBanSetting(item)">
                <div class="setting-button-left">
                  <span>{{item.value}}</span>
                </div>
                <div class="setting-button-right">
                  <img src="./../../../static/images/next.png" alt="" />
                </div>
              </a>
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
import { addGroup,getGroupAuthoritySetting,setGroupAuthority } from "@/api";

export default {
  name: "SettingGroup",
  data() {
    return {
      messagePermissionData:[
        {
          name:"传送讯息与媒体档案",
          key:"sendMessage",
          isCheck:true,
        },
        {
          name:"查看群组成员资讯",
          key:"checkUserInfo",
          isCheck:false,
        },
        {
          name:"置顶讯息",
          key:"pin",
          isCheck:false,
        },
      ],
      settingPermission:[
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
    if(!this.groupPermissionData.addGroup) this.getGroupAuthority()
  },
  methods: {
    ...mapMutations({
      setInfoMsg:"ws/setInfoMsg",
      setChatGroup: "ws/setChatGroup",
      setMsgInfoPage:"ws/setMsgInfoPage",
    }),
    changeSettingGroupShow() {
      this.setMsgInfoPage({ pageShow: false, type: "AdminSetting" });
    },
    goBanSetting(data){
      this.setMsgInfoPage({ pageShow: false, type: data.path.replace("/", "") });
    },
    getGroupAuthority(){
      let groupId = this.groupData.groupId;
      getGroupAuthoritySetting({groupId}).then((res)=>{
        if(res.code === 200 ){
          this.authorityData = res.data
          for (let item in this.authorityData) {
            this.messagePermissionData.forEach((res)=>{
              if(item === res.key){
                return res.isCheck = this.authorityData[item]
              }
            })
          }
        }
      })
    },
    authoritySettingBtn(){
      this.newAuthorityData ={}
      this.messagePermissionData.forEach((el)=>{
        this.newAuthorityData[el.key] = true;
        let newData = this.messagePermissionData.filter((res) => {
          return (res.key === el.key);
        });
        this.newAuthorityData[el.key] = newData[0].isCheck
      })
      if(!this.groupPermissionData.addGroup){
        let params = {
          authority: this.newAuthorityData,
          groupId: this.groupData.groupId
        }
        setGroupAuthority(params).then((res)=>{
          if(res.code === 200){
            this.getGroupAuthority()
          }
        })
      }else{
        delete this.groupPermissionData.addGroup
        delete this.groupPermissionData.peopleData
        this.groupPermissionData.groupAdminAuthority = this.newAuthorityData
        addGroup(this.groupPermissionData).then((res)=>{
          if(res.code === 200){
            console.log(res.data)
            let groupData = {
              groupId: res.data.id,
              groupName: res.data.groupName,
              icon: res.data.icon,
              isAdmin: true,
              toChatId: "g" + res.data.id,
              memberId: JSON.parse(localStorage.getItem("id")),
            };
            this.setChatGroup(groupData);
            this.$router.push({
              path: this.device === "moblie" ? "/ChatGroupMsg" : "home",
            });
          }
        })
      }
    },
    back() {
      if (this.device === "moblie") {
        if(this.groupPermissionData.addGroup){
          this.$router.push({ path: "/AddGroupList",});
        }else{
          this.$router.push({ path: "/GroupPage",});
        }
      } else {
        this.setInfoMsg({ infoMsgShow: true,infoMsgChat:true, });
        this.setMsgInfoPage({ pageShow: true });
      } 
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
        cursor: pointer;
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
