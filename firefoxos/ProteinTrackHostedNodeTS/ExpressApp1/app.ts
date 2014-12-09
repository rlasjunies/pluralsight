import express = require('express');
import routes = require('./routes/index');
import user = require('./routes/user');
import manifest = require('./routes/manifest');
import http = require('http');
import path = require('path');
var hbs = require('hbs');
var hbsutils = require('hbs-utils')(hbs);

var app = express();
 
// all environments
app.disable('etag');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);
hbsutils.registerWatchedPartials(__dirname + '/views/partials');
//hbs.registerPartials(__dirname + '/views/partials');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);


//import stylus = require('stylus');
//app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/public/Building-Blocks-gh-pages', express.static(path.join(__dirname, '/public/Building-Blocks-gh-pages')));
app.use('/Scripts', express.static(path.join(__dirname, '/Scripts')));
app.use('/public/Building-Blocks-gh-pages/style', express.static(path.join(__dirname, '/public/Building-Blocks-gh-pages/style')));
app.use(express.static(path.join(__dirname, 'root')));


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/index.html', routes.index);
app.get('/', manifest.manifest);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});