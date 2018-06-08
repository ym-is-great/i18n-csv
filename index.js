const fs = require('fs')
const path = require('path')
const parse = require('csv-parse')
const jsonfile = require('jsonfile')
const writeYamlFile = require('write-yaml-file')

module.exports = {

  parse ({ input, output, startRow, startCol, saveAsYAML }) {

    if (!input) throw 'Missing parameter options.input !'

    if (!fs.existsSync(input)) throw `File not found: ${input}`

    return new Promise((resolve, reject) => {
      parse(fs.readFileSync(input), (err, data) => {
        if (err) throw err

        const countRows = data.length
        const countCols = data[0].length
        const i18nData = {}

        for (let col = startCol ? startCol - 1 : 1; col < countCols; col++) {
          const lang = data[0][col]
          const list = {}
          for (let row = startRow ? startRow - 1 : 1; row < countRows; row++) {
            const key = data[row][0]
            list[key] = data[row][col]
          }
          i18nData[lang] = list
        }

        if (output) {
          !fs.existsSync(output) && fs.mkdirSync(output)
          if (saveAsYAML) {
            for (lang in i18nData) {
              const filePath = path.join(output, lang + '.json')
              jsonfile.writeFileSync(filePath, i18nData[lang], { spaces: 2 })
            }
          } else {
            for (lang in i18nData) {
              const filePath = path.join(output, lang + '.yml')
              writeYamlFile.sync(filePath, i18nData[lang])
            }
          }
        }
        resolve(i18nData)
        // return i18nData
      })
    })
  }

}