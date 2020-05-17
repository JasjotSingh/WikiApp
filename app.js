//=========================config STRT======================//
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const port = 3000;

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

//=========================config END======================//

//=========================DB STRT========================//
mongoose.connect( "mongodb://localhost:27017/wikiDB",
                  { useNewUrlParser: true, useUnifiedTopology: true }
                );
const articleSchema = new mongoose.Schema(
  {
    title:String,
    content:String
  }
);

const articleModel = mongoose.model("article", articleSchema);
//=========================DB END=========================//

//=========================RESOURCES STRT======================//
app.get("/", (req, res)=>{
  res.render("home");
});

app.get("/test", (req, res)=>{
  articleModel.find({}, (err, articles)=>{
    if(err)
      console.log("Path: /test. \nError in find, :"+err);
    else{
      res.render("test", {articles: articles});
    }
  });
});

//=========================RESOURCES END======================//

app.listen(port, ()=>{
  console.log("listening on port: "+port);
});
