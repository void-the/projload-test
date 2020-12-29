<template>
  <el-container class="layout">
    <el-aside v-if="showMenu"
              class="left-panel"
              width="240px">
      <left-panel/>
    </el-aside>
    <el-container class="body">
      <el-header>
        <navbar />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Navbar from './navbar/Navbar'
import LeftPanel from "./navbar/LeftPanel";

export default {
  name: 'Layout',

  components: {
    LeftPanel,
    Navbar,
  },
  computed: {
    showMenu() {
      return !this.$route.meta.hideLayout
    },
  }
}
</script>
