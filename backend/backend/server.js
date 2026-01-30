const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "launchpad_secret";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YOUR_MYSQL_PASSWORD",
  database: "launchpad"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected");
});

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(403);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post("/api/auth/login", (req, res) => {
  const { email, password, role } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=? AND password=? AND role=?",
    [email, password, role],
    (err, result) => {
      if (result.length === 0)
        return res.status(401).json({ message: "Invalid login" });

      const token = jwt.sign(
        { id: result[0].id, role },
        SECRET,
        { expiresIn: "2h" }
      );

      res.json({ token, role });
    }
  );
});

app.get("/api/projects", auth, (req, res) => {
  db.query(
    "SELECT * FROM projects WHERE user_id=?",
    [req.user.id],
    (err, data) => res.json(data)
  );
});

app.post("/api/projects", auth, (req, res) => {
  const { title, tech } = req.body;

  db.query(
    "INSERT INTO projects (user_id,title,tech) VALUES (?,?,?)",
    [req.user.id, title, tech],
    () => res.json({ message: "Project added" })
  );
});

app.get("/api/admin/users", auth, (req, res) => {
  if (req.user.role !== "admin") return res.sendStatus(403);

  db.query("SELECT email,role FROM users", (err, data) => {
    res.json(data);
  });
});

app.listen(5000, () =>
  console.log("LaunchPad backend running on http://localhost:5000")
);
