import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import articleRoutes from "./routes/article.routes";
import path from "path";
import { errorHandler } from './middlewares/error.middleware';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(errorHandler);

app.get("/", (req, res) => {
	res.send("API do blog está no ar 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`);
});
