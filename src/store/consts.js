//request
export const HTTP_REQUEST = 'HTTP_REQUEST'
export const HTTP_RESPONSE = 'HTTP_RESPONSE'
export const HTTP_ERROR = 'HTTP_ERROR'
export const HTTP_GET = 'HTTP_GET'
export const HTTP_POST = 'HTTP_POST'
export const HTTP_PUT = 'HTTP_PUT'
export const HTTP_DELETE = 'HTTP_DELETE'
export const HTTP_SEARCH = 'HTTP_SEARCH'
export const HTTP_CHECK_TOKEN = 'HTTP_CHECK_TOKEN'

//actions
export const A_AUTH = 'A_AUTH'
export const A_TOKEN_REFRESH = 'A_TOKEN_REFRESH'
export const A_TOKEN_REVOKE = 'A_TOKEN_REVOKE'
export const A_USER_PROFILE = 'A_USER_PROFILE'
export const A_LOGOUT = 'A_LOGOUT'
export const A_TOGGLE_REMEMBER_ME = 'A_TOGGLE_REMEMBER_ME'

export const A_USERS_SEARCH = 'A_USERS_SEARCH'
export const A_USER_ROLE_LIST = 'A_USER_ROLE_LIST'
export const A_USER_CREATE = 'A_USER_CREATE'
export const A_USER_UPDATE = 'A_USER_UPDATE'
export const A_USER_DELETE = 'A_USER_DELETE'
export const A_USER_CHANGE_PASSWORD = 'A_USER_CHANGE_PASSWORD'

export const A_CONTRACTS_SEARCH = 'A_CONTRACTS_SEARCH'
export const A_CONTRACT_CREATE = 'A_CONTRACTS_CREATE'
export const A_CONTRACT_DELETE = 'A_CONTRACTS_DELETE'
export const A_CONTRACT_UPDATE = 'A_CONTRACTS_UPDATE'
export const A_RP_USERS_SEARCH = 'A_RP_USERS_SEARCH'

export const A_ACTIVITIES_SEARCH = 'A_ACTIVITIES_SEARCH'
export const A_ACTIVITIES_SEARCH_CURRENT_USER = 'A_ACTIVITIES_SEARCH_CURRENT_USER'
export const A_ACTIVITY_CREATE = 'A_ACTIVITY_CREATE'
export const A_ACTIVITY_DELETE = 'A_ACTIVITY_DELETE'
export const A_ACTIVITY_UPDATE = 'A_ACTIVITY_UPDATE'

//mutations
export const SET_AUTH = "SET_AUTH"
export const SET_TOGGLE_REMEMBER_ME = 'SET_TOGGLE_REMEMBER_ME'
export const SET_TOKEN_REFRESH = 'SET_TOKEN_REFRESH'
export const SET_LOGOUT = 'SET_LOGOUT'
export const SET_USER_PROFILE = 'SET_USER_PROFILE'
export const SET_LOADING = 'SET_LOADING'
export const SET_PAGEABLE = 'SET_PAGEABLE'
export const SET_HTTP_ERROR = 'SET_HTTP_ERROR'

export const SET_USERS = 'SET_USERS'
export const SET_USER_ROLE_LIST = 'SET_USER_ROLE_LIST'

export const SET_CONTRACTS = 'SET_CONTRACTS'
export const SET_RP_USERS = 'SET_RP_USERS'

export const SET_ACTIVITIES = 'SET_ACTIVITIES'

//getters
export const GET_LOADING = 'GET_LOADING'
export const IS_LOADING = 'IS_LOADING'
export const GET_USERS = 'GET_USERS'
export const GET_USER_ROLE_LIST = 'GET_USER_ROLE_LIST'
export const GET_CONTRACTS = 'GET_CONTRACTS'
export const GET_RP_USERS = 'GET_RP_USERS'
export const GET_ACTIVITIES = 'GET_ACTIVITIES'

export const urls = {
    [A_AUTH]: '/auth',
    [A_TOKEN_REFRESH]: '/token/refresh',
    [A_TOKEN_REVOKE]: '/token/revoke',
    [A_USER_PROFILE]: '/user/me',
    [A_USERS_SEARCH]: '/user?search=:search::sort:&page=:page:&size=:size:',
    [A_USER_ROLE_LIST]: '/user/role/list',
    [A_USER_CREATE]: '/user/register',
    [A_USER_UPDATE]: '/user/:id:',
    [A_USER_DELETE]: '/user/:id:',
    [A_CONTRACTS_SEARCH]: '/contract?search=:search::sort:&page=:page:&size=:size:',
    [A_CONTRACT_CREATE]: '/contract',
    [A_CONTRACT_UPDATE]: '/contract',
    [A_CONTRACT_DELETE]: '/contract/:id:',
    [A_ACTIVITIES_SEARCH]: '/activity?search=:search::sort:&page=:page:&size=:size:',
    [A_ACTIVITIES_SEARCH_CURRENT_USER]: '/activity/my?search=:search::sort:&page=:page:&size=:size:',
    [A_ACTIVITY_CREATE]: '/activity',
    [A_ACTIVITY_UPDATE]: '/activity/:id:',
    [A_ACTIVITY_DELETE]: '/activity/:id:',
    [A_USER_CHANGE_PASSWORD]: '/user/password/change'
}
