import {
    A_CONTRACT_CREATE, A_CONTRACT_DELETE, A_CONTRACTS_SEARCH, A_CONTRACT_UPDATE, A_RP_USERS_SEARCH, A_USERS_SEARCH,
    GET_CONTRACTS, GET_RP_USERS,
    HTTP_DELETE, HTTP_POST, HTTP_PUT, HTTP_SEARCH,
    SET_CONTRACTS, SET_RP_USERS
} from "../consts";
import {roleType} from "../../consts";


const state = {
    list: [],
    rpUsers: []
}

const getters = {
    [GET_CONTRACTS]: state => state.list,
    [GET_RP_USERS]: state => state.rpUsers
}

const mutations = {
    [SET_CONTRACTS](state, data) {
        state.list = data
    },
    [SET_RP_USERS](state, data) {
        state.rpUsers = data
    }
}

const actions = {
    [A_CONTRACTS_SEARCH]({dispatch}, {params, data}) {
        return dispatch(HTTP_SEARCH, {method: A_CONTRACTS_SEARCH, mutation: SET_CONTRACTS, params, data})
    },
    [A_CONTRACT_CREATE]({dispatch}, data) {
        return dispatch(HTTP_POST, {method: A_CONTRACT_CREATE, mutation: false, data})
    },
    [A_CONTRACT_UPDATE]({dispatch}, data) {
        return dispatch(HTTP_PUT, {method: A_CONTRACT_UPDATE, mutation: false, data})
    },
    [A_CONTRACT_DELETE]({dispatch}, data) {
        const params = {
            id: data.id
        }
        return dispatch(HTTP_DELETE, {method: A_CONTRACT_DELETE, mutation: false, data, params})
    },
    [A_RP_USERS_SEARCH]({dispatch}) {
        const params = {
            search: {
                roleId: roleType.RP
            }
        }
        return dispatch(HTTP_SEARCH, {method: A_USERS_SEARCH, mutation: SET_RP_USERS, params})
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
