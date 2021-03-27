const fs = require('fs')
const path = require('path')
const genPermission = require('./genpermisson')

/**
 * 将指定路径的 md 文件转换为 png
 * @param {string} input 输入文件的路径（可能是相对路径，也可能是绝对）
 * @param {object} param1
 */
module.exports = async (input, { output, title }) => {
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof input}`)
  }

  // 1. 读取 input 文件所对应的文件内容
  const filename = path.resolve(input) // 内部自动基于 process.cwd()
  // 判断文件存在 + 判断是文件还是文件夹
  if (!fs.existsSync(filename)) {
    throw new Error('文件路径不存在')
  }

  const stat = fs.statSync(filename)
  if (stat.isDirectory()) {
    throw new Error('给定路径是一个文件夹，而不是文件')
  }

  const contents = fs.readFileSync(filename, 'binary')
  const json = genPermission(contents)
  fs.writeFile(`${output}/${title}.json`, json, (err) => {
    console.log(`${title}.json生成成功了`)
  })

}