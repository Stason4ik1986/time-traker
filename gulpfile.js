'use strict'
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const del = require('del');
const imagegmin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){
    return gulp.src('app/sass/style.sass)')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});
gulp.task('styles', ['sass'], function () {
    return gulp.src('app/css/libs.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'));
});
gulp.task('scripts', function () {
    return gulp.src([
        'app/bower_components/angular.min.js',
        'app/bower_components/ngStorage.min.js'
    ])
        .pipe(concat('bower_components.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
});
gulp.task('clean', function(){
    return del.sync('dist');
});
gulp.task('clear', function(){
    return cache.clearAll();
});
gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagegmin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});
gulp.task('watch', ['browserSync', 'styles', 'sass'], function() {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/**/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});
gulp.task('build',['clean', 'img', 'sass', 'scripts'], function() {
    gulp.src([
        'app/css/main.css',
        'app/css/libs.min.css'
    ]).pipe(gulp.dest('dist/css'));
    gulp.src('app/bower_components/**/*')
        .pipe(gulp.dest('dist/bower_components'));
    gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
    gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));
    gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});
gulp.task('default', ['watch']);