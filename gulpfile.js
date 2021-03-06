'use strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	header = require('gulp-header'),
	browsersync = require('browser-sync'),
	del = require('del');

var src = {
	js: ['src/js/*.js'],
	modules: ['src/js/modules/*.js'],
	jsConcat: ['dist/js/modules/*.js'],
	dist: 'dist',
	other: [
		'src/*.html'
	],
	del: 'dist',
	watch: {
		js: {
			path: [
				'src/js/*.js',
				'src/js/modules/*.js'
			],
			task: 'concat'
		}
	}
}

gulp.task('concat', function() {
	//压缩_require
	gulp.src(src.js, {
			base: 'src'
		})
		.pipe(uglify())
		.pipe(header([
            '/**',
            '*',
            '*',
            '* _require.js v1.0.6',
            '* (c) 2016-2017 Blue',
            '* https://github.com/azhanging/_require',
            '* Released under the MIT License.',
            '*',
            '*',
            '**/', ''
        ].join('\n')))
		.pipe(gulp.dest(src.dist));

	//压缩module
	gulp.src(src.modules)
		.pipe(uglify())
		.pipe(gulp.dest('src/js/tmp'));

	//模块合成
	return gulp.src('src/js/tmp/*.js')
		.pipe(concat('modules.js'))
		.pipe(gulp.dest('dist/js/modules'));
})

gulp.task('other', function() {
	return gulp.src(src.other, {
			base: 'src'
		})
		.pipe(gulp.dest(src.dist));
});

//delete dist doc
gulp.task('del', function() {
	del.sync(src.del);
});

//watch fn
var watch = function(type) {
	gulp.watch(src.watch[type].path, function(ev) {
		gulp.start(src.watch[type].task);
		browsersync.reload();
		console.log("修改路径:" + ev.path + ',修改类型:' + ev.type);
	});
}

//watch
gulp.task('watch', function() {
	watch('js');
});

//default
gulp.task('default', ['del', 'other', 'watch', 'concat']);