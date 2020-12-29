import router from '../../router/index'
import {routeNames, USERS, LOGIN} from '../../router/consts'
import {
    urls,
    HTTP_REQUEST,
    HTTP_GET,
    A_AUTH,
    A_LOGOUT,
    A_TOGGLE_REMEMBER_ME,
    A_USER_PROFILE,
    SET_AUTH,
    SET_LOGOUT,
    SET_TOGGLE_REMEMBER_ME,
    SET_TOKEN_REFRESH,
    SET_USER_PROFILE, A_TOKEN_REFRESH
} from "../consts"
import {roleType} from "../../consts";

const token = localStorage.getItem('token')
const refreshToken = localStorage.getItem('refreshToken')
const rememberMe = (localStorage.getItem('rememberMe') === 'true')
const user = null

const state = {
    token,
    refreshToken,
    rememberMe,
    user,
    isIframe: window.location !== window.parent.location
}

const getters = {
    isLoggedIn: state => !!state.token,
    token: state => state.token,
    refreshToken: state => state.refreshToken,
    user: state => state.user,
    rememberMe: state => state.rememberMe,
    isIframe: state => state.isIframe,
    isAdmin: state => state.user.roleId === roleType.ADMIN,
    isRp: state => state.user.roleId === roleType.RP,
    isDeveloper: state => state.user.roleId === roleType.DEVELOPER
}

const mutations = {
    [SET_AUTH](state, {accessToken, refreshToken}) {
        state.token = accessToken
        state.refreshToken = refreshToken
        localStorage.setItem('token', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
    },
    [SET_LOGOUT](state) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        state.token = null
        state.refreshToken = null
        state.user = null
    },
    [SET_TOKEN_REFRESH](state, {accessToken}) {
        state.token = accessToken
        localStorage.setItem('token', accessToken)
    },
    [SET_TOGGLE_REMEMBER_ME](state, checked) {
        state.rememberMe = checked
        localStorage.setItem('rememberMe', checked)
    },
    [SET_USER_PROFILE](state, user) {
        state.user = user
    }
}

const actions = {
    [A_AUTH]({ commit, dispatch}, data) {
        return dispatch(HTTP_REQUEST,
            {
                mutation: false,
                method: A_AUTH,
                options: {
                    method: 'POST',
                    url: urls[A_AUTH],
                    data: data
                }
            })
            .then((response) => {
                    const { accessToken, refreshToken} = response
                    commit(SET_AUTH, {
                        accessToken: `${accessToken}`,
                        refreshToken: `${refreshToken}`
                    })
                }
            )
    },
    [A_USER_PROFILE]({dispatch}) {
        return dispatch(HTTP_GET, {
            method: A_USER_PROFILE,
            mutation: SET_USER_PROFILE
        })
    },
    [A_TOKEN_REFRESH]({commit, dispatch}, data) {
        return dispatch(HTTP_REQUEST, {
            mutation: false,
            options: {
                method: 'POST',
                url: urls[A_TOKEN_REFRESH],
                data: data,
            }
        })
            .then((response) => {
                const {access_token: accessToken, refresh_token: refreshToken} = response
                commit(SET_AUTH, {
                    accessToken: `${accessToken}`,
                    refreshToken: `${refreshToken}`
                })
            })
            .then(() => {
                dispatch(A_USER_PROFILE)
            })
            .catch(() => {
                dispatch(A_LOGOUT)
            })
    },
    [A_LOGOUT]({commit}) {
        commit(SET_LOGOUT)
        router.push({name: routeNames[LOGIN]})
    },
    [A_TOGGLE_REMEMBER_ME]({commit}, checked) {
        commit(SET_TOGGLE_REMEMBER_ME, checked)
    }
}

export default {
    state,
    getters,
    mutations,
    actions,
};
