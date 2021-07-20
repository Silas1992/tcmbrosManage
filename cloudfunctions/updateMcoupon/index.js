const cloud = require("wx-server-sdk");

cloud.init();

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command
  // your code ...
  return await db.collection('member').doc(event._id).update({
    data: {
      coupon_id: _.push({
        each: [
          { goods_no: event.goods_no, goods_name: event.goods_name }
        ]
      })
    }
  })
};
