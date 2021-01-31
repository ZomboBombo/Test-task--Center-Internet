'use strict';


const gulp = require('gulp');

// --- Вспомогательные утилиты ---
const rename = require('gulp-rename');
var del = require("del");
var svgstore = require("gulp-svgstore");

// --- Препроцессорные утилиты ---
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');

// --- CSS-утилиты ---
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');

// --- JS-утилиты ---
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const pipeline = require('readable-stream').pipeline;

// --- HTML-утилиты ---
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var htmlmin = require("gulp-htmlmin");

// --- Серверные утилиты ---
const server = require('browser-sync').create();



/*
=====================================================
----------------------- ТАСКИ -----------------------
=====================================================
*/

// *** Обработка всех стилевых SCSS-файлов и превращение в CSS ***
gulp.task('css', () => {
  return pipeline(
    gulp.src('source/sass/styles.scss'),
    plumber(),
    sourcemap.init(),
    sass(),
    postcss([
      autoprefixer()
    ]),
    gulp.dest('build/css'),
    csso(),
    rename('styles.min.css'),
    sourcemap.write('.'),
    gulp.dest('build/css'),
    server.stream()
  );
});


// *** Обработка JS-файлов ***
gulp.task("scripts", function () {
  return pipeline(
    gulp.src("source/js/**/*.js"),
    terser(),
    concat("scripts.min.js"),
    gulp.dest("build/js")
  );
});


// *** Сборка SVG-спрайта ***
gulp.task('sprite', () => {
  return pipeline(
    gulp.src('source/img/icon-*.svg'),
    svgstore({
      inlineSvg: true
    }),
    rename('sprite.svg'),
    gulp.dest('build/img')
  );
});


// *** Обработка HTML ***
gulp.task('html', () => {
  return pipeline(
    gulp.src('source/*.html'),
    posthtml([
      include()
    ]),
    htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }),
    gulp.dest('build')
  );
});


// *** Работа с Сервером ***
gulp.task('server', () => {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.{sass,scss}', gulp.series('css'));
  gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch('source/js/*.js', gulp.series('refresh'));
  gulp.watch('source/*.html', gulp.series('html', 'refresh'));
});

gulp.task('refresh', (done) => {
  server.reload();
  done();
});


// *** Очищение директории build/ ***
gulp.task('clean',  () => {
  return del('build');
});


// *** Копирование файлов в build/ ***
gulp.task('copy', () => {
  return pipeline(
    gulp.src([
      'source/fonts/**/*.{woff,woff2}',
      'source/img/**', '!source/img/icon-*.svg',
    ], {
      base: 'source'
    }),
    gulp.dest('build')
  );
});



// === Главные задачи для Сборки проекта в "продакшн" и поднятия Сервера ===
gulp.task('build', gulp.series(
  'clean',
  'copy',
  'css',
  'scripts',
  'sprite',
  'html'
));

gulp.task('start', gulp.series('build', 'server'));