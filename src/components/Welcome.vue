<template>
    <div>
        <div class="head">
            <h3>今日统计</h3>
            <el-row class="btn">
                <el-button type="primary" plain>当日</el-button>
                <el-button type="success" plain>近7日</el-button>
                <el-button type="danger" plain>近30日</el-button>
            </el-row>
        </div>
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-dark" style="padding-left:10px;line-height:38px">
                    新增会员数：
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="grid-content bg-purple" style="padding-left:10px;line-height:38px">
                    综合收入：
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple-light" style="padding-left:10px;line-height:38px">
                    会员消费金额：
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="grid-content bg-purple" style="padding-left:10px;line-height:38px">
                    散客收入：
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple-light" style="padding-left:10px;line-height:38px">
                    售卡收入：
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple" style="padding-left:10px;line-height:38px">
                    券类收入：
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple-light" style="padding-left:10px;line-height:38px">
                    产品收入：
                </div>
            </el-col>
        </el-row>
    </div>
    
</template>
<script>
import cloudbase from "@cloudbase/js-sdk";
export default {
    data(){
        return{
            currentSub:''
        }
    },
    created(){
        //获取当前的分店信息并赋值
        const name = window.sessionStorage.getItem('token')
        this.getSub(name)
        this.getConsumList()
    },
    methods:{
        async getSub(name){
            if(name == 'tcmbros' || name == 'tcmbro1'){
                this.currentSub = name
            }else{
                //根据ID查询用户信息接口
                const app = cloudbase.init({
                    env: "cloud1-9gt8jfexd120c4fc"
                });
                
                const db = app.database();
                const result = await db.collection("member")
                .where({
                    username:name
                })
                .get()
                if(result.length == 0){
                    return this.$message.error('查询用户信息失败！')
                }
                let member = result.data[0]
                this.currentSub = member.sub_id
            }
        },

    }
}
</script>
<style>
  .head{
      display: flex;
      position: relative;
      z-index: 10;
  }
  .head .btn{
      position: absolute;
      right: 0;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>