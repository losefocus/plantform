<template>
  <div class="top">
    <div class="top-button is-left">
      <div class="tags-breadcrumb" style="cursor:pointer">
        <i class="icon-navicon tag-collapse" :class="[{ 'tag-collapse_right': isCollapse }]" @click="showCollapse"></i>
      </div>
    </div>
    <h1 class="top-title">
      <topMenu></topMenu>
    </h1>
    <span style="font-size:14px;padding-right:20px">工程信息化智慧云平台 V1.0 Beta</span>
    <div class="top-button is-right">
      <el-tooltip class="item" effect="dark" content="主题色" placement="bottom" :open-delay="300">
        <span class="top-item">
          <top-theme></top-theme>
        </span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="锁屏" placement="bottom" :open-delay="300">
        <span class="top-item">
          <top-lock></top-lock>
        </span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="isFullScren?'退出全屏':'全屏'" placement="bottom" :open-delay="300">
        <span class="top-item">
          <i :class="isFullScren?'icon-tuichuquanping':'icon-quanping'" @click="handleScreen"></i>
        </span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="用户头像" placement="bottom" :open-delay="300">
        <img v-if="userInfo && userInfo.avatarBaseUrl!=''" class="top-userImg" :src="userInfo.avatarBaseUrl+userInfo.avatarPath">
        <img class="top-userImg"  src="../../../assets/img/no_photo.png">
      </el-tooltip>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link" style="cursor: pointer;">
          <span v-if="userInfo.name!=''">{{userInfo.name}}({{userName}})</span>
          <span v-else>{{userName}}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/wel/index">控制台</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/info/index">用户资料</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout" divided>退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { fullscreenToggel, listenfullscreen } from "@/util/util";
import topLock from "./top-lock";
import topMenu from "./top-menu";
import topTheme from "./top-theme";
export default {
  components: { topLock, topMenu, topTheme },
  name: "top",
  data() {
    return {};
  },
  filters: {},
  created() {
    this.initCollapse()
  },
  mounted() {
    listenfullscreen(this.setScreen);
    window.onresize = () =>{
      var docWidth = document.body.clientWidth;
      if(docWidth <= 1400){
        this.$store.commit("SET_COLLAPSE_",true);
      }else{
        this.$store.commit("SET_COLLAPSE_",false);
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      userName: state => state.user.userName
    }),
    ...mapGetters(["isFullScren", "isCollapse"])
  },
  methods: { 
    initCollapse(){
      var docWidth = document.body.clientWidth;
      if(docWidth <= 1400){
        this.$store.commit("SET_COLLAPSE_",true);
      }else{
        this.$store.commit("SET_COLLAPSE_",false);
      }
    },
    showCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    handleScreen() {
      fullscreenToggel();
    },
    setScreen() {
      this.$store.commit("SET_FULLSCREN");
    },
    logout() {
      this.$confirm("是否退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          this.$router.push({ path: "/login" });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.top-item{
  cursor: pointer;
}
</style>

