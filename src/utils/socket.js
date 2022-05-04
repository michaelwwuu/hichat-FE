import Vue from "vue";
const wsUrl = process.env.VUE_APP_SOCKET_URL;//動態環境
// const wsUrl = "ws://test.hichat3rd.tools/ws/im/echo";//模擬環境
var socket = new WebSocket(wsUrl);
const emitter = new Vue({
  methods: {
    send(message) {
      if (socket.readyState === 1)socket.send(JSON.stringify(message));
    },
    onClose() {
      let leaveChat = {
        chatType:"CLI_LEAVE_ROOM",
        id:Math.random(),
        deviceId: localStorage.getItem('UUID'),
        token: localStorage.getItem('token'),
        tokenType: 1,
        platformCode: "manycaiSport",
      }
      socket.send(JSON.stringify(leaveChat));
      socket.close();
    },
    // 初始化 websocket 
    connect() {
      socket = new WebSocket(wsUrl);
      let chatDataKey = {
        chatType:"CLI_AUTH",
        id:Math.random(),
        deviceId: localStorage.getItem('UUID'),
        token: localStorage.getItem('token'),
        tokenType: 1,
        platformCode: "manycaiSport",
      }
      socket.onmessage = function (msg) {
        let messageData = JSON.parse(msg.data)
        let chatType = messageData.chatType
        switch (chatType) {
          // 连线成功
          case "SRV_NEED_AUTH":
            socket.send(JSON.stringify(chatDataKey));
            let heartBeat ={ chatType: "CLI_HEARTBEAT"}
            setInterval(()=> socket.send(JSON.stringify(heartBeat)),50000)
            break;
          // 连线失敗
          case "SRV_ERROR_MSG":
            console.log(`<--【连线失敗】------訊息發送失敗${messageData.text}-->`);
            if(messageData.text === "NEED_AUTH"){
              chatDataKey.chatType = "CLI_AUTH";
              chatDataKey.id = Math.random();
              socket.send(JSON.stringify(chatDataKey));
            } 
            break;
          // 验证身份返回
          case "SRV_RECENT_CHAT":
            chatDataKey.chatType = "CLI_JOIN_ROOM";
            chatDataKey.id = Math.random();
            chatDataKey.toChatId = localStorage.getItem('chatRoomId');
            socket.send(JSON.stringify(chatDataKey));
            break;
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
// emitter.connect();
export default emitter;