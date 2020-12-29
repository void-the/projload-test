import {
    A_USER_CHANGE_PASSWORD,
    A_USER_CREATE, A_USER_DELETE,
    A_USER_ROLE_LIST, A_USER_UPDATE,
    A_USERS_SEARCH, GET_USER_ROLE_LIST,
    GET_USERS, HTTP_DELETE, HTTP_GET, HTTP_POST, HTTP_PUT,
    HTTP_SEARCH, SET_USER_ROLE_LIST,
    SET_USERS
} from '../consts'
import {Logger} from '../../main'

const state = {
    list: [],
    ids: [],
    roles: []
}
const getters = {
    [GET_USERS]: state => state.list,
    [GET_USER_ROLE_LIST]: state => state.roles
}
const mutations = {
    [SET_USERS](state, data) {
        state.list = data
        state.ids = data.map(item => item.id);
    },
    [SET_USER_ROLE_LIST](state, data) {
        Logger.log(SET_USER_ROLE_LIST, data)
        state.roles = data
    }
}
const actions = {
    [A_USER_CHANGE_PASSWORD]({dispatch}, data) {
        return dispatch(HTTP_POST, {method: A_USER_CHANGE_PASSWORD, mutation: false, data})
    },
    [A_USERS_SEARCH]({dispatch}, {params, data}) {
        return dispatch(HTTP_SEARCH, {method: A_USERS_SEARCH, mutation: SET_USERS, params, data})
    },
    [A_USER_ROLE_LIST]({dispatch}) {
        return dispatch(HTTP_GET, {method: A_USER_ROLE_LIST, mutation: SET_USER_ROLE_LIST})
    },
    [A_USER_CREATE]({ dispatch }, data) {
        return dispatch(HTTP_POST, { method: A_USER_CREATE, mutation: false, data })
    },
    [A_USER_UPDATE]({dispatch}, data) {
        const params = {
            id: data.id
        }
        delete data.id
        return dispatch(HTTP_PUT, {method: A_USER_UPDATE, params, mutation: false, data})
    },
    [A_USER_DELETE]({dispatch}, data) {
        const params = {
            id: data.id
        }
        return dispatch(HTTP_DELETE, {method: A_USER_DELETE, mutation: false, params})
    }
}


export default {
    state,
    mutations,
    actions,
    getters
}
