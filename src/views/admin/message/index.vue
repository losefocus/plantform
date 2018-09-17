<template>
    <div class="app-container calendar-list-container">
        <el-collapse-transition>
            <div v-show="isshow">
            <el-form :model="form" class="clearfix" label-width="80px" ref="form" :rules="rules">
                <el-form-item label="消息标题" prop="title">
                    <el-input v-model="form.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item label="消息内容" prop="message">
                    <el-input v-model="form.message" type="textarea" :rows="3" placeholder="内容"></el-input>
                </el-form-item>
                <el-form-item label="通知对象" prop="pushObject">
                    <el-select v-model="tenantIds" multiple placeholder="请选择" @change="changeTenant">
                        <el-option v-for="item in allTenant" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                
                <!-- <el-form-item label="通知方式" prop="pushType" class="pull-right" style="width:45%">
                    <el-select v-model="form.pushType" placeholder="通知方式">
                        <el-option label="web" value="1"></el-option>
                        <el-option label="app" value="2"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item class="pull-right">
                    <el-button type="primary" @click="onSubmit('form')" size="small" :loading="createLoading" style="width:100px">推送</el-button>
                </el-form-item>
            </el-form>
            </div>
        </el-collapse-transition>
        <div class="clearfix" style="padding-bottom:20px;">
        <el-button type="primary" size="small" v-show="!isshow"  class="pull-left" @click="isshow = !isshow" style="width:80px;">添加</el-button>
        <el-button type="info" size="small" v-show="isshow" class="pull-left" @click="restTemp" style="width:80px;margin-left:0">取消</el-button>
        <!-- <el-button type="primary" size="small" class="pull-right" disabled  style="width:80px;">清空</el-button> -->
        </div>

        <el-table :data="list" style="width: 100%" v-loading="listLoading">
            <el-table-column align="center" label="消息标题" >
                <template slot-scope="scope">
                    <span>{{ scope.row.title }}</span>
                </template>
            </el-table-column>
             <el-table-column align="left" label="消息内容" min-width="200" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.message }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="推送时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.createdAt | parseTime('{y}-{m}-{d}')}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="推送人">
                <template slot-scope="scope">
                    <span>{{ scope.row.tenantId }}</span>
                </template>
            </el-table-column> -->
            <el-table-column align="center" label="通知对象">
                <template slot-scope="scope">
                    <span>{{ allTenantMap.get(scope.row.tenantId)}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="" disabled plain @click="handleDel(scope.row)">删除</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <div v-show="!listLoading" class="pagination-container" style="margin-top:20px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>    
</template>
<script>
import {fetchList,pushObj,delObj,getAllTenant} from "@/api/notification";
import { findByvalue } from "@/util/util";
export default {
    data() {
        var validateTitle = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入消息标题'));
            } else {
                callback();
            }
        };
        var validateMessage = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入消息内容'));
            } else {
                callback();
            }
        };
        var validateObject = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择通知对象'));
            } else {
                callback();
            }
        };
        var validateType = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择通知方式'));
            } else {
                callback();
            }
        };
    return {
        isshow:false,
        pushObjectOptions:[{
            value:1,
            label:'后台用户'
        },{
            value:2,
            label:'前台用户'
        },{
            value:3,
            label:'设备'
        },],
        rules:{
            title: [
                { validator: validateTitle, message: '请输入消息标题', trigger: 'blur' },
            ],
            message: [
                { validator: validateMessage, message: '请输入消息内容', trigger: 'blur' }
            ],
            tenantIds: [
                { validator: validateObject, message: '请选择租户', trigger: 'change' }
            ],
            pushType: [
                { validator: validateType, message: '请选择通知方式', trigger: 'change' }
            ],
        },
        form: {
          title: '',
          message: '',
          tenantIds:[],
        },
        tenantIds:[],
        listQuery:{
            page_index:1,
            page_size:20,
        },
        total:null,
        listLoading:false,
        createLoading:false,
        list:[],
        userIds:[],
        allTenant:[],
        allTenantMap:null
      }
    },
    filters: {
        pushObjectFilter(pushObject) {
            const pushObjectMap = {
                1: "后台用户",
                2: "前台用户",
                3: "设备"
            };
            return this.allTenantMap.get(pushObject);
        }
    },
    created(){
        this.getUserList()
        this.getList() 
    },
    methods: {
        changeTenant(){
            this.form.tenantIds = this.tenantIds.join()
            console.log(this.form.tenantIds)
        },
        handleSizeChange(val) {
            this.listQuery.page_size = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page_index = val;
            this.getList();
        },
        getUserList(){
            this.allTenant = []
            this.allTenantMap = new Map()
            getAllTenant().then(res => {
                res.data.result.forEach(ele => {
                    this.allTenant.push({value:ele.id,label:ele.name})
                    this.allTenantMap.set(ele.id,ele.name) 
                });
                
            })
        },
        getList(){
            this.listLoading = true
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
                this.restTemp()
            })
        },
        handleDel(row){
            this.$confirm(
                "此操作将永久删除该项目(项目名:" + row.title + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(res => {
                    this.$notify({
                        title: "删除",
                        message: "删除成功",
                        type: "success",
                        duration: 2000
                    });
                    this.getList()
                })
            })
        },
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.createLoading = true
                    let data = Object.assign({},this.form)
                    delete data.title
                    pushObj(data).then(res => {
                        this.$notify({
                            title: "成功",
                            message: "推送成功",
                            type: "success",
                            duration: 2000
                        });
                        this.getList()
                        
                    }).catch(res=>{
                        console.log(123123)
                    })
                }
            })
        },
        restTemp(){
            this.form = {
                title: '',
                message: '',
                tenantIds:[],
            }
            this.tenantIds = [],
            this.createLoading = false
            this.isshow = false
            this.$refs.form.resetFields();
        }
    }
}
</script>
<style scoped>

</style>
