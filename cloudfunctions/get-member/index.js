// 返回 Hello World
const cloudbase = require("@cloudbase/node-sdk"); 
const app = cloudbase.init({
    env: cloudbase.SYMBOL_URRENT_ENV,
});
const db = app.database()
const _ = db.command
const MAX_LIMIT = 100

exports.main = async (event,context) => {

  let query = {}
  // 设置分页
  let depagesize = (event.page-1) * event.pagesize
  
  //名称模糊搜索
  if (event.name && /^(\s*\S+\s*)+$/.test(event.name)) {
    // title不为空字符串
    query.name = app.database().RegExp({
      regexp: event.name,
      options: 'i', //大小写不区分
    })
  }
  if(event.type == 1){
    query.card_no = _.neq(0)
  }else if(event.type == 2){
    query.card_no = _.eq(0)
  }
  //电话号码模糊搜索
  if (event.tel) {
    // title不为空字符串
    query.tel = app.database().RegExp({
      regexp: event.tel,
      options: 'i', //大小写不区分
    })
  }
  //卡号模糊搜索
  if (event.cardNo) {
    // title不为空字符串
    query.card_no = app.database().RegExp({
      regexp: event.cardNo,
      options: 'i', //大小写不区分
    })
  }
  //如果存在分店
  if(event.sub_id){
    query.sub_id = event.sub_id
  }
  //如果存在分类编号
  if(event.position){
    query.position =event.position 
  }
  let orderstr='create_time'
  let ordertype='asc'
  //如果存在排序方式
  if(event.ordertype&&event.ordertype=="desc"){
    ordertype='desc'
  }

  //如果存在排序字段
  let allowstr=['_id','create_time','count','update_time']
  if(event.orderstr&&allowstr.indexOf(event.orderstr)!=-1){
    orderstr=event.orderstr
  }
  if(!event.page){
    //先取出集合记录总数
    const countResult = await db.collection('member').count()
    const total = countResult.total
    //计算需分几次取
    const batchTimes = Math.ceil(total/100)
    //承载所有读操作的promise的数组
    const tasks = []
    for(let i = 0;i<batchTimes;i++){
      const promise = db.collection('member').skip(i*MAX_LIMIT).limit(MAX_LIMIT).where(query).orderBy(orderstr,ordertype).get()
      tasks.push(promise)
    }
    return(await Promise.all(tasks)).reduce((acc,cur) => {
      return{
        data:acc.data.concat(cur.data),
        errMsg:acc.errMsg
      }
    })
  }else{
    const result = await app.database().collection('member').skip(depagesize).limit(event.pagesize)
    .orderBy(orderstr, ordertype).where(query).get()
    return result
  }
  
}
