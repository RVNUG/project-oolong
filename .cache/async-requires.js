// prefer default export if available
const preferDefault = m => m && m.default || m

exports.components = {
  "component---node-modules-gatsby-plugin-offline-app-shell-js": () => import("/Users/derek/dev/rvnug/project-oolong/node_modules/gatsby-plugin-offline/app-shell.js" /* webpackChunkName: "component---node-modules-gatsby-plugin-offline-app-shell-js" */),
  "component---src-pages-404-js": () => import("/Users/derek/dev/rvnug/project-oolong/src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */),
  "component---src-pages-generic-js": () => import("/Users/derek/dev/rvnug/project-oolong/src/pages/generic.js" /* webpackChunkName: "component---src-pages-generic-js" */),
  "component---src-pages-index-js": () => import("/Users/derek/dev/rvnug/project-oolong/src/pages/index.js" /* webpackChunkName: "component---src-pages-index-js" */)
}

exports.data = () => import("/Users/derek/dev/rvnug/project-oolong/.cache/data.json")

