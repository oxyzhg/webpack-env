const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = dir => path.resolve(appDirectory, dir);

module.exports = {
  // root
  appRoot: appDirectory,
  // node_modules dir
  appNodeModules: resolveApp('./node_modules'),
  // public dir
  appPublic: resolveApp('./public'),
  // dist dir
  appDist: resolveApp('./dist'),
  // src dir
  appSrc: resolveApp('./src'),
  // package.json
  appPackageJson: resolveApp('./package.json'),
  // entry:main
  appIndex: resolveApp('./src/index.js'),
  // output:main template
  appIndexTemplate: resolveApp('./public/index.html')
};
