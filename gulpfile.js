const path = require('path');
const { src, dest, parallel, series } = require('gulp');
const gzip = require('gulp-gzip');
const sftp = require('gulp-sftp-up4');
const gulpClean = require('gulp-clean');

const DEST_DIR = 'public';

function clean() {
  return src(`${DEST_DIR}`, { read: false })
    .pipe(gulpClean());
}

function js() {
  return src('js/**/*.js')
    .pipe(gzip())
    .pipe(dest(`${DEST_DIR}/js`))
}

function html() {
  return src('./*.html')
    .pipe(gzip())
    .pipe(dest(DEST_DIR));
}

function css() {
  return src('css/*.css')
    .pipe(gzip())
    .pipe(dest(`${DEST_DIR}/css`));
}

function imgage() {
  return src('img/*')
    .pipe(dest(`${DEST_DIR}/img`))
}

function video() {
  return src('video/*.mp4')
    .pipe(dest(`${DEST_DIR}/video`))
}

function deploy() {
  return src(path.join(__dirname, `${DEST_DIR}/**/*`))
    .pipe(sftp({
      host: process.env.SFTP_HOST,
      user: process.env.SFTP_USER,
      pass: process.env.SFTP_PASS,
      remotePath: process.env.SFTP_REMOTE_PATH
    }));
}

exports.clean = clean;

exports.deploy = deploy

exports.default = series(clean, parallel(html, css, js, video, imgage), deploy);