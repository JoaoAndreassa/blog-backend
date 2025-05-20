import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/user.service';

export const registerController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    await registerUser(name, email, password);
    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
