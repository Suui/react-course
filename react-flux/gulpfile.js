'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');        // Runs local dev server
const open = require('gulp-open');              // Open url in a web browser
const browserify = require('browserify');       // Bundles JS
const reactify = require('reactify');           // Transforms React JSX to JS
const source = require('vinyl-source-stream');  // Use conventional text streams with gulp
const concatCss = require('gulp-concat-css');   // Concatenates files


const config = {
    port: 9005,
    devBaseUrl: 'http:localhost',
    paths: {
        html: './src/*.html',
        css: [
            './node_modules/bootstrap/dist/css/boostrap.min.css',
            './node_modules/bootstrap/dist/css/boostrap-theme.min.css',
            '/.src/**/*.css'
        ],
        js: './src/**/*.js',
        mainJs: './src/main.js',
        dist: './dist'
    }
}

// Start a local development server
gulp.task('connect', () => {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task('open', ['connect'], () => {
    gulp.src('dist/index.html')
        .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
});

gulp.task('html', () => {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('css', () => {
    gulp.src(config.paths.css)
        .pipe(concatCss('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'));
});

gulp.task('js', () => {
    browserify(config.paths.mainJs).transform(reactify)
                                   .bundle()
                                   .on('error', console.error.bind(console))
                                   .pipe(source('bundle.js'))
                                   .pipe(gulp.dest(config.paths.dist + '/scripts'))
                                   .pipe(connect.reload());
})

gulp.task('watch', () => {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
});

gulp.task('default', ['html', 'css', 'js', 'open', 'watch']);
