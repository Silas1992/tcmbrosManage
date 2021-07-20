// 返回 Hello World
const cloudbase = require("@cloudbase/node-sdk"); 
const app = cloudbase.init({
    env: cloudbase.SYMBOL_URRENT_ENV,
});

exports.main = async (event,context) => {

    return await app.database().collection('buy_record')
    .add({
        goods_name:event.goodsname ,
        order_no:event.orderNo,
        goods_type:event.type,
        price:event.price,
        card_no:event.card_no,
        employee:event.employee,
        member_id:event.memberOpenId,
        member_name:event.memberName,
        member_tel:event.memberTel,
        state:event.state,
        pay_type:event.payType,
        remark:event.remark,
        memberBalance:event.memberBalance,
        create_time:event.createTime,
        update_time:event.updateTime,
        timestamp:event.timestamp,
        sub_id:event.sub_id,
        year:event.year,
        month:event.month
    })
    
  
}
