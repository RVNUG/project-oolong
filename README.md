# Roanoke Valley .NET User Group website.

Based on the Stellar site template, designed by HTML5 UP. Check out [https://codebushi.com/gatsby-starters/](https://codebushi.com/gatsby-starters/) for more Gatsby starters and templates.

Build Status
[![CircleCI](https://circleci.com/gh/RVNUG/project-oolong.svg?style=svg)](https://circleci.com/gh/RVNUG/project-oolong)

## Running the site for local development

This site uses gatsby js. You can run the gatsby build and development webserver by executing the following command.

```shell
npm run develop
```


## Deployment to production

The RVNUG website is hosted on Github Pages. To deploy you must have permission to commit to the gh-pages branch.
Deployments are automated using the [gh-pages](https://www.npmjs.com/package/gh-pages) npm module.

To deploy whatever is in the current active branch on your machine run the following command.

```shell
npm run deploy
```

This will run the gatsby build and then commit the built files to the gh-pages branch and push that to the remote origin (github.com).
