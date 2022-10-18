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

// postArticle("ejs", "ejs is one of the npm module which makes creating web-pages easier")
// readAricles();

app.get('/articles', function(req, res){
    Article.find(function(err, foundArticles){
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
});

app.post("/articles", function(req, res){
    postArticle(req.body.title, req.body.content);
    
});

app.delete("/articles", function(req, res){
    Article.deleteMany(function(err){
        if (!err) {
            res.send("Successfully deleted");
        } else {
            res.send("failed");
        }
    })
});

app.listen(port, ()=>{
    console.log('running on port ' + port);
})