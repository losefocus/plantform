<template>
    <div class="app-container">
        <el-button type="primary" size="small" @click="handleClick">新增</el-button>
        <el-table
            :data="list"
            style="width: 100%;margin-top:20px;">
            <el-table-column
                prop="name"
                label="名称">
            </el-table-column>
            <el-table-column
                prop="type"
                label="类型">
            </el-table-column>
            <el-table-column
                prop="price"
                label="单价"
                width ="100">
            </el-table-column>
            <el-table-column
                prop="unit"
                label="单位"
                width ="100">
            </el-table-column>
            <el-table-column
                prop="discount"
                label="折扣"
                width ="100">
            </el-table-column>
            <el-table-column
                prop="intro"
                label="简介"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="comment"
                label="备注"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作"
                width ="150">
                <template slot-scope="scope" >
                    <el-button size="mini" type="" plain @click="handleupdate(scope.row)">修改</el-button>
                    <el-button size="mini" type="" plain @click="deleteServe(scope.row)" style="margin-left:0px">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="margin-top:20px;float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <el-dialog title="新增服务"  :visible.sync="addVisible" width='690px' >
            <div class="clearfix">
                <div class="clearfix" style="width:600px;margin:-20px auto 0">
                    <el-form :model="form" label-width="50px" size="small">
                        <el-form-item label="名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="类型" style="float:left;margin-right:20px;">
                            <el-input v-model="form.type" style="width:240px;"></el-input>
                        </el-form-item>
                        <el-form-item label="单位" style="float:left;">
                            <el-input v-model="form.unit" style="width:240px;"></el-input>
                        </el-form-item>
                        <el-form-item label="单价" style="float:left;margin-right:20px;">
                            <el-input v-model="form.price" style="width:240px;"></el-input>
                        </el-form-item>
                        <el-form-item label="折扣" style="float:left;">
                            <el-input v-model="form.discount" style="width:240px;"></el-input>
                        </el-form-item>
                        <el-form-item label="简介" style="float:left;">
                            <el-input v-model="form.intro"></el-input>
                        </el-form-item>
                        <el-form-item label="图片" style="float:left;width:500px">
                            <el-input v-model="form.thumbnailUrl"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" style="float:left;">
                            <el-input v-model="form.comment"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="clearfix" style="">
                    <el-button class="pull-right" style="margin:0 20px;"  type="primary" v-if="flag == 'add'" :loading="btnLoading" size="small" @click="addServe">确定</el-button>
                    <el-button class="pull-right" style="margin:0 20px;"  type="primary" v-else size="small" :loading="btnLoading" @click="updateServe">确定</el-button>
                    <el-button class="pull-right" size="small" @click="addVisible = false">取消</el-button>
                </div>
            </div>
        </el-dialog>
        
    </div>
</template>

<script>
import { addObj,fetchList,updateObj,deleteObj} from "@/api/serve/myserve";

export default {
    components:{
        
    },
    data(){
        return {
            list:[],
            flag:'add',
            addVisible:false,
            form:{
                name:'',
                type:'',
                unit:'',
                price:'',
                discount:'',
                intro:'',
                thumbnailUrl:'',
                thumbnailPath:'',
                comment:'',
                status:1,
            },
            listQuery: {
                page_index: 1,
                page_size: 20
            },
            total:0,
            loading:false,
            btnLoading:false,
        }
    },
    computed: {
        
    },
    created() {
        this.getList()
    },
    mounted(){
        
    },
    destroyed(){

    },
    methods:{
        handleClick(){
            this.addVisible = true
        },
        addServe(){
            this.flag = 'add'
            let data = this.form
            data.discount = parseFloat(data.discount)
            data.price = parseFloat(data.price)
            this.btnLoading = true
            addObj(data).then(res => {
                if(res.data.success){
                    this.$notify({
                        title: '成功',
                        message: "新增服务成功",
                        type: "success",
                        duration: 2000
                    });
                    this.addVisible = false
                    this.listQuery.page_index = 1
                    this.getList()
                }
                this.btnLoading = false
            })
        },
        handleSizeChange(val) {
            this.listQuery.page_size = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page_index = val;
            this.getList();
        },
        getList(){
            this.loading = true
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.loading = false
            })
        },
        handleupdate(row){
            this.flag = 'edit'
            this.addVisible = true
            this.form = Object.assign({},row)
        },
        updateServe(){
            this.btnLoading = true
            updateObj(this.form).then(res => {
                if(res.data.success){
                    this.$notify({
                        title: '成功',
                        message: "新增服务成功",
                        type: "success",
                        duration: 2000
                    });
                    this.addVisible = false
                    this.listQuery.page_index = 1
                    this.getList()
                }
                this.btnLoading = false
            })
        },
        deleteServe(row){
            deleteObj(row.id).then(res => {
                if(res.data.success){
                    this.$notify({
                        title: '成功',
                        message: "删除服务成功",
                        type: "success",
                        duration: 2000
                    });
                    this.listQuery.page_index = 1
                    this.getList()
                }else{
                    this.$notify({
                        title: '失败',
                        message: "删除服务失败",
                        type: "error",
                        duration: 2000
                    });
                }
            })   
        },
    },
    watch:{

    }
}
</script>
<style lang="scss" scoped>
    .serverList{
        display: flex;
        flex-wrap:wrap;
        li{
            width:365px;
            height:168px;
            padding: 20px 25px;
            box-sizing: border-box;
            border:1px solid #EBEDF8;
            margin: 10px;
            .l_1{
                line-height: 24px;
                font-size: 20px;
                font-weight: 600;
                color: #333333;
            }
            .l_2{
                width:225px;
                height:42px;
                font-size:12px;
                font-weight:400;
                color:#666;
                line-height:21px;
                padding-top: 10px;
            }
            .l_3{
                padding-top: 15px;
            }
            .l_3_d{
                color: #F15F5F;
                font-size: 12px;
                padding-left: 20px;
            }
            .l_3_t{
                color: #999999;
                font-size: 12px;
                padding-left: 20px;
            }
        }
    }
</style>




