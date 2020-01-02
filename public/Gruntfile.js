module.exports = function (grunt) {
    grunt.file.setBase('../');

    grunt.initConfig({
        pgk: grunt.file.readJSON('package.json'),
        typescript: {
            default: grunt.file.readJSON('./public/tsconfig.json')
        },
        browserify: {
            default: {
                files: {
                    "./public/app/build/src.js": './public/app/build/ts/*.js'
                }
            }
        },
        uglify: {
            default: {
                files: {
                    './public/app/build/src.min.js': ['./public/app/build/src.js']
                }
            }
        },
        watch: {
            default: {
                files: ["./public/app/src/*.ts", "./public/index.html"],
                tasks: ["simplify"],
                options: {
                    ecma: 8,
                    interrupt: true,
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("production", ['browserify', 'uglify']);
    grunt.registerTask('development', ['browserify', 'watch']);

    grunt.registerTask('default', 'development');
};