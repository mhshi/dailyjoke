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
app.all('/mposts/:path', function(req, res){
    if (!req.session.username) {
        res.send(401, 'Unauthorized.');
    }
    var msg_obj = new Object();
    var pm = require('./lib/postmanager/postmanager');
    var post = new Object();
    //POST
    if (req.method == 'POST') {
        var path = req.params.path;
        if (path == 'save') {
            var post = new Object();
            post.title = req.body.post_title;
            post.content = req.body.post_body;

            pm.createPost(post, function(post){
                if (post) {
                    msg_obj.success = true;
                    msg_obj.data = post;
                } else {
                    msg_obj.success = false;
                    msg_obj.error = 'Fail to save.';
                }
                res.send(JSON.stringify(msg_obj));
            });
        } else if (path == 'delete') {
            var post_id = req.body.post_id;

            pm.deletePostById(post_id, function(result){
                if (result) {
                    msg_obj.success = true;
                } else {
                    msg_obj.success = false;
                    msg_obj.error = 'Fail to delete';
                }
                res.send(JSON.stringify(msg_obj));
            });
        } else {
            res.send(404, 'Page not found.');
        }
    //GET
    } else if (req.method == 'GET'){
        var path = req.params.path;
        if (path == 'list' && req.query.start && req.query.limit) {
            var start = parseInt(req.query.start);
            var limit = parseInt(req.query.limit);
 
            pm.getPostsList(start, limit, function(posts){
                if (posts) {
                    msg_obj.success = true;
                    msg_obj.data = posts;
                } else {
                    msg_obj.success = false;
                    msg_obj.error = 'Fail to save.';
                }
                res.send(JSON.stringify(msg_obj));
            });
        } else {
            res.send(404, 'Page not found.');
        }
    } else {
        res.send(404, 'Page not found.');
    }
});

app.listen(port);
