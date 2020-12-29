<template>
    <auth-wrapper :notification="notification">
        <p v-if="isIframe" class="auth-iframe-error">
            Пожалуйста, перезагрузите страницу
        </p>
        <el-form v-else label-width="120px" v-loading="isLoading">
            <el-form-item label="Логин" prop="username">
                <el-input v-model="user.username"/>
            </el-form-item>
            <el-form-item label="Пароль" prop="password">
                <el-input type="password" v-model="user.password" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="Запомнить меня" prop="rememberMe">
                <el-switch v-model="user.rememberMe"/>
            </el-form-item>
            <el-form-item>
                <el-button native-type="submit" type="primary" @click.prevent="submit">Войти</el-button>
            </el-form-item>
        </el-form>
    </auth-wrapper>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import AuthWrapper from '../../components/auth/AuthWrapper'
    import {A_AUTH, A_TOGGLE_REMEMBER_ME, GET_LOADING} from "../../store/consts";

    export default {
        name: 'Login',
        components: {AuthWrapper},
        data() {
            return {
                isError: false,
                isPermissionError: false,
                user: {
                    username: '',
                    password: '',
                    rememberMe: this.rememberMe,
                },
            };
        },
        computed: {
            ...mapGetters([
                GET_LOADING,
                'rememberMe',
                'isIframe',
            ]),
            isLoading() {
                return this[GET_LOADING](A_AUTH) === 'loading'
            },
            notification() {
                if (this.isPermissionError) return {text: 'В авторизации отказано'}
                else return this.isError ? {text: 'Неверный логин или пароль'} : null
            }
        },
        methods: {
            ...mapActions({
                login: A_AUTH,
                toggleRememberMe: A_TOGGLE_REMEMBER_ME,
            }),
            submit() {
                this.toggleRememberMe(this.user.rememberMe);
                this.isError = false;
                this.isPermissionError = false;
                this.login({username: this.user.username, password: this.user.password})
                    .then(() => {
                        this.$router.push('/')
                    })
                    .catch((e) => {
                        if (e && e.name === 'PermissionError') this.isPermissionError = true
                        else this.isError = true
                    })
            }
        }
    }
</script>

<style scoped>
    .auth-iframe-error {
        text-align: center;
        font-size: 17px;
    }
</style>
