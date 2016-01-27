var path = require('path');
var webpack = require('webpack');
var webpackProd = require('./webpack.prod.config');
var webpackServer = require('./webpack.server.config');
var _ = require('lodash');
var nconf = require('./controllers/configureNconf')();


var webpackServerProd = _.assign(_.clone(webpackServer), {
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {comments: false}
    })
  ]
});

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    nodemon: {
      default: {
        script: 'server.js',
        options: {
          watch: ['server.js', 'controllers', 'lib', 'middleware', 'public/dist/js/server-bundle.js']
        }
      },
      test: {
        script: 'server.js',
        options: {
          env: {
            NODE_ENV: 'test',
            PORT: '3700'
          },
          watch: ['server.js', 'controllers', 'lib', 'middleware']
        }
      }
    },
    compass: {
      options: {
        sassDir: 'public/sass',
        cssDir: 'public/dist/css',
        outputStyle: 'expanded',
        importPath: ["./"],
        relativeAssets: true,
        bundleExec: true
      },
      dist: {},
      watch: {
        options: {
          watch: true
        }
      },
      prod: {
        options: {
          outputStyle: 'compressed'
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: ['public/js/*.js', 'public/js/**/*.js'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['views/index.html', 'views/*.html', 'views/**/*.html', '!views/build.html', 'public/**/*.css'],
        tasks: [],
        options: {
          livereload: true
        }
      },

      components: {
        files: ['views/imports/polymer-components.html'],
        tasks: ['vulcanize:dist'],
        options: {
          livereload: true,
          interrupt: true
        }
      },
      server: {
        files: ['.rebooted'],
        tasks: [],
        options: {
          livereload: true
        }
      }
    },

    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      tasks: ['shell:webpack-client', 'shell:webpack-server', 'compass:watch', 'watch', 'nodemon'],
      front: {
        tasks: ['watch']
      },
    },

    shell: {
      mongo: {
        command: 'mkdir -p ./data/db && mongod --dbpath ./data/db',
        options: {
          async: true,
          stdout: false,
          failOnError: false
        }
      },

      'webpack-client': {
        command: 'webpack-dev-server --hot --output-public-path http://localhost:8080/public/dist/js/ --progress --colors --inline',
        options: {
          stdout: true,
          execOptions: {
            maxBuffer: 2000 * 1024
          }
        }
      },
      'webpack-server': {
        command: 'webpack --config webpack.server.config --watch',
        options: {
          stdout: true,
          execOptions: {
            maxBuffer: 2000 * 1024
          }
        }
      },
      'webpack-init': {
        command: 'cp default.stats.generated.json public/dist/js/stats.generated.json && webpack --config webpack.server.config'
      },
      'map-init': {
        command: 'node scripts/rollbar-map.js'
      }
    },

    notify_hooks: {
      options: {
        enabled: true,
        duration: 3 // the duration of notification in seconds, for `notify-send only
      },
    },

    notify: {
      rebuild: {
        options: {
          title: "Rebuilt",
          message: 'Code has been rebuilt'
        }
      }
    },

    webpack: {
      serverProd: webpackServerProd,
      prod: webpackProd
    },

    mkdir: {
      vulcanize: {
        options: {
          create: ["public/dist/html"]
        }
      },
      webpack: {
        options: {
          create: ["public/dist/js"]
        }
      }
    },

    vulcanize: {
      dist: {
        options: {
          inlineCss: true,
          stripComments: true,
          stripExcludes: ["paper-ripple-behavior"]
        },
        files: {
          'public/dist/html/components.html': 'views/imports/polymer-components.html'
        }
      },
    },
    clean: ['public/dist/*'],

    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: /\.\.\/\.\.\//g,
            }
          ],
          usePrefix: false
        },
        files: [
          {
            expand: true,
            flaten: true,
            src: ['public/dist/html/components.html'],
            dest: '.'
          }
        ]
      }
    },
  });

  grunt.registerTask('replace-static', function() {
    if (nconf.get("NODE_ENV") === "local_production") {
      return;
    }
    switch (nconf.get("NODE_ENV")) {
      case 'staging':
        grunt.config.set('replace.dist.options.patterns.0.replacement', 'http://d35c1uuh677ymk.cloudfront.net/');
        break;
      case 'production':
        grunt.config.set('replace.dist.options.patterns.0.replacement', 'http://static.app.kinetic.fitness/')
        break;
      default:
        grunt.fail.fatal("Invalid NODE_ENV name: " + nconf.get("NODE_ENV") + ".  Must be one of: 'staging' or 'production'.  Replace can't be run from 'local'");
    }
    grunt.task.run('replace:dist');
  });

  grunt.registerTask('default', function(){
    switch (nconf.get("NODE_ENV")) {
      case 'local':
        grunt.log.writeln("Running local configuration");
        grunt.task.run(['clean', 'mkdir:webpack', 'shell:webpack-init', 'mkdir:vulcanize', 'vulcanize:dist', 'concurrent']);
        break;
      case 'local_production':
      case 'staging':
      case 'production':
        grunt.log.writeln("Running server configuration");
        grunt.task.run(['clean', 'compass:prod', 'mkdir:webpack', 'mkdir:vulcanize', 'vulcanize:dist',  'replace-static', 'webpack:prod', 'webpack:serverProd', 'shell:map-init']);
        break;
      default:
        grunt.fail.fatal("Invalid NODE_ENV name: " + nconf.get("NODE_ENV") + ".  Must be one of: 'local', 'staging', or 'production'");
    }
  });
};