'use strict';

const gulp = require('gulp');
const less = require('gulp-less');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber');
const cache = require('gulp-cache');
const del = require('del');
const cssnano = require('gulp-cssnano');

const base_dir = 'src/';
const dist_dir = 'dist/';

const paths = {
  markup: base_dir,
  assets: 'assets/',
  pug: base_dir + 'pug/',
  less: base_dir + 'styles/',
  jsOriginal: base_dir + 'js/',
  media: base_dir + 'assets/',
  css: 'css/',
  js: 'js/',
  video: 'video/'
};

const assets = {
  markup: [paths.markup + '*.html'],
  pug: [paths.pug + '**/*.pug'],
  pugPages: [paths.pug + 'pages/*.pug'],
  less: [paths.less + '*.less'],
  js: [paths.jsOriginal + '*.js'],
  media: [paths.media + '**/*.*'],
  video: [paths.media + paths.video + '*.mp4']
};

gulp.task('browser-sync', function() {
  browserSync({
      server: {
          baseDir: base_dir
      },
      notify: false
  });
  browserSync.watch([base_dir + '**/*.*']).on('change', reload);
});

gulp.task('html', function () {
  return gulp.src(assets.pugPages)
    .pipe(plumber())
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(base_dir))
    .pipe(browserSync.stream());
});

gulp.task('less', function(){
	return gulp.src(assets.less)
    .pipe(sourcemaps.init())
		.pipe(less())
		.pipe(autoprefixer({ cascade: true }))
    .pipe(sourcemaps.write('maps/'))
		.pipe(gulp.dest(paths.media + paths.css))
		.pipe(reload({stream: true}))
});

gulp.task('js', function() {
  return gulp.src(assets.js)
    .pipe(plumber())
    .pipe(gulp.dest(paths.media + paths.js))
    .pipe(browserSync.stream());
});

gulp.task('watch', ['browser-sync', 'less', 'html', 'js'], function(){
  gulp.watch(assets.less, ['less']);
  gulp.watch(assets.pug, ['html']);
  gulp.watch(assets.js, ['js']);
});

gulp.task('clean', function() {
	return del.sync(dist_dir);
});

gulp.task('build', ['clean', 'less', 'js'], function(){
  const buildStyles = gulp.src(base_dir + paths.assets + paths.css + '**/*.css')
  .pipe(cssnano())
  .pipe(gulp.dest(dist_dir + paths.assets + paths.css))

  const buildJs = gulp.src(assets.js)
  .pipe(gulp.dest(dist_dir + paths.assets + paths.js))

  const buildMarkup = gulp.src(assets.markup)
  .pipe(gulp.dest(dist_dir))

  const moveAssets = gulp.src(assets.video)
  .pipe(gulp.dest(dist_dir + paths.assets + paths.video))
});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']);
