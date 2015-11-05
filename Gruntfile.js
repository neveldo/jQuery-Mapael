module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['js/jquery.mapael.js', 'js/maps/france_departments.js', 'js/maps/usa_states.js', 'js/maps/world_countries.js']
        },
        uglify: {
            options: {
                compress: true,
                mangle: true,
                preserveComments: 'some',
                report: 'gzip'
            },
            build: {
                files: {
                    'js/jquery.mapael.min.js': ['js/jquery.mapael.js'],
                    'js/maps/france_departments.min.js': ['js/maps/france_departments.js'],
                    'js/maps/usa_states.min.js': ['js/maps/usa_states.js'],
                    'js/maps/world_countries.min.js': ['js/maps/world_countries.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint', 'uglify']);
};