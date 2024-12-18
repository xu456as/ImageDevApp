import { observable, action } from 'mobx-miniprogram'
//  按需导出store实例
export const store = observable({
  //  共享数据字段          
  //Begin: Demo data
  numA: 10,
  numB: 20,
  //End: Demo data
  imageMetaList: [
    // {
    //   "id": "1",
    //   "imageUrl": "",
    //   "name": "南昌校区图书馆",
    //   "fileHash": ""
    // }
  ],
  groupId: "fangzhengGroup",
  groupToken: "UUSBFDLIBZGKUCLRZZQY",
//   groupId: "",
//   groupToken: "",

  updateLoginInfo: action(function(groupId, groupToken){
    this.groupId = groupId
    this.groupToken = groupToken
  }),

  updateImageMetaList: action(function (newList) {
    let transferedList = []
    let i = 0    
    for (; i < newList.length; i++) {
      let image = newList[i]
      transferedList.push(
        {
            "id": image.id,
          "name": image.name,
          "imageUrl": "https://5oq7407038.goho.co:443/api/serial" + "/image/download?fileHash=" + image.fileHash,
        //   "imageUrl": "http://127.0.0.1:9090/api/serial" + "/image/download?fileHash=" + image.fileHash,
          "fileHash": image.fileHash
        }
      )
    }
    console.log(transferedList)
    this.imageMetaList = transferedList
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