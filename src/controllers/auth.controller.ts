import { Response } from "express";
import {
	loginUser,
	registerUser,
	generateResetToken,
	saveResetToken,
	findUserByEmail,
	resetUserPassword,
	updateUser,
	getUserById,
} from "../services/user.service";
import bcrypt from "bcrypt";
import { AuthRequest } from "../types/express";

export const registerController = async (req: AuthRequest, res: Response) => {
	const { name, email, password } = req.body;
	await registerUser(name, email, password);
	res.status(201).json({ message: "Usuário cadastrado com sucesso" });
};

export const loginController = async (req: AuthRequest, res: Response) => {
	const { email, password } = req.body;
	const result = await loginUser(email, password);
	res.json(result);
};

export const forgotPasswordController = async (
	req: AuthRequest,
	res: Response
) => {
	const { email } = req.body;
	if (!email) throw new Error("E-mail é obrigatório");

	const user = await findUserByEmail(email);
	if (!user) throw new Error("Usuário não encontrado");

	const token = generateResetToken();
	await saveResetToken(user.id, token);

	res.json({ message: "Token de redefinição gerado com sucesso" });
};

export const resetPasswordController = async (
	req: AuthRequest,
	res: Response
) => {
	const { token, newPassword } = req.body;
	if (!token || !newPassword)
		throw new Error("Token e nova senha são obrigatórios");

	await resetUserPassword(token, newPassword);
	res.json({ message: "Senha redefinida com sucesso" });
};

export const getProfileController = async (
	req: AuthRequest & { userId?: number },
	res: Response
): Promise<void> => {
	const user = await getUserById(req.userId!);
	if (!user) {
		res.status(404).json({ error: "Usuário não encontrado" });
		return;
	}

	const avatarUrl = user.avatar
		? `${req.protocol}://${req.get("host")}/auth/users/${user.id}/avatar`
		: null;

	res.json({
		id: user.id,
		name: user.name,
		email: user.email,
		avatarUrl, // <- agora sim, link correto!
	});
};

// export const updateProfileController = async (
// 	req: AuthRequest,
// 	res: Response
// ): Promise<void> => {
// 	const { firstName, lastName, password } = req.body;
// 	const userId = req.userId!;
// 	let avatarBuffer: Buffer | undefined;

// 	console.log("🧾 Dados recebidos no updateProfile:");
// 	console.log("Nome:", firstName, lastName);
// 	console.log("Senha?", !!password);
// 	console.log(
// 		"Avatar (base64)?",
// 		typeof req.body.avatar === "string" && req.body.avatar.startsWith("data:")
// 	);

// 	if (
// 		typeof req.body.avatar === "string" &&
// 		req.body.avatar.startsWith("data:")
// 	) {
// 		try {
// 			const base64Data = req.body.avatar.split(",")[1];
// 			avatarBuffer = Buffer.from(base64Data, "base64");
// 			console.log(
// 				"📦 Avatar convertido em buffer com sucesso. Tamanho:",
// 				avatarBuffer.length
// 			);
// 		} catch (error) {
// 			console.error("❌ Erro ao converter avatar base64:", error);
// 			res.status(400).json({ error: "Imagem de avatar inválida" });
// 			return;
// 		}
// 	}

// 	const name = `${firstName} ${lastName}`.trim();
// 	const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

// 	console.log("💾 Enviando dados para updateUser:", {
// 		name,
// 		hasPassword: !!hashedPassword,
// 		hasAvatar: !!avatarBuffer,
// 	});

// 	try {
// 		await updateUser(userId, {
// 			name,
// 			password: hashedPassword,
// 			avatar: avatarBuffer,
// 		});
// 		res.json({ message: "Perfil atualizado com sucesso" });
// 	} catch (err) {
// 		console.error("❌ Erro ao atualizar usuário:", err);
// 		res.status(500).json({ error: "Erro ao atualizar perfil" });
// 	}
// };
export const updateProfileController = async (
	req: AuthRequest & { file?: Express.Multer.File },
	res: Response
) => {
	try {
		const { firstName, lastName, password } = req.body;
		const userId = req.userId!;
		let avatarBuffer: Buffer | undefined;


		if (req.file) {
			avatarBuffer = req.file.buffer;
		}

		const name = `${firstName} ${lastName}`.trim();
		const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

		await updateUser(userId, {
			name,
			password: hashedPassword,
			avatar: avatarBuffer,
		});

		res.json({ message: "Perfil atualizado com sucesso" });
	} catch (err) {
		console.error("❌ Erro ao atualizar perfil:", err);
		res.status(500).json({ error: "Erro ao atualizar perfil" });
	}
};
