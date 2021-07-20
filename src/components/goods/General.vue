<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>消费管理</el-breadcrumb-item>
            <el-breadcrumb-item>项目管理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="goodsname" @keyup.enter.native="getGoodsList" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="3" v-if="currentSub == 'tcmbros'">
                    <el-button type="primary" @click="addDialogVisible = true">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 商品列表区域 -->
            <el-table :data="goodslist" border stripe size="small">
                <el-table-column align="center" label="项目编号" prop="goods_no" width="120"></el-table-column>
                <el-table-column align="center" label="名称" prop="goodsname" width="180"></el-table-column>
                <el-table-column align="center" label="单位" prop="unit" width="150"></el-table-column>
                <el-table-column align="center" label="价格" prop="price" width="150"></el-table-column>
                <el-table-column align="center" label="累计消费" prop="count" width="150"></el-table-column>
                <el-table-column align="center" label="项目状态" width="100">
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
                        size="mini" @click="removeMemberById(scope.row._id)"></el-button>
                       
                    </template>
                </el-table-column>
            </el-table>

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
        title="添加商品" :visible.sync="addDialogVisible"
        width="50%" @close="addDialogClosed">
            <el-form ref="addFormRef" :rules="addFormRules" 
            :model="addForm" label-width="80px">
                <el-form-item label="商品名称" prop="goodsname">
                    <el-input v-model="addForm.goodsname"></el-input>
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="addForm.unit" ></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="addForm.price"></el-input>
                </el-form-item>
            </el-form>
            <!-- 选择分店-->
            <el-tag effect="dark" style="margin-right:15px">
                选择分店
            </el-tag>
            <el-select v-model="value" placeholder="请选择">
                <el-option
                v-for="item in cities"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
            </el-select>
            <!-- 选择分店-->
            <el-tag effect="dark" style="margin-left:25px">
                选择类别
            </el-tag>
            <el-select v-model="typeValue" style="margin-left:15px" placeholder="请选择">
                <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
            </el-select>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addGoods">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改页面的对话框 -->
        <el-dialog
        title="修改商品" :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed" >
            <el-form ref="editFormRef" :rules="editFormRules" 
            :model="editForm" label-width="80px">
                <el-form-item label="姓名" prop="goodsname">
                    <el-input v-model="editForm.goodsname"></el-input>
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="editForm.unit" ></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="editForm.price" ></el-input>
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
            //获取商品列表的参数对象
            pagenum:1,
            pagesize:10,
            goodslist:[],
            goodsname:'',
            total:0,
            //控制添加对话框的显示与隐藏
            addDialogVisible:false,
            addForm:{
                goodsname:'',
                unit:'',
                price:0
            },
            addFormRules:{
                goodsname:[
                    {required:true,message:'请输入商品名',trigger:'blur'}
                ],
                unit:[
                    {required:true,message:'请输入商品单位',trigger:'blur'}
                ],
                price:[
                    {required:true,message:'请输入商品价格',trigger:'blur'}
                ]
            },
            //控制修改商品对话框的显示与隐藏
            editDialogVisible:false,
            //查询到的商品对象
            editForm:{
                goodsname:'',
                unit:'',
                price:0
            },
            //修改表单的验证规则对象
            editFormRules:{
                goodsname:[
                    {required:true,message:'请输入商品名',trigger:'blur'}
                ],
                unit:[
                    {required:true,message:'请输入商品单位',trigger:'blur'}
                ],
                price:[
                    {required:true,message:'请输入商品价格',trigger:'blur'}
                ]
            },
            cities: [{
                value: 'tcmbro1',
                label: '安宁分店'
                }, {
                value: 'tcmbro2',
                label: '城关分店'}],
            value: 'tcmbro1',
            currentSub:'',
            types:[{
                    value:1,
                    label:'服务商品'
                },{
                    value:2,
                    label:'美团团单'
                },{
                    value:5,
                    label:'实体商品'
                },{
                    value:6,
                    label:'按次商品'
                }],
            typeValue:1

        }
    },
    created(){
        //获取当前的分店信息并赋值
        const name = window.sessionStorage.getItem('token')
        this.getSub(name)
        this.getGoodsList()
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
        handleSizeChange(newSize){
            this.pagesize = newSize
            this.getGoodsList()
        },
        handleCurrentChange(newPage){
            this.pagenum = newPage
            this.getGoodsList()
        },
        
        //删除操作
        async removeMemberById(id){
            const name = window.sessionStorage.getItem('token')
            if(name == 'tcmbros' || name == 'tcmbro1'){
                console.log(id)
                const confirmResult = await this.$confirm(
                    '此操作将永久删除该商品, 是否继续?', '提示', 
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(err => err)

                if(confirmResult !== 'confirm'){
                    return this.$message.info('已取消删除')
                }

                //调用根据ID删除商品信息接口
                const app = cloudbase.init({
                    env: "cloud1-9gt8jfexd120c4fc"
                });
                const db = app.database();
                const result = await db.collection("goods")
                .doc(id)
                .remove()
                if(result.deleted !== 1){
                    return this.$message.error('删除商品失败！')
                }

                this.$message.success('删除商品成功！')
                
                this.getGoodsList()
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
        addGoods(){
            this.$refs.addFormRef.validate(
                async valid=>{
                    if(!valid) return

                    //获取数据库引用
                    const app = cloudbase.init({
                        env: "cloud1-9gt8jfexd120c4fc"
                    })
                    const currentTime = this.getNowFormatDate()
                    const db = app.database()
                    //按照时间排序查询当前编号
                    const resultGoods = await db.collection('goods')
                    .orderBy('create_time',"desc").get()
                    let currentNo = 10000
                    if(resultGoods.data.length !== 0){
                        currentNo = resultGoods.data[0].goods_no+1
                    }
                    console.log('当前编号',currentNo)
                    
                    let type = this.typeValue
                    let coe = 0.3
                    if(type == 5){
                        coe = 0.1
                    }
                    //调用添加商品的接口
                    const result = await db.collection("goods")
                    .add({
                        goodsname:this.addForm.goodsname,
                        unit:this.addForm.unit,
                        price:this.addForm.price,
                        count:0,
                        state:true,
                        goods_no:currentNo,
                        type:type,
                        sub_id:this.value,
                        coe_deduct:coe,
                        create_time:currentTime,
                        update_time:currentTime
                    })

                    if(result.code !== undefined){
                        return this.$message.error('添加商品失败！')
                    }
                    
                    //关闭对话框
                    this.addDialogVisible = false
                    //刷新数据列表
                    this.getGoodsList()
                    this.$message.success('添加商品成功！')
                }
            )
        },
        //校验提交修改内容
        confirmEdit(){
            this.$refs.editFormRef.validate(
                async valid=>{
                    if(!valid) return
                    //调用修改商品信息接口
                    const app = cloudbase.init({
                        env: "cloud1-9gt8jfexd120c4fc"
                    });
                    const db = app.database();
                    const result = await db.collection("goods")
                    .doc(this.editForm._id)
                    .update({
                        goodsname:this.editForm.goodsname,
                        unit:this.editForm.unit,
                        price:this.editForm.price
                    })
                    if(result.updated !== 1){
                        return this.$message.error('更新商品失败！')
                    }
                    
                    //关闭对话框
                    this.editDialogVisible = false
                    //刷新数据列表
                    this.getGoodsList()
                    this.$message.success('更新商品成功！')
                }
            )
        },
        
        //展示Edit对话框
        async showEditDialog(id){
            const name = window.sessionStorage.getItem('token')
            if(name == 'tcmbros' || name == 'tcmbro1'){
                //根据ID查询商品信息接口
                const app = cloudbase.init({
                    env: "cloud1-9gt8jfexd120c4fc"
                });
                
                const db = app.database();
                const result = await db.collection("goods")
                .where({
                    _id:id
                })
                .get()
                if(result.length == 0){
                    return this.$message.error('查询商品信息失败！')
                }
                this.editDialogVisible=true
                this.editForm = result.data[0]
            }else{
                return this.$message.error('你没有权限进行此项操作！')
            }

        },
        async stateChange(info){
            const name = window.sessionStorage.getItem('token')
            if(name == 'tcmbros' || name == 'tcmbro1'){
                //修改状态接口
                const app = cloudbase.init({
                    env: "cloud1-9gt8jfexd120c4fc"
                });
                const db = app.database();
                const result = await db.collection("goods")
                .doc(info._id)
                .update({
                    state:info.state
                })
                console.log('修改后的结果为',result)
                if(result.updated !== 1){
                    info.state = !info.state
                    return this.$message.error('更新商品状态失败！')
                }
                this.$message.success('更新商品状态成功！')
            }else{
                info.state = !info.state
                return this.$message.error('你没有权限进行此项操作！')
            }
        },
        //获取会员列表
        async getGoodsList(){
            try {
                if(this.currentSub !== 'tcmbros'){
                    //1.查询数组
                    const res = await this.$cloudbase.callFunction({
                        name: "get-goods",
                        data: {
                            page: this.pagenum,
                            pagesize: this.pagesize,
                            name:this.goodsname,
                            sub_id:this.currentSub
                        },
                    })
                    this.goodslist = res.result.data
                    console.log('来了',this.goodslist)
                    //2、查询数组
                    const resT = await this.$cloudbase.callFunction({
                        name: "get-goods",
                        data: {
                            name:this.goodsname,
                            sub_id:this.currentSub
                        },
                    })
                    this.total = resT.result.data.length
                }else{
                    //1.查询数组
                    const res = await this.$cloudbase.callFunction({
                        name: "get-goods",
                        data: {
                            page: this.pagenum,
                            pagesize: this.pagesize,
                            name:this.goodsname
                        },
                    })
                    this.goodslist = res.result.data
                    console.log('来了',this.goodslist)
                    //2、查询数组
                    const resT = await this.$cloudbase.callFunction({
                        name: "get-goods",
                        data: {
                            name:this.goodsname
                        },
                    })
                    this.total = resT.result.data.length

                }
                
            } catch (e) {
                this.goodslist = e+'我是错误的';
            }

        }
    }
}
</script>

<style lang="less" scoped>

</style>
