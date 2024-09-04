import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, passwordHash]
    );

    const token = await createAccessToken({ id: result.rows[0].id });
    

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      token: token, // accessToken
      id: result.rows[0].id,
      username: result.rows[0].name,
      email: result.rows[0].email,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        message: "The email is already registered.",
      });
    }
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userFound.rowCount === 0)
      return res.status(400).json({ message: "Incorrect credentials" });

    const isMatch = await bcrypt.compare(password, userFound.rows[0].password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect credentials" });

    const token = await createAccessToken({ id: userFound.rows[0].id });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      token: token, // accessToken
      id: userFound.rows[0].id,
      username: userFound.rows[0].name,
      email: userFound.rows[0].email,
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await pool.query("SELECT * FROM users WHERE id = $1", [
    req.user.id,
  ]);

  if (userFound.rowCount === 0)
    return res.status(400).json({
      message: "User not found",
    });

  return res.json({
    id: userFound.rows[0].id,
    username: userFound.rows[0].name,
    email: userFound.rows[0].email,
    createdAt: userFound.rows[0].created_at,
    updatedAt: userFound.rows[0].updated_at,
  });
};

export const verifyToken = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ message: "Unauthorized" });

  const token = authorization.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    const userFound = await pool.query("SELECT * FROM users WHERE id = $1", [
      user.id,
    ]);
    if (userFound.rowCount === 0)
      return res.status(401).json({ message: "Unauthorized" });

    return res.json({
      id: userFound.rows[0].id,
      username: userFound.rows[0].name,
      email: userFound.rows[0].email,
    });
  });
};
