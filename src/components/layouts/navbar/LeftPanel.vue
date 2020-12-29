<template>
  <div class="menu">
    <div class="logo" />
    <div class="menu__list">
      <el-menu
        :default-active="$route.name"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
        router
      >
        <el-menu-item
          v-for="(route) in getMenuList"
          :index="route.name"
          :key="route.name"
          :route="{ name: route.name }"
        >
          <i class="el-icon-menu" />
          <span slot="title">{{ route.title }}</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import menuList from '../../../consts/menuList'
  import { Logger } from '@/main'

  export default {
    name: 'LeftPanel',
    data: () => {
      return {
        isCollapse: false
      }
    },
    computed: {
      ...mapGetters([
        'user'
      ]),
      getMenuList() {
          return menuList(this.user.role.id)
      },
    },
    methods: {
      openMenu (routeName) {
        this.$router.push({ name: routeName })
      },
      toggleCollapse () {
        this.isCollapse = !!this.isCollapse
      },
      handleOpen (key, keyPath) {
        Logger.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        Logger.log(key, keyPath)
      },
    },
  }
</script>
<style>

</style>
