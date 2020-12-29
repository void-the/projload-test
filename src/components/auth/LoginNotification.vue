<template>
  <div
    class="auth-notification auth-notification--active"
    :class="{'auth-notification--success' : notification.isSuccess}"
  >
    <svg
      v-if="!notification.isSuccess"
      class="auth-notification__icon"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="18"
      viewBox="0 0 20 18"
    >
      <g
        fill="none"
        fill-rule="evenodd"
        transform="translate(1 1)"
      >
        <path
          stroke="#FF342D"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7.6 1.522L.67 13.09a1.636 1.636 0 0 0 1.4 2.454h13.86a1.636 1.636 0 0 0 1.4-2.454L10.4 1.52a1.636 1.636 0 0 0-2.8 0zM9 5.727V9"
        />
        <circle
          cx="9"
          cy="12.455"
          r="1"
          fill="#FF342D"
        />
        <path
          stroke="#EE7371"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12.273"
        />
      </g>
    </svg>
    <span class="auth-notification__text">{{ notification.text }}</span>
  </div>
</template>

<script>
export default {
  name: 'LoginNotification',

  props: {
    notification: {
      type: Object,
      default() {}
    }
  }
}
</script>
