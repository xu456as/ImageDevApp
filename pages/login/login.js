// pages/login/login.js
import { store } from '../../store/store'
import { createStoreBindings } from 'mobx-miniprogram-bindings'
var md5 = require('../../utils/md5.js'); // 引入md5.js文件
const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['groupId', 'groupToken'],
      // actions: ['update'],
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  formSubmit(e) {
    console.log("e", e.detail.value);
    let groupToken = e.detail.value.password
    let groupId = e.detail.value.username
    var that = this;
    // 消重
    if (wx.showLoading) {
      wx.showToast({
        icon: 'loading',
        title: 'Loading',
        mask: true
      })
    };
    if (groupId == "" || groupId == "") {
      return wx.showToast({
        title: '帐号或密码不能为空',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
    util.post('login', {}, function (response) {
      if (response == true) {
        store.groupToken = groupToken
        store.groupId = groupId
        wx.showToast({
          title: '登陆成功',
          success(res) {
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }, 2000)
          }
        })
      } else {
        wx.showToast({
          title: response.content,
          icon: 'none',
        })
      }
    }, null, {
      "groupId": groupId,
      "token": groupToken
    })

    // wx.login({
    //   success(res) {
    //     var msg = {
    //       username: e.detail.value.username,
    //       password: md5.hexMD5(md5.hexMD5(e.detail.value.password)),
    //       code: res.code,
    //     }
    //     util.post('../wap/action/login', msg, function (response) {
    //       app.globalData.userInfo = response.content;
    //       console.log(response);
    //       if (response.code == 0) {
    //         wx.showToast({
    //           title: '登陆成功',
    //           success(res) {
    //             setTimeout(() => {
    //               wx.reLaunch({
    //                 url: '/pages/index/index'
    //               })
    //             }, 2000)
    //           }
    //         })
    //       } else {
    //         wx.showToast({
    //           title: response.content,
    //           icon: 'none',
    //         })
    //       }
    //     })
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})