import { maybeKnow } from "@/api";
import { mapMutations } from "vuex";

const rootMixins = {
  
  data() {
    return {}
  },
  computed: {
  },
  created() {
  },
  methods: {
    ...mapMutations({
      setReplyMsg:"ws/setReplyMsg",
      setEditMsg:"ws/setEditMsg",
      setMaybeKnowNum:"ws/setMaybeKnowNum",
    }),
    getMaybeKnow(){
      maybeKnow().then((res) => {
        this.setMaybeKnowNum(res.data.length)
      })
    },
    closeReplyMessage() {
      this.setReplyMsg({
        name: "",
        icon: "",
        chatType: "",
        clickType: "",
        innerText: "",
        replyHistoryId: "",
        fileSize:"",   
      });
      this.setEditMsg({ innerText: "" });
    },    
    //鎖定滾動
    handleTouch (e) {
      e._isScroller = true
    },
    // 置底
    gotoBottom() {
      const box = document.getElementsByClassName('message-pabel-box')[0]
      this.$nextTick(() => {
        box.scrollTop = box.scrollHeight
      })
    },
    // // 为了做验证的时分秒默认时间
    newDefaultEnd() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 23:59:59')
    },
    newDefaultStart() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 00:00:00')
    },
    // 获取表格搜索栏默认的时间
    startTime(type) {
      type = type === 1 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
      return this.$moment().startOf('day').format(type)
    },
    // 获取当前对应格式的时间
    newstartTime() {
      return this.$moment().startOf('day').format('YYYY/MM/DD HH:mm:ss')
    },
    endTime(type) {
      type = type === 1 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
      return this.$moment().format(type)
    },
    midnight(type) {
      type = type === 1 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
      return this.$moment().endOf('day').set('hours', 23).set('minutes', 59).set('seconds', 59).format(type)
    },
    // 获取距离目前多少天前的时间
    fromNow(num, type) {
      let moment = this.$moment
      type = type === 1 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
      return moment().day(moment().day() - num).format(type)
    },
    // 转换时间为YYYY-MM-DD格式
    formatTime(time) {
      return this.$moment(time).format('YYYY-MM-DD')
    },
    formatTime2(time) {
      return this.$moment(time).format('YYYYMMDD')
    },
    // 转换时间为YYY-MM-DD HH:mm-SS
    formatTimeS(time) {
      return this.$moment(time).format('YYYY/MM/DD HH:mm:ss')
    },
    formatTimeDay(time) {
      return this.$moment(time).format('MM-DD')
    },
    formatTimeSecound(time) {
      return this.$moment(time).format('HH:mm')
    },
    formatNowTime(time) {
      return this.$moment.unix(time).format('YYYY-MM-DD HH:mm:ss')
    },
    formatTimeX(time) {
      return this.$moment(time).format('YYYY-MM-DD 00:00:00')
    },
    formatnightTimeS(time) {
      return this.$moment(time).format('YYYY-MM-DD 23:59:59')
    },
    // 财务
    cwTimeS(time) {
      return this.$moment(time).format('YYYY-MM-DD 08:00:00')
    },
    cwNightTime(time) {
      return this.$moment(time).format('YYYY-MM-DD 07:59:59')
    },
    // 美东
    enTimeS(time) {
      return this.$moment(time).format('YYYY-MM-DD 00:00:00')
    },
    enNightTime(time) {
      return this.$moment(time).format('YYYY-MM-DD 23:59:59')
    },
    newFormatTime(time) {
      return this.$moment(time).format('YYYY-MM-DD HH:mm')
    },
    moneyTime(time) {
      return this.$moment(time).format('YYYY-MM-DD 08:00:00')
    },
    lastTime(time) {
      return this.$moment(time).format('YYYY-MM-DD 07:59:59')
    },
    nextTime(time) {
      return this.$moment(time).day(this.$moment(time).day() + 1).format('YYYY-MM-DD 07:59:59')
    },
    // 时间戳并转换时间为YYYY-MM-DD HH:mm:ss格式
    unixTime(time) {
      let str = Number(time) === 0 ? '-' : this.$moment.unix(time).format('YYYY-MM-DD HH:mm:ss')
      return str
    },
   
    newUnixTime(time) {
      let str = Number(time) === 0 ? '-' : this.$moment.unix(time).format('YYYY-MM-DD HH:mm')
      return str
    },
    returnDayTime(time) {
      let str = Number(time) === 0 ? '-' : this.$moment.unix(time).format('YYYY-MM-DD')
      return str
    },
    // 获取手个月之前的日期
    twomonth() {
      return this.$moment(new Date()).subtract(2, 'months').format('YYYY-MM-DD 00:00:00')
    },
    // 获取三个月之前的时间
    threemonth() {
      let start_date = this.$moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD 00:00:00')
      let end_date = this.$moment()
      return end_date.diff(start_date, 'days')
    },
    // 获取六个月之前的日期
    sixmonth() {
      return this.$moment(new Date()).subtract(6, 'months').format('YYYY-MM-DD 00:00:00')
    },
    // 保留两位小数
    keepTwo(num) {
      if (num == null) return '0.00'
      var result = parseFloat(num)
      result = Math.round(num * 100) / 100
      var sx = result.toString()
      var posDes = sx.indexOf('.')
      if (posDes < 0) {
        posDes = sx.length
        sx += '.'
      }
      while (sx.length <= posDes + 2) {
        sx += 0
      }
      return sx
    },
    // 查询用户名的校验  排除模糊的情况
    validateName(name) {
      name = String(name)
      let reg = /^[a-zA-Z0-9-_]{5,20}$/
      let flag
      // 多个用户名查询
      if (name.includes(',')) {
        for (let item of name.split(',')) {
          flag = reg.test(item)
          return flag
        }
        return flag
      } else {
        flag = reg.test(name)
      }
      return flag
    },
    // 去掉输入框的空格
    trimAll(name) {
      return name.replace(/\s+/g, '')
    },
    //去掉html的标签符号
    trimPhtml(html){
      return html.replace(/<\/?.+?>/g,"")
    },
    //去掉html的标签符号,除了图片
    trimHtml(html){
      return html.replace(/<(?!img).*?>/g, "")
    },
    trimImg(img){
      if(img.includes('src')){
        return (img.split("src=")[1].split('title')[0]).replace(/\"/g, "")
      }
    },
    //去掉空字符串
    trimString(string){
       return  string.replace(/\"/,"")
    },
    // 校验Ip
    checkIp(ip) {
      let reg = /(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}/
      return reg.test(ip)
    },
    // 做添加期数的限制
    beforeToday() {
      return this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    },
    // 获取时间
    hoursTime(time) {
      let sumTime
      if (time >= 3600) {
        let hours = Math.floor(time / 3600)
        let min = Math.floor(time / 60) % 60
        let seconds = time % 60
        sumTime = hours + '时' + min + '分' + seconds + '秒'
      } else if (time < 3600 && time >= 60) {
        let min = Math.floor(time / 60)
        let seconds = time % 60
        sumTime = min + '分' + seconds + '秒'
      } else if (time < 60 && time >= 0) {
        let seconds = time
        sumTime = seconds + '秒'
      } else {
        sumTime = '0秒'
      }
      return sumTime
    },
    // 今天
    todayStartTime() {
      return this.$moment().startOf('day').format('YYYY-MM-DD 00:00:00')
    },
    todayEndTime() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 23:59:59')
    },
    // 昨天
    yesterdayStartTime() {
      return this.$moment().day(this.$moment().day() - 1).startOf('day').format('YYYY-MM-DD 00:00:00')
    },
    // 昨天累计减
    yesterdayFullStartTime(message) {
      return this.$moment().day(this.$moment().day()+message - 1).startOf('day').format('YYYY-MM-DD')
    },
    //明天不要时分秒
    tomorrowFullStartTime() {
      return this.$moment().day(this.$moment().day() + 1).startOf('day').format('YYYY-MM-DD')
    },
    yesterdayEndTime() {
      return this.$moment().day(this.$moment().day() - 1).startOf('day').format('YYYY-MM-DD 23:59:59')
    },
    // 最近7天的时间
    weekDayStartTime() {
      return this.$moment().day(this.$moment().day() - 7).format('YYYY-MM-DD 00:00:00')
    },
    weekDayStartTimeY() {
      return this.$moment().day(this.$moment().day() - 7).format('YYYY-MM-DD')
    },
    weekDayEndTime() {
      return this.$moment().startOf('day').format('YYYY-MM-DD 23:59:59')
    },
    weekDayEndTimeY() {
      return this.$moment().startOf('day').format('YYYY-MM-DD')
    },
    // 本月时间
    monthDayStartTime() {
      return this.$moment().month(this.$moment().month()).startOf('month').format('YYYY-MM-DD 00:00:00')
    },
    monthDayEndTime() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 23:59:59')
    },
    // 当天计算的本月时间
    monthStartTime() {
      return this.$moment().month(this.$moment().month()).startOf('month').format('YYYY-MM-DD')
    },
    monthEndTime() {
      return this.$moment().endOf('day').format('YYYY-MM-DD')
    },
    monthEndTimeNew() {//月底结束
      return this.$moment().month(this.$moment().month()).endOf('month').format('YYYY-MM-DD')
    },
    // 上月时间，整天计算
    lastMonthStartTime() {
      return this.$moment().month(this.$moment().month() - 1).startOf('month').format('YYYY-MM-DD')
    },
    lastMonthEndTime() {
      return this.$moment().month(this.$moment().month() - 1).endOf('month').format('YYYY-MM-DD')
    },
    // 上月时间
    lastMonthDayStartTime() {
      return this.$moment().month(this.$moment().month() - 1).startOf('month').format('YYYY-MM-DD 00:00:00')
    },
    // 上个月第一天的时间不要时分秒
    lastMonthDayFullStartTime() {
      return this.$moment().month(this.$moment().month() - 1).startOf('month').format('YYYY-MM-DD')
    },
    lastMonthDayEndTime() {
      return this.$moment().month(this.$moment().month() - 1).endOf('month').format('YYYY-MM-DD 23:59:59')
    },
    // 总数据 不规范的3个月
    totalDataStartTime() {
      return this.$moment().subtract(3, 'months').add(2, 'days').startOf('day').format('YYYY-MM-DD 00:00:00')
    },
    totalDataEndTime() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 23:59:59')
    },
    // 综合报表财务模式下的今天
    cwTodayStartTime() {
      return this.$moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD 08:00:00')
    },
    cwTodayEndTime() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 07:59:59')
    },
    // 财务时间 昨天
    cwYesterdayStartTime() {
      return this.$moment().subtract(2, 'days').format('YYYY-MM-DD 08:00:00')
    },
    cwYesterdayEndTime () {
      return this.$moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD 07:59:59')
    },
    // 财务时间本月
    cwMonthStartTime() {
      return this.$moment().startOf('month').subtract(1, 'days').format('YYYY-MM-DD 08:00:00')
    },
    cwMonthEndTime() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 07:59:59')
    },
    // 财务时间 上月
    cwLastMonthStartTime() {
      return this.$moment().startOf('month').subtract(1, 'months').subtract(1, 'days').format('YYYY-MM-DD 08:00:00')
    },
    cwLastMonthEndTime() {
      return this.$moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD 07:59:59')
    },
    // 综合报表美东模式下的今天
    enTodayStartTime() {
      return this.$moment().startOf('day').format('YYYY-MM-DD 00:00:00')
    },
    enTodayEndTime() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 23:59:59')
    },
    // 美东时间 昨天
    enYesterdayStartTime() {
      return this.$moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00')
    },
    enYesterdayEndTime () {
      return this.$moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD 23:59:59')
    },
    // 美东时间本月
    enMonthStartTime() {
      return this.$moment().startOf('month').format('YYYY-MM-DD 00:00:00')
    },
    enMonthEndTime() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 23:59:59')
    },
    // 美东时间 上月
    enLastMonthStartTime() {
      return this.$moment().startOf('month').subtract(1, 'months').format('YYYY-MM-DD 00:00:00')
    },
    enLastMonthEndTime() {
      return this.$moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD 23:59:59')
    },
  },
}
export default rootMixins