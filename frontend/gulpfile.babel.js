'use strict';

import gulp 						from 'gulp';
import pug 							from 'gulp-pug';
import htmlbeautify 				from 'gulp-html-beautify';
import sass 						from 'gulp-sass';
import cleanCSS 					from 'gulp-clean-css';
import browserSync 					from 'browser-sync';
import concat 						from 'gulp-concat';
import uglify 						from 'gulp-uglify';
import rename 						from 'gulp-rename';
import del 							from 'del';
import imagemin 					from 'gulp-imagemin';
import imageminJpegRecompress 		from 'imagemin-jpeg-recompress';
import pngquant 					from 'imagemin-pngquant';
import gutil 						from 'gulp-util';
import cache 						from 'gulp-cache';
import autoprefixer 				from 'gulp-autoprefixer';
import ftp 							from 'vinyl-ftp';
import rsync 						from 'gulp-rsync';
import notify 						from 'gulp-notify';
import plumber						from 'gulp-plumber';
import includeFiles					from 'gulp-include';
import replace						from 'gulp-replace';



gulp.task('pug', function() {
  return gulp.src("app/assets/pages/**/*.pug")
		.pipe(plumber({
			errorHandler: notify.onError()
		}))
		.pipe(pug())
		.pipe(rename({dirname: ''}))
		.pipe(gulp.dest("app/intermediate/"))
		.pipe(browserSync.reload({stream: true})); 
});

gulp.task('htmlbeautify', ['pug'], function() {
	let options = {
		indentSize: 4
	};

	gulp.src('app/intermediate/**/*.html')
		.pipe(htmlbeautify(options))
		.pipe(gulp.dest('app/'))
});

gulp.task('sass', function() {
	return gulp.src('app/assets/layouts/*.+(scss|sass)')
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	// .pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function() {
	return gulp.src('app/assets/layouts/main.js')
	.pipe(replace("@include", "//=include"))
	.pipe(includeFiles({
		includePaths: [
		    "./app/assets/"
		]
	}))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(gulp.dest('app/js'))
});



gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
	});
});

gulp.task('watch', ['htmlbeautify', 'sass', 'scripts', 'browser-sync'], function() {
	gulp.watch('app/assets/**/*.+(scss|sass)', ['sass']);
	gulp.watch('app/assets/**/*.pug', ['htmlbeautify']);
	gulp.watch('app/assets/**/*.js', ['scripts']);
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imageminJpegRecompress({
        loops: 5,
        min: 65,
        max: 70,
        quality:'medium'
      }),
      imagemin.svgo(),
      imagemin.optipng({optimizationLevel: 3}),
      pngquant({quality: '65-70', speed: 5})
    ],{
      verbose: true
    })))
	.pipe(gulp.dest('dist/img')); 
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'scripts'], function() {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/*.css',
		]).pipe(gulp.dest('dist/css'));


	var buildFonts = gulp.src([
		'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('rsync', function() {
	return gulp.src('dist/**')
	.pipe(rsync({
		root: 'dist/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Скрытые файлы, которые необходимо включить в деплой
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}));
});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
