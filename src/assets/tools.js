function developmentMessage(data) {
  if (data === '传送讯息' || data === '关于HiChat' || data === '使用版本' || data === '密码管理' || data === '修改登录密码' || data === '成員' || data === '封锁名单' || data === '编辑个人资料' || data === '提醒') return
  this.$message({ message: "功能开发中", type: "warning" });
}

export {
  // gotoBottom,
  developmentMessage,
}
