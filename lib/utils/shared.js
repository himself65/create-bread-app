const path = require('path')

const repoRoot = path.resolve(__dirname, '../', '../')

const staticPath = path.join(repoRoot, 'static')
const templatePath = path.join(staticPath, 'template')

module.exports = {
  repoRoot,
  staticPath,
  templatePath
}
