<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button type="primary" size="small" v-if="menuManager_btn_add" icon="plus" @click="handlerAdd">添加</el-button>
        <el-button type="primary" size="small" v-if="menuManager_btn_edit" icon="edit" @click="handlerEdit">编辑</el-button>
        <el-button type="primary" size="small" v-if="menuManager_btn_del" icon="delete" @click="handleDelete">删除</el-button>
      </el-button-group>
    </div>

    <el-row>
      <el-col :span="7" style='margin-top:15px;'>
        <el-tree
          class="filter-tree"
          node-key="id"
          accordion
          highlight-current
          :data="treeData"
          :default-expanded-keys="aExpandedKeys"
          :filter-node-method="filterNode"
          :props="defaultProps"
          @node-click="getNodeData"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
        >
        </el-tree>
      </el-col>
      <el-col :span="16" class="pull-right" style='margin-top:15px;'>
        <el-card class="box-card">
          <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
            <el-form-item label="父级节点" prop="parentId">
              <!--<el-input v-model="form.parentId" :disabled="formEdit" placeholder="请输入父级节点"></el-input>-->
              <el-cascader
                :disabled="formEdit"
                :options="treeData"
                :props="props"
                change-on-select
                v-model="selectedOptions"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
            <el-form-item label="父级code" prop="parentId">
              <el-input v-model="form.parentCode" disabled ></el-input>
            </el-form-item>
            <el-form-item label="节点ID" prop="parentId">
              <el-input v-model="form.id" disabled placeholder="请输入节点ID"></el-input>
            </el-form-item>
            <el-form-item label="节点code" prop="parentId">
              <el-input v-model="form.code" disabled ></el-input>
            </el-form-item>
            <el-form-item label="标题" prop="name">
              <el-input v-model="form.name" :disabled="formEdit"  placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="权限标识" prop="permission">
              <el-input v-model="form.permission" :disabled="formEdit" placeholder="请输入权限标识"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <el-input v-model="form.icon" :disabled="formEdit" placeholder="请输入图标"></el-input>
            </el-form-item>
            <el-form-item label="资源路径" prop="route">
              <el-input v-model="form.route" :disabled="formEdit" placeholder="请输入资源路径"></el-input>
            </el-form-item>
            <el-form-item label="请求方法" prop="method">
              <el-select class="filter-item" v-model="form.method"  :disabled="formEdit"  placeholder="请输入资源请求类型">
                <el-option v-for="item in  methodOptions" :key="item" :label="item" :value="item"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select class="filter-item" v-model="form.type"  :disabled="formEdit"  placeholder="请输入资源请求类型">
                <el-option v-for="item in  typeOptions" :key="item" :label="item | typeFilter" :value="item"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model="form.sort" :disabled="formEdit" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="前端组件"   prop="component">
              <el-input v-model="form.component" :disabled="formEdit" placeholder="请输入前端组件"></el-input>
            </el-form-item>
            <el-form-item label="前端地址"   prop="component">
              <el-input v-model="form.path" :disabled="formEdit" placeholder="iframe嵌套地址"></el-input>
            </el-form-item>
            <el-form-item v-if="formStatus == 'update'">
              <el-button type="primary" @click="update">更新</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus == 'create'">
              <el-button type="primary" @click="create">保存</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { fetchTree, getObj, addObj, delObj, putObj } from '@/api/init/menu'
  import { mapGetters } from 'vuex'
  export default {
    name: 'menu',
    data() {
      return {
        vals:[],
        val: [],
        codeMap:null,
        parentOptions:[],
        props:{
          value:'id',
          label:'name',
        },
        selectedOptions:[],
        list: null,
        total: null,
        formEdit: true,
        formAdd: true,
        formStatus: '',
        showElement: false,
        typeOptions: ['0', '1'],
        methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
        listQuery: {
          name: undefined
        },
        treeData: [],
        oExpandedKey: {
          // key (from tree id) : expandedOrNot boolean
        },
        oTreeNodeChildren: {
          // id1 : [children] (from tree node id1)
          // id2 : [children] (from tree node id2)
        },
        aExpandedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        labelPosition: 'right',
        form: {
          permission: undefined,
          name: undefined,
          menuId: undefined,
          parentId: undefined,
          route: undefined,
          icon: undefined,
          sort: undefined,
          component: undefined,
          type: undefined,
          method: undefined,
          path: undefined
        },
        currentId: 0,
        menuManager_btn_add: false,
        menuManager_btn_edit: false,
        menuManager_btn_del: false
      }
    },
    filters: {
      typeFilter(type) {
        const typeMap = {
          0: '菜单',
          1: '按钮'
        };
        return typeMap[type]
      }
    },
    created() {
      this.getList();
      this.menuManager_btn_add = this.permissions['init_menu_add'];
      this.menuManager_btn_edit = this.permissions['init_menu_upd'];
      this.menuManager_btn_del = this.permissions['init_menu_del'];
    },
    computed: {
      ...mapGetters([
        'elements',
        'permissions'
      ])
    },
    methods: {
      //获取选中的完整对象
      getCascaderObj(val,opt) {
        return val.map(function (value, index, array) {
          for (var itm of opt) {
            if (itm.id == value) {
              opt = itm.children;
              return itm;
            }
          }
          return null;
        });
      },

      handleChange(){
        this.form.parentId = this.selectedOptions[this.selectedOptions.length-1]
        this.vals=this.getCascaderObj(this.selectedOptions, this.treeData);
        this.form.parentCode = this.vals[this.selectedOptions.length-1].code
        console.log(this.form.parentCode)
      },
      getList() {
        this.codeMap = new Map()
        fetchTree(this.listQuery).then(response => {
          this.treeData = response.data.result;
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== 0
      },

      nodeExpand(data) {
          let aChildren = data.children;
          if (aChildren.length > 0) {
            this.oExpandedKey[data.id] = true
            this.oTreeNodeChildren[data.id] = aChildren
          }
          this.setExpandedKeys()
      },
      nodeCollapse(data) {
        this.oExpandedKey[data.id] = false;
        // 如果有子节点
        this.treeRecursion(this.oTreeNodeChildren[data.id], (oNode) => {
          this.oExpandedKey[oNode.id] = false
        });
        this.setExpandedKeys()
      },
      setExpandedKeys() {
        let oTemp = this.oExpandedKey;
        this.aExpandedKeys = [];
        for (let sKey in oTemp) {
          if (oTemp[sKey]) {
            this.aExpandedKeys.push(parseInt(sKey));
          }
        }
      },
      treeRecursion(aChildren, fnCallback) {
        if (aChildren) {
          for (let i = 0; i < aChildren.length; ++i) {
            let oNode = aChildren[i]
            fnCallback && fnCallback(oNode)
            this.treeRecursion(oNode.children, fnCallback)
          }
        }
      },

      getNodeData(data) {
        if (!this.formEdit) {
          this.formStatus = 'update'
        }
        getObj(data.id).then(response => {
          this.form = response.data.result;
          this.form.parentCode = this.form.parentCode || 0;
          console.log(this.form)
        });
        this.currentId = data.id;
        this.showElement = true
      },
      handlerEdit() {
        if (this.form.id) {
          this.formEdit = false;
          this.formStatus = 'update';
        }
      },
      handlerAdd() {
        this.resetForm();
        this.formEdit = false;
        this.formStatus = 'create'
      },
      handleDelete() {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(this.currentId).then(() => {
            this.getList();
            this.resetForm();
            this.onCancel();
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      },
      update() {
        putObj(this.form).then(() => {
          this.getList();
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          });
          this.formEdit = true
        })
      },
      create() {
        addObj(this.form).then(() => {
          this.getList();
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          });
          this.formEdit = true
        })
      },
      onCancel() {
        this.formEdit = true;
        this.formStatus = ''
      },
      resetForm() {
        this.form = {
          permission: undefined,
          name: undefined,
          menuId: undefined,
          parentId: this.currentId,
          route: undefined,
          icon: undefined,
          sort: undefined,
          component: undefined,
          type: undefined,
          method: undefined,
          path: undefined
        }
        this.selectedOptions = []
      }
    }
  }
</script>

