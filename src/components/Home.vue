<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>甘肃华医兄弟中医理疗有限公司</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主题 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" 
        unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active	= "activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" 
            :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
import cloudbase from "@cloudbase/js-sdk";

export default {
  name: "Home",
  data() {
    return {
      envId: "",
      callFunctionResult: "",
      members:"",
      //左侧菜单
      menulist:[],
      //菜单图标集合
      iconsObj:{
        '101':'iconfont icon-user',
        '102':'iconfont icon-shangpin',
        '103':'iconfont icon-danju',
        '104':'iconfont icon-tijikongjian'
      },
      //默认菜单展开
      isCollapse:false,
      //被激活的连接
      activePath:'',
      currentSub:''
    };
  },
  props: {
    msg: String,
  },
  created(){
    //获取当前的分店信息并赋值
    const name = window.sessionStorage.getItem('token')
    this.currentSub = name
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout(){
      window.sessionStorage.clear()
      this.$router.push("/login")
    },
    //折叠菜单
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    //保存连接的激活状态
    saveNavState(activePath){
      console.log('什么鬼',activePath)
      window.sessionStorage.setItem('activePath',activePath)
      console.log(window.sessionStorage)
      this.activePath = activePath
    },
    //获取所有的菜单
    async getMenuList(){
      const app = cloudbase.init({
        env: "cloud1-9gt8jfexd120c4fc"
      });
      let name = this.currentSub
      
      const db = app.database();
      const result = await db.collection("menus")
      .get()
      .then((res) => {
        return res.data
      });
      if(name == 'tcmbros' || name == 'tcmbro1'){
        this.menulist = result
      }else{
        //先删除
        let menu = result[2].children.splice(2,1)
        console.log('删除后的菜单为',menu)
        this.menulist = result
      }
    },
    async callFunction() {
      try {
        const res = await this.$cloudbase.callFunction({
          name: "vue-echo",
          data: {
            foo: "bar",
          },
        });
        this.callFunctionResult = res;
      } catch (e) {
        this.callFunctionResult = e+'我是错误的';
      }
    },
    async getMember() {
      // 登录
      // await this.$cloudbase.auth({ persistence: "local"}).anonymousAuthProvider().signIn(); 
      // const res = await this.$cloudbase.callFunction({
      //   name:"get-member",
      // });
      // this.members = res;
      const app = cloudbase.init({
        env: "cloud1-9gt8jfexd120c4fc"
      });
      
      const db = app.database();
      const result = await db.collection("member")
      .get()
      .then((res) => {
        return res.data;
      });
      this.members = result
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 20px;
    align-items: center;
    color: #fff;
    font-size: 20rpx;
    >div{
      display: flex;
      align-items: center;
      img{
        height: 50px;
        width: 50px;
      }
      span{
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right: 0;
    }
  }
  .el-main{
    background-color: #eeedf1;
  }
  .iconfont{
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 26px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
