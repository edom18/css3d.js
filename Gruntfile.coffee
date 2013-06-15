module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        uglify:
            dist:
                files:
                    'js/<%= pkg.name %>.min.js': ['js/<%= pkg.name %>.js']

        jshint:
            files: ['js/*.js']
            options:
                console: true


        concat:
            options:
                separator: ';'
            dist:
                src: [
                    'js/*.js'
                ]
                dest: 'app.js'

        compass:
            dist:
                options:
                    sassDir: '_src/scss'
                    cssDir: 'css'

        coffee:
          compile:
            files:
              'js/<%= pkg.name %>.js': ['_src/coffee/*.coffee']

              #glob_to_multiple:
              #  expand: true
              #  cwd: '_src/coffee/'
              #  src: ['*.coffee']
              #  dest: 'js/'
              #  ext: '.js'

        copy:
            main:
                files: [
                    expand: true, flatten: true, cwd: '_src/coffee', src: ['*.coffee'], dest: 'js/'
                ]

        watch:
            files: ['_src/coffee/*.coffee', '_src/scss/*.scss']
            tasks: ['compass', 'coffee', 'uglify']


    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-compass'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-copy'

    grunt.registerTask 'default', ['compass', 'coffee', 'uglify']
