import {routeNames, langs, USERS, ACTIVITIES, CONTRACTS, REPORT} from "../router/consts";
import {roleType} from "./index";
import store from '../store'

const menuList = [
    {
        name: routeNames[USERS],
        title: langs[USERS],
        roles: [roleType.ADMIN]
    },
    {
        name: routeNames[ACTIVITIES],
        title: langs[ACTIVITIES],
        roles: [roleType.ALL]
    },
    {
        name: routeNames[CONTRACTS],
        title: langs[CONTRACTS],
        roles: [roleType.ADMIN, roleType.RP]
    },
    {
        name: routeNames[REPORT],
        title: langs[REPORT],
        roles: [roleType.ALL]
    }
]

export const getMenuList = () => {
    let user = store.getters.user
    // eslint-disable-next-line
    console.log('menuList user', user)
    const roleId = user ? user.role.id : roleType.ALL
    return menuList.filter(el => {
        return el.roles.includes(roleId) || el.roles.includes(roleType.ALL)
    })
}

export default getMenuList
