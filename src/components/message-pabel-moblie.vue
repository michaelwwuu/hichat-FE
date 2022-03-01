<template>
  <div class="message-pabel-box" @touchmove="$root.handleTouch">
    <ul class="message-styles-box">
      <div v-for="(item, index) in newMessageData" :key="index">
        <div class="now-time">
          <span>{{ index }}</span>
        </div>
        <li
          v-for="(el, index) in item"
          :key="index"
          :class="judgeClass(item[index])"
        >
          
            <p>
              <span
                class="message-classic"
                v-if="el.chatType === 'SRV_USER_SEND'"
                @contextmenu.prevent="onContextmenu"
                @dblclick="dblclick"
                >{{ el.message.content }}</span
              >
                <!-- @click.right="mouseClick(el)"
                
                @contextmenu.prevent -->
              <audio
                class="message-audio"
                v-else-if="el.chatType === 'SRV_USER_AUDIO'"
                controls
                :src="el.message.content"
                type="mp3"
              ></audio>

              <span
                class="message-image"
                v-else-if="el.chatType === 'SRV_USER_IMAGE'"
              >
                <el-image
                  :src="el.message.content"
                  :preview-src-list="[el.message.content]"
                >
                </el-image>
              </span>
              <span class="nickname-time">{{
                $root.formatTimeSecound(el.message.time)
              }}</span>
            </p>
            <div class="read-check-box">
              <span class="read-check" v-if="el.isRead"
                ><img src="./../../static/images/check.png" alt=""
              /></span>
              <span class="read-check2"
                ><img src="./../../static/images/check.png" alt=""
              /></span>
            </div>
            <div class="click-more-btn" v-show="el.isMoreSetUp">
              <ul>
                <li>編輯</li>
                <li>複製</li>
                <li>回覆</li>
                <li class="red-text">在所有人的對話紀錄中刪除</li>
                <li class="red-text">只在我的對話紀錄中刪除</li>
              </ul>
            </div>
        </li>
      </div>
    </ul>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "MessagePabel",
  props: {
    userInfoData: {
      type: Object,
    },
    messageData: {
      type: Array,
    },
  },
  data() {
    return {
      newData: [],
      message: [],
      newMessageData: {},
    };
  },
  watch: {
    messageData(val) {
      //去除重复
      const set = new Set();
      this.message = val.filter((item) =>
        !set.has(item.historyId) ? set.add(item.historyId) : false
      );
      this.$root.gotoBottom();
    },
    message(val) {
      this.newMessageData = {};
      val.forEach((el) => {
        this.newMessageData[this.$root.formatTimeDay(el.message.time)] = [];
        let newData = this.message.filter((res) => {
          return (
            this.$root.formatTimeDay(res.message.time) ===
            this.$root.formatTimeDay(el.message.time)
          );
        });
        this.newMessageData[this.$root.formatTimeDay(el.message.time)] =
          newData;
      });
    },
  },
  methods: {
    ...mapMutations({
      setReplyMsg:"ws/setReplyMsg"
    }),
    // 判断讯息Class名称
    judgeClass(item) {
      if (item.userChatId === 'u' + localStorage.getItem('id')) {
        return "message-layout-right";
      } else {
        return "message-layout-left";
      }
    },
    mouseClick(event) {
      for (let item in this.newMessageData) {
        this.newMessageData[item].forEach((res)=>{
          if(res.historyId === event.historyId) {
            return res.isMoreSetUp = true
          }else{
            return res.isMoreSetUp = false
          }
        })
      }
    },
    dblclick(event){
      console.log(event)
      if (event.which === 1) {
        this.setReplyMsg({type:event.type,innerText:event.target.innerText})
      }
    },
    onContextmenu(event) {
      this.$contextmenu({
        items: [
          {
            label: "返回(B)",
            onClick: () => {
              this.message = "返回(B)";
              console.log("返回(B)");
            }
          },
          { label: "前进(F)", disabled: true },
          { label: "重新加载(R)", divided: true, icon: "el-icon-refresh" },
          { label: "另存为(A)..." },
          { label: "打印(P)...", icon: "el-icon-printer" },
          { label: "投射(C)...", divided: true },
          {
            label: "使用网页翻译(T)",
            divided: true,
            minWidth: 0,
            children: [{ label: "翻译成简体中文" }, { label: "翻译成繁体中文" }]
          },
          {
            label: "截取网页(R)",
            minWidth: 0,
            children: [
              {
                label: "截取可视化区域",
                onClick: () => {
                  this.message = "截取可视化区域";
                  console.log("截取可视化区域");
                }
              },
              { label: "截取全屏" }
            ]
          },
          { label: "查看网页源代码(V)", icon: "el-icon-view" },
          { label: "检查(N)" }
        ],
        event,
        //x: event.clientX,
        //y: event.clientY,
        customClass: "class-a",
        zIndex: 3,
        minWidth: 230
      });
      return false;
    }
  },
};
</script>

<style lang="scss" scoped>
.hichat-pc{
  .message-pabel-box {
    .message-styles-box{
      .message-layout-left {
        p {
          .el-image{
            width:auto !important;
            height:10em !important;
            /deep/.el-image__inner{
              height: 100%;
            }
          }
        }
      }
      .message-layout-right {
        p {
          .el-image{
            width:auto !important;
            height:10em !important;
            /deep/.el-image__inner{
              height: 100%;
            }
          }
        }
      }
    }
    
  }
}
.message-pabel-box {
  padding: 0 15px 0 20px;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  .now-time {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin: 1em 0;
    span {
      background-color: #d3d3d3;
      padding: 3px 8px;
      border-radius: 10px;
    }
  }

  .message-styles-box {
    margin-bottom: 20px;
    .message-layout-left,
    .message-layout-right {
      margin-top: 20px;
      width: 100%;
    }

    .message-layout-left {
      p {
        display: flex;
        align-items: flex-end;
        .message-audio {
          border-radius: 0 10px 10px 10px;
          background-color: #f3f9ff; 
        }
        audio {
          width: 190px;
        }
        .el-image{
          width:10em !important;
          height:10em !important;
          /deep/.el-image__inner{
            height: 100%;
          }
        }
      }
      .message-avatar {
        float: left;
        margin-right: 10px;
      }
      .message-classic {
        background-color: rgb(243, 249, 255);
        line-height: 1.4rem;
        font-weight: 500;
        letter-spacing: 0.5px;
        border-radius: 0 8px 8px 8px;
      }
      .nickname-time {
        color: #777777;
        font-size: 12px;
        padding-left: 10px;
      }
      .read-check-box {
        display: none;
      }
      
    }

    .click-more-btn{
      width: 180px;
      background-color:#ffffffcb;
      box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.4);
      position: relative;
      border-radius:5px;
      padding: 10px;
      ul{
        li{
          line-height:2em;
          font-size: 14px;
          font-weight: 600;
          padding:5px;
          color: #403f3f;
          cursor: pointer;
          &:hover{
            background-color:#dadadacb;
            border-radius:5px;
          }
        }
        
      }
      .red-text{
        color: #ee5253;
      }
    }

    .message-layout-right {
      p {
        display: flex;
        align-items: flex-end;
        flex-flow: row-reverse;
        .message-audio {
          border-radius: 0 10px 10px 10px;
          background-color: #f1f3f4;
          audio {
            width: 190px;
          }
        }
        .el-image{
          width:10em !important;
          height:10em !important;
          /deep/.el-image__inner{
            height: 100%;
          }
        }
      }
      .message-avatar {
        float: right;
        margin-left: 10px;
      }
      .message-classic {
        text-align: left;
        color: #000000;
        line-height: 1.4rem;
        font-weight: 500;
        background-color: #f1f3f4;
        letter-spacing: 0.5px;
        border-radius: 8px 0 8px 8px;
      }
      .nickname-time {
        color: #777777;
        font-size: 12px;
        padding-right: 10px;
      }
      .read-check-box {
        display: flex;
        justify-content: flex-end;
        span {
          img {
            height: 1em;
          }
        }
        .read-check {
          position: relative;
          left: 0.5em;
        }
        .read-check2 {
          left: 1em;
        }
      }
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 2px;
      border: 1px solid #eeeeee;
    }

    .message-classic,
    .message-disabled {
      position: relative;
      max-width: 45%;
      margin-top: 5px;
      display: inline-block;
      padding: 9px 12px;
      font-size: 14px;
      color: #333333;
      white-space: pre-line;
      word-break: break-all;
      .red {
        height: 1.5em;
      }
      img {
        height: 6em;
      }
    }
    .message-audio {
      width: 190px;
      height: 2.5em;
      margin-top: 1em;
      display: inline-block;
      border: 1px solid #eeeeee;
    }
    .message-image {
      position: relative;
      margin-top: 1em;
      display: inline-block;
      padding: 5px 6px 2px 6px;
      color: #333333;
      background-color: #e5e4e4;
      border-radius: 10px;
      img {
        border-radius: 8px;
        width: 6em;
      }
    }
  }
}
</style>
