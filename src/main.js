import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Scrollbar from './components/base/Scrollbar'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/ru-RU'

//use modules
Vue.use(ElementUI, { locale });
Vue.component('scrollbar', Scrollbar);

//Validator
import './plugins/validator';

// logger
export const Logger = {
  log(name, ...args) {
    args.unshift(name && name.log ? name : { log: name });
    // eslint-disable-next-line no-console
    console.log.apply(null, args);
  },
  error(...args) {
    this.log(...args);
  },
  deprecated(...args) {
    args.unshift('@deprecated');
    this.log(...args);
  },
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
