const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = dir => path.resolve(appDirectory, dir);

module.exports = {
  appRoot: appDirectory,
  appPackageJson: resolveApp('./package.json'),
  appIndex: resolveApp('./src/index.js'),
  appIndexTemplate: resolveApp('./public/index.html'),
  appPublic: resolveApp('./public'),
  appDist: resolveApp('./dist'),
  appSrc: resolveApp('./src'),
  appNodeModules: resolveApp('./node_modules')
};
