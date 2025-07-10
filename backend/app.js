import express from "express";
import cors from "cors";
import { connectDB } from "./DB/Database.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";

// Load environment variables
dotenv.config({ path: "./config/config.env" });

const app = express();

// Set port fallback for local/dev
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Allowlisted frontend URLs
const allowedOrigins = [
  "https://expense-tracker-hazel-xi-95.vercel.app", // ✅ your deployed frontend
  "https://main.d1sj7cd70hlter.amplifyapp.com",
  "https://expense-tracker-app-three-beryl.vercel.app"
];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Hello World! Backend is running.");
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
