// 返回 Hello World
const cloudbase = require("@cloudbase/node-sdk"); 
const app = cloudbase.init({
    env: cloudbase.SYMBOL_URRENT_ENV,
});

exports.main = async (event,context) => {

    return await app.database().collection('order')
    .add({
        order_no:event.orderNo,
        total_price:event.totalPrice,
        member_openid:event.memberOpenId,
        member_name:event.memberName,
        member_tel:event.memberTel,
        card_no:event.cardNo,
        operate_id:event.operateId,
        sub_id:event.subId,
        recall_id:event.recallId,
        recall_name:event.recallName,
        recall_cause:event.recallCause,
        state:event.state,
        remark:event.remark,
        type:event.type,
        pay_type:event.payType,
        shopping_list:event.shoppingList,
        create_time:event.createTime,
        update_time:event.updateTime
        
    })
    
  
}
