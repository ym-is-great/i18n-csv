# i18nCSV

- 解析 CSV 翻译文件
- 返回多语言 Object
- 输出各个语言的 `.json`、`.yml` 文件
- 字符串处理



## 安装

```
npm install i18n-csv --save-dev
```



## 解析

CSV 文件内容：

| Field name | en                     | zh-cn     | jp                    |
| ---------- | ---------------------- | --------- | --------------------- |
| title      | Hello World            | 你好世界  | こんにちは世界        |
| subtitle   | The weather is great ! | 天气真好! | 天_はとても良いです！ |

使用 i18nCSV 解析：

```js
const i18nCSV = require('i18n-csv')
i18nCSV.parse({ input: './file1.csv' })
```

返回的对象：

```js
{
  en: {
    title: 'Hello World',
    subtitle: 'The weather is great !'
  },
  'zh-cn': {
    title: '你好世界',
    subtitle: '天气真好!'
  },
  jp: {
    title: 'こんにちは世界',
    subtitle: '天_はとても良いです！'
  }
}
```



## 设置起始列

默认使用第 2 行为正文的起始行，第 2 列作为正文的起始列。

有时我们需要指定正文的起始列。例如，为了和翻译人员协作，我们需要在正文前面插入两列描述内容，但是不希望这两列被当作语言解析到对象中。

CSV 文件内容：

| Field name | Description(Chinese) | Description(English) | en                     | zh-cn     | jp                    |
| ---------- | -------------------- | -------------------- | ---------------------- | --------- | --------------------- |
| title      | 标题                 | main title           | Hello World            | 你好世界  | こんにちは世界        |
| subtitle   | 副标题               | subtitle             | The weather is great ! | 天气真好! | 天_はとても良いです！ |

此时可以使用 `startCol=4` 指定正文从第 4 列开始：

```js
i18nCSV.parse({ input: './file2.csv', startCol: 4 })
```

类似的，使用 `startRow` 可以设置正文的起始行。



## 设置语言代码

默认使用正文的列标题（第一行）作为语言代码：`en`、`zh-cn`、`jp`，并用作输出的文件名：`en.json`、`zh-cn.json`、`jp.json`。

当需要和其他同事，比如翻译或运营人员协作时，列标题应该更加友好、通俗易懂。此时可以用 `#` 设置语言代码。列标题中包含多个 `#` 时将始终使用最后一个 `#` 后的内容作为语言代码。

示例：

| Field name | English #en            | Chinese #zh-cn | Japanese #jp          |
| ---------- | ---------------------- | -------------- | --------------------- |
| title      | Hello World            | 你好世界       | こんにちは世界        |
| subtitle   | The weather is great ! | 天气真好!      | 天_はとても良いです！ |





## 输出

使用 `ouput` 指定输出目录，解析后会在目录下生成各个语言的 `.json` 文件。

```js
i18nCSV.parse({ input: './file1.csv', output: 'path/to/output' })
```

输出完毕打印的日志：

```
Multi-language files has been generated !

source:  ./file1.csv
output:  path/to/output
format:  JSON
```

如无意外，`path/to/output` 目录下已经新增了 `en.json` 、`zh-cn.json` 、`jp.json` 三个文件。

生成的 `en.json` 文件内容：

```json
// path/to/output/en.json
{
  "title": "Hello World",
  "subtitle": "The weather is great !"
}
```

使用 `saveAdYAML=true` 可以输出更简洁、易于修改的 YAML 格式：

```js
i18nCSV.parse({
  input: './file1.csv',
  output: 'path/to/output',
  saveAsYAML: true
})
```

生成的 `.yml` 文件内容：

```yaml
# path/to/output/en.yml
title: Hello World
subtitle: The weather is great !
```



## 替换

假设有 CSV 文件内容如下：

| Field name | en                      | zh-cn                    | jp                        |
| ---------- | ----------------------- | ------------------------ | ------------------------- |
| title      | Hello World             | 你好世界                 | こんにちは世界            |
| subtitle   | Share trips with #trips | 参与话题 #trips 分享旅程 | #trips とのシェアトリップ |

为了自定义文本中的 _#trips_  的样式，我们需要对文本进行一些处理。

`replace` 用于添加 __替换任务__，它的每一个元素都是一个任务。任务（数组）的第一个元素是被替换内容，可以是正则表达式或字符串，第二个元素是替换内容。

例如，将所有 `#trips` 用 `<hashtag>` 标签包裹起来：

```js
i18nCSV.parse({
  input: './file4.csv',
  replace: [
    [/(#\w+)/g, '<hashtag>$1</hashtag>']
  ]
})
```

返回的对象：

```js
{
  en: {
    title: 'Hello World',
    subtitle: 'Share trips with <hashtag>#trips</hashtag>'
  },
  'zh-cn': {
    title: '你好世界',
    subtitle: '参与话题 <hashtag>#trips</hashtag> 分享旅程'
  },
  jp: {
    title: 'こんにちは世界',
    subtitle: '<hashtag>#trips</hashtag> とのシェアトリップ'
  }
}
```

任务的第三个元素可以指定仅对某个字段有效：

```js
i18nCSV.parse({
  input: './file4.csv',
  replace: [
    [/(#\w+)/g, '<hashtag>$1</hashtag>', 'subtitle']
  ]
})
```



## 提示

1. CSV 文件的第一列始终作为每一行文本的 Key 。
2. CSV 文件的编码必须是 UTF-8 ，否则可能出现解析后的内容包含乱码。Mac 下转换编码：使用 Numbers 打开 CSV 文件，点击菜单中的 文件 > 导出到 > CSV，在“高级选项”中将“文本编码”修改为“UTF-8”后导出。