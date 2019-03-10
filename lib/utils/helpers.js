const os = require('os')
const fs = require('fs-extra')
const path = require('path')
const debug = require('debug')('bread')
const staticPath = require('./shared').staticPath

function copyFiles (root, packageJson) {
  debug('copyFiles')
  packageJson.bread.files.forEach(file => {
    const pth = path.join(staticPath, file)
    const target = path.join(root, file)
    fs.copyFileSync(pth, target)
  })
}

function createPackageJson (root, name, packageJson) {
  const file = path.resolve(root, `${name}.json`)
  fs.ensureDirSync(root)
  fs.createFileSync(file)
  fs.writeFileSync(
    file,
    JSON.stringify(packageJson, null, 2) + os.EOL,
    { encoding: 'utf-8' }
  )
}

module.exports = {
  createPackageJson,
  copyDir: copyFiles
}
