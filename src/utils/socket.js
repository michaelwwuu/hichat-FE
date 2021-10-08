import Vue from "vue";
import { getLocal, getToken } from "_util/utils.js";
// const wsUrl = "ws://10.99.114.10:8299/im/echo";//模擬環境
// const wsUrl = "wss://test.hichat.tools/ws/im/echo";//測試機環境
const wsUrl = "wss://pre.hichat.tools/ws/im/echo";//pre環境
var socket = new WebSocket(wsUrl);

const emitter = new Vue({
  data() {
    return {
      roomKey: {
        chatType:"CLI_AUTH",
        id:Math.random(),
        deviceId: getLocal('UUID'),
        token: getToken('token'),
        tokenType: 1,
        platformCode: "dcw",
      },
    }
  },
  methods: {
    send(message) {
      if (socket.readyState === 1)socket.send(JSON.stringify(message));
    },
    onClose() {
      let leaveRoom = this.roomKey;
      leaveRoom.chatType = "CLI_LEAVE_ROOM";
      leaveRoom.id = Math.random();
      socket.send(JSON.stringify(leaveRoom));
      socket.close();
    },
    // 初始化websocket 
    connect() {
      socket = new WebSocket(wsUrl);
      let roomKey = this.roomKey

      socket.onmessage = function (msg) {
        let msgData = JSON.parse(msg.data)
        let chatType = msgData.chatType
        switch (chatType) {
          case "SRV_SUCCESS_MSG":
            socket.send(JSON.stringify(roomKey));
            break;
          case "SRV_ERROR_MSG":
            console.log(`<--【连线失敗】------訊息發送失敗${msgData.text}-->`);
            if(msgData.text === "NEED_AUTH"){
              roomKey.chatType = "CLI_AUTH";
              roomKey.id = Math.random();
              socket.send(JSON.stringify(roomKey));
            } 
            break;
          case "SRV_RECENT_CHAT":
            roomKey.chatType = "CLI_JOIN_ROOM";
            roomKey.id = Math.random();
            roomKey.toChatId = getLocal('toChatId');
            socket.send(JSON.stringify(roomKey));
            break;
        }
        emitter.$emit("message", msg.data);
      };
      socket.onerror = function (err) {
        emitter.$emit("error", err);
      };
      socket.onclose = function (e) {
        console.log("<--【连线斷開】------自動重新連線-->",e);
        roomKey.chatType = "CLI_AUTH";
        roomKey.id = Math.random();
        emitter.connect();
      };
    },
  }
});
emitter.connect();
export default emitter;