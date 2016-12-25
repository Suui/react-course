'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');        // Runs local dev server
const open = require('gulp-open');              // Open url in a web browser
const browserify = require('browserify');       // Bundles JS
const reactify = require('reactify');           // Transforms React JSX to JS
const source = require('vinyl-source-stream');  // Use conventional text streams with gulp
const concat = require('gulp-concat-css');      // Concatenates files
const lint = require('gulp-eslint');

const config = {
    port: 9005,
    devBaseUrl: 'http:localhost',
    paths: {
        html: './src/*.html',
        css:  [
            './src/**/*.css',
            './node_modules/bootstrap/dist/css/bootstrap.min.css',
            './node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
            './node_modules/toastr/toastr.css'
        ],
        js: './src/**/*.js',
        mainJs: './src/main.js',
        images: './src/images/*',
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
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'))
        .pipe(connect.reload());
});

gulp.task('js', () => {
    browserify(config.paths.mainJs).transform(reactify)
                                   .bundle()
                                   .on('error', console.error.bind(console))
                                   .pipe(source('bundle.js'))
                                   .pipe(gulp.dest(config.paths.dist + '/scripts'))
                                   .pipe(connect.reload());
});

gulp.task('lint', () => {
    return gulp.src(config.paths.js)
        .pipe(lint({ configFile: 'eslint.config.json'}))
        .pipe(lint.format());
});

gulp.task('images', () => {
    gulp.src(config.paths.images)
        .pipe(gulp.dest(config.paths.dist + '/images'))
        .pipe(connect.reload());

    gulp.src('./src/favicon.ico')
        .pipe(gulp.dest(config.paths.dist));
});

gulp.task('watch', () => {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.css, ['css']);
    gulp.watch(config.paths.images, ['images']);
    gulp.watch(config.paths.js, ['js', 'lint']);
});

gulp.task('default', ['html', 'css', 'js', 'lint', 'images', 'open', 'watch']);
