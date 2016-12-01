BeFF ![Build Status](https://travis-ci.org/behance/BeFF.svg?branch=master)
====

Behance Frontend Framework

#### Documentation

[View the Docs](https://behance.github.io/BeFF)

You can manually generate the HTML documentation of our JSDoc blocks via:

`grunt docs`

That Grunt task will also push the generated html files to your fork's `gh-pages branch`

### Cutting a Release

 * Before cutting a new release, make sure your changes are *merged*, your *master* branch is *up to date (pull from upstream)*, and you're on your *`master`* branch.
 * To create a new release, use `npm version major`, `npm version minor`, or `npm version patch` to update package.json and create a release commit and git version tag. Do not `npm publish` (this is a private module).
 * Finally, use `git push upstream master --tags` (assuming your `upstream` is pointed at behance/poet) to push the version commit and tags to the Poet repo.
