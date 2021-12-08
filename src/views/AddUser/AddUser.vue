<template>
  <div class="home-wrapper">
    <div class="home-header">
      <router-link :to="'/Home'">
        <div class="home-user"></div>
      </router-link>
      <span class="home-header-title">新增联络人</span>
      <router-link :to="'/QRcode'"><div class="home-add-user"></div></router-link>
    </div>
    <div class="home-search">
      <el-input
        placeholder="输入欲搜寻的邮箱或帐号ID"
        prefix-icon="el-icon-search"
        v-model="searchKey"
        @keyup.native.enter="searchUserData(searchKey)">
      </el-input>
    </div>
    <div class="no-data" v-show="noData">
      <span>此用户不存在</span>
      <span>无法找到此用户，请确认您填写的 ID 是否正确。</span>
    </div>

    <div v-if="addUser.username !== undefined" class="add-content">
      <div class="user-data">
        <span><img :src="addUser.icon === undefined ? avatarImg : addUser.icon" alt=""></span>
        <span>{{addUser.username}}</span>
      </div>
      <div class="home-footer-btn">
        <el-button
        @click="joinUserButtom(addUser)"
          >加入联络人</el-button
        >
      </div>
    </div>
    
  </div>
</template>

<script>
import { searchByEmailUsername,addContactUser } from "@/api";

export default {
  name: "AddUser",
  data() {
    return {
      addUser:{},
      searchKey:'',
      avatarImg:require("./../../../static/images/image_user_defult.png"),
      noData:false,
    }
  },
  created() {
    if(this.getUrlParam('username') !== '') this.searchUserData(this.getUrlParam('username'))
  },
  methods: {
    // 獲取URL key
    getUrlParam(paraName) {
      let url = document.location.toString();
      let arrObj = url.split("?");
      if (arrObj.length > 1) {
        let arrPara = arrObj[1].split("&");
        let arr;
        for (let i = 0; i < arrPara.length; i++) {
          arr = arrPara[i].split("=");
          if (arr != null && arr[0] == paraName) return arr[1];
        }
        return "";
      }else {
        return "";
      }
    },

    searchUserData(token){
      this.noData = false
      if(token === '') {
        this.addUser = {}
        this.noData = true
        return
      } else if(token === localStorage.getItem('username')){
        this.$message({message:'无法增加自己到联络人',type: "error"})
        return
      }
      searchByEmailUsername({token}).then(res =>{
        if(res.data === undefined) {
          this.noData = true
        } else if(res.data !=={}){
          this.addUser = res.data
        } 
      })
    },
    joinUserButtom(data){
      let parmas = {
        contactId: data.id,
        name: data.username
      }
      addContactUser(parmas).then(res=>{
        if(res.code === 200) {
          this.$router.push({ path:'/Address' });
        } else if(res.code === 20002){
          this.$message({message:'联络人已新增过', type: "error"})
        } else {
          this.$message({message:res.message, type: "error"})
        }
      })
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
      border-radius: 10px;
      background-color: #fff;
      background-image: url("./../../../static/images/scan.png");
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
  .home-search{
    margin: 1em;
    /deep/.el-input{
      .el-input__inner{
        background-color: #e9e8e8;
        color: #666666;
      }
      .el-input__prefix{
        color: #666666;
      }
      ::placeholder { /* CSS 3 標準 */
        color: #666666;  
      }
    }
    
  }
  .no-data{
    margin: 2em 0;
    span{
      display: block;
      text-align: center;
      height:2em;
      &:nth-child(2){
        color: #b3b3b3;
        font-size:14px;
      }
    }
  }
  .add-content{
    .user-data{
      margin: 2.5em auto;
      span{
        display: block;
        text-align: center;
        height:5.5em;
        img{
          height:5em;
          border-radius: 10px;
        }
      }
    }
    .home-footer-btn{
      margin: 1em 0;
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      .el-button{
        width:93%;
        background-color: #fe5f3f;
        color: #fff;
      }
    }
  }

}
</style>
