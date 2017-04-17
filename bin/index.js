#! /usr/bin/env node

const program = require('commander')
const join = require('path').join
const fs = require('fs')

const cwd = process.cwd()
let componentName

program
  .version(require('../package').version)
  .usage('<component-name> [--options]')
  .action(name => componentName = name)
  .option('-c, --class', 'create a ES6 class based component')
  .option('-f, --folder', 'create component with folder')
  .parse(process.argv)

if (!componentName) {
  program.help()
} else {
  componentName = componentName[0].toUpperCase() + componentName.slice(1)

  if (
    fs.existsSync(join(cwd, componentName)) ||
    fs.existsSync(join(cwd, `${componentName}.jsx`))
  ) {
    console.warn(`Component '${componentName}' already exists`);
    process.exit(1)
  }

  const srcFile = program.class ? 'Class.jsx': 'Func.jsx'
  fs.readFile(join(__dirname, '..', 'boilerplates', srcFile), 'utf8', (err, data) => {
    if (err) throw err

    data = data.replace(/\$\$COMPONENT/g, componentName)
    write(componentName, data)
  })
}

function write(componentName, data) {
  const base = [cwd]

  if (program.folder) {
    fs.mkdirSync(componentName)
    base.push(componentName)
  }

  [
    { suffix: '.jsx', data },
    { suffix: '.scss', data: '' },
  ].map(({ suffix, data }) => {
    const filePath = join.apply(
      null,
      base.slice().concat(componentName + suffix)
    )
    fs.writeFileSync(filePath, data)
  })

  console.log('Success')
}
