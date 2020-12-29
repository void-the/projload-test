import Vue from 'vue';
import {Logger} from '../../main'
import axios from 'axios';
import router from '../../router/index'
import {routeNames, PAGE_NOT_FOUND} from '../../router/consts'
import comparisonOperators from '../../consts/comparisonQueryOperators'
import {BASE_URL} from "../../consts/config";
import {
    urls,
    A_LOGOUT,
    A_TOKEN_REFRESH,
    GET_LOADING, HTTP_CHECK_TOKEN,
    HTTP_ERROR, HTTP_GET,
    HTTP_REQUEST,
    HTTP_RESPONSE, HTTP_SEARCH, SET_HTTP_ERROR,
    SET_LOADING, SET_PAGEABLE, HTTP_POST, HTTP_PUT, HTTP_DELETE
} from "../consts";
import {BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED} from "http-status-codes";

const api = axios.create({
    baseURL: BASE_URL,
})
const wrapUrl = (url, params) => {
    if (!url) {
        Logger.log('ERROR URL', url, params);
        return '';
    }
    if (!params) {
        return url;
    }
    let path = url;
    for (const key of Object.keys(params)) {
        path = path.replace(`:${key}:`, params[key]);
    }
    return encodeURI(path);
};

const convertSearchToString = searchParams => {
    const searchKeys = Object.keys(searchParams).filter(key => searchParams[key]);
    return searchKeys.map(searchKey => {
        const isNotString = typeof searchParams[searchKey] !== 'string'
        const isNotNumber = typeof searchParams[searchKey] !== 'number'

        if (isNotString && isNotNumber) {
            return Object.keys(searchParams[searchKey]).map(paramKey => {
                return `${searchKey}${comparisonOperators[paramKey]}${searchParams[searchKey][paramKey]}`;
            }).join('^');
        } else {
            return `${searchKey}${comparisonOperators.$eq}${searchParams[searchKey]}`;
        }
    }).join('^');
};

const urlParams = new URLSearchParams(window.location.search)
const state = {
    authorization: urlParams.get('token') ? `bearer ${urlParams.get('token')}` : localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    rememberMe: localStorage.getItem('rememberMe'),
    headers: {
        'Content-Language': 'ru-RU',
        'Content-Type': 'application/json',
    },
    loading: {},
    loadingRequest: {},
    pageable: {},
    errors: {},
    errorsQueue: []
}

const getters = {
    getHeaders(state) {
        return {
            ...state.headers,
            Authorization: state.authorization,
        };
    },
    getPageable: (state) => (name) => {
        return state.pageable[name] || {};
    },
    [GET_LOADING]: state => name => state.loading[name] || 'empty'
}

const mutations = {
    [SET_LOADING]: (state, {name, value, data}) => {
        Logger.log(SET_LOADING, name, value, data);
        Vue.set(state.loading, name, value);
        Vue.set(state.loadingRequest, name, data);
    },
    [SET_PAGEABLE]: (state, {name, value}) => {
        Logger.log(SET_PAGEABLE, name, value);
        Vue.set(state.pageable, name, value);
    },
    [SET_HTTP_ERROR]: (state, data) => {
        Vue.set(state.errors, data.name, data.data.errors);
        state.errorsQueue.push(data);
        Logger.error(SET_HTTP_ERROR, data);
    }
}

const actions = {
    [HTTP_CHECK_TOKEN]: async ({dispatch}, {method, mutation, options}) => {
        if (!options.headers) {
            options.headers = {};
        }

        const token = localStorage.getItem('token');
        if (!token) {
            if (getters.rememberMe && getters.refreshToken) {
                await dispatch(A_TOKEN_REFRESH, {refresh_token: getters.refreshToken})
            } else {
                await dispatch(A_LOGOUT);
                return Promise.reject(false)
            }
        }
        options.headers.Authorization = token;
        return dispatch(HTTP_REQUEST, {method, mutation, options});
    },
    [HTTP_REQUEST]: async ({commit, dispatch, getters}, {method, mutation, options}) => {
        commit(SET_LOADING, {name: method, value: 'loading'});
        if (!options.headers) {
            options.headers = {};
        }
        options.headers = {...getters.getHeaders, ...options.headers};
        return api
            .request(options)
            .then(response => dispatch(HTTP_RESPONSE, {method, mutation, response}))
            .catch(req => {
                commit(SET_LOADING, {name: method, value: 'error', data: req});

                return dispatch(HTTP_ERROR, {req, commit, method});
            });
    },
    [HTTP_RESPONSE]: ({commit}, {response, method, mutation}) => {
        response = response.data;
        if (mutation === null || mutation === undefined) {
            commit(SET_LOADING, {name: method, value: 'mutation undefined', data: response})
        } else {
            if (mutation) {
                if (response.content || response.result || response.orders) {
                    const result = response.content || response.result || response.orders;
                    if (mutation !== false) {
                        commit(mutation, result)
                    }
                    commit(SET_LOADING, {name: method, value: 'loaded', data: result});
                    if (response.totalElements || response.total !== 'undefined') {
                        const value = {
                            totalElements: parseInt(response.totalElements || response.total),
                            totalPages: parseInt(response.totalPages || response.pages),
                            size: response.size,
                            number: parseInt(response.number) + 1,
                            numberOfElements: parseInt(response.numberOfElements),
                            data: response.pageable,
                        };
                        commit(SET_PAGEABLE, {name: method, value})
                    }
                } else if (response.id) {
                    commit(SET_LOADING, {name: method, value: 'loaded', data: response})
                    commit(mutation, response)
                } else {
                    commit(SET_LOADING, {name: method, value: 'loaded', data: response})
                    commit(mutation, response)
                }
            } else {
                commit(SET_LOADING, {name: method, value: 'loaded', data: response.content})
            }
        }
        return response
    },
    [HTTP_ERROR]: ({commit, dispatch, getters}, {req, method}) => {
        if (req.response) {
            const response = req.response;
            // eslint-disable-next-line no-console
            console.log('response.status', response.status);
            switch (response.status) {
                case INTERNAL_SERVER_ERROR:
                case BAD_REQUEST:
                    commit(SET_HTTP_ERROR, {
                        name: method,
                        data: response.data,
                        status: response.status,
                    });
                    break;
                case UNAUTHORIZED:
                    if (getters.rememberMe && getters.refreshToken) {
                        dispatch(A_TOKEN_REFRESH, {refresh_token: getters.refreshToken});
                        return
                    } else {
                        dispatch(A_LOGOUT)
                    }
                    break;
                default:
                case NOT_FOUND:
                    router.push({name: routeNames[PAGE_NOT_FOUND]})
            }
            return Promise.reject(response.data);
        } else {
            commit(SET_HTTP_ERROR, {name: method, data: req, status: undefined});
            return Promise.reject(req);
        }
    },
    [HTTP_GET]: ({dispatch}, {method, mutation, params, data, options}) => {
        if (!options) {
            options = {};
        }
        options = {
            method: 'GET',
            url: wrapUrl(urls[method], params),
            data,
            ...options
        };
        return dispatch(HTTP_CHECK_TOKEN, {
            method,
            mutation,
            options
        });
    },
    [HTTP_POST]: ({dispatch}, {method, mutation, params, data, options}) => {
        const opts = {
            ...options,
            method: 'POST',
            url: wrapUrl(urls[method], params),
            data
        }
        return dispatch(HTTP_CHECK_TOKEN, {
            method,
            mutation,
            options: opts,
        });
    },
    [HTTP_PUT]: ({dispatch}, {method, mutation, params, data}) => {
        const options = {
            method: 'PUT',
            url: wrapUrl(urls[method], params),
            data
        }
        return dispatch(HTTP_CHECK_TOKEN, {
            method,
            mutation,
            options
        })
    },
    [HTTP_DELETE]: ({dispatch}, {method, mutation, params, data}) => {
        const options = {
            method: 'DELETE',
            url: wrapUrl(urls[method], params),
            data
        }
        return dispatch(HTTP_CHECK_TOKEN, {
            method,
            mutation,
            options
        })
    },
    [HTTP_SEARCH]: ({dispatch}, {method, mutation, params, data}) => {
        if (!params) {
            params = {};
        }
        params = {
            ...params,
            page: (params.page ? (params.page - 1) : 0),
            size: params.size || 10,
            sort: params.sort || {},
            search: params.search || {},
        };
        const searchParams = Object.keys(params.search).filter(key => params.search[key]);
        if (searchParams.length > 0) {
            params.search = convertSearchToString(params.search)
        } else {
            params.search = '';
        }
        const sortParams = Object.keys(params.sort).filter(key => params.sort[key]);
        if (sortParams.length > 0) {
            params.sort = '&sort=' + sortParams.map((param) => {
                return `${param},${params.sort[param]}`;
            }).join('&sort=');
        } else {
            params.sort = '';
        }
        return dispatch(HTTP_GET, {method, mutation, params, data})
    }
}


export default {
    state,
    getters,
    mutations,
    actions,
};
