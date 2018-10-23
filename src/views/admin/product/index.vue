<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container clearfix">
      <el-button v-if="product_category_add" class="filter-item" @click="handleCreate" type="primary" icon="edit"
                 size="small">添加
      </el-button>

    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="分类名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类code" show-overflow-tooltip enterable>
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="sort">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类图片">
        <template slot-scope="scope">
          <img v-if="'thumbnailBaseUrl' in scope.row && scope.row.thumbnailBaseUrl!=''" style="height:40px;width:60px;" :src="scope.row.thumbnailBaseUrl+scope.row.thumbnailPath">
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button v-if="product_category_params" size="mini" type="" @click="handleUpdate(scope.row)">分类参数</el-button>
          <el-button v-if="product_category_edit" size="mini" type="" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="product_category_del" size="mini" type="" @click="deletes(scope.row)" style="margin-left:0">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="code" prop="code">
          <el-input v-model="form.code" placeholder="请输入分类code"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="thumbnailPath">
          <el-upload
            v-loading='uploadLoaing'
            class="avatar-uploader"
            ref="upload"
            :headers="headers"
            action="/tenant/user/upload"
            :limit="999"
            :data="params"
            name="uploadFile"
            :show-file-list ="false"
            :before-upload='beforeUpload'
            :on-success="uploadSuccess"
            :auto-upload="true">
            <img v-if="form.thumbnailBaseUrl!='' && form.thumbnailBaseUrl!=undefined" :src="form.thumbnailBaseUrl+form.thumbnailPath" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" size="small">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" size="small">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')" size="small">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getToken } from "@/util/auth";
  import {fetchList, getObj, addObj, editObj, delObj,} from "@/api/product_category";
  import {treeAddValue} from "@/util/util";
  import waves from "@/directive/waves/index.js"; // 水波纹指令
  // import { parseTime } from '@/utils'
  import {mapGetters} from "vuex";
  import ElRadioGroup from "element-ui/packages/radio/src/radio-group";
  import ElOption from "element-ui/packages/select/src/option";

  export default {
    components: {
      ElOption,
    },
    name: "table_user",
    directives: {
      waves
    },
    data() {
      return {
        headers:{Authorization: getToken()},
        params:{component :'project'},
        uploadLoaing:false,
        treeDeptData: [],
        checkedKeys: [],
        defaultProps: {
          children: "children",
          label: "name"
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page_index: 1,
          page_size: 20
        },
        form: {
          id: undefined,
          name: undefined,
          code: undefined,
          sort: undefined,
          thumbnailBaseUrl: undefined,
          thumbnailPath: undefined
        },
        rules: {
          name: [
            {
              required: true,
              message: "请输入分类名称",
              trigger: "blur"
            }
          ],
          code: [
            {
              required: true,
              message: "请输入code",
              trigger: "blur"
            }
          ]
        },
        statusOptions: ["0", "1"],
        rolesOptions: [],
        dialogFormVisible: false,
        dialogDeptVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: "",
        textMap: {
          update: "编辑",
          create: "创建"
        },
        isDisabled: {
          0: false,
          1: true
        },
        tableKey: 0,
        product_category_add: false,
        product_category_edit: false,
        product_category_del: false,
        product_category_params: false
      };
    },
    computed: {
      ...mapGetters(["permissions"])
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: "有效",
          0: "无效",
          9: "锁定"
        };
        return statusMap[status];
      }
    },
    created() {
      this.getList();

    },
    mounted() {
      this.product_category_add = this.permissions["product_category_add"];
      this.product_category_edit = this.permissions["product_category_edit"];
      this.product_category_del = this.permissions["product_category_del"];
      this.product_category_params = this.permissions["product_category_params"];
    },
    methods: {
      beforeUpload(){
        this.uploadLoaing = true
      },
      uploadSuccess(response, file, fileList){
        if(response.success == false){
          this.$notify.error({
            title: '错误',
            message: '图片获取失败'
          });
        }else{
          this.form.thumbnailPath = response.result.path;
          this.form.thumbnailBaseUrl = response.result.baseUrl;
          this.imageName = response.result.name;
          this.fileList = [];
        }
        this.uploadLoaing = false

      },
      getList() {
        this.listLoading = true;
        this.listQuery.sort_by = "";
        this.listQuery.direction = false;
        fetchList(this.listQuery).then(response => {
          this.list = response.data.result.items;
          this.total = response.data.result.total;
          this.listLoading = false;
        });
      },
      handleFilter() {
        this.listQuery.page_index = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page_index = val;
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj(row.id).then(response => {
          this.form = response.data.result;
          this.dialogFormVisible = true;
          this.dialogStatus = "update";
        });
      },
      update(){
        editObj(this.form).then(res => {
          this.dialogFormVisible = false;
        })
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            delete this.form.status;
            addObj(this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
      },
      resetTemp() {
        this.form = {
          id: undefined,
          name: '',
          code: '',
          sort: undefined,
          thumbnailBaseUrl: '',
          thumbnailPath: ''
        };
      }
    }
  };
</script>
<style scoped>
  .avatar-uploader{
    height: 110px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 203px;
    height: 110px;
    line-height: 110px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
  .avatar {
    width: 203px;
    height: 110px;
    display: block;
    border-radius: 4px;
  }
</style>
