<template>
  <div class="home-wrapper">
    <el-container>
      <el-aside width="300px">
        <el-header height="70px">
          <div class="home-header flex-start">
            <div class="home-user-pc" @click="back"></div>
            <span class="home-header-title">编辑静音名单</span>
          </div>
        </el-header>
        <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.05)">
          <div class="home-search-pc">
            <el-input
              placeholder="搜寻"
              prefix-icon="el-icon-search"
              v-model="searchKey"
            >
            </el-input>
          </div>
        </div>
        <div class="home-content" @touchmove="$root.handleTouch">
          <el-tabs v-model="activeName" >
            <el-tab-pane label="联络人" name="address">
              <div
                class="address-box"
                v-for="(item, index) in newContactList"
                :key="index"
              >
                <el-image :src="noIconShow(item,'user')" />
                <div class="contont-box">
                  <div class="msg-box">
                    <div>
                      <span>{{ item.name }}</span>
                    </div>
                    <div class="time" @click="muteActional(item,'user')">
                      <img :src="item.mute ? muteImg : noMuteImg" />
                    </div>
                  </div>
                  <div class="contont-border-bottom"></div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="群组" name="group">
              <div
                class="address-box"
                v-for="(item, index) in newGroupList
                "
                :key="index"
              >
                <el-image :src="noIconShow(item,'group')" />
                <div class="contont-box">
                  <div class="msg-box">
                    <div>
                      <span>{{ item.groupName }}</span>
                    </div>
                    <div class="time" @click="muteActional(item,'group')">
                      <img :src="item.setting.prompt ? muteImg : noMuteImg" />
                    </div>
                  </div>
                  <div class="contont-border-bottom"></div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getContactList } from "@/api";
import { getGroupList,updateGroupSetting } from '@/api/groupController'

export default {
  name: "Notify",
  data() {
    return {
      searchKey: "",
      activeName: "address",
      disabled: true,
      groupList: [],      
      contactList: [],
      newGroupList:[],
      newContactList:[],
      muteImg:require("./../../../static/images/icon_notification.svg"),
      noMuteImg:require("./../../../static/images/volume.svg"),
      device: localStorage.getItem("device"),
    };
  },
  watch:{
    searchKey(val) {
      let searchKeyData = val.split(" ");
      searchKeyData.forEach((el) => {
        let searchCase =
          this.activeName === "address" ? this.contactList : this.groupList;
        this.searchData = searchCase.filter((item) => {
          if (this.activeName === "address") {
            return item.name.indexOf(el.replace("@", "")) !== -1;
          } else {
            return item.groupName.indexOf(el.replace("@", "")) !== -1;
          }
        });
      });
      if(this.activeName === "address"){
        this.newContactList = this.searchData
      }else{
        this.newGroupList = this.searchData;
      }
    },
  },
  computed: {
    ...mapState({

    }),
  },
  created() {
    this.getDataList();
  },
  mounted() {
    this.homeScrollHeight()
  },
  methods: {
    ...mapMutations({

    }),
    getDataList() {
      getContactList().then((res) => {
        this.newContactList = []
        this.contactList = res.data.list;
        this.contactList.forEach((el) => {
          el.mute = true
        }); 
        this.newContactList = this.contactList.filter((name)=>{
          return name.contactId !== localStorage.getItem("id")
        })
      });
      getGroupList().then((res) => {
        this.newGroupList=[]
        this.groupList = res.data.list;
        this.groupList = this.groupList.filter((el)=>{
          return el.groupName !== undefined
        })
        this.newGroupList = this.groupList
      });
    },
    noIconShow(iconData, key) {
      if ([undefined, null, ""].includes(iconData.icon)) {
        return require(`./../../../static/images/image_${key}_defult.png`);
      } else {
        return iconData.icon;
      }
    },    
    muteActional(item,type){
      if(type === "user"){
        item.mute = !item.mute
        this.newContactList = this.contactList.filter((name)=>{
          return name.contactId !== localStorage.getItem("id")
        })
      }else{
        item.setting.prompt = !item.setting.prompt
        let parmas = {
          groupId: item.groupId,
          setting: {
            prompt: item.setting.prompt
          }
        }
        updateGroupSetting(parmas).then(res =>{
          if(res.code === 200){
            this.$message({ message: !item.setting.prompt ? "静音":"關閉靜音", type: !item.setting.prompt ? "success" : "warning" });
          }
        })
      }
    },
    homeScrollHeight(){
      let scrollTop = document.querySelector(".home-content");
      let headerScrollTop = document.querySelector(".is-top");
      let tabsContentHeight = scrollTop.scrollHeight - headerScrollTop.scrollHeight
      document.querySelector(".el-tabs__content").style.height = tabsContentHeight + 'px';      
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
  }
  .home-content{
    overflow: hidden !important;
    .address-box{
      .contont-box {
        .msg-box {
          .time {
            position: absolute;
            right: 2.5em;
            img{
              height: 1.5em;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
.hichat-pc {
  .home-wrapper {
    .el-container {
      .el-aside {
        border-radius: 0;
        .home-header {
          .home-user-pc {
            background-color: #fff;
            background-image: url("./../../../static/images/pc/arrow-left.svg");
            cursor: pointer;
          }
        }        
        .home-search-pc {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1em;
          .el-input {
            width: 95%;
            /deep/.el-input__inner {
              background-color: #e9e8e8;
              color: #666666;
            }
          }
        }
        .address-box{
          .contont-box {
            .msg-box {
              .time {
                position: absolute;
                right: 2.5em;
                color:#F60;
                img{
                  height: 1.5em;
                  cursor: pointer;
                }
                svg{
                  fill:currentColor
                }
              }
            }
          }
        }
      }
    }
  }

  
}
.mb10 {
  margin-bottom: 1em;
}
</style>