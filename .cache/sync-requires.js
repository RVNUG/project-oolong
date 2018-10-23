// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---node-modules-gatsby-plugin-offline-app-shell-js": preferDefault(require("/Users/derek/dev/rvnug/project-oolong/node_modules/gatsby-plugin-offline/app-shell.js")),
  "component---src-pages-404-js": preferDefault(require("/Users/derek/dev/rvnug/project-oolong/src/pages/404.js")),
  "component---src-pages-generic-js": preferDefault(require("/Users/derek/dev/rvnug/project-oolong/src/pages/generic.js")),
  "component---src-pages-index-js": preferDefault(require("/Users/derek/dev/rvnug/project-oolong/src/pages/index.js"))
}

