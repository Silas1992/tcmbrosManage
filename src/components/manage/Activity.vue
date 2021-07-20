<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>营销管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        </el-breadcrumb>
        
        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    
                    <el-input @keyup.enter.native="getList" placeholder="请输入内容" v-model="activity" clearable @clear="getList">
                        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary"  @click="addDialogVisible = true">添加活动</el-button>
                </el-col>
            </el-row>
            <!-- 卡片视图 -->
            <el-tabs style="margin-top:20px" type="border-card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="正常活动" name="first"></el-tab-pane>
                <el-tab-pane label="促销活动" name="second"></el-tab-pane>
                <!-- 用户列表区域 -->
                <el-table :data="list"  size="small" border stripe>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column align="center" label="充卡活动" prop="activity" width="200"></el-table-column>
                    <el-table-column align="center" label="活动类型" prop="type" width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.type == 1">正常活动</span>
                            <span v-else-if="scope.row.type == 2">促销活动</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="售卡金额" prop="cash" width="150"></el-table-column>
                    <el-table-column align="center" label="折扣" prop="coe" width="150"></el-table-column>
                    <el-table-column align="center" label="卡内储值" prop="value" width="100"></el-table-column>
                    <el-table-column align="center" label="额外送" prop="add" width="100"></el-table-column>
                    <el-table-column align="center" label="状态" width="100">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.state"
                                @change="stateChange(scope.row)"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="250">
                        <template slot-scope="scope">
                            <!-- 修改按钮 -->
                            <el-button type="primary" icon="el-icon-edit" size="mini" 
                            :data="scope.id" @click="showEditDialog(scope.row._id)"></el-button>
                            <!-- 删除按钮 -->
                            <el-button type="danger" icon="el-icon-delete" 
                            size="mini" @click="removeById(scope.row._id)"></el-button>
                            
                        </template>
                    </el-table-column>
                </el-table>
            </el-tabs>
            

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagenum"
                :page-sizes="[5, 10, 100, 500]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
            
        <!-- 添加页面的对话框 -->
        <el-dialog
        title="添加活动" :visible.sync="addDialogVisible"
        width="50%" @close="addDialogClosed" >
            <el-form ref="addFormRef" :rules="addFormRules" 
            :model="addForm" label-width="80px">
                <el-form-item label="名称" prop="activity">
                    <el-input v-model="addForm.activity" ></el-input>
                </el-form-item>
                <el-form-item label="金额" prop="cash">
                    <el-input v-model="addForm.cash" ></el-input>
                </el-form-item>
                <el-form-item label="折扣" prop="coe">
                    <el-input v-model="addForm.coe" ></el-input>
                </el-form-item>
            </el-form>
            <!-- 选择活动类型 -->
            <el-tag style="margin-left:30px" effect="dark">
                选择活动类型
            </el-tag>
            <el-select style="margin-left:10px" v-model="type" clearable placeholder="请选择">
                <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.lable"
                :value="item.value">
                </el-option>
            </el-select>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addActivity">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改页面的对话框 -->
        <el-dialog
        title="修改用户" :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed" >
            <el-form ref="editFormRef" :rules="editFormRules" 
            :model="editForm" label-width="80px">
                <el-form-item label="姓名">
                    <el-input v-model="editForm.activity"></el-input>
                </el-form-item>
                <el-form-item label="金额" prop="cash">
                    <el-input v-model="editForm.cash" ></el-input>
                </el-form-item>
                <el-form-item label="折扣" prop="coe">
                    <el-input v-model="editForm.coe" ></el-input>
                </el-form-item>
                <el-form-item label="卡内储值" prop="value">
                    <el-input v-model="editForm.value" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import cloudbase from "@cloudbase/js-sdk";
export default {
    data(){
        return{
            //获取用户列表的参数对象
            pagenum:1,
            pagesize:10,
            list:[],

            //当前最新的会员
            activity:'',
            total:0,

            //控制添加对话框的显示与隐藏
            addDialogVisible:false,
            addForm:{
                activity:'',
                cash:'',
                coe:0
            },
            addFormRules:{
                activity:[
                    {required:true,message:'请输入用户名',trigger:'blur'}
                ],
                cash:[
                    {required:true,message:'请输入现金',trigger:'blur'}
                ],
                coe:[
                    {required:true,message:'请输入优惠折扣',trigger:'blur'}
                ]
            },
            //控制修改用户对话框的显示与隐藏
            editDialogVisible:false,
            //查询到的用户对象
            editForm:{
                activity:'',
                cash:'',
                coe:0
            },
            //修改表单的验证规则对象
            editFormRules:{
                activity:[
                    {required:true,message:'请输入用户名',trigger:'blur'}
                ],
                cash:[
                    {required:true,message:'请输入现金',trigger:'blur'}
                ],
                coe:[
                    {required:true,message:'请输入优惠折扣',trigger:'blur'}
                ],
                value:[
                    {required:true,message:'请输入卡内储值',trigger:'blur'}
                ]
            },
            currentSub:'',
            //选择商品类别
            activeName: 'first',
            type:1,
            //结算界面参数
            types:[
                {
                    value:1,
                    lable:'正常活动'
                },
                {
                    value:2,
                    lable:'促销活动'
                }
            ]
        }
    },
    created(){
        //获取当前的分店信息并赋值
        const name = window.sessionStorage.getItem('token')
        this.getSub(name)
        this.getList()
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
        //切换商品类别
        handleClick(tab) {
            let name = tab.name
            if(name == 'first'){
                this.type = 1
            }else if(name == 'second'){
                this.type = 2
            }
            //设置好参数后，调用获取商品列表的接口
            this.getList()
        },
        handleSizeChange(newSize){
            this.pagesize = newSize
            this.getList()
        },
        handleCurrentChange(newPage){
            this.pagenum = newPage
            this.getList()
        },
        //删除操作
        async removeById(id){
            const name = window.sessionStorage.getItem('token')
            if(name == 'tcmbros'){
                console.log(id)
                const confirmResult = await this.$confirm(
                    '此操作将永久删除该用户, 是否继续?', '提示', 
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(err => err)

                if(confirmResult !== 'confirm'){
                    return this.$message.info('已取消删除')
                }

                //调用根据ID删除用户信息接口
                const app = cloudbase.init({
                    env: "cloud1-9gt8jfexd120c4fc"
                });
                const db = app.database();
                const result = await db.collection("activity_rules")
                .doc(id)
                .remove()
                if(result.deleted !== 1){
                    return this.$message.error('删除用户失败！')
                }

                this.$message.success('删除用户成功！')
                
                this.getList()
            }else{
                return this.$message.error('你没有权限进行此项操作！')
            }

        },
        //监听修改对话框的关闭事件
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        //监听添加对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        //校验并提交添加内容
        addActivity(){
            this.$refs.addFormRef.validate(
                async valid=>{
                    if(!valid) return

                    //获取数据库引用
                    const app = cloudbase.init({
                        env: "cloud1-9gt8jfexd120c4fc"
                    })
                    let cash = this.addForm.cash
                    let coe = this.addForm.coe
                    //计算折后价格
                    let value = Math.round(cash/coe)
                    const currentTime = this.getNowFormatDate()
                    const db = app.database()
                    const result = await db.collection("activity_rules")
                    .add({
                        activity:this.addForm.activity,
                        cash:cash,
                        coe:coe,
                        type:this.type,
                        value:value,
                        add:0,
                        state:true,
                        create_time:currentTime,
                        update_time:currentTime
                    })

                    if(result.code !== undefined){
                        return this.$message.error('添加会员失败！')
                    }
                    
                    //关闭对话框
                    this.addDialogVisible = false
                    //刷新数据列表
                    this.getList()
                    this.$message.success('添加会员成功！')
                }
            )
        },
        //校验提交修改内容
        confirmEdit(){
            this.$refs.editFormRef.validate(
                async valid=>{
                    if(!valid) return
                    //调用修改用户信息接口
                    const app = cloudbase.init({
                        env: "cloud1-9gt8jfexd120c4fc"
                    });
                    let cash = this.editForm.cash
                    let coe = this.editForm.coe
                    let value = 0
                    if(coe == 0){
                        value = this.editForm.value
                    }else{
                        value = Math.round(cash/coe)
                    }
                    const db = app.database();
                    const result = await db.collection("activity_rules")
                    .doc(this.editForm._id)
                    .update({
                        activity:this.editForm.activity,
                        cash:cash,
                        coe:coe,
                        value:value
                    })
                    if(result.updated !== 1){
                        return this.$message.error('更新用户失败！')
                    }
                    
                    //关闭对话框
                    this.editDialogVisible = false
                    //刷新数据列表
                    this.getList()
                    this.$message.success('更新用户成功！')
                }
            )
        },

        
        //展示Edit对话框
        async showEditDialog(id){
            let currentSub = this.currentSub
            console.log('------',currentSub)
            if(currentSub == 'tcmbros' || currentSub == 'tcmbro1'){
                //根据ID查询用户信息接口
                const app = cloudbase.init({
                    env: "cloud1-9gt8jfexd120c4fc"
                });
                
                const db = app.database();
                const result = await db.collection("activity_rules")
                .where({
                    _id:id
                })
                .get()
                if(result.length == 0){
                    return this.$message.error('查询用户信息失败！')
                }
                this.editDialogVisible=true
                this.editForm = result.data[0]
            }else{
                return this.$message.error('你没有权限进行此项操作！')
            }

        },
        async stateChange(activityInfo){
            const name = window.sessionStorage.getItem('token')
            if(name == 'tcmbros'){

                //修改状态接口
                const app = cloudbase.init({
                    env: "cloud1-9gt8jfexd120c4fc"
                });
                const db = app.database();
                const result = await db.collection("activity_rules")
                .doc(activityInfo._id)
                .update({
                    state:activityInfo.state
                })
                console.log('修改后的结果为',result)
                if(result.updated !== 1){
                    activityInfo.state = !activityInfo.state
                    return this.$message.error('更新用户状态失败！')
                }
                this.$message.success('更新用户状态成功！')
            }else{
                activityInfo.state = !activityInfo.state
                return this.$message.error('你没有权限进行此项操作！')
            }
        },
        //获取会员列表
        async getList(){
            try {
                //1.查询数组
                const res = await this.$cloudbase.callFunction({
                    name: "getActivity",
                    data: {
                        page: this.pagenum,
                        pagesize: this.pagesize,
                        activity:this.activity,
                        type:this.type
                    },
                })
                this.list = res.result.data
                console.log('哈哈哈',res.result.data)
                //2、查询数组
                const resT = await this.$cloudbase.callFunction({
                    name: "getActivity",
                    data: {
                        activity:this.activity,
                        type:this.type
                    },
                })
                this.total = resT.result.data.length
            } catch (e) {
                this.list = e+'我是错误的';
            }
        }
    }
}
</script>

<style lang="less" scoped>

</style>
