import Vue from "vue";
import App from "./App.vue";
import Cloudbase from "@cloudbase/vue-provider";
import router from './router/index';
import './assets/css/global.css';
import './plugins/element.js';
import './assets/fonts/iconfont.css';


window._tcbEnv = window._tcbEnv || {};

export const envId = window._tcbEnv.TCB_ENV_ID;
export const region = window._tcbEnv.TCB_REGION;

Vue.config.productionTip = false;
Vue.prototype.getNowFormatDate = function() {
  var date = new Date()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  if (hour >= 0 && hour <= 9) {
    hour = '0' + hour
  }
  if (minute >= 0 && minute <= 9) {
    minute = '0' + minute
  }
  if (second >= 0 && second <= 9) {
    second = '0' + second
  }

  
  var currentDate = date.getFullYear() + '-' + month + '-' + strDate + ' ' + hour + ':' + minute + ':' + second
  return currentDate
  
}
Vue.prototype.getNowFormatDate02 = function(date) {
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }

  var currentDate = date.getFullYear() + '-' + month + '-' + strDate
  return currentDate
  
}
Vue.prototype.getNowFormatDate01 = function() {
  var date = new Date()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  if (hour >= 0 && hour <= 9) {
    hour = '0' + hour
  }
  if (minute >= 0 && minute <= 9) {
    minute = '0' + minute
  }
  if (second >= 0 && second <= 9) {
    second = '0' + second
  }

  var currentDate = date.getFullYear() + '/' + month + '/' + strDate + ' ' + hour + ':' + minute + ':' + second
  return currentDate
  
}
Vue.prototype.getNumber = function() {
  var date = new Date()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  if (hour >= 0 && hour <= 9) {
    hour = '0' + hour
  }
  if (minute >= 0 && minute <= 9) {
    minute = '0' + minute
  }
  if (second >= 0 && second <= 9) {
    second = '0' + second
  }

  var currentDate = date.getFullYear() + month + strDate + hour + minute + second
  return currentDate
  
}
Vue.prototype.getFormatDate = function(date){
  var seperator1 = "-"
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
  month = "0" + month;
  }
  
  if (strDate >= 0 && strDate <= 9) {
  strDate = "0" + strDate
  }
  
  var currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}

Vue.use(Cloudbase, {
  env: "cloud1-9gt8jfexd120c4fc",
  region: region
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
