
// import Socket from "@/utils/socket";
import { genAuthCode } from "@/api";


/* 返回底部 */
function gotoBottom () {
  const box = document.getElementsByClassName('message-pabel-box')[0]
  this.$nextTick(() => {
    box.scrollTop = box.scrollHeight
  })
}

// function disabled(item) {
//   const h = this.$createElement;
//   this.$prompt( '請輸入封禁分鐘', `確定要封禁玩家"${item.username}"?`, {
//     center: true,
//     cancelButtonText: "取消",
//     confirmButtonText: "确定",
//     inputPlaceholder: "請輸入封禁分鐘",
//     inputPattern: /^[0-9]*$/,
//     inputErrorMessage:'※只能輸入數字',       
//     inputValidator:(val)=>{ 
//       if(val.length > 6) return "※輸入字數不可超過6個字";
//     },
//     message: h("div", null, [
//       h("div", {
//         style:
//           "width:100%;height:50px;background-image:url(" +
//           this.disabledImg +
//           ");background-repeat:no-repeat;background-position: center; position: absolute;top: -3rem;",
//       }),
//     ]),
//   })
//   .then(({ value }) => {
//     let banList = {
//       chatType:"CLI_ROOM_BAN",
//       id:Math.random(),
//       banUser: item.username,
//       toChatId: item.chatRoomId,
//       minute: value === "0" ? "999999" : value,
//       token: localStorage.getItem("token"),
//       deviceId: localStorage.getItem("UUID"),
//       platformCode: "dcw",
//       tokenType: 1,
//     }
//     Socket.send(banList);
//     this.$message({
//       type: "success",
//       message: "确定封禁" + `${value === "0" ? "999999" : value}` + "分钟",
//     });
//   })
//   .catch(() => {
//     this.$message({
//       type: "info",
//       message: "取消输入",
//     });
//   });
// }

// function unBlock(item) {
//   let unBlock = {
//     chatType:"CLI_ROOM_LIFT_BAN",
//     id:Math.random(),
//     banUser: item.username,
//     toChatId: item.chatRoomId,
//     token: localStorage.getItem("token"),
//     deviceId: localStorage.getItem("UUID"),
//     platformCode: "dcw",
//     tokenType: 1,
//   }
//   Socket.send(unBlock);
// }

function getAuthCodeData(email,key) {
  if (email === '') {
    this.$message({
      message: "資料尚未輸入完全",
      type: "error",
    });
    return;
  }
  let params = {
    email:email,
    forRegister:key
  }
  genAuthCode(params).then((res)=>{
    if(res.code === 200) this.$message({ message: "請至郵件信箱獲取驗證碼", type: "success"});
  })
}

export {
  gotoBottom,
  // disabled,
  // unBlock,
  getAuthCodeData
}
