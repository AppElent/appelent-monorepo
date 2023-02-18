import tokens_common from "./keys/common.json";
import tokens_satisfactory from "./keys/satisfactory.json";
import tokens_dashboard from "./keys/dashboard.json";

// const createPath = (obj, currentPath) => {
//     for (const key in obj) {
//       if (typeof obj[key] === 'object') {
//         createPath(obj[key], `${currentPath}.${key}`);
//       } else {
//         tokens[key] = `common:${currentPath}.${key}`;
//       }
//     }
//   };

//   function createPath(obj, path = []) {
//     if (typeof obj !== 'object') {
//       return path;
//     }
//     return Object.entries(obj).reduce((acc, [key, value]) => {
//       const newPath = [...path, key];
//       if (typeof value === 'object') {
//         return acc.concat(createPath(value, newPath));
//       }
//       acc.push(newPath);
//       return acc;
//     }, []);
//   }

function createPath(json, prefix = "") {
  let result = {};
  for (let key in json) {
    if (typeof json[key] === "object") {
      result[key] = createPath(json[key], prefix + key + ".");
    } else {
      result[key] = prefix + key;
    }
  }
  return result;
}

const tokens = createPath(tokens_common, "common:");

console.log(tokens);
const fs = require("fs");

fs.writeFileSync(
  "./result.js",
  `module.exports = ${JSON.stringify(result, null, 2)}`
);
