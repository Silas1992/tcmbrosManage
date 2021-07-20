// 使用了 async await 语法
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return await db.collection('buy_record').where({
      order_no: event.id
    }).remove()
  } catch(e) {
    console.error(e)
  }
}
