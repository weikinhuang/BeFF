/* jshint node: true */
module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: [
          'Gruntfile.js'
        ]
      },
      test: [
        '*.js',
        'Component/**/*.js',
        'Controller/**/*.js',
        'View/**/*.js',
        'trait/**/*.js',
        'util/**/*.js',
        'ux/**/*.js'
      ]
    },
    karma: {
      options: {
        configFile: 'test/lib/karma.conf.js',
        singleRun: true
      },
      persistent: {
        browsers: null,
        singleRun: false
      },
      single: {
        browsers: ['PhantomJS']
      },
      multi: {
        reporters: ['dots'],
        browsers: ['PhantomJS', 'Firefox'/*, 'Chrome'*/]
      }
    },
    jsdoc: {
      dist: {
        src: ['**/*.js', '!Gruntfile.js', '!node_modules/**/*.js', '!bower_components/**/*.js', '!test/**/*.js'],
        options: {
            destination: 'docs'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['jshint', 'karma:persistent']);
  grunt.registerTask('docs', ['jsdoc']);
  grunt.registerTask('travis', ['jshint', 'karma:multi']);
  grunt.registerTask('default', ['test']);
};
