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
                    urls: ['test/index.html?coverage=true&lcovReport']
                }
            }
        },
        coveralls: {
            options: {
                force: true
            },
            all: {
                src: '.coverage-results/core.lcov',
            }
        }
    });

    grunt.event.on('qunit.report', function(data) {
        grunt.file.write('.coverage-results/core.lcov', data);
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-coveralls');

    grunt.registerTask('test', ['jshint', 'qunit']);
    grunt.registerTask('build', ['uglify']);
    grunt.registerTask('default', ['test', 'build']);
};
