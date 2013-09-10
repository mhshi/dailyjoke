var MongoClient = require('mongodb').MongoClient;
var MongoDB = "mongodb://jokepost:jokepost@localhost:27017/jokepost";
var postsCol = "posts";

function getPost(id, callback) {
    MongoClient.connect(MongoDB, function(err, db){
        if (err) {
            console.log(err);
            callback(false);
        }

        var collection = db.collection(postsCol);
        collection.find().toArray(function(err, items){
            if (err) {
                console.log(err);
                callback(false);
            }
            callback(items);
        });
    });
}

function createPost(post, callback) {
    MongoClient.connect(MongoDB, function(err, db){
        if (err) {
            console.log(err);
            callback(false);
        }

        var collection = db.collection(postsCol);

        var newPost = new Object();
        newPost.title = post.title;
        newPost.content = post.content;
        newPost.lastmodified = Math.round(Date.now()/1000);
        collection.insert(newPost, function(err, result){
            if (err) {
                console.log(err);
                callback(false);
            }
            callback(newPost);
        });
    });
}

function getPostsList(start, limit, callback) {
    MongoClient.connect(MongoDB, function(err, db){
        if (err) {
            console.log(err);
            callback(false);
        }

        var collection = db.collection(postsCol);
        collection.find().sort({lastmodified: -1}).limit(limit).skip(start).toArray(function(err, items){
            if (err) {
                console.log(err);
                callback(false);
            }
            callback(items);
        });
    });
}

exports.getPost = getPost;
exports.getPostsList = getPostsList;
exports.createPost = createPost;
