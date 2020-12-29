<template>
    <div class="header">
        <div class="header__left">
            <div class="header__title">
                {{ title ? title : $route.meta.title }}
            </div>
        </div>
        <div class="header__right">
            <div class="user-block">
                <div class="user-block__link">
                    <div class="user-block__info">
                        <span class="user-block__name">{{ user ? user.email : null }}</span>
                        <span class="user-block__position">{{ user && user.role ? user.role.name : null }}</span>
                    </div>
                </div>
            </div>
            <div class="control">
                <div class="header__exit">
                    <el-button
                            @click="showProfile"
                            class="button-icon">
                        <profile-icon/>
                    </el-button>
                </div>
                <div class="header__exit">
                    <el-button
                            @click="logout"
                            class="button-icon">
                        <logout-icon/>
                    </el-button>
                </div>
            </div>

        </div>
        <user-profile-form
                v-if="showModal"
                :user="this.user"
                @close="handleClose"/>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import {A_LOGOUT} from "../../../store/consts";
    import LogoutIcon from "../../icons/LogoutIcon";
    import UserProfileForm from "../../Modal/UserProfileForm";
    import ProfileIcon from "../../icons/ProfileIcon";

    export default {
        name: 'Navbar',
        components: {ProfileIcon, UserProfileForm, LogoutIcon},
        props: {
            title: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                showModal: false
            }
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        },
        methods: {
            ...mapActions({
                logout: A_LOGOUT,
            }),
            showProfile() {
                this.showModal = true;
            },
            handleClose() {
                this.showModal = false
            }
        }
    }
</script>

<style>
    div.control div {
        display: inline-block;
    }
</style>
