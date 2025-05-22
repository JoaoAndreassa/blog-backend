import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import multer from 'multer';
import path from 'path';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).userId = (decoded as any).id;
    next();
  } catch (error) {
    res.status(403).json({ error: "Token inválido" });
  }
};
// export const upload = multer({
//   storage: multer.diskStorage({
// 	destination: path.resolve(__dirname, '..', '..', 'uploads'),
// 	filename: (req, file, cb) => {
// 	  const ext = path.extname(file.originalname);
// 	  const fileName = `${Date.now()}${ext}`;
// 	  cb(null, fileName);
// 	},
//   }),
// });

export const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 10 * 1024 * 1024, // 5MB para arquivos
		fieldSize: 10 * 1024 * 1024 // 5MB para campos de texto (evita erro do base64)
	}
});

