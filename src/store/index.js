import Vue from 'vue'
import Vuex from 'vuex'
import auth from "./modules/auth";
import request from "./modules/request";
import users from "./modules/users";
import contracts from "./modules/contracts";
import activities from "./modules/activities";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    request,
    users,
    contracts,
    activities
  }
})
