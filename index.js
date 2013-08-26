var express = require("express");
var app = express();
var port = 8888;
var admin_name = 'mhshi';
var admin_pw = '1234';

app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname+'/public'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

app.get('/:path', function(req, res, next){
    var path = req.params.path;
    switch (path) {
        case 'login':
            if (!req.session.username) {
                res.render('login');
            } else {
                res.redirect('/manage');
            }
            break;
        case 'manage':
            if (!req.session.username || req.session.username != admin_name) {
                res.send('You are not authorized to view this page');
            } else {
                res.render('manage');
            }
            break;
        case 'posts':
            res.render('posts');
            break;
        case 'logout':
            delete req.session.username
            res.redirect('/login');
            break;
        default:
            //res.send(404, 'Page not found.');
            next();
    }
});

app.post('/loginpost', function(req, res){
    var post = req.body;
    if (post.username == admin_name && post.password == admin_pw) {
        req.session.username = admin_name;
        res.redirect('/manage');
    } else {
        res.send('Login Fail.');
    }
});

//ajax request entry piont
app.all('/mposts', function(req, res){
    console.log(req.method);
    res.send('test');
});

app.listen(port);
