var gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

let cleanCss = require("gulp-clean-css");
let sourcemaps = require("gulp-sourcemaps");
let browserSync = require("browser-sync").create();
let imagemin = require('gulp-imagemin');

let ghpages = require('gh-pages');

sass.compiler = require('sass');

gulp.task('sass', function() {
    // Run "sass css/app.scss app.css --watch"
    return gulp.src("src/css/app.scss") // Get this file
        .pipe(sourcemaps.init())
            .pipe(sass()) // Run sass on the file
            .pipe(cleanCss({compatibility: 'ie8'})) // Add CleanCSS to the file
        .pipe(sourcemaps.write()) // This will allow Dev tools to give accurate location for code correction
        .pipe(gulp.dest("dist")) // Send the clean file to the dist folder
        .pipe(browserSync.stream()) // Will automatically show the updates
});


gulp.task('html', async function() {
    return gulp.src("src/*.html")
    .pipe(gulp.dest("dist"))
});

gulp.task('fonts', async function() {
    return gulp.src("src/fonts/*")
    .pipe(gulp.dest("dist/fonts"))
});

gulp.task('images', async function() {
    return gulp.src("src/img/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/img"))
});



gulp.task('watch', async function () {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    })



    gulp.watch("src/*.html", gulp.series('html')).on('change', browserSync.reload)
    gulp.watch("src/css/app.scss", gulp.series('sass'))
    gulp.watch("src/fonts/*", gulp.series('fonts'))
    gulp.watch("src/img/*", gulp.series('images'))
});

gulp.task('deploy', async function() {
    ghpages.publish('dist')
});

gulp.task('default', gulp.series('html', 'sass', 'fonts', 'images', 'watch'));