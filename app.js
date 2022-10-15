// express
const express = require('express');
const app = express();
const port = 3000;
// mongoose
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/wikiDB');

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
readAricles();

app.get('/', (req, res)=>{
    res.send('Hello');
});

app.listen(port, ()=>{
    console.log('running on port ' + port);
})