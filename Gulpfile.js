/*
Gulpfile.js file for the tutorial:
Using Gulp, SASS and Browser-Sync for your front end web development - DESIGNfromWITHIN
http://designfromwithin.com/blog/gulp-sass-browser-sync-front-end-dev
Steps:
1. Install gulp globally:
npm install --global gulp
2. Type the following after navigating in your project folder:
npm install gulp gulp-util gulp-sass gulp-uglify gulp-rename gulp-minify-css gulp-notify gulp-concat gulp-plumber browser-sync --save-dev
3. Move this file in your project folder
4. Setup your vhosts or just use static server (see 'Prepare Browser-sync for localhost' below)
5. Type 'Gulp' and ster developing
Source: https://gist.github.com/DESIGNfromWITHIN/11383339
*/

/* Needed gulp config */
var gulp = require('gulp');  
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var neat = require('node-neat').includePaths;

/* Scripts task */
gulp.task('scripts', function() {
  return gulp.src([
    /* Add your JS files here, they will be combined in this order */
    'bower_components/jquery/dist/jquery.js',
    'bower_components/modernizer/modernizer.js',
    'bower_components/owl-carousel/owl-carousel/owl.carousel.min.js',
    'src/js/main.js'
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

/* Sass task */
gulp.task('sass', function () {  
    gulp.src('src/css/base.scss')
    .pipe(plumber())
    .pipe(sass({
        includePaths: ['scss'].concat(neat)
    }))
    .pipe(gulp.dest('public/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/css'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});

/* Reload task */
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', function() {
    browserSync.init(['css/*.css', 'js/*.js'], {
        /*
        I like to use a vhost, WAMP guide: https://www.kristengrote.com/blog/articles/how-to-set-up-virtual-hosts-using-wamp, XAMP guide: http://sawmac.com/xampp/virtualhosts/
        */
        proxy: 'www.envoytest.com'
        /* run MAMP with host www.envoytest.com for site to load
        /* For a static server you would use this: */
        /*
        server: {
            baseDir: './'
        }
        */
    });
});

// copy images from src to public
gulp.task('copyfiles', function() {
    gulp.src('./src/img/**/*')
    .pipe(gulp.dest('./public/img/'));
});

// compress images
gulp.task('images', function() {
    var imgSrc = './src/img/**/*',
        imgDst = './public/img/';

    return gulp.src(imgSrc)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst))
        .pipe(notify({ message: 'Images task complete' }));
});

/* Watch scss, js and html files, doing different things with each. */
gulp.task('default', ['sass', 'browser-sync'], function () {
    /* Watch scss, run the sass task on change. */
    gulp.watch(['src/css/*.scss', 'src/css/**/*.scss'], ['sass'])
    /* Watch app.js file, run the scripts task on change. */
    gulp.watch(['src/js/main.js'], ['scripts'])
    /* Watch .html files, run the bs-reload task on change. */
    gulp.watch(['*.html'], ['bs-reload']);
    // Copy images to public
    gulp.watch('./src/img/**/*', ['copyfiles']);
    // If an image is modified, run our images task to compress images
    gulp.watch('./src/img/**/*', ['images']);
});