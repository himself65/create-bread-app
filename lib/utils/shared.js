const path = require('path')

const repoRoot = path.resolve(__dirname, '../', '../')

const staticPath = path.resolve(repoRoot, 'static')

module.exports = {
  repoRoot,
  staticPath
}
