// 返回 Hello World
const cloudbase = require("@cloudbase/node-sdk"); 
const app = cloudbase.init({
    env: cloudbase.SYMBOL_URRENT_ENV,
});

exports.main = async (event,context) => {

  if(event.cardNo){
    const result = await app.database().collection('member').doc(event._id).update({
      cash:event.cash,
      card_no:event.cardNo,
      balance:event.balance,
      sub_id:event.sub_id,
      type:event.type,
      saveValue:event.saveValue,
      member_coe:event.member_coe,
      transactor:event.transactor,
      create_time:event.createTime,
      timestamp:event.timestamp
    })
    return result
  }else if(event.cumulant){
    const result = await app.database().collection('member').doc(event._id).update({
      cash:event.cash,
      balance:event.balance,
      cumulant:event.cumulant,
      consum_points:event.consumPoints,
      update_time:event.updateTime
    })
    return result
  }else{
    const result = await app.database().collection('member').doc(event._id).update({
      cash:event.cash,
      balance:event.balance,
      member_coe:event.member_coe,
      sub_id:event.sub_id,
      saveValue:event.saveValue,
      update_time:event.updateTime,
      timestamp:event.timestamp
    })
    return result
  }
  
}

