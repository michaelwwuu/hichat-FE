<template>
  <div>
    <div class="home-header">
      <div class="home-user" @click="userMemberShow"></div>
      <span class="home-header-title">通訊錄</span>
      <router-link :to="'/AddUser'">
        <div class="home-add-user"></div>
      </router-link>
    </div>
    <div class="home-search">
      <el-input
        placeholder="输入欲搜寻的联络人"
        prefix-icon="el-icon-search"
        v-model="searchKey">
      </el-input>
    </div>
    <div class="home-content-tag">
      <span>聯絡人 <span class="number">{{contactList.length}}</span></span>
      <span>群組</span>
    </div>
  </div>    
</template>

<script>
import { getContactList } from "@/api";

export default {
  name: "Address",
  data() {
    return {
      searchKey:'',
      contactList:[],
    }
  },
  mounted() {
    this.getAddressList()
  },
  methods: {
    getAddressList(){
      getContactList()
      .then((res)=>{
        console.log(res)
        this.contactList = res.list
      })
    },
    userMemberShow(){
      console.log(123)
    }
  },
};
</script>
<style lang="scss" scoped>
.home-header {
  margin: 1em;
  display: flex;
  align-items: center;
  .home-user {
    width: 2em;
    height: 2em;
    border-radius: 10px;
    background-color: #fff;
    background-image: url("./../../../../static/images/qrcode.png");
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
    background-image: url("./../../../../static/images/add_user.png");
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
.home-content-tag{
  display: flex;
  justify-content: space-between;
  background-color: #e2e0e0;
  padding: 0.7em 5em;
  span{
    font-size: 15px;
  }
  .number{
    padding-left: 1px;
  }
}

</style>

