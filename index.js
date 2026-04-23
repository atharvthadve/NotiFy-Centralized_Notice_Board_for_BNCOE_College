const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3500;
const methodOverride = require("method-override");
const path = require("path");

// DB
const connection = require("./db");

// Middlewares
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
~
// Home
app.get("/", (req, res) => {
  res.render("home");
});

// Student Dashboard (DB fetch)
app.get("/student", (req, res) => {
  const sql = "SELECT * FROM notices ORDER BY createdAt DESC";

  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.send("DB Error");
    }
    res.render("studentdashboard", { notices: results });
  });
});

// Admin Dashboard
app.get("/admin", (req, res) => {
  const sql = "SELECT * FROM notices ORDER BY createdAt DESC";

  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.send("DB Error");
    }
    res.render("admin", { notices: results });
  });
});



// Create Post Page
app.get("/createpost", (req, res) => {
  res.render("createPost");
});

// Insert Post
app.post("/student", (req, res) => {
  const { title, description, url, author, department } = req.body;

  const sql = `
    INSERT INTO notices 
    (title, description, url, author, department)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [title, description, url, author, department],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Insert Error");
      }

      console.log("Inserted ID:", result.insertId);
      res.redirect("/admin");
    }
  );
});

//render edit page
app.get("/admin/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM notices WHERE id = ?";

  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.render("404");
    }
    if (result.length === 0) {
      return res.render("404");
    }
    res.render("edit", { n: result[0] });
  });
});

//edit notice
app.patch("/admin/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, url, author, department } = req.body;

  const sql = `
    UPDATE notices
    SET title = ?, description = ?, url = ?, author = ?, department = ?
    WHERE id = ?
  `;

  connection.query(sql, [title, description, url, author, department, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.render("404");
    }
    res.redirect("/admin");
  });
});

//Delete Notice

app.delete("/admin/:id", (req, res)=>{
  let { id } = req.params;

  let sql = "DELETE FROM notices WHERE id = ?"
connection.query(sql, [id], (err, result)=>{
  if (err){
    console.log(err);
    return res.send("DB Error");
  }
  res.redirect("/admin")
})
})

// Error Page
app.use((req, res) => {
  res.render("error");
});

// Start Server
app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});