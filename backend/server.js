import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";
import multer from "multer";
env.config();

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "kawasakiversys650.POVARESHKA!zxc",
  database: "online_store",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Подключение к базе данных MySQL успешно установлено");
});

const PORT = process.env.PORT || 4444;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Server is running");
});

app.get("/user", function (req, res) {
  const jwt_token = req.headers.authorization;
  const userJWT = jwt.verify(jwt_token, process.env.jwt_key);
  const userId = userJWT.userId;
  db.query(
    `SELECT * FROM \`user\` WHERE \`user_id\` = ?`,
    [userId],
    function (err, data) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.json(data);
      }
    }
  );
});

app.post("/register", function (req, res) {
  const { name, email, password } = req.body;

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      console.error("Error generating salt:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    bcrypt.hash(password, salt, function (err, hashedPassword) {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      db.query(
        `INSERT INTO \`users\` (name, email, password) VALUES (?, ?, ?)`,
        [name, email, hashedPassword],
        function (err, result) {
          if (err) {
            console.error("Error registering user:", err);
            return res.status(500).json({ error: "Internal server error" });
          }

          db.query("SELECT LAST_INSERT_ID() as id", function (err, rows) {
            if (err) {
              console.error("Error getting last insert ID:", err);
              return res.status(500).json({ error: "Internal server error" });
            }
            const lastInsertId = rows[0].user_id;

            const token = jwt.sign(
              { userId: lastInsertId },
              process.env.jwt_key,
              {
                expiresIn: "30d",
              }
            );

            res.json({ token: token });
          });
        }
      );
    });
  });
});

app.post("/auth", function (req, res) {
  const { email, password } = req.body;

  db.query(
    `SELECT * FROM \`users\` WHERE email = ?`,
    [email],
    function (err, results) {
      if (err) {
        console.error("Error querying user:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Неверный логин или пароль" });
      }

      const hashedPasswordFromDB = results[0].password;
      bcrypt.compare(password, hashedPasswordFromDB, function (err, isMatch) {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (!isMatch) {
          return res.status(401).json({ error: "Неверный логин или пароль" });
        }

        const userId = results[0].user_id;
        const token = jwt.sign({ userId: userId }, process.env.jwt_key, {
          expiresIn: "30d",
        });

        res.json({ token: token });
      });
    }
  );
});

app.post("/product", function (req, res) {
  db.query(
    `insert into \`products\` ( \`name\`, \`description\`, \`price\`, \`image_url\`) values ('${req.body.name}', '${req.body.description}', '${req.body.price}', '${req.body.image_url}')`,
    function (err, resilt) {
      if (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(200).json({ massage: "ok" });
    }
  );
});

app.get("/product", function (req, res) {
  if (req.query.product_id) {
    // Query for a specific product
    db.query(
      `SELECT * FROM \`products\` WHERE product_id=${req.query.product_id}`,
      function (err, result) {
        if (err) {
          // Handle query error
          console.log(err);
          res.status(400).json({ err: err });
        } else {
          // Send the result if successful
          res.status(200).json(result);
        }
      }
    );
  } else {
    // Query for all products
    db.query("SELECT * FROM `products`", function (err, result) {
      if (err) {
        // Handle query error
        console.log(err);
        res.status(400).json(err);
      } else {
        // Send the result if successful
        res.status(200).json(result);
      }
    });
  }
});

app.post("/add-to-cart", (req, res) => {
  const jwt_token = req.headers.authorization;
  const userJWT = jwt.verify(jwt_token, process.env.jwt_key);
  const userId = userJWT.userId;
  const { product_id } = req.body;

  db.query(`SELECT * FROM carts WHERE user_id = ?`, [userId], (err, carts) => {
    if (err) {
      console.error("Error querying cart:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (carts.length === 0) {
      db.query(
        `INSERT INTO carts (user_id) VALUES (?)`,
        [userId],
        (err, result) => {
          if (err) {
            console.error("Error creating cart:", err);
            return res.status(500).json({ error: "Internal server error" });
          }

          const cartId = result.insertId;
          db.query(
            `INSERT INTO cart_items (cart_id, product_id) VALUES (?, ?)`,
            [cartId, product_id],
            (err, result) => {
              if (err) {
                console.error("Error adding product to cart:", err);
                return res.status(500).json({ error: "Internal server error" });
              }

              res
                .status(200)
                .json({ message: "Product added to cart successfully" });
            }
          );
        }
      );
    } else {
      const cartId = carts[0].cart_id;
      db.query(
        `INSERT INTO cart_items (cart_id, product_id) VALUES (?, ?)`,
        [cartId, product_id],
        (err, result) => {
          if (err) {
            console.error("Error adding product to cart:", err);
            return res.status(500).json({ error: "Internal server error" });
          }

          res
            .status(200)
            .json({ message: "Product added to cart successfully" });
        }
      );
    }
  });
});

app.get("/incart", (req, res) => {
  const jwt_token = req.headers.authorization;
  const userJWT = jwt.verify(jwt_token, process.env.jwt_key);
  const userId = userJWT.userId;
  const { product_id } = req.query;

  db.query(
    `SELECT * FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.cart_id
    WHERE c.user_id = ? AND ci.product_id = ?`,
    [userId, product_id],
    (err, results) => {
      if (err) {
        console.error("Error querying cart items:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length > 0) {
        res.json({ added: true });
      } else {
        res.json({ added: false });
      }
    }
  );
});

app.post("/remove-from-cart", (req, res) => {
  const jwt_token = req.headers.authorization;
  const userJWT = jwt.verify(jwt_token, process.env.jwt_key);
  const userId = userJWT.userId;
  const { product_id } = req.body;

  db.query(
    `DELETE ci FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.cart_id
    WHERE c.user_id = ? AND ci.product_id = ?`,
    [userId, product_id],
    (err, results) => {
      if (err) {
        console.error("Error removing product from cart:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.json({ message: "Product removed from cart successfully" });
    }
  );
});

