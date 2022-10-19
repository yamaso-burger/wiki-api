// express
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
// mongoose
const mongoose = require('mongoose');
// ejs
let ejs = require('ejs');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('article', articleSchema);
function readAricles(){
    Article.find({}, (err, articles)=>{
        if (err) {
            console.log(err);
        } else {
            articles.forEach((article)=>{
                console.log(article);
            });
        }
    });
}
function postArticle(title, content) {
    const article = new Article({
        title: title,
        content: content
    });
    article.save();
}

///////////////////////////////////Requests targeting all articles///////////////////////

app.route("/articles")
.get(function(req, res){
    Article.find(function(err, foundArticles){
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})
.post(function(req, res){
    postArticle(req.body.title, req.body.content);
    res.send("Successfuly posted article.")
})
.delete(function(req, res){
    Article.deleteMany(
        function(err){
        if (!err) {
            res.send("Successfully deleted");
        } else {
            res.send("failed");
        }
    })
});

///////////////////////////////////Requests targeting each article///////////////////////


app.route('/articles/:articleTitle')
.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticles){
        if (err || foundArticles == ""){
            res.send("not found");
        } else {
            res.send(foundArticles);
        }
    });
})
.put(function(req, res){
    Article.updateOne({title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err){
            if (err) {
                console.log(err);
            } else {
                res.send("Success");
            }
        });
})
.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if (!err) {
                res.send("Successfully updated article.");
            } else {
                res.send("failed");
            }
        }
        );
})
.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err) {
            if (!err) {
                res.send("Successfully deleted article.");
            } else {
                res.send("failed");
            }
        }
    )
})

app.listen(port, ()=>{
    console.log('running on port ' + port);
})