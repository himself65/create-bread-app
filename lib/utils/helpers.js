const fs = require('fs-extra')
const path = require('path')
const staticPath = require('./shared')

function copyDir (root, packageJson) {
  const resolve = file => path.resolve(staticPath, file)
  packageJson.forEach(file => {
    const path = resolve(file)
    fs.copyFileSync(path, root)
  })
}

function createPackageJson (root, name, packageJson) {
  const file = path.resolve(root, `${name}.json`)
  fs.ensureDirSync(root)
  fs.createFileSync(file)
  fs.writeJSONSync(file, JSON.stringify(packageJson), { encoding: 'utf-8' })
}

module.exports = {
  createPackageJson,
  copyDir
}
