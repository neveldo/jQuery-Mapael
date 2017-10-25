module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['js/**/*.js', '!js/**/*.min.js']
        },
        uglify: {
            options: {
                compress: true,
                mangle: true,
                preserveComments: 'some',
                report: 'gzip'
            },
            build: {
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        src: ['js/**/*.js', '!js/**/*.min.js'],
                        ext: '.min.js',   // Dest filepaths will have this extension.
                        extDot: 'last'   // Extensions in filenames begin after the last dot
                    }
                ]
            }
        },
        qunit: {
            all: {
                options: {
                    urls: ['test/index.html']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('test', ['jshint', 'qunit']);
    grunt.registerTask('build', ['uglify']);
    grunt.registerTask('default', ['test', 'build']);
};
