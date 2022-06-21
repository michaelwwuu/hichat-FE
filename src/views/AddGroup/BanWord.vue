<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container v-if="device === 'moblie'">
      <el-main>
        <el-header height="125px">
          <div class="home-header">
            <div class="home-user" @click="back()"></div>
            <span class="home-header-title">禁用詞設定</span>
            <div class="home-add-user" @click="addBanShow = true">＋</div>
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
            class="setting-button"
            v-for="(item, index) in newBanSearchData"
            :key="index"
          >
            <div class="setting-box">
              <div class="setting-button-left">
                <span>{{ !groupPermissionData.addGroup ? item.word: item }}</span>
              </div>
              <div class="setting-button-right">
                <span @click="unAdmin(item)">－</span>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="300px">
        <el-header height="70px">
          <div class="home-header">
            <span class="home-header-title">
              <div
                style="
                  display: flex;
                  align-items: center;
                  cursor: pointer;
                "
              >
                <span style="padding-right: 10px" :style="groupPermissionData.addGroup ? 'margin-top:2px; margin-left:4px':''" @click="back()"
                  ><img src="./../../../static/images/pc/arrow-left.png" alt=""
                /></span>
                <span>禁用詞設定</span>
              </div>
            </span>
            <div class="home-add-user" @click="addBanShow = true">＋</div>
          </div>
        </el-header>
        <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.05);">
          <div class="home-search" >
            <el-input
              placeholder="搜寻"
              prefix-icon="el-icon-search"
              v-model="searchKey"
            >
            </el-input>
          </div>
        </div>                
        <div class="home-content">
          <div
            class="setting-button"
            v-for="(item, index) in newBanSearchData"
            :key="index"
          >
            <div class="setting-box">
              <div class="setting-button-left">
                <span>{{ !groupPermissionData.addGroup ? item.word: item }}</span>
              </div>
              <div class="setting-button-right">
                <span @click="unAdmin(item)">－</span>
              </div>
            </div>
          </div>
        </div>
      </el-aside>
    </el-container>  
    <el-dialog
      title="請輸入要新增的禁用字詞"
      :visible.sync="addBanShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :class="device === 'moblie' ? 'border-red' : 'background-gray'" @click="closeAddBanShow"
          >取消</el-button
        >
        <el-button class="background-red" @click="addBanAction">确认</el-button>
      </span>
    </el-dialog>     
    <el-dialog
      :title="device === 'pc' ? '刪除禁用字詞' : ''"
      :visible.sync="unBanShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'moblie'"><img src="./../../../static/images/warn.png" alt="" /></div>
        <span>是否確定要刪除該則禁用字詞？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :class="device === 'moblie' ? 'border-red' : 'background-gray'" @click="unBanShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="unBanAction">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState,mapMutations } from "vuex";
import { addGroupDisabledWord,getGroupDisabledWord,delGroupDisabledWord } from "@/api";

export default {
  name: "AdminSetting",
  data() {
    return {
      searchKey:"",
      input:"",
      banMessage:[],
      newBanSearchData:[],
      banObject:{},
      unBanShow:false,
      addBanShow:false,
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
    this.getDisabledWord()
  },
  watch:{
    searchKey(val) {
      if(this.groupPermissionData.addGroup){
        let searchKeyData = val.split(" ");
        searchKeyData.forEach((el) => {
          let searchCase = this.banMessage;
          this.searchData = searchCase.filter((item) => {
            return item.indexOf(el) !== -1;
          });
        });
        this.newBanSearchData = this.searchData
      }else{
        let searchKeyData = val.split(" ");
        searchKeyData.forEach((el) => {
          let searchCase = this.banMessage;
          this.searchData = searchCase.filter((item) => {
            return item.word.indexOf(el) !== -1;
          });
        });
        this.newBanSearchData = this.searchData
      }
    },
  },  
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,
      groupPermissionData: (state) => state.ws.groupPermissionData,
    }),
  },  
  methods: {
    ...mapMutations({
      setMsgInfoPage:"ws/setMsgInfoPage",
    }), 
    getDisabledWord(){
      if(!this.groupPermissionData.addGroup){
        let groupId = this.groupData.groupId;
        getGroupDisabledWord({groupId}).then((res)=>{
          if(res.code === 200){
            this.banMessage = res.data
            this.newBanSearchData = this.banMessage
          }
        })
      }else{
        this.banMessage = this.groupPermissionData.groupDisabledWordList
        this.newBanSearchData = this.banMessage
      }
    },
    unAdmin(data){
      this.unBanShow = true
      this.banObject = data
    },
    unBanAction(){
      if(!this.groupPermissionData.addGroup){
        let params = this.banObject
        delGroupDisabledWord(params).then((res)=>{
          if(res.code === 200){
            this.unBanShow = false
            this.getDisabledWord()
          }
        })
      }else{
        let newObjArr = this.groupPermissionData.groupDisabledWordList.filter((el)=>{
          return el !== this.banObject
        })
        this.groupPermissionData.groupDisabledWordList = newObjArr
        this.unBanShow = false
        this.getDisabledWord()
      }
    },
    addBanAction(){
      if(this.input === ""){
        this.$message({ message: "不可填入空白", type: "error" });
        return false
      }
      if(!this.groupPermissionData.addGroup){
        let params = {
          groupId: this.groupData.groupId,
          word:this.input
        }
        addGroupDisabledWord(params).then((res)=>{
          if(res.code === 200) {
            this.input = ""
            this.addBanShow = false
            this.getDisabledWord()
          }
        })
      }else{
        this.groupPermissionData.groupDisabledWordList.push(this.input)
        this.input = ""
        this.addBanShow = false
      }

    },
    closeAddBanShow(){
      this.input = ""
      this.addBanShow = false
    },
    back() {
      if (this.device === "moblie") {
        this.$router.back(-1);
      } else {
        if(this.groupPermissionData.addGroup){
          this.$router.back(-1);
        }else{
          this.setMsgInfoPage({ pageShow: false, type: "SettingGroup" });
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
    .home-add-user {
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fe5f3f;
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
          color: #fe5f3f;
          border: 1px solid #fe5f3f;
          cursor: pointer;
        }
      }
    }    
  }
  .el-dialog-loginOut {
    overflow: auto;
    /deep/.el-dialog {
      margin: 0 auto 50px;
      background: #ffffff;
      border-radius: 10px;
      position: relative;
      box-sizing: border-box;
      width: 50%;
      .el-dialog__header {
        padding: 30px 10px 0 10px;
      }
      .el-dialog__body {
        text-align: center;
        padding: 25px 25px 15px;
        .loginOut-box {
          img {
            height: 5em;
            margin-bottom: 1.2em;
          }
        }
      }
      .el-dialog__footer {
        padding: 20px;
        padding-top: 10px;
        text-align: right;
        box-sizing: border-box;
        .dialog-footer {
          display: flex;
          justify-content: space-between;
          .el-button {
            width: 100%;
            border-radius: 8px;
          }
          .background-red {
            background-color: #ee5253;
            color: #fff;
          }
          .border-red {
            border: 1px solid #fe5f3f;
            color: #fe5f3f;
          }
        }
      }
    }
  }  
}
.hichat-pc {
  .home-wrapper {
    .home-search{
      .el-input{
        width: 95%;
      }
    }
    .el-dialog-loginOut {
      /deep/.el-dialog {
        .el-dialog__footer {
          padding: 0;
          .el-button {
            &:nth-child(2) {
              border-left: 1px solid rgb(239, 239, 239);
            }
          }
        }
      }
    }
  }
}
</style>
