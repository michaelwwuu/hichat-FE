<template>
  <div class="home-wrapper">
    <el-container v-if="device === 'moblie'">
      <el-main>
        <div class="home-header">
          <div class="home-user" @click="back"></div>
          <span class="home-header-title">提醒</span>
          <div class="home-add-user"></div>
        </div>
        <div class="home-content">
          <div class="setting-title">應用內提醒</div>
          <div
            class="setting-button"
            v-for="(item, index) in soundNofiyData"
            :key="item + index"
            :class="{
              mb10: item.key === 'sound'
            }"
          >
            <div class="setting-box">
              <div class="setting-button-left">
                <span>{{ item.name }}</span>
              </div>
              <div class="setting-button-right">
                <el-switch
                  v-model="item.isNofity"
                  active-color="#fd5f3f"
                  inactive-color="#666666"
                  @change="chengeSoundNofiy(item)"
                >
                </el-switch>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="300px">
        <el-header height="70px">
          <div class="home-header flex-start">
            <div class="home-user-pc" @click="back"></div>
            <span class="home-header-title">提醒</span>
          </div>
        </el-header>
        <div class="home-content">
          <div class="setting-title">靜音</div>
          <router-link :to="'/MuteSound'">
            <div class="setting-button">
              <div class="setting-box">
                <div class="setting-button-left">
                  <span>編輯名單</span>
                </div>
                <div class="setting-button-right">
                  <img src="./../../../static/images/next.png" alt="" />
                </div>
              </div>
            </div>      
          </router-link>
          <div class="setting-title">應用內提醒</div>
          <div
            class="setting-button"
            v-for="(item, index) in soundNofiyData"
            :key="item + index"
          >
            <div class="setting-box">
              <div class="setting-button-left">
                <span>{{ item.name }}</span>
              </div>
              <div class="setting-button-right">
                <el-switch
                  v-model="item.isNofity"
                  active-color="#fd5f3f"
                  inactive-color="#666666"
                  @change="chengeSoundNofiy(item)"
                >
                </el-switch>
              </div>
            </div>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Notify",
  data() {
    return {
      device: localStorage.getItem("device"),
      nofityData: JSON.parse(localStorage.getItem("nofity")),

      soundNofiyData: JSON.parse(localStorage.getItem("soundNofiy")),
    };
  },
  // computed: {
  //   ...mapState({
  //     nofity: (state) => state.ws.nofity,
  //     soundNofiy: (state) => state.ws.soundNofiy,
  //   }),
  // },
  created() {
    // if(localStorage.getItem("nofity") === null){
    //   this.setNofiy(this.nofity)
    // }
    // if(localStorage.getItem("soundNofiy") === null){
    //   this.setSoundNofiy(this.soundNofiy)
    // }
    // console.log(JSON.parse(localStorage.getItem("nofity")))
  },
  methods: {
    ...mapMutations({
      setNofiy:"ws/setNofiy",
      setSoundNofiy: "ws/setSoundNofiy",
    }),
    // chengeNofiy(item){
    //   this.nofityData.forEach((data) => {
    //     if (item.key === "nofity") {
    //       if (!item.isNofity) {
    //         return (data.isNofity = false);
    //       } else if (item.isNofity) {
    //         return (data.isNofity = true);
    //       }
    //     } else if (item.key === data.key) {
    //       if (!item.isNofity) {
    //         return (data.isNofity = false);
    //       } else if (item.isNofity) {
    //         return (data.isNofity = true);
    //       }
    //     }
    //   })
    //   let newNofiy = this.nofityData.filter(el => el.key !== "nofity")
    //   let doubleCloseNofiy = newNofiy.every(item => !item.isNofity);
    //   let doubleOpenNofiy = newNofiy.every(item => item.isNofity);
    //   if(doubleCloseNofiy){
    //     this.nofityData.forEach((el)=> el.isNofity = false)
    //   } 
    //   if(doubleOpenNofiy){
    //     this.nofityData.forEach((el)=> el.isNofity = true)
    //   }
    //   this.setNofiy(this.nofityData);
    // },
    chengeSoundNofiy(item) {
      this.soundNofiyData.forEach((data) => {
        if (item.key === "sound") {
          if (!item.isNofity) {
            return (data.isNofity = false);
          } else if (item.isNofity) {
            return (data.isNofity = true);
          }
        } else if (item.key === data.key) {
          if (!item.isNofity) {
            return (data.isNofity = false);
          } else if (item.isNofity) {
            return (data.isNofity = true);
          }
        }
      });
      // let newSoundNofiy = this.soundNofiyData.filter(el => el.key !== "sound")
      // let doubleCloseSoundNofiy = newSoundNofiy.every(item => !item.isNofity);
      // let doubleOpenSoundNofiy = newSoundNofiy.every(item => item.isNofity);
      // if(doubleCloseSoundNofiy){
      //   this.soundNofiyData.forEach((el)=> el.isNofity = false)
      // } 
      // if(doubleOpenSoundNofiy){
      //   this.soundNofiyData.forEach((el)=> el.isNofity = true)
      // }
      this.setSoundNofiy(this.soundNofiyData);
    },
    back() {
      this.$router.back(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.hichat-pc {
  .home-user-pc {
    background-color: #fff;
    background-image: url("./../../../static/images/pc/arrow-left.svg");
    cursor: pointer;
  }
}

.hichat-moblie {
  .home-wrapper {
    .el-container {
      .el-main {
        .home-content {
          .setting-title {
            padding: 12px 0 16px 18px;
            text-decoration: none;
          }
          .setting-button {
            .setting-button-left {
              span {
                margin-left: 0;
              }
            }
          }
        }
      }
    }
  }
}
.home-wrapper {
  .home-header {
    .home-user {
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
    }
  }
  .home-content {
    
    a{
      text-decoration: none;
    }
    .setting-title {
      padding: 30px 0 5px 33px;
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
      .setting-box {
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
          margin-left: 1em;
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
.mb10 {
  margin-bottom: 1em;
}
</style>