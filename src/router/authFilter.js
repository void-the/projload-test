import store from "../store";
import {routeNames, LOGIN, PAGE_NOT_FOUND, ACTIVITIES, USERS, CONTRACTS} from "./consts";
import {roleType} from "../consts";

export const hasToken = (to, from, next) => {
    if (store.getters.token) {
        next('/')
    } else {
        next()
    }
}

export const manageRoute = (to, from, next) => {
    // eslint-disable-next-line
    console.log('route to:',to)
    if (to.path === '/') {
        switch (store.getters.user.role.id) {
            case roleType.ADMIN:
                next({name: routeNames[USERS]}); break;
            case roleType.RP:
                next({name: routeNames[CONTRACTS]}); break;
            case roleType.DEVELOPER:
            default: next({name: routeNames[ACTIVITIES]}); break;
        }
    } else {
        next()
    }
}

export const requireAuth = (to, from, next) => {
    if (store.getters.isLoggedIn) {
            manageRoute(to, from, next)
    } else if (from.name !== routeNames[LOGIN]) {
        next({name: routeNames[LOGIN]})
    } else {
        next(false)
    }
}

export const requireRole = (to, from, next, role) => {
    if (store.getters.user.role.id === role) {
        next()
    } else {
        next({name: routeNames[PAGE_NOT_FOUND]})
    }
}
