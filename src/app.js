import express from "express";
import cors from "cors";
import mysql from "mysql2";

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

export default app;