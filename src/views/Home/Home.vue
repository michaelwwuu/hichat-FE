<template>
  <div class="home-wrapper">
    <router-view></router-view>
    <div class="home-footer">
      <div class="home-footer-btn" v-for="(item,index) in routerNav" :key="index" @click="changeImg(index)">
        <router-link :to="item.path">
          <span><img alt="" :src="item.icon"  v-show="index !== num" /></span>
          <span><img alt="" :src="item.active" v-show="index === num" /></span>
          <span >{{item.name}}</span> 
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      routerNav:[
        {
          icon:require("./../../../static/images/address.png"),
          active:require("./../../../static/images/address_hover.png"),
          path:"/Address",
          name:"通訊錄",
        },
        {
          icon:require("./../../../static/images/chat.png"),
          active:require("./../../../static/images/chat_hover.png"),
          path:"/HiChat",
          name:"聊天",
        },
        {
          icon:require("./../../../static/images/setting.png"),
          active:require("./../../../static/images/setting_hover.png"),
          path:"/Setting",
          name:"設定",
        },
      ],
      num:0,
    };
  },
  created() {
    this.num = this.$route.fullPath === "/HiChat"? 1 : this.$route.fullPath === "/Setting" ? 2:0
  },
  methods: {
    changeImg(index){
      this.num = index
    }
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  min-height: 100%;
  width: 100%;
  background-color: #eaf5fa;
  overflow: hidden;

  .home-footer{
    width: 100vw;
    background-color: #FFF;
    position:fixed;
    bottom:0;
    display: flex;
    justify-content: space-between;
    padding:0.5em 0;
    .home-footer-btn{
      text-align: center;
      font-size: 12px;
      padding: 0;
      margin: 0 auto;
      a{
        text-decoration: none;
        color: #999999;
      }
      span{
        display:block;
      }
      img{
        margin-bottom: 5px;
        height:2.2em;
      }
      .router-link-exact-active{
        color:#fe5f3f;
      }
    }
  }
}
</style>
