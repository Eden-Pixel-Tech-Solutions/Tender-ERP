require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

async function createDemoUsers() {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    console.log("Connected to MySQL");

    // 1️⃣ Create users table if not exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(150) UNIQUE,
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Users table ready ✔️");

    // 2️⃣ Define demo users
    const demoUsers = [
      { name: "Admin User", email: "admin@gmail.com", password: "123456" },
      { name: "Test User", email: "test@gmail.com", password: "123456" }
    ];

    for (const user of demoUsers) {
      // hash password
      const hashed = await bcrypt.hash(user.password, 10);

      // insert if email doesn't exist
      const [exists] = await db.execute(
        "SELECT id FROM users WHERE email = ?",
        [user.email]
      );

      if (exists.length === 0) {
        await db.execute(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [user.name, user.email, hashed]
        );
        console.log(`Created user → ${user.email}`);
      } else {
        console.log(`User already exists → ${user.email}`);
      }
    }

    console.log("\n🎉 Demo users created successfully!");
    console.log("Login credentials:");
    console.log("Email: admin@gmail.com | Password: 123456");
    console.log("Email: test@gmail.com | Password: 123456");

    process.exit();

  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

createDemoUsers();
