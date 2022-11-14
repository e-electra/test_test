let projectFolder = 'build';
let sourceFolder = 'src';

let fs = require('fs');

let path = {
    build: {
        html: projectFolder + '/',
        css: projectFolder + '/css/',
        fonts: projectFolder + '/fonts/',
        js: projectFolder + '/js/',
        img: projectFolder + '/img/',
    },
    src: {
        html: sourceFolder + '/pug/*.pug',
        css: sourceFolder + '/scss/style.scss',
        fonts: sourceFolder + '/fonts/*.ttf',
        js: sourceFolder + '/js/script.js',
        img: sourceFolder + '/img/**/*.+(png|jpg|gif|ico|svg|webp)',
    },
    watch: {
        html: sourceFolder + '/pug/**/*.pug',
        css: sourceFolder + '/scss/**/*.scss',
        fonts: sourceFolder + '/fonts/*.ttf',
        js: sourceFolder + '/js/**/*.js',
        img: sourceFolder + '/img/**/*.+(png|jpg|gif|ico|svg|webp)',
    },
    clean: './' + projectFolder + '/'
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileInclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    groupMedia = require('gulp-group-css-media-queries'),
    cleanCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    pug = require('gulp-pug'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    fonter = require('gulp-fonter');



function browserSync() {
    browsersync.init({
        server: {
            baseDir: './' + projectFolder + '/'
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(pug({ pretty: true }))
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: 'expanded'
            }).on('error', scss.logError)
        )
        .pipe(groupMedia())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(cleanCss())
        .pipe(
            rename({
                extname: '.min.css'
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function fonts() {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
}


function images() {
    return src(path.src.img)
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean() {
    return del(path.clean);
}

gulp.task('otf2ttf', function () {

    return gulp.src([sourceFolder + '/fonts/*.otf'])
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest(sourceFolder + '/fonts/'));
})

let srcFonts = 'src/scss/fonts.scss';
let appFonts = 'build/fonts/';

function fontsStyle(done) {
    fs.writeFile(srcFonts, '', () => { });
    fs.readdir(appFonts, (err, items) => {
        if (items) {
            let c_fontname;
            for (let i = 0; i < items.length; i++) {
                let fontname = items[i].split('.'),
                    fontExt;
                fontExt = fontname[1];
                fontname = fontname[0];
                if (c_fontname != fontname) {
                    if (fontExt == 'woff' || fontExt == 'woff2') {
                        fs.appendFile(srcFonts, `@include font-face("${fontname}", "${fontname}", 400);\r\n`, () => { });

                    }
                }
                c_fontname = fontname;
            }
        }
    })
    done();
}

function cb() {
}

let build = gulp.series(clean, gulp.parallel(js, images, css, html, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
