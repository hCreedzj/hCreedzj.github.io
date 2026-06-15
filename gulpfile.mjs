import gulp from "gulp";
import { deleteSync } from "del";

import include from "gulp-file-include";
import formatHTML from "gulp-format-html";

import less from "gulp-less";
import plumber from "gulp-plumber";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import sortMediaQueries from "postcss-sort-media-queries";
import minify from "gulp-csso";
import rename from "gulp-rename";
import terser from "gulp-terser";

import imagemin from "gulp-imagemin";
import imagemin_gifsicle from "imagemin-gifsicle";
import imagemin_mozjpeg from "imagemin-mozjpeg";
import imegemin_optipng from "imagemin-optipng";

import svgmin from "gulp-svgmin";
import svgstore from "gulp-svgstore";

import server, { reload } from "browser-sync";

const resourses = {
    html: "src/html/**/*.html",
    jsDev: "src/scripts/dev/**/*.js",
    jsVendor: "src/scripts/vendor/**/*.js",
    images: "src/assets/images/**/*.{png,jpg,jpeg,webp,gif,svg}",
    less: "src/styles/**/*.less",
    svgSprite: "src/assets/svg-sprite/**/*.svg",
    static: [
        "src/assets/favicons/**/*.*",
        "src/assets/fonts/**/*.{woff,woff2}",
        "src/assets/icons/**/*.*",
        //"src/assets/video/**/*.{mp4,webm}"
        //"src/assets/audio/**/*.{mp3,ogg,wav,aac}",
        //"src/json/**/*.json",
        //"src/php/**/*.php"
    ],
};

function clean(done) {
    deleteSync(["dist"]);
    done();
    
}

function includeHtml() {
    return gulp
        .src("src/html/*.html")
        .pipe(plumber())
        .pipe(include({
            prefix: "@@",
            basepath: "@file"
        }))
        .pipe(formatHTML())
        .pipe(gulp.dest("dist"));
}

function style() {
    return gulp
        .src("src/styles/styles.less")
        .pipe(plumber())
        .pipe(less())
        .pipe(
            postcss([
                autoprefixer({ overrideBrowserslist: ["last 4 version"] }),
                sortMediaQueries({ sort: "desktop-first"}),
            ])
        )
        .pipe(gulp.dest("dist/styles"))
        .pipe(minify())
        .pipe(rename("styles.min.css"))
        .pipe(gulp.dest("dist/styles"));
}

function js() {
    return gulp
        .src("src/scripts/dev/*.js")
        .pipe(plumber())
        // .pipe(
        //     include({
        //         prefix: "//@@",
        //         basepath: "@@file"
        //     })
        // )
        .pipe(gulp.dest("dist/scripts"))
        .pipe(terser())
        .pipe(
            rename(function(path) {
                path.basename+=".min"
            })
        )
        .pipe(gulp.dest("dist/scripts"))
}

function jsCopy() {
    return gulp
        .src(resourses.jsVendor)
        .pipe(plumber())
        .pipe(gulp.dest("dist/scripts"));
}

function copy() {
    return gulp
        .src(resourses.static, {
            base: "src",
            encoding: false
        })
        .pipe(gulp.dest("dist/"));
}

function images() {
    return gulp
        .src(resourses.images, { encoding: false })
        .pipe(
            imagemin([
                imagemin_gifsicle({ interlaced: true }),
                imagemin_mozjpeg({ quality: 100, progressive: true }),
                imegemin_optipng({ optimizationLevel: 3 })
            ])
        )
        .pipe(gulp.dest("dist/assets/images"));

}

function svgSprite() {
    return gulp
        .src(resourses.svgSprite)
        .pipe(
            svgmin({
                js2svg: {
                    pretty: true
                }
            })
        )
        .pipe(
            svgstore({
                inlineSvg: true
            })
        )
        .pipe(rename("symbols.svg"))
        .pipe(gulp.dest("dist/assets/icons/"));
}

const build = 
    gulp.series(
        clean,
        copy,
        includeHtml,
        style,
        js,
        jsCopy,
        images,
        svgSprite
    );

function reloadServer(done) {
    server.reload();
    done();
}

function serve() {
    server.init({
        server: "dist"
    });
    gulp.watch(resourses.html, gulp.series(includeHtml, reloadServer));
    gulp.watch(resourses.less, gulp.series(style, reloadServer));
    gulp.watch(resourses.jsDev, gulp.series(js, reloadServer));
    gulp.watch(resourses.jsVendor, gulp.series(jsCopy, reloadServer));
    gulp.watch(resourses.static, { delay: 500 }, gulp.series(copy, reloadServer));
    gulp.watch(resourses.images, { delay: 500 }, gulp.series(images, reloadServer));
    gulp.watch(resourses.svgSprite, gulp.series(svgSprite, reloadServer));
}

const start = gulp.series(build, serve);

export {
    clean,
    copy,
    includeHtml,
    style,
    js,
    jsCopy,
    images,
    svgSprite,
    build,
    serve,
    start
};