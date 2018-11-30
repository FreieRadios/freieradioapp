var gulp = require("gulp"),
    tsc = require("gulp-typescript");

var tsProject = tsc.createProject("tsconfig.json");

gulp.task("typescript", function() {
    return gulp.src([
            "typescript/__start__.ts"
        ])
        .pipe(tsProject())
        .js.pipe(gulp.dest("www/js"));
});
