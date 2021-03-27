const XLSX = require('xlsx')

let keys = [];
let jsonArr = [];
let idIndex = 10000;
let sensitiveTypeArr = ["姓名", "照片", "性别", "籍贯", "证件号码", "出生日期", "文化水平", "婚姻状态", "手机号码", "车牌号码", "加密显示", "不加密显示"]

module.exports = contents => {
  keys = [];
  jsonArr = [];
  idIndex = 10000;
  let workbook = XLSX.read(contents, { type: "binary" });
  let sheetNames = workbook.SheetNames;
  let worksheet = workbook.Sheets[sheetNames[0]];
  const sheet2JSONOpts = {
    defval: "",
  };
  let tableArr = XLSX.utils.sheet_to_json(worksheet, sheet2JSONOpts);
  (tableArr.length > 0) && (keys = Object.keys(tableArr[0]));
  iterateGetTree(tableArr, 0);
  iterateGetJsonArr(tableArr);
  let permissonArr = jsonArr.filter(v => v.name);
  let jsonObj = {
    permissions: permissonArr
  }
  return JSON.stringify(jsonObj);
};

function iterateGetJsonArr(data) {
  if (!data || data.length === 0) {
    return;
  }
  for (let i = 0; i < data.length; i++) {
    let obj = {};
    obj.resourceId = data[i].name ? idIndex.toString() : (data[i].parentResourceId || "");
    obj.permissionId = data[i].name ? idIndex.toString() : (data[i].parentId || "");
    let tempType = "web_view";
    if (sensitiveTypeArr.some(v => v === data[i].name)) {
      tempType = "sensitive";
    }
    obj.resourceType = data[i].api ? "action" : tempType;
    obj.parentResourceType = data[i].parentResourceType || "web_view";
    obj.parentResourceId = data[i].parentResourceId || "0";
    obj.parentId = data[i].parentId || "0";
    data[i].api && (obj.action = data[i].api);
    obj.name = data[i].name;
    if (obj.action) {
      obj.operationOffset = i + 2;
    }
    // obj.operationOffset = i + 2;
    data[i].children.forEach(v => {
      v.parentResourceId = data[i].name ? idIndex.toString() : (data[i].parentResourceId || "");
      v.parentId = data[i].name ? idIndex.toString() : (data[i].parentId || "");
      v.parentResourceType = obj.resourceType;
    });
    jsonArr.push(obj);
    idIndex = idIndex + 1;
    iterateGetJsonArr(data[i].children);
  }
};

function iterateGetTree(data, index) {
  if (index > keys.length - 1) {
    return;
  }
  let temp = toTree(data, index);
  data.splice(0, data.length);
  data.push(...temp);
  index = index + 1;
  for (let item of data) {
    iterateGetTree(item.children, index);
  }
};

function toTree(data, index) {
  let result = [];
  for (let item of data) {
    if (!result.some((v) => v.name === item[keys[index]])) {
      if (keys[index] === "API") {
        let apiArr = item[keys[index]].split(";");
        apiArr && apiArr.forEach(v => {
          result.push({
            key: keys[index],
            name: v ? "restApi" : "",
            type: "API",
            api: v,
            children: [],
          });
        });
      } else {
        result.push({
          key: keys[index],
          name: item[keys[index]],
          type: item[keys[index]],
          api: "",
          children: [],
        });
      }
    }
  }
  for (let resultItem of result) {
    for (let dataItem of data) {
      if (dataItem[keys[index]] === resultItem.type && resultItem.type !== "API") {
        resultItem.children.push(dataItem);
      }
    }
  }
  return result;
};
