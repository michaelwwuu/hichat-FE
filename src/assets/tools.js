
// import Socket from "@/utils/socket";
import { genAuthCode } from "@/api";


/* 返回底部 */
function gotoBottom () {
  const box = document.getElementsByClassName('message-pabel-box')[0]
  this.$nextTick(() => {
    box.scrollTop = box.scrollHeight
  })
}

function developmentMessage(data){
  if(data ==='传送讯息' || data ==='关于HiChat' || data === '使用版本' || data === '密码管理' || data === '修改登录密码') return
  this.$message({ message: "功能开发中", type: "warning"});
}

 
export {
  gotoBottom,
  developmentMessage,
}
