// pages/pic/pic.js
import {
    createStoreBindings
} from 'mobx-miniprogram-bindings'
import {
    store
} from '../../store/store'
const util = require('../../utils/util')
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mask: false,
        update: false,
        tmp_id: -1,
        tmp_img: null,
        tmp_name: null,
        img_list: [{
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
        let loginOk = this.is_login()
        if (loginOk) {
            this.get_img_list(1);
        }
    },
    getImageCache: function (fileHash) {
        console.log("getImageCache.fileHash: " + fileHash)
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
            return false
        } else {
            return true
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
            let imageMetaList = res
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
            "token": store.groupToken,
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
                // console.log("res", res)
                let tmp_list = res.tempFilePaths;
                for (let i = 0; i < tmp_list.length; i++) {
                    that.data.tmp_img = tmp_list[i];
                    break;
                    //   util.upload(res.tempFilePaths[i], function (data) {
                    //     console.log(data, "data");
                    //     // img_list.unshift({
                    //     //   url: data.content.cosUrl,
                    //     // });
                    //     that.setData({
                    //       // img_list,
                    //       tmp_img: data.content.cosUrl
                    //     }, wx.hideLoading);
                    //   })
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
        let itemList = ['更新', '删除'];
        let fileHash = store.imageMetaList[e.currentTarget.dataset.idx].fileHash;
        var id = store.imageMetaList[e.currentTarget.dataset.idx].id;
        wx.showActionSheet({
            itemList,
            success(res) {
                if (res.tapIndex == 0) {
                    console.log("enter update")
                    that.update(id);
                } else if (res.tapIndex == 1) {
                    //删除
                    console.log("fileHash to delete: ", fileHash)
                    util.post('image/delete', {
                        "fileHash": fileHash
                    }, function (response) {
                        // console.log("delete resp:", response)
                        if (response == 1) {
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
                    }, null, {
                        "token": store.groupToken,
                        "groupId": store.groupId
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
            update: false,
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
    update(id) {
        this.setData({
            mask: true,
            update: true,
            tmp_id: id
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
            url: this.data.tmp_img
        }
        console.log('msg', msg);
        if (!that.data.update) {
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
        }
        let groupId = store.groupId
        let token = store.groupToken
        if (!that.data.update) {
            util.uploadWx(this.data.tmp_img, groupId, token, {
                    "nickName": this.data.tmp_name
                },
                function (res) {
                    that.close();
                    that.get_img_list(1);
                    wx.hideLoading();
                })
        } else {
            util.updateWx(this.data.tmp_img, groupId, token, {
                "nickName": this.data.tmp_name,
                "id": this.data.tmp_id
            },
            function (res) {
                that.close();
                that.get_img_list(1);
                wx.hideLoading();
            })
        }
        // util.post('image/upload', msg, function (res) {
        //   that.close();
        //   that.get_img_list(1);
        //   wx.hideLoading();
        // }); //上传
    },
})