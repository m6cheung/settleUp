module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    concat: {
      options: {
        seperator: ';'
      },
      dist: {
        src: ['client/app/**/*.js'],
        dest: 'client/dist/built.js'
      }
    },

    // mochaTest: {
    //   test: {
    //     options: {
    //       reporter: 'spec'
    //     },
    //     src: ['test/**/*.js']
    //   }
    // },

    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },

    uglify: {
      dist: {
        files: {
          'client/dist/built.min.js': ['client/dist/built.js']
        }
      }
    },

    // eslint: {
    //   target: [
    //     // Add list of files to lint here
    //     'app/**/*.js', 'lib/*.js', 'public/**/*.js', '*.js'
    //   ]
    // },

    // cssmin: {
    //   target: {
    //     files: [{
    //       expand: true,
    //       cwd: 'client',
    //       src: ['*.css'],
    //       dest: 'client/dist',
    //       ext: '.min.css'
    //     }]
    //   }
    // },

    watch: {
      scripts: {
        files: [
          'client/app/**/*.js',
          'client/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      }
      // css: {
      //   files: 'public/*.css',
      //   tasks: ['cssmin']
      // }
    },

    shell: {
      prodServer: {
        command: [
          'git add .',
          'git commit -m "Updating server" ',
          'git push live2 master'
        ].join('&&')
      }
    },
  });

  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // grunt.loadNpmTasks('grunt-eslint');
  // grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');




  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run(['shell']);
  });


  // grunt.registerTask('test', [
  //   'eslint', 'mochaTest'
  // ]);

  grunt.registerTask('build', [
    'concat', 'uglify', 'cssmin'
  ]);


  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      
      var nodemon = grunt.util.spawn({
        cmd: 'grunt',
        grunt: true,
        args: 'nodemon'
      });

      nodemon.stdout.pipe(process.stdout);
      nodemon.stderr.pipe(process.stderr);

    }
    grunt.task.run([ 'server-dev' ]);
  });

  grunt.registerTask('deploy', function () {
    if (grunt.option('prod')) {
      grunt.task.run(['build', 'shell']);
    } else {
      grunt.task.run(['test', 'build']);
    }
  });
    // add your deploy tasks here


};
