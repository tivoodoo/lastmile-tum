var gulp = require('gulp'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    wiredep = require('wiredep'),
    plumber = require('gulp-plumber'),
    merge = require('merge2'),
    inject = require('gulp-inject'),
    browserSync = require('browser-sync').create();;

// Directory for deployment. Structure will be as follows:
var buildDir = 'dist';

// Directory for the main contents of the app; Only JS and HTML files
// will be regarded. Static supporting files have to be stored in the static contents directory
var appDir = 'app';

// Directory for everything else: All contents of this directory will be copied
// to buildDir
var staticContentsDir = 'docroot';

// Directory for stylesheets (sass, less and css supported)
var stylesDir = 'style';

// only refers to script and HTML minimization; CSS is always minified.
// use only for development!
var minifyScripts = false;

// Compile less and sass and copy all css stylesheets into the build directory
gulp.task('styles', function() {
    var lessStream = gulp.src(stylesDir + '/**/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(concat('less.css'));
    var scssStream = gulp.src(stylesDir + '/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(concat('sass.css'));
    var cssStream = gulp.src('bower_components/jquery-ui/themes/smoothness/jquery-ui.min.css')
        .pipe(plumber())
        .pipe(concat('css.css'));
    var css2Stream = gulp.src('bower_components/rateYo/min/jquery.rateyo.min.css')
        .pipe(plumber())
        .pipe(concat('css.css'));
    var css3Stream = gulp.src('bower_components/hover/css/hover-min.css')
        .pipe(plumber())
        .pipe(concat('css.css'));
    return merge(lessStream, scssStream, cssStream, css2Stream)
        .pipe(plumber())
        .pipe(autoprefixer())
        .pipe(concat('main.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(buildDir + '/css'));
});

// Copy all scripts from the app directory as well as bower-installed scripts into the build directory
// use vendor-delivered minified version if available
gulp.task('scripts', function() {
    var bowerMainFiles = wiredep().js;
    var files = [];
    bowerMainFiles.forEach(function(e) {
        if(minifyScripts && e.indexOf('.min') == -1) {
            try {
                var tmp = e.substring(0, e.length - 3) + ".min.js";
                if(fs.lstatSync(tmp).isFile())
                    e = tmp;
            } catch(ex) {
                console.log("[Bower] Warning: No min file for " + e + " (large version will be used)");
            }
        }
        files.push(e);
    });
    console.log("[scripts] Bower files: " + files)
    var bowerScriptStream = gulp.src(files)
        .pipe(plumber())
        .pipe(concat('vendor.min.js'));
    var customScriptStream;
    if(minifyScripts) {
        customScriptStream = gulp.src(appDir + '/**/*.js')
            .pipe(plumber())
            .pipe(concat('custom.min.js'))
            .pipe(uglify({compress: true}));
    } else {
        customScriptStream = gulp.src(appDir + '/**/*.js')
            .pipe(plumber())
            .pipe(concat('custom.min.js'));
    }
    return merge(bowerScriptStream, customScriptStream)
        .pipe(plumber())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(buildDir + '/js'));
});

// Copies the HTML files contained in the app directory into the build directory.
// Handles injections of scripts and styles.
// Minifes HTML.
gulp.task('html', ['scripts', 'styles'], function() {
    var injectFiles = [];

    [buildDir+'/css/**/*.css', buildDir+'/js/**/*.js'].forEach(function(e) {
        injectFiles.push(e);
    });

    injectFiles.forEach(function(e) {
        console.log("[html] Inject " + e);
    });

    var htmlStream;
    if(minifyScripts) {
        htmlStream = gulp.src(appDir + '/**/*.html')
            .pipe(plumber())
            .pipe(inject(gulp.src(injectFiles), {ignorePath: buildDir, addRootSlash: false}))
            .pipe(htmlmin({
                compress: true,
                collapseWhitespace: true,
                removeComments: true
            }));
    } else {
        htmlStream = gulp.src(appDir + '/**/*.html')
            .pipe(plumber())
            .pipe(inject(gulp.src(injectFiles), {ignorePath: buildDir, addRootSlash: false}));
    }

    var remStream = gulp.src([staticContentsDir + '/**/*.*', '!'+ appDir + '/**/*.html'])
        .pipe(plumber());

    return merge(htmlStream, remStream)
        .pipe(plumber())
        .pipe(gulp.dest(buildDir));
});

// Load all fonts from bower components
gulp.task('bower-fonts', function() {
    return gulp.src('bower_components/**/*.{otf,eot,ttf,woff,woff2,svg}')
        .pipe(plumber())
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest(buildDir + '/fonts'));
});

gulp.task('browser-sync', ['build'], function() {
    browserSync.init({
        server: {baseDir: buildDir},
        ui:false,
        middleware: function(req, resp, next) {
            resp.setHeader('Access-Control-Allow-Origin', '*');
            next();
        }
    });
});

// Clean build directory
gulp.task('clean', function() {
    return gulp.src(buildDir, {read: false})
        .pipe(plumber())
        .pipe(clean());
});

// Watch files
gulp.task('watch', function() {
    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch([appDir + '/**/*.*', staticContentsDir + '/**/*.*'], ['build', 'browser-sync-reload']).on('change', livereload.changed);
});

gulp.task('browser-sync-reload', ['build'], function() {
    browserSync.reload();
});

// Build
gulp.task('build', ['bower-fonts','scripts', 'styles', 'html']);


// Default
gulp.task('default', ['build', 'browser-sync', 'watch']);