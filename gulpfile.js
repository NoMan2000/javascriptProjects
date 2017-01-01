let gulp = require('gulp'),
    $ = require('gulp-load-plugins')({lazy: true}),
    jsFiles = ['./public/js/**/*.js'],
    injectOptions = {
        ignorePath: '/public'
    },
    debug = $.debug,

    /**
     * Send any less files in bower to the
     * @returns {*}
     */
    wireDepLessToCss = function wireDepLessToCss() {
        let wiredep = require('wiredep'),
            stream = require('merge-stream')(),
            less = wiredep().less,
            cssDest = gulp.dest('./public/css');
        if (less) {
            less = gulp.src(less);
            return less.pipe(
                $.less()
            ).pipe(cssDest);
        }
        return stream;
    },
    /**
     * Compile Stylus to CSS
     * @returns {*}
     */
    wireDepStylusToCss = function wireDepStylusToCss() {
        let wiredep = require('wiredep'),
            stream = require('merge-stream')(),
            stylus = wiredep().styl,
            cssDest = gulp.dest('./public/css');
        if (stylus) {
            stylus = gulp.src(stylus);
            return stylus.pipe(
                $.stylus()
            ).pipe(cssDest);
        }
        return stream;
    },
    wireDepSassToCss = function wireDepSassToCss() {
        let wiredep = require('wiredep'),
            sass = wiredep().sass,
            scss = wiredep().scss,
            cssDest = gulp.dest('./public/css'),
            stream = require('merge-stream')();
        if (sass) {
            sass = gulp.src(sass);
            stream.add(sass);
        }
        if (scss) {
            scss = gulp.src(scss);
            stream.add(scss);
        }
        if (!stream.isEmpty()) {

        }
    },

    /**
     * Check against ESlint and JShint for style guide errors.
     * Even though JSRC is in the directory, it is considered deprecated
     * and the team is migrating to ESLint.  Same with JSLint, considered
     * superceeded by JSHint and ESLint.
     * @returns {*}
     */
    styleGuides = function styleGuides() {
        return gulp.src(jsFiles)
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish', {
                verbose: true
            }))
            .pipe($.eslint({
                configFile: './.eslintrc.js'
            }))
            .pipe($.eslint.format());
    },
    wiredepInject = function wiredepInject() {
        debugger;
        let wiredep = require('wiredep'),
            sources = wiredep(),
            js,
            css,
            jsDest,
            cssDest,
            target;
        js = gulp.src(sources.js);
        css = gulp.src(sources.css);
        jsDest = gulp.dest('./public/js');
        cssDest = gulp.dest('./public/css');
        target = gulp.src('./public/**/*.html');

        return target
            .pipe(
                $.inject(
                    js.pipe(
                        $.concat('deps.js')
                    ).pipe(jsDest),
                    injectOptions
                )
            ).pipe(
                $.inject(
                    css.pipe(
                        $.concat('deps.css')
                    ).pipe(cssDest),
                    injectOptions
                )
            ).pipe(gulp.dest('./public'))
            .pipe(debug());
    },
    nodemon = function nodemon() {
        let args = require('yargs').argv,
            options = {
                script: './app.js',
                delayTime: 1,
                env: {
                    PORT: args.port || 5000
                },
                watch: jsFiles
            };
        return $.nodemon(options)
            .on('restart', function (ev) {
                console.log("Restart");
            });
    },
    copyCSSDependencies = function copyCSSDependencies() {
        return gulp.src([
                './bower_components/semantic/dist/components/**',
                './bower_components/semantic/dist/themes/**'
            ],
            {base: './bower_components/semantic/dist'}
        ).pipe(gulp.dest('./public/css'));
    };
gulp.task('copyCSS', copyCSSDependencies);
gulp.task('serve', ['copyCSS', 'inject'], nodemon);
gulp.task('style', styleGuides);
gulp.task('wiredepLess', wireDepLessToCss);
gulp.task('wiredepStylus', wireDepStylusToCss);
gulp.task('wiredepSass', wireDepSassToCss);
gulp.task('inject', wiredepInject);
