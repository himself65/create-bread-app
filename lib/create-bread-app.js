const DEBUG_NAME = 'bread'
const path = require('path')
const fs = require('fs-extra')
const debug = require('debug')(DEBUG_NAME)
const spawn = require('cross-spawn')
const validateProjectName = require('validate-npm-package-name')
const commander = require('commander')
const chalk = require('chalk').default

const utilsHelpers = require('./utils/helpers')
const packageJson = require('../package.json')

let projectName = null

// todo
const command = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .action(name => {
    projectName = name
  })
  .option('--template, -t <item>')
  .option('--useWebpack, -webpack')
  .option('--useRollup, -rollup')
  .option('--useTypeScript, -ts')
  .option('--use-npm, -npm')
  .option('--use-yarn, -yarn')
  .option('--debug', 'open debug logs')
  .allowUnknownOption()
  .on('--help', () => {
    console.log(`    Only ${chalk.green('<project-directory>')} is required.`)
    console.log()
  })
  .parse(process.argv)

if (command.debug) {
  process.env.debug = DEBUG_NAME
}

debug(
  'commands',
  command.useWebpack,
  command.useRollup,
  command.useTypeScript,
  command.useNpm,
  command.useYarn
)

if (command.template) {
  // copy a exits template
} else {
  // generate new template
  createApp(projectName,
    command.useWebpack,
    command.useRollup,
    command.useTypeScript,
    command.useNpm,
    command.useYarn
  )
}

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
  fs.ensureDirSync(root)

  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true,
    bread: { // bread config
      files: []
    }
  }

  const allDependencies = {
    dev: [
      '@types/node',
      '@types/jest',
      '@babel/core',
      '@babel/preset-env'
    ],
    prod: [
      'cross-env',
      'rimraf'
    ]
  }

  packageJson.bread.files.concat([
    'babel.config.js',
    'jest.config.js'
  ])
  if (typeScript) {
    allDependencies.dev.concat([
      'typescript',
      'tslint'
    ])
    packageJson.bread.files.concat([
      'tslint.json',
      'tsconfig.json'
    ])
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
    'webpack-cli',
    'webpack-chain',
    'babel-loader',
    typeScript && 'ts-loader'
  ]

  if (useRollup) {
    allDependencies.dev.concat(rollupDependencies)
    packageJson.bread.files.concat(['build/webpack'])
  }
  if (useWebpack) {
    allDependencies.dev.concat(webpackDependencies)
    packageJson.bread.files.concat(['build/rollup'])
  }
  packageJson.devDependencies = allDependencies.dev
  packageJson.dependencies = allDependencies.prod
  debug(root, name)
  run(root, name, packageJson, allDependencies, useNpm, useYarn)
}

function run (root, name, packageJson, allDependencies, useNpm, useYarn) {
  utilsHelpers.createPackageJson(root, name, packageJson)
  utilsHelpers.copyDir(root, packageJson)
  process.chdir(root)
  install(
    root,
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

function install (path, allDependencies, useNpm, useYarn) {
  // todo
  let command
  let installCommand
  let devCommand
  if (useYarn) {
    command = 'yarn'
    installCommand = 'add'
    devCommand = '--dev'
  } else if (useNpm) {
    command = 'npm'
    installCommand = 'install'
    devCommand = '--save-dev'
  }
  const _install = (args, arr) => {
    return new Promise((resolve, reject) => {
      const child = spawn(command, [].concat(args).concat(arr), { stdio: 'inherit', cwd: path })
      child.on('close', code => {
        if (code !== 0) {
          reject(
            new Error(`${command} ${args.join(' ')}`)
          )
          return
        }
        resolve()
      })
    })
  }
  return _install([installCommand], allDependencies.prod)
    .then(() => _install([installCommand, devCommand], allDependencies.dev)
      .then(null))
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

exports.DEBUG_NAME = DEBUG_NAME
