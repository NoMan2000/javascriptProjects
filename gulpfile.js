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
    wireDepLessToCss = () => {
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
    wireDepStylusToCss = () => {
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
            stream.pipe(
                $.sass()
            ).pipe(cssDest)
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
        let wiredep = require('wiredep'),
            sources = wiredep(),
            merge = require('merge-stream'),
            baseCSS = gulp.src('./public/src/css/*.css'),
            js,
            css,
            jsDest,
            cssDest,
            finalDest,
            outputJS,
            outputCSS,
            target;
        if (sources.js) {
            js = gulp.src(sources.js);
        }
        if (sources.less) {
            let less = gulp.src(sources.less);
            let lessStream = less.pipe(
                $.less()
            );
            baseCSS = merge(lessStream, baseCSS);
        }
        if (sources.css) {
            css = gulp.src(sources.css);
            css = merge(css, baseCSS);
        }
        jsDest = gulp.dest('./public/js');
        cssDest = gulp.dest('./public/css');
        finalDest = './public';
        target = gulp.src([
            './public/**/*.html',
            './public/**/*.pug'
        ]);
        outputJS = 'deps.js';
        outputCSS = 'deps.css';
        if (js) {
            target
                .pipe(
                    $.inject(
                        js.pipe(
                            $.concat(outputJS)
                        ).pipe(jsDest),
                        injectOptions
                    )
                ).pipe(gulp.dest(finalDest))
        }
        if (css) {
            target.pipe(
                $.inject(
                    css.pipe(
                        $.concat(outputCSS)
                    ).pipe(cssDest),
                    injectOptions
                )
            ).pipe(gulp.dest(finalDest))
        }
        return target;
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
            .on('restart', (ev) => {
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
