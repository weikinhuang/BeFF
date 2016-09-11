BeFF ![Build Status](https://travis-ci.org/behance/BeFF.svg?branch=master)
====

Behance Frontend Framework

#### Documentation

[View the Docs](https://behance.github.io/BeFF)

You can manually generate the HTML documentation of our JSDoc blocks via:

`grunt docs`

That Grunt task will also push the generated html files to your fork's `gh-pages branch`

### Cutting a Release

1. `npm version <version number>`
1. `git push upstream master --follow-tags`
1. `npm publish`
1. Edit the release at https://github.com/behance/BeFF/releases