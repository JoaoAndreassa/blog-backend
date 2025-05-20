import { connection } from '../database/connection';
import { RowDataPacket } from 'mysql2';

interface Article extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_name: string;
}

export const createArticle = async (
  title: string,
  content: string,
  imageBuffer: Buffer | null,
  authorId: number
) => {
  const [result] = await connection.execute(
    `INSERT INTO articles (title, content, image, author_id) VALUES (?, ?, ?, ?)`,
    [title, content, imageBuffer, authorId]
  );

  return result;
};

export const getAllArticles = async (): Promise<Article[]> => {
  const [articles] = await connection.execute<Article[]>(
    `SELECT 
      a.id, a.title, a.content, a.created_at, a.updated_at,
      u.name AS author_name
     FROM articles a
     JOIN users u ON a.author_id = u.id
     ORDER BY a.created_at DESC`
  );

  return articles;
};

export const getArticleImage = async (id: number): Promise<Buffer | null> => {
  const [rows] = await connection.execute<RowDataPacket[]>(
    'SELECT image FROM articles WHERE id = ?',
    [id]
  );

  const article = rows[0];
  if (!article || !article.image) {
    return null;
  }

  return article.image as Buffer;
};

export const getArticleById = async (id: number): Promise<Article | null> => {
  const [rows] = await connection.execute<Article[]>(
    `SELECT 
      a.id, a.title, a.content, a.created_at, a.updated_at,
      u.name AS author_name
     FROM articles a
     JOIN users u ON a.author_id = u.id
     WHERE a.id = ?`,
    [id]
  );

  return rows.length > 0 ? rows[0] : null;
};

export const updateArticle = async (
  articleId: number,
  title: string,
  content: string,
  imageBuffer: Buffer | null,
  userId: number
) => {
  // Primeiro, verifica se o artigo é do usuário
  const [rows] = await connection.execute<RowDataPacket[]>(
    'SELECT author_id FROM articles WHERE id = ?',
    [articleId]
  );

  const article = rows[0];
  if (!article) {
    throw new Error('Artigo não encontrado');
  }

  if (article.author_id !== userId) {
    throw new Error('Você não tem permissão para editar este artigo');
  }

  // Atualiza o artigo
  await connection.execute(
    `UPDATE articles SET title = ?, content = ?, image = ?, updated_at = NOW() WHERE id = ?`,
    [title, content, imageBuffer, articleId]
  );
};

export const deleteArticle = async (articleId: number, userId: number) => {
  const [rows] = await connection.execute<RowDataPacket[]>(
    'SELECT author_id FROM articles WHERE id = ?',
    [articleId]
  );

  const article = rows[0];
  if (!article) {
    throw new Error('Artigo não encontrado');
  }

  if (article.author_id !== userId) {
    throw new Error('Você não tem permissão para excluir este artigo');
  }

  await connection.execute('DELETE FROM articles WHERE id = ?', [articleId]);
};
