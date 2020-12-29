<template>
    <modal :title="title" persistent="persistent" :actions="false" @cancel="handleClose">
        <div class="editor">
            <div class="inputs">
                <ValidationObserver v-slot="{ handleSubmit }">
                    <el-form @keydown.enter="handleSubmit(onSubmit)" label-position="right" label-width="250px">
                        <div>
                            <el-form-item label="ID:">
                                <span>{{user.id}}</span>
                            </el-form-item>
                            <el-form-item label="Логин\email:">
                                <span>{{user.email}}</span>
                            </el-form-item>
                            <el-form-item label="Роль:">
                                <span>{{user.role.name}}</span>
                            </el-form-item>
                            <el-form-item label="Активен:">
                                <span>{{user.enabled ? 'Да' : 'Нет'}}</span>
                            </el-form-item>
                            <el-form-item label="Ставка:">
                                <span>{{user.rate}}</span>
                            </el-form-item>
                            <el-form-item>
                                <span>Изменение пароля</span>
                            </el-form-item>
                            <ValidationProvider :name="'password'" :rules="'required|password:@passwordRepeated'"
                                                v-slot="{ errors }">
                                <el-form-item label="Новый пароль:">
                                    <el-input v-model="password"></el-input>
                                    <span>{{errors[0]}}</span>
                                </el-form-item>
                            </ValidationProvider>
                            <ValidationProvider :name="'passwordRepeated'" :rules="'required'"
                                                v-slot="{ errors }">
                                <el-form-item label="Повторите пароль:">
                                    <el-input v-model="passwordRepeated"></el-input>
                                    <span>{{errors[0]}}</span>
                                </el-form-item>
                            </ValidationProvider>
                            <el-form-item v-if="info">
                                <span>{{info}}</span>
                            </el-form-item>
                        </div>
                        <div class="actions">
                            <el-button type="primary" @click="handleSubmit(onSubmit)">Изменить пароль</el-button>
                            <el-button @click="()=>handleClose()">Закрыть</el-button>
                        </div>
                    </el-form>
                </ValidationObserver>
            </div>
        </div>
    </modal>
</template>

<script>
    import Modal from "./index";
    import {mapActions} from 'vuex'
    import {A_USER_CHANGE_PASSWORD} from "../../store/consts";

    export default {
        name: "UserProfileForm",
        components: {Modal},
        props: ['user'],
        data() {
            return {
                title: 'ПРОФИЛЬ',
                password: null,
                passwordRepeated: null,
                info: null
            }
        },
        methods: {
            ...mapActions({
                updatePassword: A_USER_CHANGE_PASSWORD
            }),
            handleClose() {
                this.$emit('close');
            },
            onSubmit() {
                this.updatePassword({
                    password: this.password,
                    passwordRepeated: this.passwordRepeated + '11'
                }).then(() => {
                    this.info = 'Пароль успешно изменен.'
                })
                this.$emit('submit');
            }
        }
    }
</script>

<style>
    .actions {
        display: flex;
        justify-content: center;
        margin: 20px 0;
    }
</style>
