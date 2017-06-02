const gulp = require('gulp');
const imageMin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var webserver = require('gulp-webserver');
var header = require('gulp-header');

// using data from package.json
var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @author <%= pkg.author %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');


// Log Message
gulp.task('message',function(){
  return console.log('Gulp running..');
});

gulp.task('index', function () {
  var target = gulp.src('./src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['./dist/js/**/*.js', './**/main.min.css'], {read: false, cwd: __dirname + '/dist'});
  //.pipe(inject(gulp.src('./src/**/*.js', {read: false}), {ignorePath: 'src'}))
 //.pipe(gulp.dest('./dist'));

  return target.pipe(inject(sources))
    .pipe(gulp.dest('./src'));
});

// Copy alle HTML files
gulp.task('copyHtml',function(){
  gulp.src('src/*.html')
      .pipe(gulp.dest('dist'));
});

// Optimizing images
gulp.task('imageMin',function(){
  gulp.src('src/images/*')
      .pipe(imageMin())
      .pipe(gulp.dest('dist/images'));
});

// Minify JS
gulp.task('minifyJS',function(){
  gulp.src('src/js/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
});

// Compile SASS to css
gulp.task('sass', function(){
  gulp.src('src/sass/main.scss')
      .pipe(autoprefixer({
        browsers: ['last 4 versions'],
        cascade: false}))
      .pipe(rename({suffix: '.min'}))
      .pipe(header(banner, { pkg : pkg } ))
      .pipe(sass({outputStyle: 'uncompressed'}).on('error', sass.logError))
      .pipe(gulp.dest('dist/css'))
});

// compile Scripts
gulp.task('scripts', function(){
  gulp.src('src/js/*.js')
      .pipe(concat('main.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
});

gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true,
      fallback: './dist/index.html'
    }));
});

gulp.task('default', ['index', 'message', 'copyHtml', 'imageMin', 'sass', 'scripts']);

gulp.task('watch',function(){
  gulp.watch('src/js/*.js', ['scripts']);
  gulp.watch('src/images/*', ['imageMin']);
  gulp.watch('src/sass/*.scss', ['sass']);
  gulp.watch('src/*.html', ['copyHtml']);
  gulp.watch('src/*.html', ['index']);

});
