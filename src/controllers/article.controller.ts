import { Request, Response } from "express";
import {
	createArticle,
	getAllArticles,
	getArticleImage,
	getArticleById,
    updateArticle,
    deleteArticle,
} from "../services/article.service";

export const createArticleController = async (req: Request, res: Response) => {
	try {
		const { title, content } = req.body;
		const imageBuffer = req.file ? req.file.buffer : null;
		const userId = (req as any).user.id;

		const result = await createArticle(title, content, imageBuffer, userId);
		res.status(201).json({ message: "Artigo criado com sucesso", result });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const getAllArticlesController = async (
	_req: Request,
	res: Response
) => {
	try {
		const articles = await getAllArticles();
		res.json(articles);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const getArticleByIdController = async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		const article = await getArticleById(id);

		if (!article) {
			res.status(404).json({ error: "Artigo não encontrado" });
			return;
		}

		res.json(article);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const getArticleImageController = async (
	req: Request,
	res: Response
) => {
	try {
		const id = Number(req.params.id);
		const imageBuffer = await getArticleImage(id);

		if (!imageBuffer) {
			res.status(404).json({ error: "Imagem não encontrada" });
			return;
		}

		res.setHeader("Content-Type", "image/jpeg");
		res.send(imageBuffer);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const updateArticleController = async (req: Request, res: Response) => {
	try {
		const articleId = Number(req.params.id);
		const { title, content } = req.body;
		const imageBuffer = req.file ? req.file.buffer : null;
		const userId = (req as any).user.id;

		await updateArticle(articleId, title, content, imageBuffer, userId);

		res.json({ message: "Artigo atualizado com sucesso" });
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};
export const deleteArticleController = async (req: Request, res: Response) => {
  try {
    const articleId = Number(req.params.id);
    const userId = (req as any).user.id;

    await deleteArticle(articleId, userId);

    res.json({ message: 'Artigo excluído com sucesso' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
