import { connection } from "../database/connection";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
	id: number;
	name: string;
	email: string;
	password: string;
	reset_token?: string;
	reset_token_expires?: Date;
}

const saltRounds = 10;

export const registerUser = async (
	name: string,
	email: string,
	password: string
) => {
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	const [result] = await connection.execute(
		"INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
		[name, email, hashedPassword]
	);

	return result;
};

export const loginUser = async (email: string, password: string) => {
	const [users] = await connection.execute<User[]>(
		"SELECT * FROM users WHERE email = ?",
		[email]
	);

	const user = Array.isArray(users) ? users[0] : null;

	if (!user) {
		throw new Error("Usuário não encontrado");
	}

	const match = await bcrypt.compare(password, user.password);

	if (!match) {
		throw new Error("Senha incorreta");
	}

	const token = jwt.sign(
		{ id: user.id, name: user.name, email: user.email },
		process.env.JWT_SECRET as string,
		{ expiresIn: "1d" }
	);

	return { token, user: { id: user.id, name: user.name, email: user.email } };
};
export const findUserByEmail = async (email: string): Promise<User | null> => {
	const [rows] = await connection.execute<User[]>(
		"SELECT * FROM users WHERE email = ?",
		[email]
	);

	return rows.length > 0 ? rows[0] : null;
};

export const generateResetToken = () => {
	return crypto.randomBytes(20).toString("hex");
};

export const saveResetToken = async (userId: number, token: string) => {
	await connection.execute(
		"UPDATE users SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?",
		[token, userId]
	);
};

export const resetUserPassword = async (token: string, newPassword: string) => {
  const [rows] = await connection.execute<User[]>(
    `SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()`,
    [token]
  );

  const user = rows[0];
  if (!user) {
    throw new Error('Token inválido ou expirado');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await connection.execute(
    `UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?`,
    [hashedPassword, user.id]
  );
};
export const getUserById = async (id: number): Promise<User | null> => {
  const [rows] = await connection.execute<User[]>(
    'SELECT id, name, email, avatar FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

export const updateUser = async (
  id: number,
  data: {
	avatar: any;
    name?: string | null;
    email?: string | null;
    password?: string | null;
    avatarBuffer?: string | null;
  }
) => {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (typeof data.name !== 'undefined') {
    fields.push('name = ?');
    values.push(data.name ?? null);
  }
  if (typeof data.email !== 'undefined') {
    fields.push('email = ?');
    values.push(data.email ?? null);
  }
  if (typeof data.password !== 'undefined') {
    fields.push('password = ?');
    values.push(data.password ?? null);
  }
  if (typeof data.avatar !== 'undefined') {
    fields.push('avatar = ?');
    values.push(data.avatar ?? null);
  }

  if (fields.length === 0) return;

  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);

  await connection.execute(sql, values);
};

