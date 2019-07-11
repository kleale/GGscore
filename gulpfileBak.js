'use strict';

// переменные ======================

// As we need to reference a single set of mixins across multiple independently processed CSS files, we have created JS version of the mixins
var cssMixins = require("./src/css/mixins.js");

//As we need to reference a single set of vars across multiple independently processed CSS files, we have created a JS for the CSS vars
var cssVariables = require("./src/css/var.js");

var gulp         = require('gulp'),
    rename       = require('gulp-rename'),
    autoprefixer = require('autoprefixer'),
    watch        = require('gulp-watch'),
    rigger       = require('gulp-rigger'),               // html и css вставки
    twig         = require('gulp-twig'), 
    //sourcemaps   = require('gulp-sourcemaps'),
    //uncss        = require('gulp-uncss'),              // удаление неиспользуемых стилей
    postcss      = require('gulp-postcss'),
    atImport     = require('postcss-import'),            // import in css
    postcssMixins  = require('postcss-mixins')({
        mixins: cssMixins
    }),
    postcssNested = require('postcss-nested'),           // sass in postcss
    postcssShort = require('postcss-short'),             // сокращенная запись в css
    postcssVars  = require('postcss-simple-vars')({
        variables: cssVariables
    }),
    postcssColor = require('postcss-color-function'),
    postcssAssets = require('postcss-assets'),
    
    cssnano      = require('cssnano'),                   // mincss + postcss
    //assets       = require('postcss-assets'),          // картинки в цсс
    
    uglify       = require('gulp-uglify'),               // minify for js
    
    //prefixer    = require('gulp-autoprefixer'),        // dep
    //sass        = require('gulp-sass'),                // dep
    //cssmin      = require('gulp-minify-css'),
    //useref      = require('gulp-useref'),              // объединени css и js
    //cssmin      = require('gulp-clean-css'),           // mincss dep
    
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    
    browserSync  = require('browser-sync'),            //синхронизация с браузером 
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
    clean: './build'
};

// Сервер
var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Kleale"
};

//  Сборка HTML
gulp.task('html:build', function () {
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
});

//  Сборка JS

gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        //.pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        //.pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
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
gulp.task('img:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

// Сборка шрифтов
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

// Полная сборка проекта
gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'img:build'
]);

// Изменения

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('img:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

// Сервер
gulp.task('webserver', function () {
    browserSync(config);
});

//Очистка
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);