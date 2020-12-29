import { extend } from 'vee-validate'

extend('required', {
  validate (value) {
    if (typeof value === 'undefined') {
      return 'Обязательное поле';
    }
    if (typeof value === 'string') {
      value = (value || '').trim();
    }
    if (['', null, undefined].indexOf(value) !== -1) {
      return 'Обязательное поле'
    }
    return true;
  },
  computesRequired: true
});

extend('password', {
  params: ['target'],
  validate(value, {target}) {
    return value === target;
  },
  message: 'Пароли не совпадают'
});

extend('email', {
  validate(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
  message: "Введите корректный email",
  computesRequired: true
});

extend('max', {
  validate(text, limit) {
    if(text.toString().length <= parseInt(limit.toString())) {
      return true;
    }
    return `Количество символов не более ${limit.toString()}`;
  },
  computesRequired: true
});

extend('min', {
  validate(text, limit) {
    if(text.toString().length >= parseInt(limit.toString())) {
      return true;
    }
    return `Количество символов не менее ${limit.toString()}`;
  },
  computesRequired: true
});

extend('mathMin', {
  validate(text, limit) {
    if(parseInt(text.toString(), 10) >= parseInt(limit.toString())) {
      return true;
    }
    return `Мин. ${limit.toString()}`;
  },
  computesRequired: true
});

extend('mathMax', {
  validate(text, limit) {
    if(parseInt(text.toString(), 10) <= parseInt(limit.toString())) {
      return true;
    }
    return `Макс. ${limit.toString()}`;
  },
  computesRequired: true
});

import { numeric } from 'vee-validate/dist/rules';

extend('numeric', {
  ...numeric,
  message: "Должно быть числом"
});
