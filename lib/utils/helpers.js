const os = require('os')
const fs = require('fs-extra')
const path = require('path')
const debug = require('debug')(require('../create-bread-app').DEBUG_NAME)
const staticPath = require('./shared')

function copyDir (root, packageJson) {
  const resolve = file => path.resolve(staticPath, file)
  debug(packageJson)
  packageJson.bread.files.forEach(file => {
    const path = resolve(file)
    fs.copyFileSync(path, root)
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
  copyDir
}
