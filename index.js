const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const methodOverride = require("method-override");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const { v4: uuidv4 } = require("uuid");

// DB
const connection = require("./db");

// Cloudinary + Upload Middleware
const cloudinary = require("./config/cloudinary");
const upload = require("./middleware/upload");

// Create post: rate limiting to prevent multiple entries of single post
const createPostLimiter = rateLimit({
  windowMs: 100,
  max: 1,
  message: "Waiting...",
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Home
app.get("/", (req, res) => {
  res.render("home");
});

// Student Dashboard
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

let islogin = false;

// Admin Dashboard
app.get("/admin", (req, res) => {
  if (islogin) {
    const sql = "SELECT * FROM notices ORDER BY createdAt DESC";

    connection.query(sql, (err, results) => {
      if (err) {
        console.log(err);
        return res.send("DB Error");
      }
      res.render("admin", { notices: results });
    });
  } else {
    res.redirect("login");
  }
});

// Create Post Page
app.get("/createpost", (req, res) => {
  if (islogin) {
    res.render("createPost");
  } else {
    res.redirect("login");
  }
});

// Insert Post
app.post("/student",createPostLimiter,upload.single("file"), async (req, res) => {
  const { title, description, url, author, department } = req.body;
  let id = uuidv4();
  let finalUrl = url || null;

    try {
      if (req.file) {
        const isPDF = req.file.mimetype === "application/pdf";
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: isPDF ? "raw" : "image",
          folder: "notify_bncoe",
        });
        // Fix: Cloudinary sometimes returns image/upload for PDFs, lets replace it with raw/upload
        finalUrl = isPDF ? result.secure_url.replace("/image/upload/", "/raw/upload/") : result.secure_url;
        fs.unlink(req.file.path, (err) => {
          if (err) console.error(err);
        });
      }

    const sql = `
    INSERT INTO notices 
    (id, title, description, url, author, department) VALUES (?, ?, ?, ?, ?, ?)
  `;
  connection.query(
    sql,
    [id, title, description, finalUrl, author, department],
    (err, result) => {
        if (err) {
          console.error(err);
          return res.send("Insert Error");
        }
        res.redirect("/admin");
      }
    );
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path))
      fs.unlinkSync(req.file.path);
    console.error("Upload Error:", err);
    res.status(500).send("File upload failed.");
  }
});

//render edit page
app.get("/admin/:id", (req, res) => {
  if (!islogin) return res.redirect("../login");
  const { id } = req.params;
  connection.query(
    "SELECT * FROM notices WHERE id = ?",
    [id],
    (err, result) => {
      if (err || result.length === 0) return res.render("404");
      res.render("edit", { n: result[0] });
    },
  );
});

//edit notice
app.patch(
  "/admin/:id",
  upload.single("file"),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, url, author, department } = req.body;
    let finalUrl = url || null;

    try {
      if (req.file) {
        const isPDF = req.file.mimetype === "application/pdf";
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: isPDF ? "raw" : "image",
          folder: "notify_bncoe",
        });
        finalUrl = isPDF
          ? result.secure_url.replace("/image/upload/", "/raw/upload/")
          : result.secure_url;
        fs.unlink(req.file.path, (err) => {
          if (err) console.error(err);
        });
      }

      const sql = `UPDATE notices SET title=?, description=?, url=?, author=?, department=? WHERE id=?`;
      connection.query(
        sql,
        [title, description, finalUrl, author, department, id],
        (err) => {
          if (err) {
            console.error(err);
            return res.render("404");
          }
          res.redirect("/admin");
        },
      );
    } catch (err) {
      if (req.file && fs.existsSync(req.file.path))
        fs.unlinkSync(req.file.path);
      console.error("Edit Error:", err);
      res.status(500).send("File upload failed during edit.");
    }
  },
);

//Delete Notice

app.delete("/admin/:id", (req, res) => {
  let { id } = req.params;

  let sql = "DELETE FROM notices WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("DB Error");
    }
    res.redirect("/admin");
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

//admin login
app.post("/login", (req, res) => {
  const { id, password } = req.body;
  if (id === process.env.USER_ID && password === process.env.USER_PASSWORD) {
    islogin = true;
    res.redirect("/admin");
  } else {
    res.render("login.ejs", { error: true });
  }
});

//admin logout
app.get("/logout", (req, res) => {  
  islogin = false;
  res.redirect("/");
});

// Multer error handler
app.use((err, req, res, next) => {
  if (err instanceof require("multer").MulterError) {
    if (err.code === "LIMIT_FILE_SIZE")
      return res.status(400).send("Too large file, Max 5MB.");
    return res.status(400).send("Upload error: " + err.message);
  } else if (err) {
    return res.status(400).send(err.message);
  }
  next();
});

// Error Page
app.use((req, res) => {
  res.render("error");
});

// Start Server
app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
