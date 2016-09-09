/* jshint node: true */
module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    karma: {
      options: {
        configFile: 'test/lib/karma.conf.js',
        singleRun: true
      },
      watch: {
        browsers: ['PhantomJS'],
        reporters: ['mocha'],
        singleRun: false
      },
      persistent: {
        browsers: ['Firefox'],
        singleRun: false
      },
      single: {
        browsers: ['PhantomJS']
      },
      multi: {
        reporters: ['dots'],
        browsers: ['PhantomJS']
      }
    },

    // Generates HTML JSDoc Documentation
    jsdoc: {
      dist: {
        src: ['**/*.js', '!Gruntfile.js', '!node_modules/**/*.js', '!bower_components/**/*.js', '!test/**/*.js'],
        options: {
          destination: 'docs/html',
          template: 'node_modules/ink-docstrap/template',
          configure: './docs/jsdoc.conf.json'
        }
      }
    },

    eslint: {
      src: [
        '**/*.js',
        '!bower_components/**/*.js',
        '!node_modules/**/*.js',
        '!Gruntfile.js',
        '!test/lib/**/*.js'
      ]
    },

    'gh-pages': {
      options: {
        base: 'docs/html',
        message: 'Docs'
      },
      src: '**/*'
    }
  });


  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('test', ['eslint', 'karma:persistent']);
  grunt.registerTask('docs', ['jsdoc', 'gh-pages']);
  grunt.registerTask('travis', ['eslint', 'karma:multi']);
  grunt.registerTask('default', ['test']);
};
