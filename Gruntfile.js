/* eslint-env node */
module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      watch: {
        reporters: ['mocha'],
        singleRun: false
      },
      single: {
        singleRun: true
      }
    },

    // Generates HTML JSDoc Documentation
    jsdoc: {
      dist: {
        src: ['**/*.js', '!Gruntfile.js', '!node_modules/**/*.js', '!test/**/*.js'],
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
        '!node_modules/**/*.js'
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

  grunt.registerTask('test', ['eslint', 'karma:watch']);
  grunt.registerTask('docs', ['jsdoc', 'gh-pages']);
  grunt.registerTask('travis', ['eslint', 'karma:single']);
  grunt.registerTask('default', ['test']);
};
