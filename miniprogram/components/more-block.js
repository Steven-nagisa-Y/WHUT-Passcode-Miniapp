// components/more-block.js
const { getTime, formatDate } = require("../utils/util");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      value: "核酸检测",
      type: String
    },
    time: {
      value: 48,
      type: Number
    },
    preContent: {
      value: "",
      type: String
    },
    content: {
      value: "阴性",
      type: String
    },
    blockType: {
      value: 1,
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    icon: ["../images/ok-1.png", "../images/ok.svg"],
    staticTime: "2022-05-06 00:00"
  },

  attached: function () {
    this.getStaticTime();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getLastTime() {

    },

    getStaticTime() {
      let staticTime
      if (this.properties.blockType == 0) {
        staticTime = "2021-12-16 10:00:00"
      } else {
        const t = new Date();
        t.setTime(t.setHours(t.getHours() - 48));
        t.setHours(23);
        staticTime = formatDate(t, "yyyy-MM-dd hh:mm:ss");
      }
      this.setData({
        staticTime
      })
    }
  }
})