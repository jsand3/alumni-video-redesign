// The goal is be to create an automated workflow for working with Sass and CoffeeScript. We want to make tasks that will:
//
// Process styles/main.scss to assets/main.css, and scripts/hello.cofee to scripts/hello.js,
// Concatenate and minify scripts/main.js and scripts/hello.js to assets/script.js,
// React when we change scripts/hello.cofee, styles/main.scss, scripts/main.js, and index.html,
// Create server and load index.html so we can see the change on each save

// load gulp plugin
var gulp = require('gulp');

//gulp-util plugin -
//  logs custom messages to the terminal
var gutil = require('gulp-util');

//sass
var sass = require('gulp-sass');

//coffeescript
var coffee = require('gulp-coffee');

//miniffying and concatenating scripts
//gulp-uglify and concat
var uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

//server live reload
var connect = require('gulp-connect');

var coffeeSources = ['scripts/hello.coffee'],
    jsSources = ['scripts/*.js'],
    sassSources = ['styles/*.scss'],
    htmlSources = ['**/*.html'],
    outputDir = 'assets';





// ** Task ** //

  //sass
    gulp.task('sass', function() {
      gulp.src('styles/main.scss')
      .pipe(sass({style: 'expanded'}))
        .on('error', gutil.log)
      .pipe(gulp.dest('assets'))
    });

  //CoffeeScript
    gulp.task('coffee', function() {
      gulp.src('scripts/hello.coffee')
      .pipe(coffee({bare: true })
        .on('error', gutil.log))
      .pipe(gulp.dest('scripts'))
    });

    //uglify and concatenating
    gulp.task('js', function() {
      gulp.src('scripts/*.js')
      .pipe(uglify())
      .pipe(concat('script.js'))
      .pipe(gulp.dest('assets'))
    });

    gulp.task('default', ['coffee', 'js']); //combime the task for CoffeeScript and javascript

    //watching for files (automate processing task on file saves)
    gulp.task('watch', function() {
      gulp.watch('scripts/hello.coffee', ['coffee']);
      gulp.watch('scripts/*.js', ['js']);
      gulp.watch('styles/main.scss', ['sass']);
      //gulp.watch('styles/main.scss', ['sass']);
      gulp.watch(htmlSources, ['html']);
    });

    //server live load task
    //root of the server is the root of the project
    //initate with "gulp connect"
    gulp.task('connect', function() {
      connect.server({
        root: '.',
        livereload: true
      })
    });

    gulp.task('html', function() {
      gulp.src(htmlSources)
      .pipe(connect.reload())
    });

    gulp.task('default', ['html', 'coffee', 'js', 'sass', 'connect', 'watch']);
