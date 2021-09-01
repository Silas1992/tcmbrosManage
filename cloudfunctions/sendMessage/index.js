const cloud = require('wx-server-sdk')
//引入request-promise用于做网络请求
var req = require('request-promise')
cloud.init({
  env: "cloud1-9gt8jfexd120c4fc",
})
exports.main = async (event, context) => {
  let access_token =  await req('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx5c4e408fb57d8045&secret=fdc7806e55bfe511c68f44790e29e1d4')
  .then(function(res){
    console.log('到底来了没有啊',JSON.parse(res).access_token)
    return JSON.parse(res).access_token
  }).catch (function (err) {
    return err
  });
  console.log('此时的access_token',access_token)
  let json = {
    "touser" : event.openid,
    "access_token":access_token,//token为上文中获得的access_token
    "mp_template_msg":{
      "appid":"wx3638fcdb465a8215",//发送目标公众号的appid,可在公众号设置里找到
      "template_id":"Pv8re6HOKHr0jnGCvOQsGOwhMkoMPoXVVsXI4YVEbnE",//待发送的模板消息的模板ID
      "miniprogram":{
          "appid":"wx5c4e408fb57d8045",//模板消息发送后关联的小程序,即点击消息后跳转的小程序
          "pagepath":"pages/client/consume/consume"//跳转的小程序的页面位置
      },
      "data": {
        "productType":{
          "value":event.product_type,
          "color":'#173177'
        },
        "name":{
          "value":event.goods_name,
          "color":'#173177'
        },
        "accountType":{
          "value":event.account_type,
          "color":'#173177'
        },
        "account":{
          "value":event.card_no,
          "color":'#173177'
        },
        "time":{
          "value":event.create_time,
          "color":'#173177'
        },
        "remark":{
          "value":event.remark,
          "color":'#173177'
        }
      },
    }
  }
  const send = await req({//使用request-promise发送数据包
    method:'POST',
    url:'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/uniform_send',
    qs:{
      access_token:access_token
    },
    body:json,
    json:true
    })
  return send
}

