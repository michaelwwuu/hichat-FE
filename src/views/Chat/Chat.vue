<template>
  <div class="wrapper">
    <!-- <div class="search">
      <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="searchForm.name"  placeholder="请输入 不輸入則顯示所有聊天室" style="width: 250px; margin-right: 10px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSearch">搜寻</el-button>
        </el-form-item>
      </el-form>
      
    </div>
    <div class="search-list">
      <span>聊天室選擇 :</span>
      <el-row v-for="item in searchData" :key="item.i">
        <el-button type="primary" plain round>{{item.chatRoomName}}</el-button>
      </el-row>
    </div> -->
    <el-container>
      <el-aside width="250px">
        
        <el-header height="40px">
          <i class="el-icon-user-solid icon-message"></i>
          <span class="title">联系人 </span>
        </el-header>

        <message-group
          :concats="concats"
           />
      </el-aside>
      <el-main>
        <el-header height="40px"></el-header>
        <message-pabel
          :concats="concats"
          :nowSwitchId="nowSwitchId"
          :localInfo="localInfo"
          @message="message" />

        <message-input
          :concats="concats"
          :localInfo="localInfo"
          :nowSwitchId="nowSwitchId" />
      </el-main>
      <footer class="footer">
        <a href="https://xiaobaicai.fun/" target="_blank">WeiLin</a> &copy; 2020
      </footer>
      <audio id="notify-audio" src="./../../../static/wav/tim.wav"></audio>
    </el-container>
  </div>
</template>

<script>
import { mapState } from "vuex";

import MessageGroup from '@/components/message-group'
import MessagePabel from '@/components/message-pabel'
import MessageInput from '@/components/message-input'
import { getSearchChat } from "@/api";
export default {
  name: 'Chat',
  data () {
    return {
      concats: [{
        id: 0,
        active: false,
        nickName: '聊天室',
        avatar: './../../../static/avatar/group.png',
        message: {
          time: 1580572800000,
          content: 'Welcome'
        }
      }],
      nowSwitch: 0,
      nowSwitchId: 'group',
      localInfo: {},
      searchForm: {
        pageSize: 10,
        pageNum: 1 ,
        name: '',
      },
      searchData:[],
    }
  },  
  computed: {
    ...mapState({
      wsRes: state => state.ws.wsRes
    }),
  },
  watch: {
    wsRes(val) {
      const StatusCode = val;
      StatusCode === 0 && this.$message({ type: "error", message: "查詢失敗" });
      console.log('val',val)
      let chatType = val.chatType
      switch (chatType) {
        case "SRV_RECENT_CHAT":
          console.log(val.recentChat)
          break;
      
        default:
          break;
      }
    }
  },
  mounted () {
    this.UUID()
    console.log(this.UUID())
    const params = this.$route.params
 
    /**
     * 判断是否通过路由跳转过来的
     */
    if (params.id) {
      // 保存当前用户信息
      this.localInfo = {
        id: params.id,
      }
    }
    // else{
    //   this.goBack()
    // }
  },
  methods: {
    UUID(){
      let number = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      localStorage.setItem('UUID',number + number + '-' + number + '-' + number + '-' + number + '-' + number + number + number ) 
    },
    onSearch(){
      getSearchChat(this.searchForm)
      .then((res) => {
        if(res.code === 200){
          this.searchData = res.data.list
        }
      })
      .catch((err) => {
        console.log(err)
      })
    },
    /**
     * 接收消息
     */
    message (respone) {
      let type = respone.type
      let body = respone.body
      let concats = this.concats
      let length = concats.length
      let id = body.gotoId
      let notifyAudio = document.getElementById('notify-audio')

      // 服务器返回的消息
      if (type === 'server-message') {
        if (respone.id === 'robots') {
          id = 'robots'
        }
      }

      // 更新小红点
      if (this.nowSwitchId !== id) {
        body.message.isNewMessage = true
        body.message.newMessageCount = (() => {
          for (var i = 0; i < length; i++) {
            if (id === this.concats[i].id) {
              notifyAudio.play()
              if (this.concats[i].message.newMessageCount !== undefined) {
                let count = this.concats[i].message.newMessageCount += 1
                return count
              } else {
                return 1
              }
            }
          }
        })()
      }

      // 更新联系人消息
      for (let i = 0; i < length; i++) {
        if (concats[i].id === id) {
          Object.assign(this.concats[i].message, body.message)
        }
      }
    },

    /**
     * 关闭
     */
    goBack() {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      // let href = window.location.href
      // window.location.href = href.split('#')[0]
    }
  },
  components: {
    MessageGroup,
    MessagePabel,
    MessageInput
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  background-image: url('/static/images/bg.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  .search{
    display: inline-flex;
    align-content: center;
    position: fixed;
    top: 0px;
    bottom: 0;
    left: 0;
    right: 0;
    width: 95%;
    margin: 30px auto;
  }
  .search-list{
    display: inline-flex;
    align-content: center;
    align-items: center;
    position: fixed;
    top: 45px;
    bottom: 0;
    left: 0;
    right: 0;
    width: 95%;
    height: 6%;
    margin: 30px auto;
    div{
      margin-left: 10px;
    }
  }
  .el-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 95%;
    margin: 30px auto;
    .el-aside,
    .el-main{
      display: flex;
      flex-direction: column;
      border-radius: 6px 0px 6px 6px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);      
    }
    .el-aside{
      border-radius: 6px 0px 6px 6px;
    }
    .el-main {
      border-radius: 0px 6px 6px 6px;
    }
    .el-aside {
      background: rgba(235, 233, 232, .8);
    }
    .el-main {
      padding: 0;
    }
    .el-header {
      position: relative;
      line-height: 40px;
      background: rgb(55, 126, 200);
      overflow: hidden;
      border-right:1px solid #FFFFFF;
      .title,
      .icon-message {
        color: #ffffff;
      }
      .icon-message {
        font-size: 20px;
        vertical-align: middle;
      }
      .title {
        display: inline-block;
        margin-left: 5px;
        font-size: 16px;
        letter-spacing: 1px;
      }
    }
  }
  .footer {
    position: absolute;
    bottom: -23px;
    right: 0;
    left: 0;
    margin: auto;
    font-size: 13px;
    width: 150px;
    color: #ffffff;
    text-align: center;
    a {
      color: #ffffff;
      &:hover {
        color: #377ec8;
      }
    }
  }
}
</style>
