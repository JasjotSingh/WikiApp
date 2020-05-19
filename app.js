//=========================config STRT======================//
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const port = 3000;

const app = express();

app.use(express.json());
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

app.route("/articles")
  .get((req, res)=>{
    articleModel.find({}, (err, articles)=>{
      if(err){
        console.log("Path: /test. \nError in find, :"+err);
        res.send(err);
      }
      else{
        res.send(articles);
      }
    });
  })
  .post((req, res)=>{
    const postObj = new articleModel(
                      {
                          title: req.body.title,
                          content: req.body.content
                      }
    );
    console.log(req.body);
    postObj.save((err)=>{
      if(err){
        console.log(err);
        res.send(err);
      }
      else{
        console.log("post saved:");
        console.log(postObj);
        res.send(postObj);
      }
    });
  })
  .delete((req, res)=>{
    articleModel.deleteMany((err)=>{
      if(err)
        res.send(err);
      else{
        console.log("deleteing all articles");
        res.send({message: "deleteing all articles"});
      }
    });
  });

app.route("/articles/:articleId")
  .get((req, res)=>{
    const articleId = req.params.articleId; //new mongoose.Types.ObjectId(req.params.articleId);

    articleModel.findOne({"_id" : articleId}, (err, post)=>{
      if(err)
        res.send(err);
      else{
        res.send(post);
      }
    });
  })
  .put((req, res)=>{
    const articleId = req.params.articleId;
    const postUpdate = {
                          title: req.body.title,
                          content : req.body.content
                        }; //can not use new articleMode() here, as it will create a object with new id.
                        //and since we are updating the same object id has to be same.
    articleModel.update({_id:articleId}, postUpdate, {overwrite : true}, (err, result)=>{
      if(err)
        res.send(err);
      else
        res.send(result);
    });

  })
  .patch((req, res)=>{
    const articleId = req.params.articleId;

    articleModel.update({_id:articleId}, {$set : req.body}, (err, result)=>{
      if(err)
        res.send(err);
      else
        res.send(result);
    });

  })
  .delete((req, res)=>{
    const articleId = req.params.articleId;
    articleModel.deleteOne({_id:articleId},(err)=>{
      if(err)
        res.send(err);
      else
        res.send({message : "article id :"+articleId+" deleted"});
    });
  });

//=======IMP========//
// can use route in case path is same, different from app.router
//=======IMP========//

// app.get("/articles", (req, res)=>{
//   articleModel.find({}, (err, articles)=>{
//     if(err){
//       console.log("Path: /test. \nError in find, :"+err);
//       res.send(err);
//     }
//     else{
//       res.send(articles);
//     }
//   });
// });
//
// app.post("/articles", (req, res)=>{
//   const postObj = new articleModel(
//                     {
//                         title: req.body.title,
//                         content: req.body.content
//                     }
//   );
//   console.log(req.body);
//   postObj.save((err)=>{
//     if(err){
//       console.log(err);
//       res.send(err);
//     }
//     else{
//       console.log("post saved:");
//       console.log(postObj);
//       res.send(postObj);
//     }
//   });
// });
//
// app.delete("/articles", (req, res)=>{
//   articleModel.deleteMany((err)=>{
//     if(err)
//       res.send(err);
//     else{
//       console.log("deleteing all articles");
//       res.send({message: "deleteing all articles"});
//     }
//   });
// });

//=========================RESOURCES END======================//

app.listen(port, ()=>{
  console.log("listening on port: "+port);
});
