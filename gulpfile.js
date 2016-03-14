/**
 * Created by zylee on 2016/1/12.
 */
/**
 * 组件安装
 * npm install gulp-util gulp-imagemin gulp-ruby-sass gulp-minify-css gulp-jshint gulp-uglify gulp-rename gulp-concat gulp-clean gulp-livereload tiny-lr --save-dev
 */

// 引入 gulp及组件
var gulp         = require('gulp'),                //基础库
    imagemin     = require('gulp-imagemin'),       //图片压缩
    pngquant     = require('imagemin-pngquant'),
    sass         = require('gulp-ruby-sass'),      //sass
    compass      = require('gulp-compass'),        //compass
    autoprefixer = require('gulp-autoprefixer'), 	//预编译
    minifycss    = require('gulp-minify-css'),   	//css压缩
    jshint       = require('gulp-jshint'),          //js检查
    uglify       = require('gulp-uglify'),         	//js压缩
    rename       = require('gulp-rename'),          //重命名
    concat       = require('gulp-concat'),          //合并文件
    clean        = require('gulp-clean'),           //清空文件夹
    notify       = require('gulp-notify'),			//更动通知
    cache        = require('gulp-cache'),			//图片快取，只有更改过得图片会进行压缩
    livereload   = require('gulp-livereload'),		//即时重整
    watch        = require('gulp-watch'),            //监听文件变化
    tinylr       = require('tiny-lr'),              //livereload
    server       = tinylr(),
    port = 8081;

// HTML处理
gulp.task('html', function() {
    var htmlSrc = './src/*.html',
        htmlDst = './dist';

    gulp.src(htmlSrc)
        .pipe(livereload(server))
        .pipe(gulp.dest(htmlDst))
});

// 样式处理
/*gulp.task('css', function () {
    return sass('src/sass/!*.scss',{ style: 'compressed' })
        .pipe(gulp.dest('src/styles/'))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('src/styles'))
        .pipe(rename({ suffix: '' }))
        .pipe(minifycss())
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/styles'))
        .pipe(notify({ message: 'Styles task complete' }));
    //编码风格 normal, compressed(压缩)
});*/

//compass
gulp.task('compass', function() {
    gulp.src('./src/sass/*.scss')
        .pipe(compass({
            config_file: './config.rb',
            css: './src/styles',
            sass: './src/sass'
            //debug: true
        }))
        .pipe(rename({ suffix: '' }))
        .pipe(minifycss())
        .pipe(livereload(server))
        .pipe(gulp.dest('./dist/styles'))
        .pipe(notify({ message: 'Styles task complete' }));;
});
// 图片处理
gulp.task('images',function(){
    return gulp.src("./src/images/**/*")
        .pipe(cache(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true ,
            use:[pngquant({quality: '65-80', speed: 4})]
        })))
        .pipe(livereload(server))
        .pipe(gulp.dest("dist/images"))
        .pipe(notify({ message: 'Images task complete' }));
});


// js处理
gulp.task('js', function () {
    var dir={
        src:'./src/js/*.js',
        dest:'./dist/js',
        libSrc:'./src/js/plugins/**.js',
        libDest:'./dist/js/plugins'
    };


    gulp.src(dir.libSrc)
        .pipe(gulp.dest(dir.libDest));

    gulp.src(dir.src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(dir.dest))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(dir.dest))
        .pipe(notify({ message: 'js task complete' }));
});

// 清空图片、样式、js
gulp.task('clean', function() {
    gulp.src(['./dist/styles', './dist/js/', './dist/images/','./dist/*.html'], {read: false})
        .pipe(clean({force: true}));
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function(){
    gulp.start('html','compass','images','js');
});

// 监听任务 运行语句 gulp watch
gulp.task('watch',function(){


    // 监听html
    gulp.watch('./src/**/*.html',  ['html']);
    // 监听.scss档
    gulp.watch('./src/sass/**/*.scss', ['compass']);

    // 监听.js档
    gulp.watch('./src/js/**/*.js', ['js']);

    // 监听图片档
    gulp.watch('./src/images/', ['images']);

    livereload.listen();
    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);


});
