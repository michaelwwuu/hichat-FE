const systemMixins = {
  data() {
    return {}
  },
  computed: {
  },
  created() {
  },
  methods: {
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
    }
  },
}
export default systemMixins