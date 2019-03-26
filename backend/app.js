const Git = require("nodegit");
const express = require("express");
const bodyParser = require("body-parser");
var path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.get('/api/commit', (req, res, next) => {

  //git clone https://github.com/project-manga/manga-core.git

  Git.Clone('https://github.com/project-manga/manga-core.git', './git-repository')
    .then(function () {


      Git.Repository.open("./git-repository")
        .then(function (repo) {
          return repo.getHeadCommit()
            .then(function (commit) {
              return repo.createBranch("test", commit, false);
            })
            .then(function(branch) {
              return repo.checkoutBranch(branch, {});
            })
            .then(function(reference) {
              var sign = Git.Signature.now("", "andrea.bertin@outlook.com");
              repo.push(
                ["refs/heads/master:refs/heads/master"],

              )

            });
        })
        .done(function () {
          console.log('Completed');
          res.status(200).json('Completed!!!');
        })

    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json('Failed!!!');
    });

});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "fadf12421l",
      title: "First server-side post",
      content: "This is coming from the server"
    },
    {
      id: "ksajflaj132",
      title: "Second server-side post",
      content: "This is coming from the server!"
    }
  ];
  res.status(200).json({
    message: "Posts fetched successfully!",
    posts: posts
  });
});

module.exports = app;
