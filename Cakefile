fs = require 'fs'
util = require 'util'
{spawn, exec} = require 'child_process'
 
option '-o', '--output [DIR]', 'Output directory.'
option '-t', '--target [DIR]', 'Watch target directory.'
 
stdout_handler = (data) ->
    console.log data.toString().trim()

fileCopy = ->

    dirname = 'js'
    fs.readdir dirname, (err, filelist) ->
        for filename in filelist
            if /.*\.coffee$/.test filename
                rio = fs.createReadStream "#{dirname}/#{filename}"
                wio = fs.createWriteStream "js/#{filename}"
                util.pump rio, wio

        return
 
build = (watch, output = 'js', target = 'js') ->
    console.log 'Watching coffee scripts'
    console.log "Watch to #{target}"
 
    options = ['-cmb', '-o', output, target]

    if watch is true
        options[0] = '-cmbw'
 
    coffee = spawn 'coffee', options
    coffee.stdout.on 'data', (data) ->
        #fileCopy()
        stdout_handler data
 
style = (watch) ->
    console.log 'Watching compass files.'

    options = ['compile']

    if watch is true
        options = ['watch']

    compass = spawn 'compass', options
    compass.stdout.on 'data', (data) -> stdout_handler
    compass.stderr.on 'data', (data) -> stdout_handler

 
task 'build', 'build the project', (watch) ->
    build watch
 
task 'watch', 'watch for changes and rebuild', (options) ->
    build true, options.output, options.target
    style true

task 'copy', 'copy coffee file.', ->
    fileCopy()
