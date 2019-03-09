const fs = require('fs-extra')
const path = require('path')
const debug = require('../create-bread-app').debug
const staticPath = require('./shared')

function copyDir (root, packageJson) {
  const resolve = file => path.resolve(staticPath, file)
  debug(packageJson)
  packageJson.files.forEach(file => {
    const path = resolve(file)
    fs.copyFileSync(path, root)
  })
}

function createPackageJson (root, name, packageJson) {
  const file = path.resolve(root, `${name}.json`)
  fs.ensureDirSync(root)
  fs.createFileSync(file)
  fs.writeJSONSync(file, packageJson, { encoding: 'utf-8' })
}

module.exports = {
  createPackageJson,
  copyDir
}
