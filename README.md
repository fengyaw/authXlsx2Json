# 说明

这是一个专门用于将广拓云平台的产品部门提供的权限功能excel表格，转换成前端所需要的json文件的cli工具。

## 使用方式

1. 安装依赖：

   ```
   npm install authxlsx2json
   ```

2. 命令行输入authxlsx2json+你的权限表格的路径，回车执行，例如：

   ```
   authxlsx2json .\权限模板.xlsx
   ```

3. 根据命令行提示输入你要输出的路径和json的文件名，如：

   ```
   ? 输出json文件路径 ./
   ? 输出json文件的文件名 permission
   ```

4. 回车执行即可生成权限json文件。

5. excel模板和json文件示例请直接查看根目录。

