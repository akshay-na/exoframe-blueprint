// gulpfile.js

import { exec } from "child_process";
import * as del from "del";
import gulp from "gulp";
import gulpCached from "gulp-cached";
import notify from "gulp-notify";
import plumber from "gulp-plumber";
import gulpRemember from "gulp-remember";
import ts from "gulp-typescript";
import uglify from "gulp-uglify";
import merge from "merge-stream";

// Determine environment (default is development)
const isProduction = process.env.NODE_ENV === "production";

// Create a TypeScript project using tsconfig.json.
// (Ensure tsconfig.json has options like "noEmitOnError": true, "declaration": true, etc.)
const tsProject = ts.createProject("tsconfig.json");

/* ====================
   Build & Code Tasks
   ==================== */

/**
 * Clean Task:
 * Deletes the 'dist' folder to remove previous build artifacts.
 */
function clean() {
  return del.deleteAsync(["dist"]);
}

/**
 * Type-Check Task:
 * Checks TypeScript files for type errors without emitting output.
 */
function typecheck() {
  const tsProjectTypeCheck = ts.createProject("tsconfig.json", {
    noEmit: true,
  });
  return tsProjectTypeCheck.src().pipe(tsProjectTypeCheck());
}

/**
 * Scripts Task:
 * Compiles TypeScript files.
 * - Uses caching for faster incremental builds.
 * - Generates sourcemaps in development.
 * - Minifies the output in production.
 */
function compile() {
  const tsResult = tsProject
    .src()
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(gulpCached("scripts"))
    .pipe(tsProject());

  const jsStream = tsResult.js
    .pipe(gulpRemember("scripts"))
    .pipe(uglify())
    .pipe(gulp.dest("dist"));

  const dtsStream = tsResult.dts.pipe(gulp.dest("dist"));

  return merge(jsStream, dtsStream);
}

/**
 * Git Report Task:
 * Logs the last 10 git commits to the console.
 */
function gitReport(done) {
  exec("git log --oneline -n 10", (err, stdout, stderr) => {
    if (err) {
      notify.onError("Git Report Error: <%= error.message %>")(err);
      return done(err);
    }
    console.log("Recent Git Commits:\n", stdout);
    done();
  });
}

/* ====================
   Deployment Tasks
   ==================== */

/**
 * Publish Task:
 * Publishes your package to npm.
 * (Ensure you’re ready to publish before running this task!)
 */
function publishNpm(done) {
  exec("npm publish", (err, stdout, stderr) => {
    if (err) {
      notify.onError("NPM Publish Error: <%= error.message %>")(err);
      return done(err);
    }
    console.log("npm publish output:\n", stdout);
    done();
  });
}

/**
 * Semantic Release Task:
 * Triggers semantic-release (typically used in CI/CD).
 */
function semanticReleaseTask(done) {
  exec("npx semantic-release", (err, stdout, stderr) => {
    if (err) {
      notify.onError("Semantic Release Error: <%= error.message %>")(err);
      return done(err);
    }
    console.log(stdout);
    done();
  });
}

/* ====================
   Development Tasks
   ==================== */

/**
 * Format Task:
 * Formats your code using Prettier.
 */
function format(done) {
  exec('prettier --write "src/**/*.{ts,js,json,md}"', (err, stdout, stderr) => {
    if (err) {
      notify.onError("Prettier Error: <%= error.message %>")(err);
      return done(err);
    }
    console.log(stdout);
    done();
  });
}

/* ====================
   Register Gulp Tasks
   ==================== */

// Build-related tasks
gulp.task("clean", clean);
gulp.task("typecheck", typecheck);
gulp.task("compile", compile);
gulp.task("git-report", gitReport);

// Deployment tasks
gulp.task("publish", publishNpm);
gulp.task("semantic-release", semanticReleaseTask);

// Development tasks
gulp.task("format", format);

// Composite tasks
gulp.task("build", gulp.series("clean", "typecheck", "compile"));

gulp.task("release", gulp.series("build", "git-report", "publish"));

// Default task runs build
gulp.task("default", gulp.series("build"));
