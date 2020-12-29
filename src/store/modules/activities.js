import {
    A_ACTIVITIES_SEARCH, A_ACTIVITIES_SEARCH_CURRENT_USER,
    A_ACTIVITY_CREATE,
    A_ACTIVITY_DELETE,
    A_ACTIVITY_UPDATE,
    GET_ACTIVITIES, HTTP_DELETE, HTTP_POST, HTTP_PUT, HTTP_SEARCH,
    SET_ACTIVITIES
} from "../consts";

const state = {
    list: []
}

const getters = {
    [GET_ACTIVITIES]: state => state.list
}

const mutations = {
    [SET_ACTIVITIES](state, data) {
        state.list = data
    }
}

const actions = {
    [A_ACTIVITIES_SEARCH]({dispatch}, {params, data}) {
        return dispatch(HTTP_SEARCH, {method: A_ACTIVITIES_SEARCH, mutation: SET_ACTIVITIES, params, data})
    },
    [A_ACTIVITIES_SEARCH_CURRENT_USER]({dispatch}, {params, data}) {
        return dispatch(HTTP_SEARCH, {method: A_ACTIVITIES_SEARCH_CURRENT_USER, mutation: SET_ACTIVITIES, params, data})
    },
    [A_ACTIVITY_CREATE]({dispatch}, data) {
        return dispatch(HTTP_POST, {method: A_ACTIVITY_CREATE, mutation: false, data})
    },
    [A_ACTIVITY_UPDATE]({dispatch}, data) {
        const params = {
            id: data.id
        }
        return dispatch(HTTP_PUT, {method: A_ACTIVITY_UPDATE, mutation: false, data, params})
    },
    [A_ACTIVITY_DELETE]({dispatch}, data) {
        const params = {
            id: data.id
        }
        return dispatch(HTTP_DELETE, {method: A_ACTIVITY_DELETE, mutation: false, data, params})
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
