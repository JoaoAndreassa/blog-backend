import { Request, Response } from "express";
import {
  createArticle,
  getAllArticles,
  getArticleImage,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../services/article.service";
import { AuthRequest } from "../types/express";

export const createArticleController = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null;
  const userId = req.userId!;

  const result = await createArticle(title, content, imageBuffer, userId);
  res.status(201).json({ message: "Artigo criado com sucesso", result });
};

export const getAllArticlesController = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
    throw new Error("Parâmetros de paginação inválidos");
  }

  const articles = await getAllArticles(page, limit);
  res.json(articles);
};


export const getArticleByIdController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const article = await getArticleById(id);

  if (!article) throw new Error("Artigo não encontrado");

  res.json(article);
};

export const getArticleImageController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const imageBuffer = await getArticleImage(id);

  if (!imageBuffer) throw new Error("Imagem não encontrada");

  res.setHeader("Content-Type", "image/jpeg");
  res.send(imageBuffer);
};

export const updateArticleController = async (req: AuthRequest, res: Response) => {
  const articleId = Number(req.params.id);
  const { title, content } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null;
  const userId = req.userId!;

  await updateArticle(articleId, title, content, imageBuffer, userId);
  res.json({ message: "Artigo atualizado com sucesso" });
};

export const deleteArticleController = async (req: AuthRequest, res: Response) => {
  const articleId = Number(req.params.id);
  const userId = req.userId!;

  await deleteArticle(articleId, userId);
  res.json({ message: "Artigo excluído com sucesso" });
};
