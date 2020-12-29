<template>
    <div class="auth-wrapper">
        <div class="auth">
            <login-notification
                    v-if="notification"
                    :notification="notification"
            />
            <div class="auth-form">
               <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>

    import LoginNotification from "../auth/LoginNotification";
    export default {
        name: 'AuthWrapper',
        components: {
            LoginNotification
        },
        props: {
            notification: {
                type: Object,
                default: () => {},
            }
        }
    }
</script>
