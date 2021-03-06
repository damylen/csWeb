// Karma configuration
// Generated on Wed Jun 03 2015 16:17:08 GMT+0200 (W. Europe Daylight Time)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '..',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'example/public/bower_components/jquery/dist/jquery.min.js',
            'example/public/bower_components/bootstrap/dist/js/bootstrap.min.js',
            'example/public/bower_components/angular/angular.min.js',
            'example/public/bower_components/angular-cookies/angular-cookies.min.js',
            'example/public/bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'example/public/bower_components/angular-translate/angular-translate.min.js',
            'example/public/bower_components/leaflet/dist/leaflet.js',
            'example/public/bower_components/leaflet.locatecontrol/src/L.Control.Locate.js',
            'example/public/bower_components/leaflet-ajax/dist/leaflet.ajax.min.js',
            'example/public/bower_components/leaflet.markercluster/dist/leaflet.markercluster.js',
            'example/public/bower_components/angular-bootstrap/ui-bootstrap.min.js',
            'example/public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'example/public/bower_components/angular-utils-pagination/dirPagination.js',
            'example/public/bower_components/angular-local-storage/dist/angular-local-storage.min.js',
            'example/public/bower_components/angular-sanitize/angular-sanitize.min.js',
            'example/public/bower_components/angular-mocks/angular-mocks.js',
            'example/public/bower_components/angular-ui-select/dist/select.js',
            'example/public/bower_components/chroma-js/chroma.min.js',
            'example/public/bower_components/d3/d3.min.js',
            'example/public/bower_components/d3-tip/index.js',
            'example/public/bower_components/crossfilter/crossfilter.min.js',
            'example/public/bower_components/dcjs/dc.min.js',
            'example/public/bower_components/async/lib/async.js',
            'example/public/bower_components/jquery-ui/jquery-ui.min.js',
            'example/public/bower_components/underscore/underscore-min.js',
            'example/public/bower_components/moment/min/moment.min.js',
            'example/public/bower_components/spectrum/spectrum.js',
            'example/public/bower_components/topojson/topojson.js',
            'example/public/cs/js/togeojson.js',
            'example/public/cs/js/locationfilter.js',
            'example/public/cs/js/angular-spectrum-colorpicker.min.js',
            'example/public/cs/js/stringformat-1.09.min.min.js',
            'example/public/cs/js/stringformat.nl-NL.min.js',
            'example/public/cs/js/xbbcode.min.js',
            'example/public/cs/js/jquery.cookies.min.js',
            'example/public/cs/js/pnotify.custom.min.js',
            'example/public/cs/js/jqueryinjectCSS.min.js',
            'example/public/cs/js/timeline.min.js',
            'example/public/cs/js/wizMarkdown.min.js',
            'csComp/js/**/*.js',
            'example/public/app/app.js',
            'example/public/cs/js/csTemplates.js',
            'test/csComp/spec/**/*.js',
            'test/csComp/mock/**/*.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'csComp/js/**/*.js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // Which plugins to enable
        plugins: [
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage'
        ],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
