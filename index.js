var express = require("express");
var titleController = require("./controllers/title.controller");

var app = express();

// Task 1
app.get("/task-1/I/want/title/", titleController.getTitles);
// Task 2
app.get("/task-2/I/want/title/", titleController.getAsyncTitles);
// Task 3
app.get("/task-3/I/want/title/", titleController.getPromiseTitles);

// Handle unknwon url hits
app.get("*", function (req, res) {
  return res.status(404).json({
    success: false,
    msg: `Not found`,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
