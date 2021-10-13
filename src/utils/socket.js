import Vue from "vue";
// const wsUrl = "ws://10.99.114.10:8299/im/echo";//模擬環境
const wsUrl = "wss://test.hichat.tools/ws/im/echo";//測試機環境
// const wsUrl = "wss://pre.hichat.tools/ws/im/echo";//pre環境
var socket = new WebSocket(wsUrl);

const emitter = new Vue({
  data() {
    return {
      chatDataKey: {
        chatType:"CLI_AUTH",
        id:Math.random(),
        deviceId: localStorage.getItem('UUID'),
        token: localStorage.getItem('token'),
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
      let leaveChat = this.chatDataKey;
      leaveChat.chatType = "CLI_LEAVE_ROOM";
      leaveChat.id = Math.random();
      socket.send(JSON.stringify(leaveChat));
      socket.close();
    },
    // 初始化websocket 
    connect() {
      socket = new WebSocket(wsUrl);
      let chatDataKey = this.chatDataKey
      socket.onmessage = function (msg) {
        let messageData = JSON.parse(msg.data)
        let chatType = messageData.chatType
        switch (chatType) {
          case "SRV_SUCCESS_MSG":
            socket.send(JSON.stringify(chatDataKey));
            break;
          case "SRV_ERROR_MSG":
            console.log(`<--【连线失敗】------訊息發送失敗${messageData.text}-->`);
            if(messageData.text === "NEED_AUTH"){
              chatDataKey.chatType = "CLI_AUTH";
              chatDataKey.id = Math.random();
              socket.send(JSON.stringify(chatDataKey));
            } 
            break;
          case "SRV_RECENT_CHAT":
            chatDataKey.chatType = "CLI_JOIN_ROOM";
            chatDataKey.id = Math.random();
            chatDataKey.toChatId = localStorage.getItem('chatRoomId');
            socket.send(JSON.stringify(chatDataKey));
            break;
          case "SRV_JOIN_ROOM":
            let heartBeat ={ chatType: "CLI_HEARTBEAT"}
            setInterval(()=> socket.send(JSON.stringify(heartBeat)),25000)
            break
        }
        emitter.$emit("message", msg.data);
      };
      socket.onerror = function (err) {
        emitter.$emit("error", err);
      };
      socket.onclose = function (e) {
        console.log("<--【连线斷開】------自動重新連線-->");
        chatDataKey.chatType = "CLI_AUTH";
        chatDataKey.id = Math.random();
        emitter.connect();
      };
    },
  }
});
emitter.connect();
export default emitter;