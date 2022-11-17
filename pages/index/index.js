// pages/pic/pic.js
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../store/store'
const util = require('../../utils/util')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask: false,
    img_list: [
    {
      "id": "12",
      "imageUrl": "http://pic.baike.soso.com/p/20130618/20130618153602-1487877646.jpg",
      "name": "国防生风采"
    }],
    is_show_normal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['imageMetaList'],
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
    this.is_login();
  },
  // 判断是否登陆
  is_login: function () {
    console.log("index.is_login")
    let that = this;
    // util.login();
    if (store.groupId == null || store.groupId == "") {
      wx.showModal({
        title: '未登录账号不可使用',
        showCancel: false,
        confirmText: '我要登陆',
        success(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }

    // function fn() {
    //   that.setData({
    //     userInfo: app.globalData.userInfo,
    //   })
    //   that.get_img_list(1);
    // }

    // if (app.globalData.userInfo) {
    //   fn()
    // } else {
    //   util.add_login_callback(function () {
    //     fn()
    //   })
    //   util.add_login_callback_fail(function () {
    //     wx.showModal({
    //       title: '未登录账号不可使用',
    //       showCancel: false,
    //       confirmText: '我要登陆',
    //       success(res) {
    //         if (res.confirm) {
    //           wx.redirectTo({
    //             url: '/pages/login/login',
    //           })
    //         }
    //       }
    //     })

    //   })
    // }
  },
  // 相册列表
  get_img_list(page, name = '') {
    console.log("get_img_list")
    wx.showLoading({
      title: 'loading',
    })
    var that = this;
    util.post('image/list_all', {}, function (res) {
      imegeMetaList = res
      store.updateImageMetaList(imageMetaList)
      // if (res.ret == 0) {
      //   if (page > 1) {
      //     var data = that.data.img_list;
      //     res.content.data.forEach((item, index) => {
      //       data.push(item)
      //     })
      //   } else {
      //     var data = res.content.data;
      //   }
      //   that.setData({
      //     img_list: data,
      //     page
      //   })
      // } else {
      //   wx.showToast({
      //     title: res.content,
      //     icon: 'none'
      //   })
      // }
      wx.hideLoading({
        success: (res) => {},
      })
    }, null, {
      "token": store.token,
      "groupId": store.groupId
    })
  },

  chooseImage(e) {
    var that = this;
    wx.showLoading({
      title: 'loading',
    })
    var count = 1;
    // var img_list = this.data.img_list;
    // 上传
    wx.chooseImage({
      count,
      type: ['album', 'camera'],
      success(res) {
        wx.showLoading({
          title: '加载中',
        })
        let tmp_list = res.tempFilePaths;
        for (let i = 0; i < tmp_list.length; i++) {
          util.upload(res.tempFilePaths[i], function (data) {
            console.log(data, "data");
            // img_list.unshift({
            //   url: data.content.cosUrl,
            // });
            that.setData({
              // img_list,
              tmp_img: data.content.cosUrl
            }, wx.hideLoading);
          })
        }

      }
    })
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
    this.get_img_list(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.get_img_list(this.data.page + 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 
  preview(e) {
    var ls = this.data.img_list;
    let idx = e.currentTarget.dataset.idx;
    var urls = [];
    let current = '';
    for (let i = 0; i < ls.length; i++) {
      urls.push(ls[i].url);
      if (i == idx) {
        current = ls[i].url;
      }
    }
    wx.previewImage({
      current,
      urls,
      success(res) {
        // console.log('res', res)
      },
      fail(err) {
        // console.log('err', err)
      }
    })
  },
  //图片选项
  img_action(e) {
    var that = this;
    let itemList = ['删除'];
    var id = store.imageMetaList[e.currentTarget.dataset.idx].id
    // var id = this.data.img_list[e.currentTarget.dataset.idx].id;
    wx.showActionSheet({
      itemList,
      success(res) {
        if (res.tapIndex == 0) {
          //删除
          util.post('pic/del', {
            id,
          }, function (response) {
            if (response.ret == 0) {
              wx.showToast({
                title: '删除成功',
                icon: 'none'
              })
              that.get_img_list(1);
            } else {
              wx.showToast({
                title: response.content,
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },
  change() {
    this.setData({
      is_show_normal: !this.data.is_show_normal
    })
  },
  // 关闭
  close() {
    this.setData({
      mask: false,
      tmp_img: '',
      tmp_name: ''
    })
  },
  //打开
  open() {
    this.setData({
      mask: true
    })
  },
  modify_name(e) {
    console.log(this.data.tmp_name);
    this.setData({
      tmp_name: e.detail.value
    })
  },
  confirm() {
    var that = this;
    wx.showLoading({
      title: 'loading',
    })
    var msg = {
      name: this.data.tmp_name,
      url: this.data.tmp_img,
      admin_id: app.globalData.userInfo.id
    }
    console.log('msg', msg);
    if (!msg.name) {
      return wx.showToast({
        title: '名称不可为空',
        icon: 'none'
      })
    } else if (!msg.url) {
      return wx.showToast({
        title: '未上传图片',
        icon: 'none'
      })
    }
    util.post('pic/store', msg, function (res) {
      that.close();
      that.get_img_list(1);
      wx.hideLoading();
    }); //上传
  },
})