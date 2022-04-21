var gulp = require('gulp');

// css
let cleanCss = require("gulp-clean-css");
let postcss = require("gulp-postcss");
let sourcemaps = require("gulp-sourcemaps");
let concat = require("gulp-concat");

// browser refresh
let browserSync = require("browser-sync").create();

// images
let imagemin = require('gulp-imagemin');

// github
let ghpages = require('gh-pages');


gulp.task('css', function() {
    return gulp.src(
        ['src/css/reset.css', 
        'src/css/typography.css', 
        'src/css/app.css']) // Get this file
        .pipe(sourcemaps.init())
        .pipe(postcss([ require('autoprefixer'), require('postcss-preset-env')({stage: 1, browsers:["IE 11", "last 2 versions"]}) ]))
        .pipe(concat("app.css"))
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
    gulp.watch("src/css/*", gulp.series('css'))
    gulp.watch("src/fonts/*", gulp.series('fonts'))
    gulp.watch("src/img/*", gulp.series('images'))
});

gulp.task('deploy', async function() {
    ghpages.publish('dist')
});

gulp.task('default', gulp.series('html', 'css', 'fonts', 'images', 'watch'));