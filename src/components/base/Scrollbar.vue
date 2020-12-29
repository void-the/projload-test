<template>
  <perfect-scrollbar ref="scrollbar">
    <slot />
  </perfect-scrollbar>
</template>

<script>
  import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
  import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

  export default {
    name: 'Scrollbar',
    components: {
      PerfectScrollbar
    },
    methods: {
      updateScrollbar () {
        this.$refs.scrollbar.update()
      }
    },
    mounted () {
      window.addEventListener('resize', this.updateScrollbar)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.updateScrollbar)
    }
  }
</script>
