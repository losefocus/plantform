<template>
  <div>
    <div style="padding-bottom:10px;">分类名称 : {{dataInfo.name}}</div>
    <el-form :model="form" class="clearfix" ref="form" size="mini">
      <el-form-item label="参数名称" style="width: 240px" label-width="70px" >
        <el-input v-model="form.label" size="mini" auto-complete="off" ></el-input>
      </el-form-item>
      <el-form-item label="参数内容" style="width: 240px;margin-left:10px;" label-width="70px" >
        <el-input v-model="form.code" size="mini" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item  style="width: 150px" class="pull-right" label-width="0" >
        <div v-if="flag == 'add'">
          <el-button size="mini" type="primary" class="pull-right" @click="handleAdd" :loading="createdLoading">添加</el-button>
        </div>
        <div v-else>
          <el-button size="mini" type="info" class="pull-right" style="margin-left:10px" @click="cancelEdit('form')">取消</el-button>
          <el-button size="mini" type="primary" class="pull-right"  @click="handleEdit('form')" :loading="createdLoading">保存</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div v-loading="listLoading">
      <el-table :data="list" border fit highlight-current-row style="width: 100%;margin-bottom:20px;margin-top:10px">
        <el-table-column align="center" label="分类名称">
          <template slot-scope="scope">
            <span>{{scope.row.label}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="分类内容">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160" style="float:right">
          <template slot-scope="scope">
            <el-button size="mini" type="" plain @click="updateList(scope.row)">修改</el-button>
            <el-button size="mini" type="" plain @click="deleteList(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total,  prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import {fetchList,addObj,delObj,updateObj} from "@/api/product_category_params";

  export default {
    props:['dataInfo'],
    data(){
      return {
        listLoading:false,
        createdLoading:false,
        form:{
          categoryCode:this.dataInfo.code,
          label:'',
          code:'',
        },
        flag:'add',
        listQuery:{
          category_code:this.dataInfo.code,
          page_index: 1,
          page_size: 10
        },
        total:null,
        list:null,
      }
    },
    created() {
      this.getList()
    },
    mounted() {

    },
    computed: {
    },
    methods:{
      handleSizeChange(val) {
        this.listQuery.page_size = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page_index = val;
        this.getList();
      },
      getList(){
        console.log(this.dataInfo)
        this.listLoading = true
        fetchList(this.listQuery).then(res => {
          this.list = res.data.result.items;
          this.total = res.data.result.total;
          this.listLoading = false
        })
      },
      handleAdd(){
        this.createdLoading = true
        addObj(this.form).then(res => {
          if(res.data.success){
            this.getList()
            this.resetTem()
            this.$notify({
              title: '成功',
              message: "保存成功",
              type: "success",
              duration: 2000
            });
          }else{
            this.$notify({
              title: '失败',
              message: "保存失败",
              type: "error",
              duration: 2000
            });
          }
          this.createdLoading = false
        })
      },
      deleteList(row){
        this.$confirm(
          "此操作将永久删除该参数(分参数名称:" + row.label + "), 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          delObj(row.id).then(res => {

            this.getList()
          })
        }).catch(() => {})
      },
      updateList(row){
        this.flag = 'edit'
        this.form = Object.assign({},row)
      },
      handleEdit(){
        this.createdLoading = true
        updateObj(this.form).then(res => {
          if(res.data.success){
            this.getList()
            this.cancelEdit()
            this.$notify({
              title: '成功',
              message: "修改成功",
              type: "success",
              duration: 2000
            });
          }else{
            this.$notify({
              title: '失败',
              message: "修改失败",
              type: "error",
              duration: 2000
            });
          }
          this.createdLoading = false
        })

      },
      cancelEdit(){
        this.flag = 'add'
        this.resetTem()
      },
      resetTem(){
        this.form={
          categoryCode:this.dataInfo.code,
          label:'',
          code:'',
        }
        this.createdLoading = false
        this.$refs.form.resetFields()
      },
    },
    watch:{
    }
  }
</script>
<style scoped>
  .el-form-item{
    float: left;
    width:80px;
    margin-bottom: 10px
  }

</style>
