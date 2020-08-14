var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://localhost:9091/api"'
  // API_ROOT: '"http://localhost:5000"'
})
