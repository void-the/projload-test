import Vue from 'vue'
import VueRouter from 'vue-router'
import AuthLayout from '../components/layouts/AuthLayout'
import {langs, routeNames, LOGIN, USERS, ACTIVITIES, CONTRACTS, REPORT, PAGE_NOT_FOUND} from './consts'
import {roleType} from '../consts'
import {hasToken, requireRole, MAIN_PAGE, requireAuth, manageRoute} from "./authFilter";
import Layout from "../components/layouts/Layout";
Vue.use(VueRouter)

export function loadView(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../views/${view}.vue`)
}

const routes = [
    {
        path: '/login',
        component: AuthLayout,
        children: [
            {
                path: '',
                name: routeNames[LOGIN],
                component: loadView('auth/Login'),
                meta: {title: langs[LOGIN]}
            },
        ],
        beforeEnter: hasToken
    },
    {
        path: '/404',
        name: routeNames[PAGE_NOT_FOUND],
        component: loadView('app/PageNotFound'),
        meta: { title: langs[PAGE_NOT_FOUND] }
    },
    {
        path: '/',
        component: Layout,
        beforeEnter: (to,from, next) => requireAuth(to,from,next),
        children:
            [
                {
                    path: ''
                },
                {
                    path: 'users/',
                    name: routeNames[USERS],
                    component: loadView('app/Users'),
                    meta: {title: langs[USERS]},
                    beforeEnter: (to, from, next) => requireRole(to, from, next, roleType.ADMIN)
                },
                {
                    path: 'activities/',
                    name: routeNames[ACTIVITIES],
                    component: loadView('app/Activities'),
                    meta: {title: langs[ACTIVITIES]}
                },
                {
                    path: 'contracts/',
                    name: routeNames[CONTRACTS],
                    component: loadView('app/Contracts'),
                    meta: {title: langs[CONTRACTS]}
                },
                {
                    path: 'report/',
                    name: routeNames[REPORT],
                    component: loadView('app/Report'),
                    meta: {title: langs[REPORT]}
                }

            ]
    }
]

const router = new VueRouter({
    mode: 'history',
    // base: process.env.BASE_URL,
    routes
})

export default router
