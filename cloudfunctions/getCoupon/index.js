// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let query = {}
  if(!event.page) event.page=1
  if(!event.pagesize) event.pagesize=20
  // 设置分页
  let depagesize = (event.page-1) * event.pagesize
  //名称模糊搜索
  if (event.title && /^(\s*\S+\s*)+$/.test(event.title)) {
    // title不为空字符串
    query.title = cloud.database().RegExp({
      regexp: event.title,
      options: 'i', //大小写不区分
    })
  }
  if(event.type){
    query.type = event.type
  }
  
  let orderstr='create_time'
  let ordertype='desc'
  //如果存在排序方式
  if(event.ordertype&&event.ordertype=="desc"){
    ordertype='desc'
  }

  //如果存在排序字段
  let allowstr=['_id','create_time','count','lowprice']
  if(event.orderstr&&allowstr.indexOf(event.orderstr)!=-1){
    orderstr=event.orderstr
  }

  if(!event.page){
    const result = await db.collection('coupon').where(query).get({
      success:function(res){
        return res
      },
      fail(err){
        return err
      }
    })
    return result
  }else{
    const result = await db.collection('coupon').skip(depagesize).limit(event.pagesize)
    .orderBy(orderstr, ordertype).where(query).get({
      success:function(res){
        return res
      },
      fail(err){
        return err
      }
    })
    return result
  }
}
