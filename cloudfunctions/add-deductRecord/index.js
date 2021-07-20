// 返回 Hello World
const cloudbase = require("@cloudbase/node-sdk"); 
const app = cloudbase.init({
    env: cloudbase.SYMBOL_URRENT_ENV,
});

exports.main = async (event,context) => {

    return await app.database().collection('deduct_record')
    .add({
        employee:event.employee,
        price:event.price,
        de_money:event.deMoney,
        goodsname:event.goodsName,
        goods_no:event.goodsNo,
        goods_type:event.goodsType,
        de_type:event.deType,
        de_rate:event.deRate,
        pay_type:event.payType,
        order_no:event.orderNo,
        card_no:event.card_no,
        member_openid:event.memberOpenid,
        member_name:event.memberName,
        member_tel:event.memberTel,
        state:event.state,
        sub_id:event.sub_id,
        create_time:event.createTime,
        update_time:event.updateTime,
        year:event.year,
        month:event.month,
        date:event.date
    })
    
  
}
