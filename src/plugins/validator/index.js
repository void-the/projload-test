import Vue from 'vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import './rules';

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
