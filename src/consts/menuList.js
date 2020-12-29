import {routeNames, langs, USERS, ACTIVITIES, CONTRACTS, REPORT} from "../router/consts";
import {roleType} from "./index";

const menuList = [
    {
        name: routeNames[USERS],
        title: langs[USERS],
        roles: [roleType.ADMIN]
    },
    {
        name: routeNames[ACTIVITIES],
        title: langs[ACTIVITIES],
        roles: [roleType.ADMIN, roleType.DEVELOPER, roleType.RP]
    },
    {
        name: routeNames[CONTRACTS],
        title: langs[CONTRACTS],
        roles: [roleType.ADMIN, roleType.RP]
    },
    {
        name: routeNames[REPORT],
        title: langs[REPORT],
        roles: [roleType.RP, roleType.ADMIN, roleType.DEVELOPER]
    }
]

export const getMenuList = (roleId) => {

    return menuList.filter(el => {
        return el.roles.includes(roleId)
    })
}

export default getMenuList
