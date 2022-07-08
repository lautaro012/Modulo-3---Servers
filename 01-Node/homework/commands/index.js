const fs = require('fs');
const { findSourceMap } = require('module');
const request = require('request');

module.exports = {
    date: function (args, done) {
        done(Date())
      },
    pwd: function (args, done) {
      done(process.cwd());
      },
    ls: function (args, done) {
        fs.readdir('.', function(err, files) {
            if(err) throw err;
            let strfiles = '';
            files.forEach(function(file) {
                strfiles = strfiles + file + '\n'
            })
            done(strfiles)
        })
    },
    echo: function (args, done) {
        done(args.join(' '));
    },
    cat: function (args, done) {
        fs.readFile(args[0], function (err, data) {
            if (err) throw err;
            done(data);
        })
    },
    head: function (args, done) {
        fs.readFile(args[0], 'utf-8', function (err, data) {
            if (err) throw err;
            const firstlines = data.split('\n').slice(0, 10).join('\n')
           done(firstlines)

        })
    },
    tail: function (args, done) {
        fs.readFile(args[0], 'utf-8', function (err, data) {
            if (err) throw err;
            const lastlines = data.split('\n').slice(-10).join('\n')
            done(lastlines);
        })
    },
    curl: function(args, done) {
        request(args[0], function(err, response, body) {
            if (err) throw err;
            done(body);
        })
    }

}