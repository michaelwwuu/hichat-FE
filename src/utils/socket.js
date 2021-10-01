import Vue from "vue";
import { getLocal,setLocal, getToken } from "_util/utils.js";
// const wsUrl = "ws://10.99.114.10:8299/im/echo";//模擬環境
const wsUrl = "wss://test.hichat.tools/ws/im/echo";//測試機環境
var socket = new WebSocket(wsUrl);

const emitter = new Vue({
  data() {
    return {
      roomKey: {
        chatType: "CLI_AUTH",
        id: Math.random(),
        deviceId: getLocal('UUID'),
        token: getToken('token'),
        tokenType: 0,
        platformCode: "dcw",
      },
    }
  },
  created() {
    this.connect()
  },
  methods: {
    send(message) {
      if (socket.readyState === 1)socket.send(JSON.stringify(message));
    },
    // 初始化websocket 
    connect() {
      socket = new WebSocket(wsUrl);
      let roomKey = this.roomKey
      socket.onopen = function () {
        console.log("<--【开启连线】------初始建立连线-->");
        socket.send(JSON.stringify(roomKey));
      };
      socket.onmessage = function (msg) {
        let msgData = JSON.parse(msg.data)
        let chatType = msgData.chatType
        switch (chatType) {
          case "SRV_SUCCESS_MSG":
            console.log("<--【连线成功】------Websocket 连线已建立-->");
            break;
          case "SRV_ERROR_MSG":
            console.log("<--【连线失敗】------请检察 Websocket onopen 参数是否正确-->");
            if(msgData.text === "NEED_AUTH"){
              roomKey.chatType = "CLI_AUTH",
              roomKey.id = Math.random(),
              socket.send(JSON.stringify(roomKey));
            } 
            break;
          case "SRV_RECENT_CHAT":
            console.log("<--【连线成功】------加入群组聊天室------【toChatId：進入聊天室ID】-->");
            roomKey.chatType = "CLI_JOIN_ROOM",
            roomKey.id = Math.random(),
            roomKey.toChatId = 'r5',
            socket.send(JSON.stringify(roomKey));
            break;
        }
        emitter.$emit("message", msg.data);
      };
      socket.onerror = function (err) {
        emitter.$emit("error", err);
      };
      socket.onclose = function () {
        console.log("<--【连线斷開】------自動重新連線-->");
        roomKey.chatType = "CLI_AUTH",
        roomKey.id = Math.random(),
        emitter.connect();
      };
    },
    onClose() {
      let leaveRoom = this.roomKey
      leaveRoom.chatType = "CLI_LEAVE_ROOM",
      leaveRoom.id = Math.random(),
      socket.send(JSON.stringify(leaveRoom));
      socket.close()
    },
  }
});
export default emitter;