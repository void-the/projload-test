<template>
  <div class="auth-wrapper">
    <div class="auth">
      <login-notification
        v-if="notification"
        :notification="notification"
      />
      <div class="auth-form">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
  import LoginNotification from './LoginNotification'

  export default {
    name: 'AuthWrapper',
    components: {
      LoginNotification,
    },
    props: {
      notification: {
        type: Object,
        default: () => {},
      }
    }
  }
</script>
