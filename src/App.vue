<template>
  <div id="app">
    <router-view />
    <div v-loading.fullscreen.lock="isLoading"></div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {IS_LOADING} from "./store/consts";
  import {Logger} from "./main";
  export default {
    name: 'App',
    computed: {
      ...mapGetters({
        isLoading: IS_LOADING
      }),
      isLoad() {
        Logger.log('isLoading', this.isLoading())
        return false
      }
    }
  }
</script>

<style lang="scss">
  #app {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
  @import "assets/scss/style";
</style>
