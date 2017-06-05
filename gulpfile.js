"use strict"

var gulp           = require('gulp');

// Server/Lifereload
var markdown       = require('gulp-markdown'); 

// Utils 
var rename         = require("gulp-rename");
var notify         = require("gulp-notify"); 
var fs             = require('fs-extra'); 
var prependFile    = require('prepend-file');

var textHeader     = fs.readFileSync('./header.html', 'utf8');
var textFooter     = fs.readFileSync('./footer.html', 'utf8');

// -------- Tasks ----------

gulp.task('markdown', function() {
    return gulp.src('./src/*.md')
        .pipe(markdown())
        .pipe(gulp.dest('./res/'))
        .on("end", appendStyles); 
});

gulp.task('watch', function(){
	gulp.watch('./src/*.md', ['markdown']); // compile markdown
});

gulp.task('default', ['markdown', 'watch']);   

function appendStyles(){
  console.log("Add Styles");
  fs.readdir('./res/', (err, files) => {

    files.forEach(file => {

      fs.copy("./res/"+file, "./public_html/"+file)
        .then(() => {
          
          prependFile("./public_html/"+file, textHeader, function (err) {
            if (err) {
              console.error(err); 
            } else {
              console.log('Add Header To', file);
              fs.appendFile("./public_html/"+file, textFooter, function (err) {
                if (err) throw err;
                  console.log('Add Footer To', file); 
              });
            } 
          });

        })
        .catch(err => console.error(err))

    });
  })

}

/*

CONSOLE:
$ gulp

Browser (livereload plugin for .html files): 
file:///Volumes/disc_data/ECLIPSE/node.js/gulp_markdown/public_html/readme.html

*/
