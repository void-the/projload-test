module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    "no-unused-vars": [
      1
    ],
    "vue/singleline-html-element-content-newline": [
      false
    ],
    "vue/max-attributes-per-line": [
      false
    ]
  }
}
