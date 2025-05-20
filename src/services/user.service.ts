import { connection } from "../database/connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

interface User extends RowDataPacket {
	id: number;
	name: string;
	email: string;
	password: string;
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
