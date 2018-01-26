'use srtrict';

const gulp = require('gulp');
const less = require('gulp-less');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');

const base_dir = 'src/';

const paths = {
  markup: '',
  pug: base_dir + 'pug/',
  less: base_dir + 'styles/',
  js: base_dir + 'js/'
};

const assets = {
  markup: [paths.markup + '*.html'],
  pug: [paths.pug + '**/*.pug'],
  pugPages: [paths.pug + 'pages/*.pug'],
  less: [paths.less + '*.less'],
  js: [paths.js + '*.js']
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
		.pipe(gulp.dest(base_dir))
		.pipe(reload({stream: true}))
});

gulp.task('js', function() {
  return gulp.src(assets.js)
    .pipe(plumber())
    .pipe(gulp.dest(base_dir))
    .pipe(browserSync.stream());
});

gulp.task('watch', ['browser-sync', 'less', 'html', 'js'], function(){
  gulp.watch(assets.less, ['less']);
  gulp.watch(assets.pug, ['html']);
  gulp.watch(assets.js, ['js']);
});

gulp.task('default', ['watch']);

// Инкрементальная сборка
// gulp.task( 'default', function() {
//
// } )


//
//
// // Сборка продакшн билда
// gulp.task( 'build', function() {
//
// } )
