//配置路由相关的信息
import VueRouter from 'vue-router';
import Vue from "vue";
import Login from '../components/Login';
import Home from '../components/Home';
import Welcome from '../components/Welcome';
import Member from '../components/member/Member';
import General from '../components/goods/General';
import Consum from '../components/goods/Consum';
import Order from '../components/record/Order';
import ConsumRecord from '../components/record/ConsumRecord';
import DeductRecord from '../components/record/DeductRecord';
import Activity from '../components/manage/Activity';
import Coupon from '../components/manage/Coupon';



//1、通过Vue.use(插件),安装插件
Vue.use(VueRouter)


//配置路径和组件之间的映射关系
const routes=[
    {
        path:"/",
        redirect:'/login'
    },
    {
        path:'/login',
        component:Login
    },
    {
        path:'/Home',
        component:Home,
        redirect:'/welcome',
        children:[
            {
                path:'/welcome',
                component:Welcome
            },
            {
                path:'/member',
                component:Member
            },
            {
                path:'/general',
                component:General
            },
            {
                path:'/consum',
                component:Consum
            },
            {
                path:'/order',
                component:Order
            },
            {
                path:'/consumRecord',
                component:ConsumRecord
            },
            {
              path:'/deductRecord',
              component:DeductRecord  
            },
            {
              path:'/activity',
              component:Activity
            },
            {
                path:'/coupon',
                component:Coupon
            }
        ]
    }
]
//2、创建VueRouter对象
const router = new VueRouter({
    routes
})

//4、挂载路由导航守卫
router.beforeEach((to,form,next) => {
    if(to.path === '/login') return next()
    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if(!tokenStr) return next('/login')
    next()
})

//3、将router对象传入VUE实例中
export default router