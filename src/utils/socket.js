import Vue from "vue";
const baseWsUrl = process.env.NODE_ENV === 'test' ? 'test.hailiao.net':location.host
const wsUrl = `wss://${baseWsUrl}/ws/im/echo`;//動態環境
// const wsUrl = `wss://www.hailiao.info/ws/im/echo`;//動態環境
var socket = new WebSocket(wsUrl);
const emitter = new Vue({
  data() {
    return {
      chatDataKey: {
        chatType:"CLI_AUTH",
        id:Math.random(),
        deviceId: localStorage.getItem('UUID'),
        token: localStorage.getItem('token'),
        tokenType: 0,
      },
    }
  },
  methods: {
    send(message) {
      if (socket.readyState === 1) socket.send(JSON.stringify(message));
    },
    onClose() {
      let leaveChatKey = this.chatDataKey;
      leaveChatKey.chatType = "CLI_LEAVE_ROOM";
      leaveChatKey.id = Math.random();
      socket.send(JSON.stringify(leaveChatKey));
      socket.close();
    },

    // 初始化 websocket 
    connect() {
      socket = new WebSocket(wsUrl);
      let joinChatKey = this.chatDataKey
      socket.onmessage = function (msg) {
        let messageData = JSON.parse(msg.data)
        let chatType = messageData.chatType
        switch (chatType) {
          // 连线成功
          case "SRV_NEED_AUTH":
            socket.send(JSON.stringify(joinChatKey));
            break;
          // 连线失敗
          case "SRV_ERROR_MSG":
            // console.log(`<--【连线失敗】------訊息發送失敗${messageData.text}-->`);
            if(messageData.text === "50002"){
              joinChatKey.chatType = "CLI_AUTH";
              joinChatKey.id = Math.random();
              socket.send(JSON.stringify(joinChatKey));
            } 
            break;
        }
        emitter.$emit("message", msg.data);
      };
      socket.onerror = function (err) {
        emitter.$emit("error", err);
      };
      socket.onclose = function (e) {
        console.log("<--【连线斷開】------自動重新連線-->",e);
        setTimeout(() => emitter.connect(), 1500);
      };
    },
  }
});
emitter.connect();
export default emitter;