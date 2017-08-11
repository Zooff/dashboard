# ng-annotate-adf-plugin

[ng-annotate](https://github.com/olov/ng-annotate) plugin to annotate [angular-dashboard-framework](https://github.com/sdorra/angular-dashboard-framework) widgets.

## usage with gulp

### package.json

```json
{
  "devDependencies": {
    "gulp": "^3.8.10",
    "gulp-load-plugins": "^0.8.0",
    "gulp-ng-annotate": "^0.5.2",
    "ng-annotate-adf-plugin": "^0.1.0",
    "gulp-uglify": "^1.1.0"
  }
}

```

### gulpfile.js

```javascript
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var annotateAdfPlugin = require('ng-annotate-adf-plugin');

var annotateOptions = {
  plugin: [
    annotateAdfPlugin
  ]
};

gulp.task('js', function() {
  gulp.src('src/*.js')
      .pipe($.ngAnnotate(annotateOptions))
      .pipe($.uglify())
      .pipe(gulp.dest('dist/'));
});

```
