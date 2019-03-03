const path = require('path')
const fs = require('fs-extra')
const spawn = require('cross-spawn')
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
  .option('--useWebpack, -webpack')
  .option('--useRollup, -rollup')
  .option('--useTypeScript, -ts')
  .option('--use-npm, -npm')
  .option('--use-yarn, -yarn')
  .allowUnknownOption()
  .on('--help', () => {
    console.log(`    Only ${chalk.green('<project-directory>')} is required.`)
    console.log()
  })
  .parse(process.argv)

createApp(projectName,
  command.useWebpack || false,
  command.useRollup || true,
  command.useTypeScript || true,
  command.useNpm || false,
  command.useYarn || true
)

// based on creat-react-app
// todo
function createApp (
  name,
  useWebpack = false,
  useRollup = true,
  typeScript = true,
  useNpm = false,
  useYarn = true
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

  const allDependencies = {
    dev: [
      '@types/node',
      '@types/jest',
      typeScript && 'typescript'
    ],
    prod: [
      'cross-env'
    ]
  }
  const rollupDependencies = [
    'rollup',
    'rollup-plugin-node-resolve',
    'rollup-plugin-commonjs',
    'rollup-plugin-json',
    'rollup-plugin-terser',
    typeScript && 'rollup-plugin-typescript'
  ]

  const webpackDependencies = [
    'webpack',
    'webpack-cli'
  ]

  if (useRollup) {
    allDependencies.dev.push(...rollupDependencies)
  }
  if (useWebpack) {
    allDependencies.dev.push(...webpackDependencies)
  }

  run(name, packageJson, allDependencies, useNpm, useYarn)
}

function run (name, packageJson, allDependencies, useNpm, useYarn) {
  install(
    path,
    allDependencies,
    useNpm,
    useYarn
  )
    .then(message => {
      console.log(chalk.green(message))
    })
    .catch(message => {
      console.log(chalk.red(message))
    })
}

function install (allDependencies, useNpm, useYarn) {
  // todo
  let command
  let args = []
  if (useYarn) {
    command = 'yarn'
  } else if (useNpm) {
    command = 'npm'
  }
  return new Promise((resolve, reject) => {

  })
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
