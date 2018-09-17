<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container clearfix">
      <el-button v-if="sys_tenant_add" class="filter-item" @click="handleCreate" type="primary" icon="edit"
                 size="small">添加
      </el-button>
      <div class="pull-right">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="租户名称"
                  v-model="listQuery.name" size="small">
        </el-input>
        <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter" size="small">搜索
        </el-button>
      </div>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="租户名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="域名">
        <template slot-scope="scope">
          <span>{{scope.row.domain}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="code" show-overflow-tooltip enterable>
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话">
        <template slot-scope="scope">
          <span>{{scope.row.tel}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系方式" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.contact}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="地址" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.position}} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="说明" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.comment}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createdBy | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="状态">
        <template slot-scope="scope">
          <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
          <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i>
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
        <el-form-item label="用户名" prop="name">
          <el-input v-model="form.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="域名" prop="name">
          <el-input v-model="form.domain" placeholder="请输入域名"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="position">
          <el-input v-model="form.position" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="comment">
          <el-input v-model="form.comment" placeholder="请输入说明"></el-input>
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
  import {fetchList, getObj, addObj, putObj, delObj} from "@/api/tenant";
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
          name: undefined,
          domain: undefined,
          tel: undefined,
          position: undefined,
          comment: undefined,
          contact: undefined,
          code: undefined
        },
        rules: {
          name: [
            {
              required: true,
              message: "请输入用户名",
              trigger: "blur"
            },
            {
              min: 3,
              max: 20,
              message: "长度在 3 到 20 个字符",
              trigger: "blur"
            }
          ],
          domain: [
            {
              required: true,
              message: "请输入域名",
              trigger: "blur"
            }
          ],
          tel: [
            {
              required: true,
              message: "手机号",
              trigger: "blur"
            },
            {
              min: 11,
              max: 11,
              message: "长度在11 个字符",
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
        sys_tenant_add: false,
        sys_tenant_upd: false,
        sys_tenant_del: false
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
      this.sys_tenant_add = this.permissions["tenant_btn_add"];
      this.sys_tenant_upd = this.permissions["tenant_btn_edit"];
      this.sys_tenant_del = this.permissions["tenant_btn_del"];
    },
    methods: {
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
          this.form.status = this.form.status == 1 ? true : false
          this.dialogFormVisible = true;
          this.dialogStatus = "update";
        });
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
          domain: "",
          name: "",
          tel: "",
          position: "",
          comment: "",
          contact: "",
          code: ""
        };
      }
    }
  };
</script>
