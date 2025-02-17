// gulpfile.js

const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const eslint = require("gulp-eslint");
const gulpif = require("gulp-if");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const cached = require("gulp-cached");
const typedoc = require("gulp-typedoc");
const nodemon = require("gulp-nodemon");
const { exec } = require("child_process");

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
  return del(["dist"]);
}

/**
 * Lint Task:
 * Lints all TypeScript files in the 'src' folder.
 */
function lint() {
  return gulp
    .src("src/**/*.ts")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
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
function scripts() {
  return tsProject
    .src() // Uses the file globs from tsconfig.json
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(tsProject())
    .js // Get the JavaScript output
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
}

/**
 * Docs Task:
 * Generates API documentation from your TypeScript files using TypeDoc.
 */
function docs() {
  return gulp.src(["src/**/*.ts"]).pipe(
    typedoc({
      module: "commonjs",
      target: "es6",
      out: "docs",
      name: "My Project API Docs",
      includeDeclarations: false,
      experimentalDecorators: true,
      excludeExternals: true,
    })
  );
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
 * Test Task:
 * Runs unit tests using Jest.
 * Ensure you have a jest.config.js in your project root.
 */
function test(done) {
  exec("jest --config jest.config.js", (err, stdout, stderr) => {
    if (err) {
      notify.onError("Jest Error: <%= error.message %>")(err);
      return done(err);
    }
    console.log(stdout);
    done();
  });
}

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

/**
 * Commitlint Task:
 * Checks the most recent commit message using commitlint.
 */
function commitlintTask(done) {
  exec("commitlint --from=HEAD~1", (err, stdout, stderr) => {
    if (err) {
      notify.onError("Commitlint Error: <%= error.message %>")(err);
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
gulp.task("lint", lint);
gulp.task("typecheck", typecheck);
gulp.task("scripts", scripts);
gulp.task("docs", docs);
gulp.task("gitreport", gitReport);

// Deployment tasks
gulp.task("publish", publishNpm);
gulp.task("semantic-release", semanticReleaseTask);

// Development tasks
gulp.task("test", test);
gulp.task("format", format);
gulp.task("commitlint", commitlintTask);

// Composite tasks
gulp.task(
  "build",
  gulp.series("clean", "lint", "typecheck", "scripts", "docs")
);
gulp.task("release", gulp.series("build", "gitreport", "publish"));

// Default task runs build
gulp.task("default", gulp.series("build"));
