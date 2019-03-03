const path = require('path')
const fs = require('fs-extra')
const validateProjectName = require('validate-npm-package-name')
const commander = require('commander')
const chalk = require('chalk').default

const packageJson = require('../package.json')

let projectName = null

// todo
const command = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .action(name => {
    projectName = name
  })
  .option('--useWebpack')
  .option('--useRollup')
  .parse(process.argv)

createApp(projectName,
  command.useWebpack,
  command.useRollup
)

// based on creat-react-app
// todo
function createApp (
  name,
  useWebpack = false,
  useRollup = true
) {
  const root = path.resolve(__dirname, name)
  const appName = path.basename(root)
  checkAppName(appName)
  fs.ensureDirSync(name)

  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true
  }
}

function printValidationResults (results) {
  if (typeof results !== 'undefined') {
    results.forEach(error => {
      console.error(chalk.red(`  *  ${error}`))
    })
  }
}

function checkAppName (appName) {
  const validationResult = validateProjectName(appName)
  if (!validationResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${appName}"`
      )} because of npm naming restrictions:`
    )
    printValidationResults(validationResult.errors)
    printValidationResults(validationResult.warnings)
    process.exit(1)
  }
}
