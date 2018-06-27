const fs = require('fs')
const path = require('path')
const csvParse = require('csv-parse/lib/sync')
const jsonfile = require('jsonfile')
const writeYamlFile = require('write-yaml-file')
const chalk = require('chalk')

const mkdirIfNotExists = function (dirPath) {
  const list = dirPath.split('/')
  let temp = []
  list.forEach(item => {
    temp.push(item)
    const path = temp.join('/')
    !fs.existsSync(path) && fs.mkdirSync(path)
  })
}

const getLang = function (colHeader) {
  const hashIndex = colHeader.lastIndexOf('#')
  return hashIndex >= 0 ? colHeader.slice(hashIndex + 1) : colHeader
}

const handleText = function (key, string, tasks = []) {
  string = string.replace(/[\r\n]/g, '')
  tasks.forEach(item => {
    if (!item[2] || item[2] === key) string = string.replace(item[0], item[1])
  })
  return string
}

const printLog = function (input, output, format) {
  console.log(chalk.cyan('Multi-language files has been generated !\n'))
  console.log('source: ', input)
  console.log('output: ', output)
  console.log('format: ', format, '\n')
}

module.exports = {

  parse ({ input, output, startRow, startCol, saveAsYAML, replace }) {

    if (!input) throw 'Missing parameter options.input !'

    if (!fs.existsSync(input)) throw `File not found: ${input}`

    const data = csvParse(fs.readFileSync(input))

    const countRows = data.length
    const countCols = data[0].length
    const i18nData = {}

    for (let col = startCol !== undefined ? startCol - 1 : 1; col < countCols; col++) {
      const lang = getLang(data[0][col])
      const list = {}
      for (let row = startRow !== undefined ? startRow - 1 : 1; row < countRows; row++) {
        const key = data[row][0]
        list[key] = handleText(key, data[row][col], replace)
      }
      i18nData[lang] = list
    }

    if (output) {
      mkdirIfNotExists(output)
      console.log('\nStart output ...\n')
      let format = null
      if (saveAsYAML) {
        format = 'YAML'
        for (lang in i18nData) {
          const filePath = path.join(output, lang + '.yml')
          writeYamlFile.sync(filePath, i18nData[lang])
        }
      } else {
        format = 'JSON'
        for (lang in i18nData) {
          const filePath = path.join(output, lang + '.json')
          jsonfile.writeFileSync(filePath, i18nData[lang], { spaces: 2 })
        }
      }
      printLog(input, output, format)
    }

    return i18nData

  }

}
