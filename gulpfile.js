'use strict';

// переменные ======================
var cssMixins = require("./src/css/mixins.js");
var cssVariables = require("./src/css/var.js");

var gulp         = require('gulp'),
    rimraf       = require("rimraf"),
    rename       = require('gulp-rename'),
    autoprefixer = require('autoprefixer'),
    watch        = require('gulp-watch'),
    rigger       = require('gulp-rigger'),           // html и css вставки
    twig         = require('gulp-twig'), 
    //sourcemaps   = require('gulp-sourcemaps'),
    //uncss        = require('gulp-uncss'),          // удаление неиспользуемых стилей
    postcss      = require('gulp-postcss'),
    atImport     = require('postcss-import'),        // import in css
    postcssMixins  = require('postcss-mixins')({
        mixins: cssMixins
    }),
    postcssNested = require('postcss-nested'),       // sass in postcss
    postcssShort = require('postcss-short'),         // сокращенная запись в css
    postcssVars  = require('postcss-simple-vars')({
        variables: cssVariables
    }),
    postcssColor = require('postcss-color-function'),
    postcssAssets = require('postcss-assets'),
    cssnano      = require('cssnano'),               // mincss + postcss
    //assets       = require('postcss-assets'),      // картинки в цсс
    uglify       = require('gulp-uglify'),           // minify for js
    //cssmin      = require('gulp-minify-css'),
    //useref      = require('gulp-useref'),          // объединени css и js
    //cssmin      = require('gulp-clean-css'),       // mincss dep
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    browserSync  = require('browser-sync'),          //синхронизация с браузером 
    reload       = browserSync.reload;

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/inc/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/inc/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/css/main.css',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/inc/**/*.js',
        style: 'src/css/**/*.*',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build/'
};

// Сервер
/*
var config = {
    server: {
      baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Kleale",
    firefox: '-browser "firefox.exe"'
};
*/

var config = {
    server: {
      baseDir: "./build"
    },
    //browser: "chrome.exe",
    browser: "firefox.exe",
    host: 'localhost',
    port: 9000,
    notify: false
}

//  Сборка HTML
gulp.task('html:build', function (done) {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
    //.pipe(rigger()) //Прогоним через rigger
    .pipe(twig({
        data: {
            // some data
            titleDemo: 'Gulp and Twig',
            benefitsDemo: [
                'Fast',
                'Flexible',
                'Secure'
            ]
        }
    }))
    .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
    .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
  done();
});

//  Сборка JS

gulp.task('js:build', function (done) {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        //.pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        //.pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
  done();
});

// Сборка стилей
/*
// Старый вариант через sass
gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});
*/
gulp.task('style:build', function () {
    var processors = [
      atImport,
      postcssShort,
      postcssMixins,
      postcssNested,
      postcssVars,
      postcssColor,
      postcssAssets,
      autoprefixer({browsers: ['last 2 version']}),
      //cssnano(),  // разкомментить для минимайза
    ];
    return gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(postcss(processors))
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
  
});

// Удалить ненужные стили
/*
gulp.task('uncssed', function () {
  return gulp.src('build/main.css')  
    .pipe(uncss({
      html: ['build/index.html'] //сюда добавить все хтмльки
    }))
    .pipe(gulp.dest(path.build.css));
});
*/

// Сборка картинок
gulp.task('img:build', function (done) {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
  done();
});

// Сборка шрифтов
gulp.task('fonts:build', function(done) {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
  done();
});

// Полная сборка проекта

gulp.task('build', 
  gulp.parallel([
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'img:build'
]));


// Изменения

gulp.task('watch', function(done){
    gulp.watch(path.watch.style, gulp.series('style:build')),
    gulp.watch(path.watch.html, gulp.series('html:build')),
    gulp.watch(path.watch.js, gulp.series('js:build')),
    gulp.watch(path.watch.img, gulp.series('img:build')),
    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
  done();
});

// Сервер
gulp.task('webserver', function (done) {
  //browserSync(config);
  browserSync.init(config);
  done();
});

//Очистка
gulp.task('clean', function (done) {
  //rimraf(path.clean);
  done();
});

//gulp.task('default', ['build', 'webserver', 'watch']);


// Per default, start scripts and styles - in console "gulp default"
gulp.task('default', gulp.series('watch', 'build', 'webserver', function (done) { done(); }  
));

