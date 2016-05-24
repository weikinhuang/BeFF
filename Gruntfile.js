/* jshint node: true */
module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: true
      },
      test: [
        '**/*.js',
        '!node_modules/**/*.js',
        '!bower_components/**/*.js',
        '!test/lib/**/*.js',
      ]
    },
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

    jscs: {
      src: [
        '**/*.js',
        '!bower_components/**/*.js',
        '!node_modules/**/*.js',
        '!Gruntfile.js',
        '!test/lib/**/*.js'
      ],
      options: {
        config: '.jscsrc',
      }
    },

    'gh-pages': {
      options: {
        base: 'docs/html',
        message: 'Docs'
      },
      src: '**/*'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('test', ['jshint', 'karma:persistent']);
  grunt.registerTask('docs', ['jsdoc', 'gh-pages']);
  grunt.registerTask('travis', ['jshint', 'jscs', 'karma:multi']);
  grunt.registerTask('default', ['test']);
};
