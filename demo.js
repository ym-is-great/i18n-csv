const fs = require('fs')
const csv = require('csv')

const path = 'file.csv'

if (fs.existsSync(path)) {
  fs.readFile(path, (err, data) => {
    if (err) throw err
    csv.parse(data, (err, data) => {
      if (err) throw err
      let i18nData = {}
      // 遍历列（语言）
      for (let i = 3; i < data[0].length; i++) {
        const lang = data[0][i]
        i18nData[lang] = {}
        // 遍历行（文本键值对）
        for (let j = 1; j < data.length; j++) {
          const key = data[j][0]
          i18nData[lang][key] = data[j][i]
        }
      }
      console.log(i18nData)
    })
  })
}