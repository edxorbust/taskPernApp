import { date } from "zod";
import { pool } from "../db.js";

export const getTasks = async (req, res) => {
  const result = await pool.query("SELECT * FROM task WHERE user_id = $1", [req.user.id]);
  return res.json(result.rows);
};

export const createTask = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const newTask = await pool.query(
      "INSERT INTO task (title, description, date, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, date, req.user.id]
    );
    return res.json(newTask.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getTask = async (req, res) => {
  const task = await pool.query("SELECT * FROM task WHERE id = $1", [
    req.params.id,
  ]);
  if (task.rowCount === 0)
    return res.status(404).json({ message: "Task not found" });
  return res.json(task.rows[0]);
};

export const updateTask = async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  const task = await pool.query(
    "UPDATE task SET title = $1, description = $2 WHERE id = $3 RETURNING *",
    [title, description, id]
  );
  if (task.rowCount === 0)
    return res.status(404).json({ message: "Task not found" });
  return res.json(task.rows[0]);
};

export const deleteTask = async (req, res) => {
  const task = await pool.query("DELETE FROM task WHERE id = $1", [
    req.params.id,
  ]);
  if (task.rowCount === 0)
    return res.status(404).json({ message: "Task not found" });
  return res.sendStatus(204);
};
