BeFF ![Build Status](https://travis-ci.org/behance/BeFF.svg?branch=master)
====

Behance Frontend Framework

### Cutting a Release

 * Before cutting a new release, make sure your changes are *merged*, your *master* branch is *up to date (pull from upstream)*, and you're on your *`master`* branch.
 * To create a new release, use `npm version major`, `npm version minor`, or `npm version patch` to update package.json and create a release commit and git version tag.
 * Finally, use `git push upstream master --tags` (assuming your `upstream` is pointed at behance/BeFF) to push the version commit and tags to the BeFF repo.
 * Run `npm publish`
