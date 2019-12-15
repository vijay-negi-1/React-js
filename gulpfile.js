const gulp = require('gulp');
const { src, dest, series, parallel  } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-html-minifier2');
const browserSync = require('browser-sync').create();
const smushit = require('gulp-smushit');
const gulpCopy = require('gulp-copy');
const autoprefixer = require('gulp-autoprefixer');

function jsMin() {
	return gulp.src('./src/js/**/*.js')
		.pipe(babel())
		// .pipe(gulp.src('./src/js/**/*.js'))
		.pipe(uglify())
		.pipe(rename({ extname: '.min.js' }))
		.pipe(gulp.dest('./dist/js'));
}

function cssMin() {
	return gulp.src('./src/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./dist/css'))
		.pipe(cleanCSS({compatibility: 'ie8'}))
    	.pipe(rename({ extname: '.min.css' }))
		.pipe(gulp.dest('./dist/css'));
}
function htmlMin() {
  return gulp.src('./src/*.html')
    .pipe(htmlmin({collapseWhitespace: false}))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
}

function imagesMinSmushit() {
  return gulp.src('./src/images/**/*.{jpg,png}')
        .pipe(smushit())
        .pipe(gulp.dest('./dist/images'));
}

function copyWebFonts() {
  return src('./src/webfonts/**/*.*')
    .pipe(dest('./dist/webfonts'));
}

function watch() {
	browserSync.init({
		server: {
			baseDir: './dist'
		}
	});
	// gulp.watch('./src/images',imagesMinSmushit);
	// gulp.watch('./src/webfonts',copyWebFonts);
	gulp.watch('./src/scss/**/*.scss').on('change', series(cssMin, browserSync.reload));
	gulp.watch('./src/*.html').on('change', series(htmlMin, browserSync.reload));
	gulp.watch('./src/js/**/*.js').on('change', series(jsMin, browserSync.reload));
}
exports.htmlMin = htmlMin;
exports.cssMin = cssMin;
exports.jsMin = jsMin;
exports.copyWebFonts = copyWebFonts;
exports.imagesMinSmushit = imagesMinSmushit;
exports.finalCall = series(htmlMin,cssMin, imagesMinSmushit, jsMin, copyWebFonts);
exports.watch = watch;