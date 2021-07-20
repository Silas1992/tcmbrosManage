// 返回 Hello World
const cloudbase = require("@cloudbase/node-sdk"); 
const app = cloudbase.init({
    env: cloudbase.SYMBOL_URRENT_ENV,
});

exports.main = async (event,context) => {

  let query = {}
  // 设置分页
  let depagesize = (event.page-1) * event.pagesize
  //名称模糊搜索
  if (event.name && /^(\s*\S+\s*)+$/.test(event.name)) {
    // title不为空字符串
    query.goodsname = app.database().RegExp({
      regexp: event.name,
      options: 'i', //大小写不区分
    })
  }
  //如果存在分店
  console.log('哈哈哈',event.sub_id)
  if(event.sub_id !== ''){
    query.sub_id = event.sub_id
  }
  //类型
  if(event.type){
    query.type=event.type
  }
  //如果存在分类编号
  if(event.position){
    query.position =event.position 
  }
  let orderstr='goods_no'
  let ordertype='asc'
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
    const result = await app.database().collection('goods').where(query).get()
    return result
  }else{
    const result = await app.database().collection('goods').skip(depagesize).limit(event.pagesize)
    .orderBy(orderstr, ordertype).where(query).get()
    return result
  }
  
}
