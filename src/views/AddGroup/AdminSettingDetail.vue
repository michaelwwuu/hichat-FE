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
            v-for="(item, index) in groupManagerAuthorityVO"
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
        </div>
        <div class="home-footer-btn">
          <el-button
            class="orange-btn"
            @click="addGroupMsg"
            >设定群组资讯</el-button
          >
        </div>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="300px">
        <el-header height="70px">
          <div class="home-header flex-start" style="position: relative; left: -4px; top: -1px;">
            <div class="home-user-pc" @click="back()"></div>
            <span class="home-header-title" style="position: relative; left: 1px; top: 1px;">管理员权限设定</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          <div class="setting-title">管理员权限</div>
          <div
            class="setting-button"
            v-for="(item, index) in groupManagerAuthorityVO"
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
        </div>
        <div class="home-footer-btn">
          <el-button
            class="orange-btn"
            @click="addGroupMsg"
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
import { addManager,groupListMember,setManagerAuthority } from "@/api";

export default {
  name: "AdminSetting",
  data() {
    return {
      searchKey:"",
      groupManagerAuthorityVO:[
        {
          name:"传送讯息与媒体档案",
          key:"sendMessage",
          isCheck:true,
        },
        {
          name:"置顶讯息",
          key:"pin",
          isCheck:true,
        },
        {
          name:"禁言设定",
          key:"disableUser",
          isCheck:true,
        },
        {
          name:"禁言字词设定",
          key:"disabledWord",
          isCheck:true,
        },
        {
          name:"加入成員",
          key:"addUser",
          isCheck:true,
        },
        {
          name:"踢除成員",
          key:"delUser",
          isCheck:true,
        },
        {
          name:"变更群组资讯",
          key:"updateGroupInfo",
          isCheck:true,
        },
        {
          name:"删除群组成员讯息",
          key:"delUserMessage",
          isCheck:true,
        },
        {
          name:"查看群组成员资讯",
          key:"checkUserInfo",
          isCheck:true,
        },
      ],
      device: localStorage.getItem("device"),
    };
  },
  created() {
    if(this.device === "moblie"){
      this.groupData = JSON.parse(localStorage.getItem("groupData"));
    }else{
      this.groupData = this.groupUser
    }    
  },
  mounted() {
    this.getGroupListMember()
  },
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,     
      msgInfoPage: (state) => state.ws.msgInfoPage,     
      groupPermissionData: (state) => state.ws.groupPermissionData,
    }),
  },  
  methods: {
    ...mapMutations({
      setMsgInfoPage:"ws/setMsgInfoPage",
      setGroupPermissionData:"ws/setGroupPermissionData",
    }),
    addGroupMsg(){
      this.newManagerAuthorityData ={}
      this.groupManagerAuthorityVO.forEach((el)=>{
        this.newManagerAuthorityData[el.key] = true;
        let newData = this.groupManagerAuthorityVO.filter((res) => {
          return (res.key === el.key);
        });
        this.newManagerAuthorityData[el.key] = newData[0].isCheck
      })
      if(!this.groupPermissionData.addGroup) {
        let parmaGroupId = this.device==="moblie" ? this.$route.params : this.msgInfoPage.data
        let parmaMemberId = this.device==="moblie" ? this.$route.params : this.msgInfoPage.data
        
        let params = {
          groupId:parmaGroupId.groupId,
          groupManagerAuthorityVO:this.newManagerAuthorityData,
          memberId:parmaMemberId.memberId,
        }
        if(!parmaGroupId.isManager || parmaGroupId.isManager === undefined){
          addManager(params).then((res)=>{
            if(res.code === 200){
              if (this.device === "moblie") {
                this.$router.push({ path: "/AdminSetting" });
              } else {
                if(this.msgInfoPage.pageAdd) {
                  this.setMsgInfoPage({ pageShow: false, type: "AdminSettingPage" });
                }else{
                  this.setMsgInfoPage({ pageShow: false, type: "AdminSetting" });
                }
              } 
            }
          })
        }else{
          setManagerAuthority(params).then((res)=>{
            if(res.code === 200){
              if (this.device === "moblie") {
                this.$router.push({ path: "/AdminSetting" });
              } else {
                if(this.msgInfoPage.pageAdd) {
                  this.setMsgInfoPage({ pageShow: false, type: "AdminSettingPage" });
                }else{
                  this.setMsgInfoPage({ pageShow: false, type: "AdminSetting" });
                }
              } 
            }
          })
        }
      }else{
        this.newManagerAuthorityData["memberId"] = this.$route.params.contactId
        if(this.$route.params.isManager){
          this.groupPermissionData.groupManagerAuthority.forEach((el)=>{
            if(el.memberId === this.$route.params.contactId){
              el.addUser = this.newManagerAuthorityDataaddUser
              el.checkUserInfo = this.newManagerAuthorityData.checkUserInfo
              el.delUser = this.newManagerAuthorityData.delUser
              el.disableUser = this.newManagerAuthorityData.disableUser
              el.disabledWord = this.newManagerAuthorityData.disabledWord
              el.addUser = this.newManagerAuthorityData.addUser
              el.pin = this.newManagerAuthorityData.pin
              el.sendMessage = this.newManagerAuthorityData.sendMessage
              el.updateGroupInfo = this.newManagerAuthorityData.updateGroupInfo
            }
          })
        }else{
          this.groupPermissionData.groupManagerAuthority.push(this.newManagerAuthorityData)
        } 
        this.groupPermissionData.peopleData.forEach((res)=>{
          if(res.contactId === this.$route.params.contactId){
            res.isManager = true
            res.authority = this.newManagerAuthorityData
           }
        })
        this.$router.push({ path: "/AdminSetting" });
      }
    },

    getGroupListMember(){
      if(!this.groupPermissionData.addGroup){
        let groupId = this.groupData.groupId;
        groupListMember({ groupId }).then((res) => {
          let parmaMemberId = this.device==="moblie" ? this.$route.params.memberId : this.msgInfoPage.data.memberId
          this.newData = res.data.list.filter((el)=>{
            return el.memberId === parmaMemberId
          })
          let managerAuthority = this.newData[0].authority
          if(managerAuthority !== undefined){
            for (let item in managerAuthority) {
              this.groupManagerAuthorityVO.forEach((res)=>{
                if(item === res.key){
                  return res.isCheck = managerAuthority[item]
                }
              })
            }
          }
        })
      }else{
        let managerAuthority = this.$route.params.authority
        if(managerAuthority !== undefined){
          for (let item in managerAuthority) {
            this.groupManagerAuthorityVO.forEach((res)=>{
              if(item === res.key){
                return res.isCheck = managerAuthority[item]
              }
            })
          }
        }
      }
      
    },
    back() {
      if (this.device === "moblie") {
        this.$router.back(-1);
      } else {
        if(this.msgInfoPage.pageAdd) {
          this.setMsgInfoPage({ pageShow: false, type: "AdminSettingPage" });
        }else{
          this.setMsgInfoPage({ pageShow: false, type: "AdminSetting" });
        }
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
