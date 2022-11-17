import { observable, action } from 'mobx-miniprogram'
//  按需导出store实例
export const store = observable({
  //  共享数据字段          
  //Begin: Demo data
  numA: 10,
  numB: 20,
  //End: Demo data
  imageMetaList: [
    {
      "id": "1",
      "imageUrl": "http://xl.tianjiaoedu.org/upload/201607/05/201607051554541730.jpg",
      "name": "南昌校区图书馆",
      "fileHash": ""
    }
  ],
  groupId: "",
  groupToken: "",

  updateLoginInfo: action(function(groupId, groupToken){
    this.groupId = groupId
    this.groupToken = groupToken
  }),

  updateImageMetaList: action(function (newList) {
    this.imageMetaList = newList
  }),



  //Begin: Demo
  //  定义计算属性 get表示sum属性是只读的           
  get sum() {
    return this.numA + this.numB
  },
  //  actions方法，用来修改store中的数据 
  updateNum1: action(function (step) {
    this.numA += step
  }),
  updateNum2: action(function (step) {
    this.numB += step
  })
  //End: Demo
})